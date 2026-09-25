import { get, run } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface AdminRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  session_version: number;
  created_at: string;
}

export async function findAdminByEmail(email: string): Promise<AdminRow | undefined> {
  return get<AdminRow>("SELECT * FROM admin_users WHERE email = ?", email.trim().toLowerCase());
}

export async function findAdminById(id: string): Promise<AdminRow | undefined> {
  return get<AdminRow>("SELECT * FROM admin_users WHERE id = ?", id);
}

export async function countAdmins(): Promise<number> {
  const row = await get<{ c: number }>("SELECT COUNT(*) as c FROM admin_users");
  return row?.c ?? 0;
}

export async function createAdmin(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<AdminRow> {
  const id = newId();
  await run(
    `INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)`,
    id,
    input.email.trim().toLowerCase(),
    input.passwordHash,
    input.name.trim()
  );
  return (await findAdminByEmail(input.email))!;
}

export async function updateAdminPassword(id: string, passwordHash: string): Promise<AdminRow> {
  await run(
    `UPDATE admin_users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?`,
    passwordHash,
    id
  );
  return (await findAdminById(id))!;
}
