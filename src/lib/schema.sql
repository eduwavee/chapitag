-- Esquema de la base de datos (SQLite, via node:sqlite)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
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
  active INTEGER NOT NULL DEFAULT 1,
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

CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_tags_pet ON tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_pet ON pet_photos(pet_id);
