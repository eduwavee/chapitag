import { all, get, run, transaction } from "@/lib/db";
import { newId, newTagCode } from "@/lib/ids";

export type TagStatus = "UNASSIGNED" | "ASSIGNED" | "REVOKED";

export const TAG_STATUSES: TagStatus[] = ["UNASSIGNED", "ASSIGNED", "REVOKED"];

export interface TagRow {
  id: string;
  code: string;
  status: TagStatus;
  batch_label: string | null;
  created_at: string;
  assigned_at: string | null;
  pet_id: string | null;
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s|-/g, "");
}

export async function findTagByCode(code: string): Promise<TagRow | undefined> {
  return get<TagRow>("SELECT * FROM tags WHERE code = ?", normalizeCode(code));
}

/** Etiqueta automática para lotes generados sin nombre, así siempre se pueden exportar/imprimir. */
function defaultBatchLabel(): string {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
  return `Lote ${fmt.format(now)}`;
}

/** Genera un lote de códigos únicos sin asignar, listos para grabar en tarjetas NFC. */
export async function generateTagBatch(
  count: number,
  batchLabel?: string
): Promise<{ label: string; tags: TagRow[] }> {
  const label = batchLabel?.trim() || defaultBatchLabel();
  const tags = await transaction(async () => {
    const created: TagRow[] = [];
    for (let i = 0; i < count; i++) {
      // Reintenta si por casualidad el código ya existe (muy poco probable).
      let code = newTagCode();
      let attempts = 0;
      while ((await findTagByCode(code)) && attempts < 5) {
        code = newTagCode();
        attempts++;
      }
      await run(
        `INSERT INTO tags (id, code, status, batch_label) VALUES (?, ?, 'UNASSIGNED', ?)`,
        newId(),
        code,
        label
      );
      created.push((await findTagByCode(code))!);
    }
    return created;
  });
  return { label, tags };
}

export async function countTagsByStatus(): Promise<Record<TagStatus, number>> {
  const rows = await all<{ status: TagStatus; c: number }>(
    "SELECT status, COUNT(*) as c FROM tags GROUP BY status"
  );
  const result: Record<TagStatus, number> = {
    UNASSIGNED: 0,
    ASSIGNED: 0,
    REVOKED: 0,
  };
  for (const row of rows) result[row.status] = row.c;
  return result;
}

/**
 * Asigna una tarjeta libre a una mascota. Devuelve false si la tarjeta ya no
 * estaba libre (la condición `status = 'UNASSIGNED'` va en el UPDATE para que
 * dos activaciones simultáneas no puedan ganar las dos).
 */
export async function assignTagToPet(code: string, petId: string): Promise<boolean> {
  const result = await run(
    `UPDATE tags SET status = 'ASSIGNED', pet_id = ?, assigned_at = datetime('now')
     WHERE code = ? AND status = 'UNASSIGNED'`,
    petId,
    normalizeCode(code)
  );
  return result.changes === 1;
}

/** Libera las tarjetas de una mascota (por ejemplo al borrar su perfil). */
export async function unassignTagsForPet(petId: string): Promise<void> {
  await run(
    `UPDATE tags SET status = 'UNASSIGNED', pet_id = NULL, assigned_at = NULL WHERE pet_id = ?`,
    petId
  );
}

export async function revokeTag(code: string): Promise<void> {
  await run(`UPDATE tags SET status = 'REVOKED', pet_id = NULL WHERE code = ?`, normalizeCode(code));
}

export async function findActiveTagForPet(petId: string): Promise<TagRow | undefined> {
  return get<TagRow>("SELECT * FROM tags WHERE pet_id = ? AND status = 'ASSIGNED'", petId);
}

export type ReplaceTagResult =
  | { ok: true; code: string }
  | { ok: false; error: "TAG_NOT_FOUND" | "TAG_NOT_AVAILABLE" };

/**
 * Chapita perdida o rota: da de baja la tarjeta actual de la mascota (si
 * alguien la escanea, verá que fue dada de baja) y le asigna una nueva.
 */
export async function replaceTagForPet(petId: string, newCode: string): Promise<ReplaceTagResult> {
  const code = normalizeCode(newCode);
  const tag = await findTagByCode(code);
  if (!tag) return { ok: false, error: "TAG_NOT_FOUND" };
  if (tag.status !== "UNASSIGNED") return { ok: false, error: "TAG_NOT_AVAILABLE" };

  return transaction(async () => {
    await run(
      `UPDATE tags SET status = 'REVOKED', pet_id = NULL WHERE pet_id = ? AND status = 'ASSIGNED'`,
      petId
    );
    if (!(await assignTagToPet(code, petId))) {
      throw new Error("La tarjeta dejó de estar disponible.");
    }
    return { ok: true as const, code };
  });
}

export interface TagDetailedRow extends TagRow {
  pet_name: string | null;
  owner_name: string | null;
  owner_email: string | null;
}

export interface TagFilter {
  q?: string;
  status?: TagStatus;
  batch?: string;
}

function buildTagWhere(filter: TagFilter): { sql: string; params: string[] } {
  const clauses: string[] = [];
  const params: string[] = [];
  if (filter.status) {
    clauses.push("tags.status = ?");
    params.push(filter.status);
  }
  if (filter.batch) {
    clauses.push("tags.batch_label = ?");
    params.push(filter.batch);
  }
  if (filter.q?.trim()) {
    const like = `%${filter.q.trim()}%`;
    clauses.push(
      "(tags.code LIKE ? OR pets.name LIKE ? OR users.email LIKE ? OR users.name LIKE ?)"
    );
    params.push(`%${normalizeCode(filter.q)}%`, like, like, like);
  }
  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

const TAG_DETAIL_FROM = `FROM tags
  LEFT JOIN pets ON pets.id = tags.pet_id
  LEFT JOIN users ON users.id = pets.owner_id`;

/** Tarjetas para el panel de admin (con mascota y dueño si están asignadas), filtradas y paginadas. */
export async function listTagsDetailed(
  filter: TagFilter = {},
  limit = 50,
  offset = 0
): Promise<TagDetailedRow[]> {
  const where = buildTagWhere(filter);
  return all<TagDetailedRow>(
    `SELECT tags.*, pets.name as pet_name, users.name as owner_name, users.email as owner_email
     ${TAG_DETAIL_FROM}
     ${where.sql}
     ORDER BY tags.created_at DESC, tags.code ASC
     LIMIT ? OFFSET ?`,
    ...where.params,
    limit,
    offset
  );
}

export async function countTagsDetailed(filter: TagFilter = {}): Promise<number> {
  const where = buildTagWhere(filter);
  const row = await get<{ c: number }>(
    `SELECT COUNT(*) as c ${TAG_DETAIL_FROM} ${where.sql}`,
    ...where.params
  );
  return row?.c ?? 0;
}

export interface BatchSummary {
  label: string;
  total: number;
  assigned: number;
  revoked: number;
  created_at: string;
}

export async function listBatches(): Promise<BatchSummary[]> {
  return all<BatchSummary>(
    `SELECT COALESCE(batch_label, 'Sin lote') as label,
            COUNT(*) as total,
            SUM(status = 'ASSIGNED') as assigned,
            SUM(status = 'REVOKED') as revoked,
            MIN(created_at) as created_at
     FROM tags
     GROUP BY COALESCE(batch_label, 'Sin lote')
     ORDER BY MIN(created_at) DESC`
  );
}

/** Todas las tarjetas de un lote, en orden de generación (para exportar o imprimir). */
export async function listTagsForBatch(label: string): Promise<TagDetailedRow[]> {
  const isUnlabeled = label === "Sin lote";
  return all<TagDetailedRow>(
    `SELECT tags.*, pets.name as pet_name, users.name as owner_name, users.email as owner_email
     ${TAG_DETAIL_FROM}
     WHERE ${isUnlabeled ? "tags.batch_label IS NULL" : "tags.batch_label = ?"}
     ORDER BY tags.created_at ASC, tags.code ASC`,
    ...(isUnlabeled ? [] : [label])
  );
}
