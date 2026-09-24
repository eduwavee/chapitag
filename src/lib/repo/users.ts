import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  session_version: number;
  created_at: string;
}

export function findUserByEmail(email: string): UserRow | undefined {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as UserRow | undefined;
}

export function findUserById(id: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
}

export function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  whatsapp?: string;
}): UserRow {
  const id = newId();
  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, phone, whatsapp)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.email.trim().toLowerCase(),
    input.passwordHash,
    input.name.trim(),
    input.phone.trim(),
    input.whatsapp?.trim() || null
  );
  return findUserById(id)!;
}

export function updateUserProfile(
  id: string,
  input: { name: string; email: string; phone: string; whatsapp?: string }
): UserRow {
  db.prepare(
    `UPDATE users SET name = ?, email = ?, phone = ?, whatsapp = ? WHERE id = ?`
  ).run(
    input.name.trim(),
    input.email.trim().toLowerCase(),
    input.phone.trim(),
    input.whatsapp?.trim() || null,
    id
  );
  return findUserById(id)!;
}

/** Cambia la contraseña e invalida las sesiones abiertas en otros dispositivos. */
export function updateUserPassword(id: string, passwordHash: string): UserRow {
  db.prepare(
    `UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?`
  ).run(passwordHash, id);
  return findUserById(id)!;
}

// --- Recuperación de contraseña ------------------------------------------

const RESET_TTL_MINUTES = 60;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crea un token de un solo uso. Solo se guarda su hash: el token viaja únicamente en el email. */
export function createPasswordReset(userId: string): string {
  const token = randomBytes(32).toString("base64url");
  db.prepare("DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL").run(userId);
  db.prepare(
    `INSERT INTO password_resets (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, datetime('now', ?))`
  ).run(newId(), userId, hashToken(token), `+${RESET_TTL_MINUTES} minutes`);
  return token;
}

/** Usuario dueño de un token vigente y sin usar, o undefined. */
export function findValidPasswordReset(token: string): UserRow | undefined {
  const row = db
    .prepare(
      `SELECT user_id FROM password_resets
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')`
    )
    .get(hashToken(token)) as { user_id: string } | undefined;
  return row ? findUserById(row.user_id) : undefined;
}

export function markPasswordResetUsed(token: string): void {
  db.prepare("UPDATE password_resets SET used_at = datetime('now') WHERE token_hash = ?").run(
    hashToken(token)
  );
}
