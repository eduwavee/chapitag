import { db, transaction } from "@/lib/db";
import { newId } from "@/lib/ids";
import {
  assignTagToPet,
  findTagByCode,
  normalizeCode,
  unassignTagsForPet,
  type TagRow,
} from "@/lib/repo/tags";
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
  contact_instagram: string | null;
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
  lost: 0 | 1;
  lost_since: string | null;
  lost_note: string | null;
  notify_scans: 0 | 1;
  last_scan_email_at: string | null;
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
  /** true = el dueño sacó la foto de portada. */
  removePhoto?: boolean;
  rewardOffered?: string;
  contactName: string;
  contactPhone: string;
  contactWhatsapp?: string;
  contactPhone2?: string;
  contactName2?: string;
  /** Usuario de Instagram ya normalizado (sin @ ni URL). */
  contactInstagram?: string;
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

/** Mascota solo si pertenece al dueño indicado. */
export function findOwnedPet(id: string, ownerId: string): PetRow | undefined {
  const pet = findPetById(id);
  return pet && pet.owner_id === ownerId ? pet : undefined;
}

export interface PetListRow extends PetRow {
  tag_code: string | null;
  last_scan_at: string | null;
  scans_7d: number;
}

/** Mascotas del dueño con su chapita activa y actividad de escaneos (una sola consulta). */
export function listPetsByOwner(ownerId: string): PetListRow[] {
  return db
    .prepare(
      `SELECT pets.*,
              (SELECT code FROM tags WHERE tags.pet_id = pets.id AND tags.status = 'ASSIGNED') as tag_code,
              (SELECT MAX(created_at) FROM scans WHERE scans.pet_id = pets.id) as last_scan_at,
              (SELECT COUNT(*) FROM scans WHERE scans.pet_id = pets.id
                 AND scans.created_at >= datetime('now', '-7 days')) as scans_7d
       FROM pets
       WHERE owner_id = ?
       ORDER BY pets.lost DESC, pets.created_at DESC`
    )
    .all(ownerId) as unknown as PetListRow[];
}

export type CreatePetResult =
  | { ok: true; pet: PetRow }
  | { ok: false; error: "TAG_NOT_FOUND" | "TAG_NOT_AVAILABLE" };

function petValues(input: PetInput) {
  return {
    name: input.name.trim(),
    species: input.species,
    breed: input.breed?.trim() || null,
    color: input.color?.trim() || null,
    sex: input.sex || null,
    birthYear: input.birthYear ?? null,
    sterilized: input.sterilized ? 1 : 0,
    microchip: input.microchipNumber?.trim() || null,
    medical: input.medicalNotes?.trim() || null,
    reward: input.rewardOffered?.trim() || null,
    contactName: input.contactName.trim(),
    contactPhone: input.contactPhone.trim(),
    contactWhatsapp: input.contactWhatsapp?.trim() || null,
    contactPhone2: input.contactPhone2?.trim() || null,
    contactName2: input.contactName2?.trim() || null,
    contactInstagram: input.contactInstagram?.trim() || null,
    city: input.city?.trim() || null,
    address: input.address?.trim() || null,
    showExact: input.showExactAddress ? 1 : 0,
    theme: input.theme || DEFAULT_THEME_ID,
    badges: serializeBadges(input.badges || []),
    vetName: input.vetName?.trim() || null,
    vetPhone: input.vetPhone?.trim() || null,
    insurance: input.insuranceInfo?.trim() || null,
    personality: input.personality?.trim() || null,
  };
}

/** Crea una mascota y, en la misma transacción, le asigna un código de tarjeta NFC libre. */
export function createPetWithTag(
  ownerId: string,
  input: PetInput,
  tagCode: string
): CreatePetResult {
  const code = normalizeCode(tagCode);
  const tag = findTagByCode(code);
  if (!tag) return { ok: false, error: "TAG_NOT_FOUND" };
  if (tag.status !== "UNASSIGNED") {
    return { ok: false, error: "TAG_NOT_AVAILABLE" };
  }

  const v = petValues(input);
  const id = newId();

  try {
    transaction(() => {
      db.prepare(
        `INSERT INTO pets (
          id, owner_id, name, species, breed, color, sex, birth_year, sterilized,
          microchip_number, medical_notes, photo_url, reward_offered,
          contact_name, contact_phone, contact_whatsapp, contact_phone2,
          contact_name2, city, address, show_exact_address, theme, badges,
          vet_name, vet_phone, insurance_info, personality, contact_instagram
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id, ownerId, v.name, v.species, v.breed, v.color, v.sex, v.birthYear,
        v.sterilized, v.microchip, v.medical, input.photoUrl || null, v.reward,
        v.contactName, v.contactPhone, v.contactWhatsapp, v.contactPhone2,
        v.contactName2, v.city, v.address, v.showExact, v.theme, v.badges,
        v.vetName, v.vetPhone, v.insurance, v.personality, v.contactInstagram
      );
      if (!assignTagToPet(code, id)) throw new TagTakenError();
    });
  } catch (err) {
    if (err instanceof TagTakenError) return { ok: false, error: "TAG_NOT_AVAILABLE" };
    throw err;
  }

  return { ok: true, pet: findPetById(id)! };
}

class TagTakenError extends Error {}

export function updatePet(
  id: string,
  ownerId: string,
  input: PetInput
): PetRow | null {
  const existing = findOwnedPet(id, ownerId);
  if (!existing) return null;

  const v = petValues(input);
  const photoUrl = input.photoUrl
    ? input.photoUrl
    : input.removePhoto
      ? null
      : existing.photo_url;

  db.prepare(
    `UPDATE pets SET
      name = ?, species = ?, breed = ?, color = ?, sex = ?, birth_year = ?,
      sterilized = ?, microchip_number = ?, medical_notes = ?, photo_url = ?,
      reward_offered = ?, contact_name = ?, contact_phone = ?,
      contact_whatsapp = ?, contact_phone2 = ?, contact_name2 = ?, city = ?,
      address = ?, show_exact_address = ?, theme = ?, badges = ?,
      vet_name = ?, vet_phone = ?, insurance_info = ?, personality = ?,
      contact_instagram = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    v.name, v.species, v.breed, v.color, v.sex, v.birthYear, v.sterilized,
    v.microchip, v.medical, photoUrl, v.reward, v.contactName, v.contactPhone,
    v.contactWhatsapp, v.contactPhone2, v.contactName2, v.city, v.address,
    v.showExact, v.theme, v.badges, v.vetName, v.vetPhone, v.insurance,
    v.personality, v.contactInstagram, id
  );

  return findPetById(id) ?? null;
}

/** Activa o desactiva el modo perdido. `note` es el mensaje opcional que se muestra en el perfil. */
export function setPetLost(
  id: string,
  ownerId: string,
  lost: boolean,
  note?: string
): PetRow | null {
  const existing = findOwnedPet(id, ownerId);
  if (!existing) return null;
  if (lost) {
    db.prepare(
      `UPDATE pets SET lost = 1,
        lost_since = COALESCE(CASE WHEN lost = 1 THEN lost_since END, datetime('now')),
        lost_note = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(note?.trim() || null, id);
  } else {
    db.prepare(
      `UPDATE pets SET lost = 0, lost_since = NULL, lost_note = NULL, updated_at = datetime('now') WHERE id = ?`
    ).run(id);
  }
  return findPetById(id) ?? null;
}

export function setPetNotifyScans(id: string, ownerId: string, notify: boolean) {
  const existing = findOwnedPet(id, ownerId);
  if (!existing) return null;
  db.prepare("UPDATE pets SET notify_scans = ? WHERE id = ?").run(notify ? 1 : 0, id);
  return findPetById(id) ?? null;
}

export function markScanEmailSent(id: string) {
  db.prepare("UPDATE pets SET last_scan_email_at = datetime('now') WHERE id = ?").run(id);
}

/**
 * Borra el perfil de la mascota. Sus tarjetas vuelven a quedar libres (el
 * dueño sigue teniendo la chapita física y puede activarla para otra
 * mascota). Devuelve las URLs de fotos para que el caller borre los archivos.
 */
export function deletePet(id: string, ownerId: string): string[] | null {
  const existing = findOwnedPet(id, ownerId);
  if (!existing) return null;
  const photoUrls = (
    db.prepare("SELECT url FROM pet_photos WHERE pet_id = ?").all(id) as { url: string }[]
  ).map((r) => r.url);
  if (existing.photo_url) photoUrls.unshift(existing.photo_url);

  transaction(() => {
    unassignTagsForPet(id);
    db.prepare("DELETE FROM pets WHERE id = ?").run(id);
  });
  return photoUrls;
}

export type TagLookup =
  | { state: "missing" }
  | { state: "unassigned"; tag: TagRow }
  | { state: "revoked"; tag: TagRow }
  | { state: "assigned"; tag: TagRow; pet: PetRow };

/** Qué hay detrás de un código escaneado. Usado en la página pública. */
export function lookupTag(code: string): TagLookup {
  const tag = findTagByCode(code);
  if (!tag) return { state: "missing" };
  if (tag.status === "REVOKED") return { state: "revoked", tag };
  if (tag.status === "UNASSIGNED" || !tag.pet_id) return { state: "unassigned", tag };
  const pet = findPetById(tag.pet_id);
  if (!pet) return { state: "unassigned", tag };
  return { state: "assigned", tag, pet };
}
