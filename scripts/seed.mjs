// Script de siembra: crea el primer usuario administrador y una mascota de
// ejemplo (tarjeta "DEMO") para poder probar la app apenas se instala.
//
// Uso: npm run seed
// Siembra la misma base que usa la app: la de Turso si está
// TURSO_DATABASE_URL (la publicada) o el archivo local (DB_PATH) si no.
// Para la publicada conviene pasar contraseñas propias:
//   SEED_ADMIN_PASSWORD=... SEED_DEMO_PASSWORD=... npm run seed
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@libsql/client";

const root = path.resolve(import.meta.dirname, "..");

function loadEnvFile(name) {
  const envPath = path.join(root, name);
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^"(.*)"$/, "$1");
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

function connect() {
  const remote = process.env.TURSO_DATABASE_URL?.trim();
  if (remote) {
    console.log(`Base: Turso (${remote.replace(/^libsql:\/\//, "")})`);
    return { client: createClient({ url: remote, authToken: process.env.TURSO_AUTH_TOKEN?.trim() }), isFile: false };
  }
  const file = path.resolve(root, process.env.DB_PATH || "./data/app.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  console.log(`Base: archivo ${path.relative(root, file)}`);
  return { client: createClient({ url: `file:${file.replace(/\\/g, "/")}` }), isFile: true };
}
const { client: db, isFile } = connect();

const get = async (sql, ...args) => (await db.execute({ sql, args })).rows[0];
const run = (sql, ...args) => db.execute({ sql, args });

if (isFile) {
  await db.execute("PRAGMA journal_mode = WAL");
  await db.execute("PRAGMA foreign_keys = ON");
}

// Agrega columnas nuevas a bases de datos sembradas con una versión anterior
// del schema (misma lógica que src/lib/db.ts, duplicada acá porque este
// script corre standalone con node, sin pasar por la app).
async function ensureColumn(table, column, ddl) {
  const { rows } = await db.execute(`PRAGMA table_info(${table})`);
  if (rows.length === 0) return;
  if (rows.some((c) => c.name === column)) return;
  await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}
await ensureColumn("pets", "theme", "TEXT NOT NULL DEFAULT 'classic'");
await ensureColumn("pets", "badges", "TEXT NOT NULL DEFAULT '[]'");
await ensureColumn("pets", "vet_name", "TEXT");
await ensureColumn("pets", "vet_phone", "TEXT");
await ensureColumn("pets", "insurance_info", "TEXT");
await ensureColumn("pets", "personality", "TEXT");
await ensureColumn("pets", "contact_name2", "TEXT");
await ensureColumn("pets", "contact_instagram", "TEXT");
await ensureColumn("pets", "lost", "INTEGER NOT NULL DEFAULT 0");
await ensureColumn("pets", "lost_since", "TEXT");
await ensureColumn("pets", "lost_note", "TEXT");
await ensureColumn("pets", "notify_scans", "INTEGER NOT NULL DEFAULT 1");
await ensureColumn("pets", "last_scan_email_at", "TEXT");
await ensureColumn("users", "session_version", "INTEGER NOT NULL DEFAULT 0");
await ensureColumn("admin_users", "session_version", "INTEGER NOT NULL DEFAULT 0");

await db.executeMultiple(fs.readFileSync(path.join(root, "src/lib/schema.sql"), "utf-8"));

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@chapitag.demo";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "Demo1234!";
// Con contraseñas propias no se imprimen (quedarían en el historial de la terminal).
const show = (password, fromEnv) => (fromEnv ? "(la contraseña que pasaste)" : password);

const existingAdmin = await get("SELECT id FROM admin_users WHERE email = ?", ADMIN_EMAIL);

if (!existingAdmin) {
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  await run(
    "INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
    crypto.randomUUID(), ADMIN_EMAIL, passwordHash, "Administrador"
  );
  console.log(`✔ Usuario administrador creado: ${ADMIN_EMAIL} / ${show(ADMIN_PASSWORD, process.env.SEED_ADMIN_PASSWORD)}`);
} else {
  console.log(`— Ya existía un administrador con el email ${ADMIN_EMAIL}`);
}

// --- Mascota de ejemplo, tarjeta "DEMO" -------------------------------
const DEMO_PERSONALIZATION = {
  // Foto de stock (Unsplash, licencia libre) versionada en public/demo/.
  photoUrl: "/demo/firulais.webp",
  theme: "sunny",
  badges: JSON.stringify(["reactive", "vaccinated", "friendly"]),
  vetName: "Dra. Gómez",
  vetPhone: "+5491100000001",
  insuranceInfo: "PetSalud, póliza #DEMO-001",
  personality: "Juguetón, le encanta la pelota, un poco miedoso con los truenos.",
  contactName2: "Vecino de confianza",
};

const existingDemoTag = await get("SELECT * FROM tags WHERE code = 'DEMO'");

if (!existingDemoTag) {
  const demoOwnerEmail = "demo@chapitag.demo";
  let owner = await get("SELECT id FROM users WHERE email = ?", demoOwnerEmail);

  if (!owner) {
    const ownerId = crypto.randomUUID();
    await run(
      `INSERT INTO users (id, email, password_hash, name, phone, whatsapp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ownerId,
      demoOwnerEmail,
      bcrypt.hashSync(DEMO_PASSWORD, 10),
      "Familia Demo",
      "+5491100000000",
      "+5491100000000"
    );
    owner = { id: ownerId };
    console.log(`✔ Dueño de ejemplo creado: ${demoOwnerEmail} / ${show(DEMO_PASSWORD, process.env.SEED_DEMO_PASSWORD)}`);
  }

  const petId = crypto.randomUUID();
  await db.batch(
    [
      {
        sql: `INSERT INTO pets (
          id, owner_id, name, species, breed, color, sex, birth_year, sterilized,
          medical_notes, reward_offered, contact_name, contact_phone,
          contact_whatsapp, city, show_exact_address, theme, badges, vet_name,
          vet_phone, insurance_info, personality, contact_name2, photo_url
        ) VALUES (?, ?, 'Firulais', 'perro', 'Mestizo', 'Marrón y blanco', 'macho', ?, 1,
          'Alérgico a la penicilina', 'Se ofrece recompensa', 'Familia Demo',
          '+5491100000000', '+5491100000000', 'Buenos Aires', 0, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          petId,
          owner.id,
          new Date().getFullYear() - 3,
          DEMO_PERSONALIZATION.theme,
          DEMO_PERSONALIZATION.badges,
          DEMO_PERSONALIZATION.vetName,
          DEMO_PERSONALIZATION.vetPhone,
          DEMO_PERSONALIZATION.insuranceInfo,
          DEMO_PERSONALIZATION.personality,
          DEMO_PERSONALIZATION.contactName2,
          DEMO_PERSONALIZATION.photoUrl,
        ],
      },
      {
        sql: "INSERT INTO tags (id, code, status, pet_id, assigned_at) VALUES (?, 'DEMO', 'ASSIGNED', ?, datetime('now'))",
        args: [crypto.randomUUID(), petId],
      },
    ],
    "write"
  );

  console.log("✔ Mascota de ejemplo creada — probá /p/demo");
} else {
  // Ya existía (de una siembra anterior a esta versión): igual actualizamos
  // sus campos de personalización para que /p/demo muestre las funciones
  // nuevas sin tener que borrar la base de datos.
  await run(
    `UPDATE pets SET theme = ?, badges = ?, vet_name = ?, vet_phone = ?,
      insurance_info = ?, personality = ?, contact_name2 = ?, photo_url = COALESCE(photo_url, ?)
     WHERE id = ?`,
    DEMO_PERSONALIZATION.theme,
    DEMO_PERSONALIZATION.badges,
    DEMO_PERSONALIZATION.vetName,
    DEMO_PERSONALIZATION.vetPhone,
    DEMO_PERSONALIZATION.insuranceInfo,
    DEMO_PERSONALIZATION.personality,
    DEMO_PERSONALIZATION.contactName2,
    DEMO_PERSONALIZATION.photoUrl,
    existingDemoTag.pet_id
  );
  console.log("— Ya existía la tarjeta de ejemplo DEMO (actualicé su personalización)");
}

// --- Lote de prueba: 12 chapitas sin usar para probar la activación -------
const LOTE_DEMO = "Lote de prueba";
const hasDemoBatch = await get("SELECT 1 FROM tags WHERE batch_label = ? LIMIT 1", LOTE_DEMO);
if (!hasDemoBatch) {
  const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const codes = [];
  for (let i = 0; i < 12; i++) {
    let code = "";
    for (let j = 0; j < 8; j++) code += ALPHABET[crypto.randomInt(ALPHABET.length)];
    codes.push(code);
  }
  await db.batch(
    codes.map((code) => ({
      sql: "INSERT INTO tags (id, code, status, batch_label) VALUES (?, ?, 'UNASSIGNED', ?)",
      args: [crypto.randomUUID(), code, LOTE_DEMO],
    })),
    "write"
  );
  console.log(`✔ ${LOTE_DEMO}: 12 chapitas sin usar (por ejemplo ${codes[0]}) — activalas desde /activar`);
}

// --- Algunos escaneos de ejemplo para la mascota DEMO ----------------------
const demoTag = await get("SELECT pet_id FROM tags WHERE code = 'DEMO'");
if (demoTag?.pet_id) {
  const hasScans = await get("SELECT 1 FROM scans WHERE pet_id = ? LIMIT 1", demoTag.pet_id);
  if (!hasScans) {
    const scan = (kind, lat, lng, accuracy, note, when) => ({
      sql: `INSERT INTO scans (id, pet_id, tag_code, kind, lat, lng, accuracy, note, created_at)
            VALUES (?, ?, 'DEMO', ?, ?, ?, ?, ?, datetime('now', ?))`,
      args: [crypto.randomUUID(), demoTag.pet_id, kind, lat, lng, accuracy, note, when],
    });
    await db.batch(
      [
        scan("view", null, null, null, null, "-3 days"),
        scan("view", null, null, null, null, "-26 hours"),
        scan(
          "location", -34.6037, -58.4389, 18,
          "Lo tengo en la puerta del kiosco (escaneo de ejemplo)", "-25 hours"
        ),
      ],
      "write"
    );
    console.log("✔ Escaneos de ejemplo cargados para DEMO");
  }
}

db.close();
console.log("Listo.");
