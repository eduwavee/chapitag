import { cache } from "react";
import { lookupTag } from "@/lib/repo/pets";
import { listPetPhotos } from "@/lib/repo/petPhotos";

/** Una sola consulta por request, compartida entre generateMetadata, la página y la imagen OG. */
export const getTagView = cache((code: string) => {
  const result = lookupTag(code);
  if (result.state !== "assigned") return { ...result, photos: [] as string[] };
  return { ...result, photos: listPetPhotos(result.pet.id).map((p) => p.url) };
});
