import { db } from "@/lib/db";
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

export function recordScan(input: {
  petId: string;
  tagCode: string;
  kind: ScanKind;
  lat?: number;
  lng?: number;
  accuracy?: number;
  note?: string;
}): ScanRow {
  const id = newId();
  db.prepare(
    `INSERT INTO scans (id, pet_id, tag_code, kind, lat, lng, accuracy, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.petId,
    input.tagCode,
    input.kind,
    input.lat ?? null,
    input.lng ?? null,
    input.accuracy ?? null,
    input.note?.trim() || null
  );
  return db.prepare("SELECT * FROM scans WHERE id = ?").get(id) as unknown as ScanRow;
}

export function listScansForPet(petId: string, limit = 20): ScanRow[] {
  return db
    .prepare("SELECT * FROM scans WHERE pet_id = ? ORDER BY created_at DESC LIMIT ?")
    .all(petId, limit) as unknown as ScanRow[];
}

export function countScansForPet(petId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) as c FROM scans WHERE pet_id = ?")
    .get(petId) as { c: number };
  return row.c;
}

export function countScansSince(days: number): number {
  const row = db
    .prepare("SELECT COUNT(*) as c FROM scans WHERE created_at >= datetime('now', ?)")
    .get(`-${days} days`) as { c: number };
  return row.c;
}

export function mapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}
