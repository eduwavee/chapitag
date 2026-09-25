import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs";
import path from "node:path";
import {
  createClient,
  type Client,
  type InValue,
  type ResultSet,
  type Transaction,
} from "@libsql/client";

// La base es SQLite en los dos lados:
// - En la compu, un archivo (data/app.db, o DB_PATH).
// - Publicada (Vercel), una base Turso: libSQL, el mismo SQL de SQLite, pero
//   en un servidor, porque en serverless el disco se borra entre invocaciones.
// Si está TURSO_DATABASE_URL se usa Turso; si no, el archivo local.

function connectionConfig(): { url: string; authToken?: string } {
  const remote = process.env.TURSO_DATABASE_URL?.trim();
  if (remote) return { url: remote, authToken: process.env.TURSO_AUTH_TOKEN?.trim() };

  // turbopackIgnore: la ruta depende de una variable de entorno, así que le
  // decimos al bundler que no intente rastrearla/empaquetarla estáticamente.
  const file = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.DB_PATH || "./data/app.db"
  );
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return { url: `file:${file.replace(/\\/g, "/")}` };
}

/**
 * Columnas que se sumaron después del lanzamiento inicial. `CREATE TABLE IF
 * NOT EXISTS` no las agrega a una tabla que ya existía (por ejemplo una
 * data/app.db ya sembrada), así que se agregan acá, de forma idempotente.
 */
const ADDED_COLUMNS: [table: string, column: string, ddl: string][] = [
  ["pets", "theme", "TEXT NOT NULL DEFAULT 'classic'"],
  ["pets", "badges", "TEXT NOT NULL DEFAULT '[]'"],
  ["pets", "vet_name", "TEXT"],
  ["pets", "vet_phone", "TEXT"],
  ["pets", "insurance_info", "TEXT"],
  ["pets", "personality", "TEXT"],
  ["pets", "contact_name2", "TEXT"],
  ["pets", "contact_instagram", "TEXT"],
  ["pets", "lost", "INTEGER NOT NULL DEFAULT 0"],
  ["pets", "lost_since", "TEXT"],
  ["pets", "lost_note", "TEXT"],
  ["pets", "notify_scans", "INTEGER NOT NULL DEFAULT 1"],
  ["pets", "last_scan_email_at", "TEXT"],
  ["users", "session_version", "INTEGER NOT NULL DEFAULT 0"],
  ["admin_users", "session_version", "INTEGER NOT NULL DEFAULT 0"],
];

/** Primero las columnas nuevas y después el schema completo: así los índices nuevos encuentran sus columnas. */
async function init(client: Client, isFile: boolean) {
  if (isFile) {
    await client.execute("PRAGMA journal_mode = WAL");
    await client.execute("PRAGMA busy_timeout = 5000");
    await client.execute("PRAGMA foreign_keys = ON");
  }

  // Una sola consulta para ver qué columnas ya existen (en Turso cada ida y
  // vuelta cuesta, y esto corre en cada arranque en frío).
  const tables = [...new Set(ADDED_COLUMNS.map(([t]) => t))];
  const existing = await client.execute(
    tables.map((t) => `SELECT '${t}' AS t, name FROM pragma_table_info('${t}')`).join(" UNION ALL ")
  );
  const present = new Set(existing.rows.map((r) => `${r.t}.${r.name}`));
  const presentTables = new Set(existing.rows.map((r) => String(r.t)));
  const alters = ADDED_COLUMNS.filter(
    // Tabla inexistente (base nueva): la crea el schema con todas sus columnas.
    ([t, c]) => presentTables.has(t) && !present.has(`${t}.${c}`)
  ).map(([t, c, ddl]) => `ALTER TABLE ${t} ADD COLUMN ${c} ${ddl}`);
  if (alters.length) await client.batch(alters, "write");

  const schema = fs.readFileSync(path.join(process.cwd(), "src", "lib", "schema.sql"), "utf-8");
  await client.executeMultiple(schema);
}

interface Connection {
  client: Client;
  ready: Promise<void>;
}

declare global {
  // Next.js recarga módulos en caliente en desarrollo, y en producción cada
  // instancia reusa la conexión entre requests: la guardamos en globalThis.
  var __chapitagDb: Connection | undefined;
}

function connection(): Connection {
  if (global.__chapitagDb) return global.__chapitagDb;
  const config = connectionConfig();
  const client = createClient(config);
  const conn: Connection = { client, ready: init(client, config.url.startsWith("file:")) };
  // Si la inicialización falla (por ejemplo, Turso no respondió), el próximo
  // request vuelve a intentar en vez de quedar roto hasta el próximo deploy.
  conn.ready.catch(() => {
    if (global.__chapitagDb === conn) global.__chapitagDb = undefined;
  });
  global.__chapitagDb = conn;
  return conn;
}

// La transacción en curso, si la hay: las funciones de los repos que se
// llaman adentro de transaction() usan la misma conexión sin tener que pasarla.
const currentTx = new AsyncLocalStorage<Transaction>();

async function executor(): Promise<Pick<Client, "execute">> {
  const tx = currentTx.getStore();
  if (tx) return tx;
  const conn = connection();
  await conn.ready;
  return conn.client;
}

/** Filas como objetos planos (se pueden pasar a componentes cliente). */
function toObjects<T>(rs: ResultSet): T[] {
  return rs.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    rs.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

export async function all<T>(sql: string, ...args: InValue[]): Promise<T[]> {
  const rs = await (await executor()).execute({ sql, args });
  return toObjects<T>(rs);
}

export async function get<T>(sql: string, ...args: InValue[]): Promise<T | undefined> {
  return (await all<T>(sql, ...args))[0];
}

export async function run(sql: string, ...args: InValue[]): Promise<{ changes: number }> {
  const rs = await (await executor()).execute({ sql, args });
  return { changes: rs.rowsAffected };
}

/**
 * Corre `fn` dentro de una transacción. Si tira error, se deshace todo.
 * Es de escritura (`BEGIN IMMEDIATE`): toma el lock al empezar, así dos
 * requests que intentan activar la misma chapita no pueden pisarse.
 */
export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  if (currentTx.getStore()) return fn(); // ya estamos adentro de una
  const conn = connection();
  await conn.ready;
  const tx = await conn.client.transaction("write");
  try {
    const result = await currentTx.run(tx, fn);
    await tx.commit();
    return result;
  } catch (err) {
    await tx.rollback().catch(() => {});
    throw err;
  } finally {
    tx.close();
  }
}
