"use server";

import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import { createPetWithTag } from "@/lib/repo/pets";
import { addPetPhoto } from "@/lib/repo/petPhotos";
import { parsePetForm } from "@/lib/parsePetForm";
import { deleteUploadedFile } from "@/lib/upload";
import { formValues } from "@/lib/formValues";
import type { PetFormState } from "@/components/PetForm";

export async function createPetAction(
  _prevState: PetFormState | undefined,
  formData: FormData
): Promise<PetFormState> {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const values = formValues(formData);
  const tagCode = String(formData.get("tagCode") || "").trim();
  if (!tagCode) {
    return { error: "Falta el código de la chapita (está impreso en el dorso).", values };
  }

  const parsed = await parsePetForm(formData);
  if (!parsed.ok) return { error: parsed.error, values };

  const result = createPetWithTag(session.sub, parsed.input, tagCode);
  if (!result.ok) {
    // Las fotos ya se guardaron: se borran para no dejar archivos huérfanos.
    deleteUploadedFile(parsed.input.photoUrl);
    parsed.galleryPhotoUrls.forEach(deleteUploadedFile);
    return {
      error:
        result.error === "TAG_NOT_FOUND"
          ? "No encontramos una chapita con ese código. Revisá que esté bien escrito (son 8 letras y números). Las fotos hay que volver a elegirlas."
          : "Esa chapita ya está activada o fue dada de baja. Las fotos hay que volver a elegirlas.",
      values,
    };
  }

  for (const url of parsed.galleryPhotoUrls) {
    addPetPhoto(result.pet.id, url);
  }

  redirect(`/panel/mascotas/${result.pet.id}?creada=1`);
}
