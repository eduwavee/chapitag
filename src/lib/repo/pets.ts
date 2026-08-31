import { db } from "@/lib/db";
import { newId } from "@/lib/ids";
import { assignTagToPet, findTagByCode, normalizeCode } from "@/lib/repo/tags";
import { serializeBadges } from "@/lib/badges";
import { DEFAULT_THEME_ID } from "@/lib/themes";

export interface PetRow {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  sex: string | null;
  birth_year: number | null;
  sterilized: 0 | 1;
  microchip_number: string | null;
  medical_notes: string | null;
  photo_url: string | null;
  reward_offered: string | null;
  contact_name: string;
  contact_phone: string;
  contact_whatsapp: string | null;
  contact_phone2: string | null;
  contact_name2: string | null;
  city: string | null;
  address: string | null;
  show_exact_address: 0 | 1;
  theme: string;
  badges: string;
  vet_name: string | null;
  vet_phone: string | null;
  insurance_info: string | null;
  personality: string | null;
  active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface PetInput {
  name: string;
  species: string;
  breed?: string;
  color?: string;
  sex?: string;
  birthYear?: number;
  sterilized?: boolean;
  microchipNumber?: string;
  medicalNotes?: string;
  photoUrl?: string;
  rewardOffered?: string;
  contactName: string;
  contactPhone: string;
  contactWhatsapp?: string;
  contactPhone2?: string;
  contactName2?: string;
  city?: string;
  address?: string;
  showExactAddress?: boolean;
  theme?: string;
  badges?: string[];
  vetName?: string;
  vetPhone?: string;
  insuranceInfo?: string;
  personality?: string;
}

export function findPetById(id: string): PetRow | undefined {
  return db.prepare("SELECT * FROM pets WHERE id = ?").get(id) as
    | PetRow
    | undefined;
}

export function listPetsByOwner(ownerId: string): PetRow[] {
  return db
    .prepare("SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC")
    .all(ownerId) as unknown as PetRow[];
}

export type CreatePetResult =
  | { ok: true; pet: PetRow }
  | { ok: false; error: "TAG_NOT_FOUND" | "TAG_NOT_AVAILABLE" };

/** Crea una mascota y, en la misma operación, le asigna un código de tarjeta NFC ya existente. */
export function createPetWithTag(
  ownerId: string,
  input: PetInput,
  tagCode: string
): CreatePetResult {
  const tag = findTagByCode(tagCode);
  if (!tag) return { ok: false, error: "TAG_NOT_FOUND" };
  if (tag.status !== "UNASSIGNED") {
    return { ok: false, error: "TAG_NOT_AVAILABLE" };
  }

  const id = newId();
  db.prepare(
    `INSERT INTO pets (
      id, owner_id, name, species, breed, color, sex, birth_year, sterilized,
      microchip_number, medical_notes, photo_url, reward_offered,
      contact_name, contact_phone, contact_whatsapp, contact_phone2,
      contact_name2, city, address, show_exact_address, theme, badges,
      vet_name, vet_phone, insurance_info, personality
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    ownerId,
    input.name.trim(),
    input.species,
    input.breed?.trim() || null,
    input.color?.trim() || null,
    input.sex || null,
    input.birthYear ?? null,
    input.sterilized ? 1 : 0,
    input.microchipNumber?.trim() || null,
    input.medicalNotes?.trim() || null,
    input.photoUrl || null,
    input.rewardOffered?.trim() || null,
    input.contactName.trim(),
    input.contactPhone.trim(),
    input.contactWhatsapp?.trim() || null,
    input.contactPhone2?.trim() || null,
    input.contactName2?.trim() || null,
    input.city?.trim() || null,
    input.address?.trim() || null,
    input.showExactAddress ? 1 : 0,
    input.theme || DEFAULT_THEME_ID,
    serializeBadges(input.badges || []),
    input.vetName?.trim() || null,
    input.vetPhone?.trim() || null,
    input.insuranceInfo?.trim() || null,
    input.personality?.trim() || null
  );

  assignTagToPet(normalizeCode(tagCode), id);

  return { ok: true, pet: findPetById(id)! };
}

export function updatePet(
  id: string,
  ownerId: string,
  input: PetInput
): PetRow | null {
  const existing = findPetById(id);
  if (!existing || existing.owner_id !== ownerId) return null;

  db.prepare(
    `UPDATE pets SET
      name = ?, species = ?, breed = ?, color = ?, sex = ?, birth_year = ?,
      sterilized = ?, microchip_number = ?, medical_notes = ?, photo_url = ?,
      reward_offered = ?, contact_name = ?, contact_phone = ?,
      contact_whatsapp = ?, contact_phone2 = ?, contact_name2 = ?, city = ?,
      address = ?, show_exact_address = ?, theme = ?, badges = ?,
      vet_name = ?, vet_phone = ?, insurance_info = ?, personality = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    input.name.trim(),
    input.species,
    input.breed?.trim() || null,
    input.color?.trim() || null,
    input.sex || null,
    input.birthYear ?? null,
    input.sterilized ? 1 : 0,
    input.microchipNumber?.trim() || null,
    input.medicalNotes?.trim() || null,
    input.photoUrl ?? existing.photo_url,
    input.rewardOffered?.trim() || null,
    input.contactName.trim(),
    input.contactPhone.trim(),
    input.contactWhatsapp?.trim() || null,
    input.contactPhone2?.trim() || null,
    input.contactName2?.trim() || null,
    input.city?.trim() || null,
    input.address?.trim() || null,
    input.showExactAddress ? 1 : 0,
    input.theme || DEFAULT_THEME_ID,
    serializeBadges(input.badges || []),
    input.vetName?.trim() || null,
    input.vetPhone?.trim() || null,
    input.insuranceInfo?.trim() || null,
    input.personality?.trim() || null,
    id
  );

  return findPetById(id) ?? null;
}

export function setPetActive(id: string, ownerId: string, active: boolean) {
  const existing = findPetById(id);
  if (!existing || existing.owner_id !== ownerId) return null;
  db.prepare("UPDATE pets SET active = ? WHERE id = ?").run(active ? 1 : 0, id);
  return findPetById(id);
}

/** Mascota + su tarjeta activa, a partir del código escaneado. Usado en la página pública. */
export function findPetByTagCode(
  code: string
): { pet: PetRow; tagCode: string } | undefined {
  const row = db
    .prepare(
      `SELECT pets.* FROM pets
       JOIN tags ON tags.pet_id = pets.id
       WHERE tags.code = ? AND tags.status = 'ASSIGNED'`
    )
    .get(normalizeCode(code)) as PetRow | undefined;
  if (!row) return undefined;
  return { pet: row, tagCode: normalizeCode(code) };
}
