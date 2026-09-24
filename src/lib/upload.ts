import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

const MAX_BYTES = 10 * 1024 * 1024; // 10MB de entrada; se guarda comprimida
const MAX_DIMENSION = 1600;

/**
 * Guarda una foto subida por el usuario en un directorio privado (fuera de
 * /public) y devuelve la URL para servirla por /api/uploads/[filename], o
 * null si no vino ningún archivo.
 *
 * La foto se re-codifica con sharp: se rota según EXIF, se achica a 1600px
 * como máximo y se guarda como WebP. Eso (1) valida que sea una imagen de
 * verdad y no otra cosa con extensión de imagen, (2) borra los metadatos EXIF
 * —incluida la ubicación GPS de donde se sacó la foto, que suele ser la casa
 * del dueño— y (3) hace que el perfil cargue rápido con datos móviles.
 *
 * Por qué no /public: Next.js no sirve archivos agregados a /public después
 * del build. Para desplegar en serverless (Vercel) hay que cambiar esta
 * función y el route handler de /api/uploads por un storage externo.
 */
export function uploadsDir(): string {
  return path.join(process.cwd(), "data", "uploads");
}

export async function savePhotoIfPresent(
  file: File | null | undefined
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    throw new Error("La foto tiene que ser JPG, PNG, WEBP o HEIC.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La foto no puede pesar más de 10 MB.");
  }

  let output: Buffer;
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    throw new Error("No pudimos leer esa foto. Probá con otra (JPG o PNG).");
  }

  const dir = uploadsDir();
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  fs.writeFileSync(path.join(dir, filename), output);

  return `/api/uploads/${filename}`;
}

/** Igual que savePhotoIfPresent pero para varios archivos (galería). Ignora entradas vacías. */
export async function savePhotos(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await savePhotoIfPresent(file);
    if (url) urls.push(url);
  }
  return urls;
}

/** Borra del disco una foto guardada con savePhotoIfPresent. Ignora URLs ajenas. */
export function deleteUploadedFile(url: string | null | undefined): void {
  if (!url) return;
  const match = url.match(/^\/api\/uploads\/([a-zA-Z0-9-]+\.(?:jpg|jpeg|png|webp))$/);
  if (!match) return;
  try {
    fs.unlinkSync(path.join(uploadsDir(), match[1]));
  } catch {
    // Ya no existía: nada que hacer.
  }
}
