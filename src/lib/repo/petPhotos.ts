import { db } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface PetPhotoRow {
  id: string;
  pet_id: string;
  url: string;
  position: number;
  created_at: string;
}

export const MAX_GALLERY_PHOTOS = 4;

export function listPetPhotos(petId: string): PetPhotoRow[] {
  return db
    .prepare(
      "SELECT * FROM pet_photos WHERE pet_id = ? ORDER BY position ASC, created_at ASC"
    )
    .all(petId) as unknown as PetPhotoRow[];
}

export function countPetPhotos(petId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) as c FROM pet_photos WHERE pet_id = ?")
    .get(petId) as { c: number };
  return row.c;
}

export function addPetPhoto(petId: string, url: string): PetPhotoRow {
  const id = newId();
  const position = countPetPhotos(petId);
  db.prepare(
    "INSERT INTO pet_photos (id, pet_id, url, position) VALUES (?, ?, ?, ?)"
  ).run(id, petId, url, position);
  return db
    .prepare("SELECT * FROM pet_photos WHERE id = ?")
    .get(id) as unknown as PetPhotoRow;
}

/** Borra una foto de galería, verificando que pertenezca a la mascota indicada. */
export function deletePetPhoto(photoId: string, petId: string): void {
  db.prepare("DELETE FROM pet_photos WHERE id = ? AND pet_id = ?").run(
    photoId,
    petId
  );
}
