import { db } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface AdminRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export function findAdminByEmail(email: string): AdminRow | undefined {
  return db
    .prepare("SELECT * FROM admin_users WHERE email = ?")
    .get(email.trim().toLowerCase()) as AdminRow | undefined;
}

export function countAdmins(): number {
  const row = db
    .prepare("SELECT COUNT(*) as c FROM admin_users")
    .get() as { c: number };
  return row.c;
}

export function createAdmin(input: {
  email: string;
  passwordHash: string;
  name: string;
}): AdminRow {
  const id = newId();
  db.prepare(
    `INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)`
  ).run(id, input.email.trim().toLowerCase(), input.passwordHash, input.name.trim());
  return findAdminByEmail(input.email)!;
}
