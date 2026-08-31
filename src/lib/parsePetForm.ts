import type { PetInput } from "@/lib/repo/pets";
import { savePhotoIfPresent, savePhotos } from "@/lib/upload";
import { MAX_GALLERY_PHOTOS } from "@/lib/repo/petPhotos";

export async function parsePetForm(formData: FormData): Promise<
  | { ok: true; input: PetInput; galleryPhotoUrls: string[] }
  | { ok: false; error: string }
> {
  const name = String(formData.get("name") || "").trim();
  const species = String(formData.get("species") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();

  if (!name || !species) {
    return { ok: false, error: "Completá al menos el nombre y la especie." };
  }
  if (!contactName || !contactPhone) {
    return {
      ok: false,
      error: "Completá el nombre y teléfono de contacto.",
    };
  }

  const birthYearRaw = String(formData.get("birthYear") || "").trim();
  const birthYear = birthYearRaw ? parseInt(birthYearRaw, 10) : undefined;

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
    breed: String(formData.get("breed") || "").trim() || undefined,
    color: String(formData.get("color") || "").trim() || undefined,
    sex: String(formData.get("sex") || "").trim() || undefined,
    birthYear:
      birthYear && !Number.isNaN(birthYear) ? birthYear : undefined,
    sterilized: formData.get("sterilized") === "on",
    microchipNumber:
      String(formData.get("microchipNumber") || "").trim() || undefined,
    medicalNotes: String(formData.get("medicalNotes") || "").trim() || undefined,
    photoUrl,
    rewardOffered:
      String(formData.get("rewardOffered") || "").trim() || undefined,
    contactName,
    contactPhone,
    contactWhatsapp:
      String(formData.get("contactWhatsapp") || "").trim() || undefined,
    contactPhone2:
      String(formData.get("contactPhone2") || "").trim() || undefined,
    contactName2:
      String(formData.get("contactName2") || "").trim() || undefined,
    city: String(formData.get("city") || "").trim() || undefined,
    address: String(formData.get("address") || "").trim() || undefined,
    showExactAddress: formData.get("showExactAddress") === "on",
    theme: String(formData.get("theme") || "").trim() || undefined,
    badges,
    vetName: String(formData.get("vetName") || "").trim() || undefined,
    vetPhone: String(formData.get("vetPhone") || "").trim() || undefined,
    insuranceInfo:
      String(formData.get("insuranceInfo") || "").trim() || undefined,
    personality: String(formData.get("personality") || "").trim() || undefined,
  };

  return { ok: true, input, galleryPhotoUrls };
}
