"use server";

import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import { findPetById, updatePet } from "@/lib/repo/pets";
import {
  addPetPhoto,
  deletePetPhoto,
  countPetPhotos,
  MAX_GALLERY_PHOTOS,
} from "@/lib/repo/petPhotos";
import { parsePetForm } from "@/lib/parsePetForm";
import type { PetFormState } from "@/components/PetForm";

export async function updatePetAction(
  petId: string,
  _prevState: PetFormState | undefined,
  formData: FormData
): Promise<PetFormState> {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const existing = findPetById(petId);
  if (!existing || existing.owner_id !== session.sub) {
    return { error: "No encontramos esa mascota." };
  }

  const parsed = await parsePetForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  updatePet(petId, session.sub, parsed.input);

  for (const photoId of formData.getAll("deletePhotoIds")) {
    deletePetPhoto(String(photoId), petId);
  }
  const remainingSlots = Math.max(0, MAX_GALLERY_PHOTOS - countPetPhotos(petId));
  for (const url of parsed.galleryPhotoUrls.slice(0, remainingSlots)) {
    addPetPhoto(petId, url);
  }

  redirect(`/panel/mascotas/${petId}?guardada=1`);
}
