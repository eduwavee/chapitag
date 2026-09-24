import type { PetInput } from "@/lib/repo/pets";
import { savePhotoIfPresent, savePhotos } from "@/lib/upload";
import { MAX_GALLERY_PHOTOS } from "@/lib/repo/petPhotos";
import { looksLikePhone } from "@/lib/formValues";
import { normalizeInstagram } from "@/lib/ui";

const LIMITS: Record<string, number> = {
  name: 40,
  breed: 60,
  color: 60,
  microchipNumber: 30,
  medicalNotes: 500,
  rewardOffered: 120,
  contactName: 60,
  contactName2: 60,
  city: 80,
  address: 120,
  vetName: 60,
  insuranceInfo: 120,
  personality: 280,
};

function text(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) || "").trim();
  if (!value) return undefined;
  const max = LIMITS[key];
  return max ? value.slice(0, max) : value;
}

export async function parsePetForm(formData: FormData): Promise<
  | { ok: true; input: PetInput; galleryPhotoUrls: string[] }
  | { ok: false; error: string }
> {
  const name = text(formData, "name");
  const species = text(formData, "species");
  const contactName = text(formData, "contactName");
  const contactPhone = text(formData, "contactPhone");
  const contactWhatsapp = text(formData, "contactWhatsapp");
  const contactPhone2 = text(formData, "contactPhone2");
  const vetPhone = text(formData, "vetPhone");

  if (!name || !species) {
    return { ok: false, error: "Falta el nombre de la mascota." };
  }
  if (!contactName || !contactPhone) {
    return {
      ok: false,
      error: "Falta el nombre o el teléfono de contacto: es lo que va a usar quien la encuentre.",
    };
  }
  for (const [label, phone] of [
    ["El teléfono de contacto", contactPhone],
    ["El WhatsApp", contactWhatsapp],
    ["El teléfono alternativo", contactPhone2],
    ["El teléfono del veterinario", vetPhone],
  ] as const) {
    if (phone && !looksLikePhone(phone)) {
      return {
        ok: false,
        error: `${label} parece incompleto. Escribilo con código de área, ej: 11 2345-6789.`,
      };
    }
  }

  const instagramRaw = text(formData, "contactInstagram");
  const contactInstagram = instagramRaw ? normalizeInstagram(instagramRaw) : undefined;
  if (instagramRaw && !contactInstagram) {
    return {
      ok: false,
      error: "El usuario de Instagram no parece válido. Escribilo como @usuario (letras, números, punto o guion bajo).",
    };
  }

  const birthYearRaw = text(formData, "birthYear");
  const birthYear = birthYearRaw ? parseInt(birthYearRaw, 10) : undefined;
  const thisYear = new Date().getFullYear();
  if (birthYear !== undefined && (Number.isNaN(birthYear) || birthYear < thisYear - 40 || birthYear > thisYear)) {
    return { ok: false, error: `El año de nacimiento tiene que estar entre ${thisYear - 40} y ${thisYear}.` };
  }

  let photoUrl: string | undefined;
  let galleryPhotoUrls: string[] = [];
  try {
    const photoFile = formData.get("photo");
    const saved = await savePhotoIfPresent(
      photoFile instanceof File ? photoFile : null
    );
    if (saved) photoUrl = saved;

    const galleryFiles = formData
      .getAll("galleryPhotos")
      .filter((f): f is File => f instanceof File && f.size > 0)
      .slice(0, MAX_GALLERY_PHOTOS);
    galleryPhotoUrls = await savePhotos(galleryFiles);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  const badges = formData.getAll("badges").map((b) => String(b));

  const input: PetInput = {
    name,
    species,
    breed: text(formData, "breed"),
    color: text(formData, "color"),
    sex: text(formData, "sex"),
    birthYear,
    sterilized: formData.get("sterilized") === "on",
    microchipNumber: text(formData, "microchipNumber"),
    medicalNotes: text(formData, "medicalNotes"),
    photoUrl,
    removePhoto: formData.get("removePhoto") === "on",
    rewardOffered: text(formData, "rewardOffered"),
    contactName,
    contactPhone,
    contactWhatsapp,
    contactPhone2,
    contactName2: text(formData, "contactName2"),
    contactInstagram: contactInstagram ?? undefined,
    city: text(formData, "city"),
    address: text(formData, "address"),
    showExactAddress: formData.get("showExactAddress") === "on",
    theme: text(formData, "theme"),
    badges,
    vetName: text(formData, "vetName"),
    vetPhone,
    insuranceInfo: text(formData, "insuranceInfo"),
    personality: text(formData, "personality"),
  };

  return { ok: true, input, galleryPhotoUrls };
}
