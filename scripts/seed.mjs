// Script de siembra: crea el primer usuario administrador y una mascota de
// ejemplo (tarjeta "DEMO") para poder probar la app apenas se instala.
//
// Uso: npm run seed
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const root = path.resolve(import.meta.dirname, "..");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^"(.*)"$/, "$1");
  }
}
loadEnvFile();

const DB_PATH = process.env.DB_PATH || "./data/app.db";
const dbFile = path.resolve(root, DB_PATH);
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new DatabaseSync(dbFile);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Agrega columnas nuevas a bases de datos sembradas con una versión anterior
// del schema (misma lógica que src/lib/db.ts, duplicada acá porque este
// script corre standalone con node, sin pasar por la app).
function ensureColumn(table, column, ddl) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (columns.length === 0) return;
  if (columns.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}
ensureColumn("pets", "theme", "TEXT NOT NULL DEFAULT 'classic'");
ensureColumn("pets", "badges", "TEXT NOT NULL DEFAULT '[]'");
ensureColumn("pets", "vet_name", "TEXT");
ensureColumn("pets", "vet_phone", "TEXT");
ensureColumn("pets", "insurance_info", "TEXT");
ensureColumn("pets", "personality", "TEXT");
ensureColumn("pets", "contact_name2", "TEXT");
ensureColumn("pets", "contact_instagram", "TEXT");
ensureColumn("pets", "lost", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("pets", "lost_since", "TEXT");
ensureColumn("pets", "lost_note", "TEXT");
ensureColumn("pets", "notify_scans", "INTEGER NOT NULL DEFAULT 1");
ensureColumn("pets", "last_scan_email_at", "TEXT");
ensureColumn("users", "session_version", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("admin_users", "session_version", "INTEGER NOT NULL DEFAULT 0");

db.exec(fs.readFileSync(path.join(root, "src/lib/schema.sql"), "utf-8"));

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@chapitag.demo";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";

const existingAdmin = db
  .prepare("SELECT id FROM admin_users WHERE email = ?")
  .get(ADMIN_EMAIL);

if (!existingAdmin) {
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  db.prepare(
    "INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
  ).run(crypto.randomUUID(), ADMIN_EMAIL, passwordHash, "Administrador");
  console.log(`✔ Usuario administrador creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
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

const existingDemoTag = db
  .prepare("SELECT * FROM tags WHERE code = 'DEMO'")
  .get();

if (!existingDemoTag) {
  const demoOwnerEmail = "demo@chapitag.demo";
  let owner = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(demoOwnerEmail);

  if (!owner) {
    const ownerId = crypto.randomUUID();
    db.prepare(
      `INSERT INTO users (id, email, password_hash, name, phone, whatsapp)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      ownerId,
      demoOwnerEmail,
      bcrypt.hashSync("Demo1234!", 10),
      "Familia Demo",
      "+5491100000000",
      "+5491100000000"
    );
    owner = { id: ownerId };
  }

  const petId = crypto.randomUUID();
  db.prepare(
    `INSERT INTO pets (
      id, owner_id, name, species, breed, color, sex, birth_year, sterilized,
      medical_notes, reward_offered, contact_name, contact_phone,
      contact_whatsapp, city, show_exact_address, theme, badges, vet_name,
      vet_phone, insurance_info, personality, contact_name2, photo_url
    ) VALUES (?, ?, 'Firulais', 'perro', 'Mestizo', 'Marrón y blanco', 'macho', ?, 1,
      'Alérgico a la penicilina', 'Se ofrece recompensa', 'Familia Demo',
      '+5491100000000', '+5491100000000', 'Buenos Aires', 0, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
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
    DEMO_PERSONALIZATION.photoUrl
  );

  db.prepare(
    "INSERT INTO tags (id, code, status, pet_id, assigned_at) VALUES (?, 'DEMO', 'ASSIGNED', ?, datetime('now'))"
  ).run(crypto.randomUUID(), petId);

  console.log("✔ Mascota de ejemplo creada — probá /p/demo");
} else {
  // Ya existía (de una siembra anterior a esta versión): igual actualizamos
  // sus campos de personalización para que /p/demo muestre las funciones
  // nuevas sin tener que borrar la base de datos.
  db.prepare(
    `UPDATE pets SET theme = ?, badges = ?, vet_name = ?, vet_phone = ?,
      insurance_info = ?, personality = ?, contact_name2 = ?, photo_url = COALESCE(photo_url, ?)
     WHERE id = ?`
  ).run(
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
const hasDemoBatch = db.prepare("SELECT 1 FROM tags WHERE batch_label = ? LIMIT 1").get(LOTE_DEMO);
if (!hasDemoBatch) {
  const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const insert = db.prepare("INSERT INTO tags (id, code, status, batch_label) VALUES (?, ?, 'UNASSIGNED', ?)");
  const codes = [];
  for (let i = 0; i < 12; i++) {
    let code = "";
    for (let j = 0; j < 8; j++) code += ALPHABET[crypto.randomInt(ALPHABET.length)];
    insert.run(crypto.randomUUID(), code, LOTE_DEMO);
    codes.push(code);
  }
  console.log(`✔ ${LOTE_DEMO}: 12 chapitas sin usar (por ejemplo ${codes[0]}) — activalas desde /activar`);
}

// --- Algunos escaneos de ejemplo para la mascota DEMO ----------------------
const demoTag = db.prepare("SELECT pet_id FROM tags WHERE code = 'DEMO'").get();
if (demoTag?.pet_id) {
  const hasScans = db.prepare("SELECT 1 FROM scans WHERE pet_id = ? LIMIT 1").get(demoTag.pet_id);
  if (!hasScans) {
    const insertScan = db.prepare(
      `INSERT INTO scans (id, pet_id, tag_code, kind, lat, lng, accuracy, note, created_at)
       VALUES (?, ?, 'DEMO', ?, ?, ?, ?, ?, datetime('now', ?))`
    );
    insertScan.run(crypto.randomUUID(), demoTag.pet_id, "view", null, null, null, null, "-3 days");
    insertScan.run(crypto.randomUUID(), demoTag.pet_id, "view", null, null, null, null, "-26 hours");
    insertScan.run(
      crypto.randomUUID(), demoTag.pet_id, "location", -34.6037, -58.4389, 18,
      "Lo tengo en la puerta del kiosco (escaneo de ejemplo)", "-25 hours"
    );
    console.log("✔ Escaneos de ejemplo cargados para DEMO");
  }
}

console.log("Listo.");
