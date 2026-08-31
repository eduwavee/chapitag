import { db } from "@/lib/db";
import { newId, newTagCode } from "@/lib/ids";

export type TagStatus = "UNASSIGNED" | "ASSIGNED" | "REVOKED";

export interface TagRow {
  id: string;
  code: string;
  status: TagStatus;
  batch_label: string | null;
  created_at: string;
  assigned_at: string | null;
  pet_id: string | null;
}

export function findTagByCode(code: string): TagRow | undefined {
  return db
    .prepare("SELECT * FROM tags WHERE code = ?")
    .get(normalizeCode(code)) as TagRow | undefined;
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s|-/g, "");
}

/** Genera un lote de códigos únicos sin asignar, listos para grabar en tarjetas NFC. */
export function generateTagBatch(count: number, batchLabel?: string): TagRow[] {
  const created: TagRow[] = [];
  const insert = db.prepare(
    `INSERT INTO tags (id, code, status, batch_label) VALUES (?, ?, 'UNASSIGNED', ?)`
  );
  for (let i = 0; i < count; i++) {
    // Reintenta si por casualidad el código ya existe (muy poco probable).
    let code = newTagCode();
    let attempts = 0;
    while (findTagByCode(code) && attempts < 5) {
      code = newTagCode();
      attempts++;
    }
    const id = newId();
    insert.run(id, code, batchLabel?.trim() || null);
    created.push(findTagByCode(code)!);
  }
  return created;
}

export function listTags(filter?: { status?: TagStatus }): TagRow[] {
  if (filter?.status) {
    return db
      .prepare("SELECT * FROM tags WHERE status = ? ORDER BY created_at DESC")
      .all(filter.status) as unknown as TagRow[];
  }
  return db
    .prepare("SELECT * FROM tags ORDER BY created_at DESC")
    .all() as unknown as TagRow[];
}

export function countTagsByStatus(): Record<TagStatus, number> {
  const rows = db
    .prepare("SELECT status, COUNT(*) as c FROM tags GROUP BY status")
    .all() as { status: TagStatus; c: number }[];
  const result: Record<TagStatus, number> = {
    UNASSIGNED: 0,
    ASSIGNED: 0,
    REVOKED: 0,
  };
  for (const row of rows) result[row.status] = row.c;
  return result;
}

export function assignTagToPet(code: string, petId: string): void {
  db.prepare(
    `UPDATE tags SET status = 'ASSIGNED', pet_id = ?, assigned_at = datetime('now') WHERE code = ?`
  ).run(petId, normalizeCode(code));
}

export function unassignTagsForPet(petId: string): void {
  db.prepare(
    `UPDATE tags SET status = 'UNASSIGNED', pet_id = NULL, assigned_at = NULL WHERE pet_id = ?`
  ).run(petId);
}

export function revokeTag(code: string): void {
  db.prepare(
    `UPDATE tags SET status = 'REVOKED', pet_id = NULL WHERE code = ?`
  ).run(normalizeCode(code));
}

export function findActiveTagForPet(petId: string): TagRow | undefined {
  return db
    .prepare("SELECT * FROM tags WHERE pet_id = ? AND status = 'ASSIGNED'")
    .get(petId) as TagRow | undefined;
}

export interface TagDetailedRow extends TagRow {
  pet_name: string | null;
  owner_name: string | null;
  owner_email: string | null;
}

/** Lista de tarjetas para el panel de admin, con el nombre de la mascota y el dueño si están asignadas. */
export function listTagsDetailed(limit = 200): TagDetailedRow[] {
  return db
    .prepare(
      `SELECT tags.*, pets.name as pet_name, users.name as owner_name, users.email as owner_email
       FROM tags
       LEFT JOIN pets ON pets.id = tags.pet_id
       LEFT JOIN users ON users.id = pets.owner_id
       ORDER BY tags.created_at DESC
       LIMIT ?`
    )
    .all(limit) as unknown as TagDetailedRow[];
}
