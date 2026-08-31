"use server";

import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import { createPetWithTag } from "@/lib/repo/pets";
import { addPetPhoto } from "@/lib/repo/petPhotos";
import { parsePetForm } from "@/lib/parsePetForm";
import type { PetFormState } from "@/components/PetForm";

export async function createPetAction(
  _prevState: PetFormState | undefined,
  formData: FormData
): Promise<PetFormState> {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const tagCode = String(formData.get("tagCode") || "").trim();
  if (!tagCode) {
    return { error: "Ingresá el código de la tarjeta NFC." };
  }

  const parsed = await parsePetForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const result = createPetWithTag(session.sub, parsed.input, tagCode);
  if (!result.ok) {
    if (result.error === "TAG_NOT_FOUND") {
      return {
        error:
          "No encontramos ninguna tarjeta con ese código. Revisá que esté bien escrito.",
      };
    }
    return {
      error:
        "Esa tarjeta ya está asignada a otra mascota o fue dada de baja.",
    };
  }

  for (const url of parsed.galleryPhotoUrls) {
    addPetPhoto(result.pet.id, url);
  }

  redirect(`/panel/mascotas/${result.pet.id}?creada=1`);
}
