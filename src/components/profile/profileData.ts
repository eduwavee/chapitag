import type { PetRow } from "@/lib/repo/pets";
import { parseBadges } from "@/lib/badges";

/** Lo que muestra el perfil público. Se arma desde la base o, en la landing, con datos de ejemplo. */
export interface ProfileData {
  code: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  sex: string | null;
  birthYear: number | null;
  sterilized: boolean;
  microchip: string | null;
  medicalNotes: string | null;
  reward: string | null;
  contactName: string;
  contactPhone: string;
  contactWhatsapp: string | null;
  contactPhone2: string | null;
  contactName2: string | null;
  contactInstagram: string | null;
  locationText: string | null;
  themeId: string;
  badges: string[];
  vetName: string | null;
  vetPhone: string | null;
  insurance: string | null;
  personality: string | null;
  lost: boolean;
  lostSince: string | null;
  lostNote: string | null;
  updatedAt: string;
  photos: string[];
}

export function toProfileData(pet: PetRow, galleryUrls: string[], code: string): ProfileData {
  return {
    code,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    color: pet.color,
    sex: pet.sex,
    birthYear: pet.birth_year,
    sterilized: !!pet.sterilized,
    microchip: pet.microchip_number,
    medicalNotes: pet.medical_notes,
    reward: pet.reward_offered,
    contactName: pet.contact_name,
    contactPhone: pet.contact_phone,
    contactWhatsapp: pet.contact_whatsapp,
    contactPhone2: pet.contact_phone2,
    contactName2: pet.contact_name2,
    contactInstagram: pet.contact_instagram,
    locationText: pet.show_exact_address
      ? [pet.address, pet.city].filter(Boolean).join(", ") || null
      : pet.city || null,
    themeId: pet.theme,
    badges: parseBadges(pet.badges),
    vetName: pet.vet_name,
    vetPhone: pet.vet_phone,
    insurance: pet.insurance_info,
    personality: pet.personality,
    lost: !!pet.lost,
    lostSince: pet.lost_since,
    lostNote: pet.lost_note,
    updatedAt: pet.updated_at,
    photos: [...(pet.photo_url ? [pet.photo_url] : []), ...galleryUrls],
  };
}
