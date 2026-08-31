import { db } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string;
  whatsapp: string | null;
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
