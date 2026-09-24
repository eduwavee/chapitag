"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import {
  deletePet,
  findOwnedPet,
  setPetLost,
  setPetNotifyScans,
  updatePet,
} from "@/lib/repo/pets";
import {
  addPetPhoto,
  countPetPhotos,
  deletePetPhoto,
  MAX_GALLERY_PHOTOS,
} from "@/lib/repo/petPhotos";
import { replaceTagForPet } from "@/lib/repo/tags";
import { parsePetForm } from "@/lib/parsePetForm";
import { deleteUploadedFile } from "@/lib/upload";
import { formValues } from "@/lib/formValues";
import type { PetFormState } from "@/components/PetForm";

async function ownedPetOrRedirect(petId: string) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");
  const pet = findOwnedPet(petId, session.sub);
  if (!pet) redirect("/panel");
  return { session, pet };
}

export async function updatePetAction(
  petId: string,
  _prevState: PetFormState | undefined,
  formData: FormData
): Promise<PetFormState> {
  const { session, pet } = await ownedPetOrRedirect(petId);
  const values = formValues(formData);

  const parsed = await parsePetForm(formData);
  if (!parsed.ok) return { error: parsed.error, values };

  updatePet(petId, session.sub, parsed.input);

  // Portada reemplazada o sacada: el archivo viejo ya no se usa.
  if ((parsed.input.photoUrl || parsed.input.removePhoto) && pet.photo_url) {
    deleteUploadedFile(pet.photo_url);
  }

  for (const photoId of formData.getAll("deletePhotoIds")) {
    deleteUploadedFile(deletePetPhoto(String(photoId), petId));
  }
  const remainingSlots = Math.max(0, MAX_GALLERY_PHOTOS - countPetPhotos(petId));
  parsed.galleryPhotoUrls.slice(remainingSlots).forEach(deleteUploadedFile);
  for (const url of parsed.galleryPhotoUrls.slice(0, remainingSlots)) {
    addPetPhoto(petId, url);
  }

  redirect(`/panel/mascotas/${petId}?guardada=1`);
}

export type SimpleState = { error?: string; success?: string };

export async function setLostAction(petId: string, formData: FormData): Promise<void> {
  const { session } = await ownedPetOrRedirect(petId);
  const lost = formData.get("lost") === "1";
  const note = String(formData.get("lostNote") || "").slice(0, 280);
  setPetLost(petId, session.sub, lost, note);
  revalidatePath(`/panel/mascotas/${petId}`);
  revalidatePath("/panel");
}

export async function setNotifyAction(petId: string, formData: FormData): Promise<void> {
  const { session } = await ownedPetOrRedirect(petId);
  setPetNotifyScans(petId, session.sub, formData.get("notify") === "1");
  revalidatePath(`/panel/mascotas/${petId}`);
}

export async function replaceTagAction(
  petId: string,
  _prev: SimpleState | undefined,
  formData: FormData
): Promise<SimpleState> {
  await ownedPetOrRedirect(petId);
  const code = String(formData.get("newCode") || "").trim();
  if (!code) return { error: "Escribí el código de la chapita nueva." };

  const result = replaceTagForPet(petId, code);
  if (!result.ok) {
    return {
      error:
        result.error === "TAG_NOT_FOUND"
          ? "No encontramos una chapita con ese código. Revisalo."
          : "Esa chapita ya está activada o fue dada de baja.",
    };
  }
  redirect(`/panel/mascotas/${petId}?reemplazada=1`);
}

export async function deletePetAction(petId: string, formData: FormData): Promise<void> {
  const { session, pet } = await ownedPetOrRedirect(petId);
  const confirmName = String(formData.get("confirmName") || "").trim().toLowerCase();
  if (confirmName !== pet.name.trim().toLowerCase()) {
    redirect(`/panel/mascotas/${petId}?borrar=error#borrar`);
  }
  const photos = deletePet(petId, session.sub) ?? [];
  photos.forEach(deleteUploadedFile);
  revalidatePath("/panel");
  redirect("/panel?borrada=1");
}
