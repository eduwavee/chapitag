import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Usamos el módulo nativo node:sqlite (Node 22+), así evitamos depender de
// binarios precompilados que a veces no se pueden descargar (por ejemplo
// detrás de un proxy o firewall corporativo).

const DB_PATH = process.env.DB_PATH || "./data/app.db";

declare global {
  // eslint-disable-next-line no-var
  var __chapitagDb: DatabaseSync | undefined;
}

function initDb(): DatabaseSync {
  // turbopackIgnore: la ruta depende de una variable de entorno, así que le
  // decimos al bundler que no intente rastrearla/empaquetarla estáticamente.
  const resolved = path.resolve(/* turbopackIgnore: true */ process.cwd(), DB_PATH);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });

  const db = new DatabaseSync(resolved);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  const schemaPath = path.join(process.cwd(), "src", "lib", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);

  migrate(db);

  return db;
}

/**
 * `CREATE TABLE IF NOT EXISTS` no agrega columnas nuevas a una tabla que ya
 * existía en una base de datos creada con una versión anterior del schema
 * (por ejemplo, data/app.db ya sembrada). Estas líneas agregan, de forma
 * idempotente, las columnas que se fueron sumando después del lanzamiento
 * inicial, para no perder los datos ya cargados.
 */
function migrate(db: DatabaseSync) {
  ensureColumn(db, "pets", "theme", "TEXT NOT NULL DEFAULT 'classic'");
  ensureColumn(db, "pets", "badges", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn(db, "pets", "vet_name", "TEXT");
  ensureColumn(db, "pets", "vet_phone", "TEXT");
  ensureColumn(db, "pets", "insurance_info", "TEXT");
  ensureColumn(db, "pets", "personality", "TEXT");
  ensureColumn(db, "pets", "contact_name2", "TEXT");
}

function ensureColumn(
  db: DatabaseSync,
  table: string,
  column: string,
  ddl: string
) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  if (columns.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}

// En desarrollo, Next.js recarga módulos en caliente; guardamos la conexión
// en globalThis para no abrir el archivo una y otra vez.
export const db: DatabaseSync = global.__chapitagDb ?? initDb();
if (process.env.NODE_ENV !== "production") {
  global.__chapitagDb = db;
}
