import { createHash, randomBytes } from "node:crypto";
import { get, run } from "@/lib/db";
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

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  return get<UserRow>("SELECT * FROM users WHERE email = ?", email.trim().toLowerCase());
}

export async function findUserById(id: string): Promise<UserRow | undefined> {
  return get<UserRow>("SELECT * FROM users WHERE id = ?", id);
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  whatsapp?: string;
}): Promise<UserRow> {
  const id = newId();
  await run(
    `INSERT INTO users (id, email, password_hash, name, phone, whatsapp)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.email.trim().toLowerCase(),
    input.passwordHash,
    input.name.trim(),
    input.phone.trim(),
    input.whatsapp?.trim() || null
  );
  return (await findUserById(id))!;
}

export async function updateUserProfile(
  id: string,
  input: { name: string; email: string; phone: string; whatsapp?: string }
): Promise<UserRow> {
  await run(
    `UPDATE users SET name = ?, email = ?, phone = ?, whatsapp = ? WHERE id = ?`,
    input.name.trim(),
    input.email.trim().toLowerCase(),
    input.phone.trim(),
    input.whatsapp?.trim() || null,
    id
  );
  return (await findUserById(id))!;
}

/** Cambia la contraseña e invalida las sesiones abiertas en otros dispositivos. */
export async function updateUserPassword(id: string, passwordHash: string): Promise<UserRow> {
  await run(
    `UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?`,
    passwordHash,
    id
  );
  return (await findUserById(id))!;
}

// --- Recuperación de contraseña ------------------------------------------

const RESET_TTL_MINUTES = 60;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crea un token de un solo uso. Solo se guarda su hash: el token viaja únicamente en el email. */
export async function createPasswordReset(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await run("DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL", userId);
  await run(
    `INSERT INTO password_resets (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, datetime('now', ?))`,
    newId(),
    userId,
    hashToken(token),
    `+${RESET_TTL_MINUTES} minutes`
  );
  return token;
}

/** Usuario dueño de un token vigente y sin usar, o undefined. */
export async function findValidPasswordReset(token: string): Promise<UserRow | undefined> {
  const row = await get<{ user_id: string }>(
    `SELECT user_id FROM password_resets
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')`,
    hashToken(token)
  );
  return row ? findUserById(row.user_id) : undefined;
}

export async function markPasswordResetUsed(token: string): Promise<void> {
  await run(
    "UPDATE password_resets SET used_at = datetime('now') WHERE token_hash = ?",
    hashToken(token)
  );
}
