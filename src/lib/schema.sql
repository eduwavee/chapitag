-- Esquema de la base de datos (SQLite, via node:sqlite)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  -- Se incrementa al cambiar/recuperar la contraseña: invalida las sesiones
  -- abiertas en otros dispositivos (el JWT lleva la versión con la que se emitió).
  session_version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  session_version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  color TEXT,
  sex TEXT,
  birth_year INTEGER,
  sterilized INTEGER NOT NULL DEFAULT 0,
  microchip_number TEXT,
  medical_notes TEXT,
  photo_url TEXT,
  reward_offered TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_whatsapp TEXT,
  contact_phone2 TEXT,
  city TEXT,
  address TEXT,
  show_exact_address INTEGER NOT NULL DEFAULT 0,
  theme TEXT NOT NULL DEFAULT 'classic',
  badges TEXT NOT NULL DEFAULT '[]',
  vet_name TEXT,
  vet_phone TEXT,
  insurance_info TEXT,
  personality TEXT,
  contact_name2 TEXT,
  -- Usuario de Instagram del dueño (sin @), opcional.
  contact_instagram TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  -- Modo perdido: el perfil público pasa a modo urgente.
  lost INTEGER NOT NULL DEFAULT 0,
  lost_since TEXT,
  lost_note TEXT,
  -- Avisos por email al dueño cuando se escanea la chapita.
  notify_scans INTEGER NOT NULL DEFAULT 1,
  last_scan_email_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pet_photos (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNASSIGNED',
  batch_label TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  assigned_at TEXT,
  pet_id TEXT REFERENCES pets(id) ON DELETE SET NULL
);

-- Cada vez que alguien abre el perfil público (escaneo de la chapita) o
-- comparte su ubicación desde ahí.
CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  tag_code TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'view', -- 'view' | 'location'
  lat REAL,
  lng REAL,
  accuracy REAL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_tags_pet ON tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_tags_batch ON tags(batch_label);
CREATE INDEX IF NOT EXISTS idx_pet_photos_pet ON pet_photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_scans_pet ON scans(pet_id, created_at);
