import { all, get, run } from "@/lib/db";
import { newId } from "@/lib/ids";

export interface PetPhotoRow {
  id: string;
  pet_id: string;
  url: string;
  position: number;
  created_at: string;
}

export { MAX_GALLERY_PHOTOS } from "@/lib/limits";

export async function listPetPhotos(petId: string): Promise<PetPhotoRow[]> {
  return all<PetPhotoRow>(
    "SELECT * FROM pet_photos WHERE pet_id = ? ORDER BY position ASC, created_at ASC",
    petId
  );
}

export async function countPetPhotos(petId: string): Promise<number> {
  const row = await get<{ c: number }>("SELECT COUNT(*) as c FROM pet_photos WHERE pet_id = ?", petId);
  return row?.c ?? 0;
}

export async function addPetPhoto(petId: string, url: string): Promise<PetPhotoRow> {
  const id = newId();
  await run(
    `INSERT INTO pet_photos (id, pet_id, url, position)
     VALUES (?, ?, ?, (SELECT COALESCE(MAX(position), -1) + 1 FROM pet_photos WHERE pet_id = ?))`,
    id,
    petId,
    url,
    petId
  );
  return (await get<PetPhotoRow>("SELECT * FROM pet_photos WHERE id = ?", id))!;
}

/**
 * Borra una foto de galería, verificando que pertenezca a la mascota
 * indicada. Devuelve la URL borrada (para eliminar el archivo) o null.
 */
export async function deletePetPhoto(photoId: string, petId: string): Promise<string | null> {
  const row = await get<{ url: string }>(
    "SELECT url FROM pet_photos WHERE id = ? AND pet_id = ?",
    photoId,
    petId
  );
  if (!row) return null;
  await run("DELETE FROM pet_photos WHERE id = ? AND pet_id = ?", photoId, petId);
  return row.url;
}
