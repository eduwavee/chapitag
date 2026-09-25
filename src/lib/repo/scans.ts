import { all, get, run } from "@/lib/db";
import { newId } from "@/lib/ids";

export type ScanKind = "view" | "location";

export interface ScanRow {
  id: string;
  pet_id: string;
  tag_code: string;
  kind: ScanKind;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  note: string | null;
  created_at: string;
}

export async function recordScan(input: {
  petId: string;
  tagCode: string;
  kind: ScanKind;
  lat?: number;
  lng?: number;
  accuracy?: number;
  note?: string;
}): Promise<ScanRow> {
  const id = newId();
  await run(
    `INSERT INTO scans (id, pet_id, tag_code, kind, lat, lng, accuracy, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.petId,
    input.tagCode,
    input.kind,
    input.lat ?? null,
    input.lng ?? null,
    input.accuracy ?? null,
    input.note?.trim() || null
  );
  return (await get<ScanRow>("SELECT * FROM scans WHERE id = ?", id))!;
}

export async function listScansForPet(petId: string, limit = 20): Promise<ScanRow[]> {
  return all<ScanRow>(
    "SELECT * FROM scans WHERE pet_id = ? ORDER BY created_at DESC LIMIT ?",
    petId,
    limit
  );
}

export async function countScansForPet(petId: string): Promise<number> {
  const row = await get<{ c: number }>("SELECT COUNT(*) as c FROM scans WHERE pet_id = ?", petId);
  return row?.c ?? 0;
}

export async function countScansSince(days: number): Promise<number> {
  const row = await get<{ c: number }>(
    "SELECT COUNT(*) as c FROM scans WHERE created_at >= datetime('now', ?)",
    `-${days} days`
  );
  return row?.c ?? 0;
}

export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}
