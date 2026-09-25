import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, get, put } from "@vercel/blob";
import sharp from "sharp";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

const MAX_BYTES = 10 * 1024 * 1024; // 10MB de entrada; se guarda comprimida
const MAX_DIMENSION = 1600;

/** Nombres de archivo que genera savePhotoIfPresent (y los únicos que se sirven). */
export const UPLOAD_NAME = /^[a-zA-Z0-9-]+\.(?:jpg|jpeg|png|webp)$/;
const UPLOAD_URL = /^\/api\/uploads\/([a-zA-Z0-9-]+\.(?:jpg|jpeg|png|webp))$/;

/**
 * Dónde viven las fotos:
 * - Publicada (Vercel), en un store privado de Vercel Blob: en serverless el
 *   disco se borra entre invocaciones. Se activa sola cuando el proyecto
 *   tiene un store conectado (BLOB_STORE_ID o BLOB_READ_WRITE_TOKEN).
 * - En la compu, en data/uploads.
 * En los dos casos la URL guardada es /api/uploads/<archivo> y la sirve
 * nuestro route handler: la foto nunca queda en una URL pública directa.
 */
function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

const blobPath = (filename: string) => `uploads/${filename}`;

function uploadsDir(): string {
  return path.join(process.cwd(), "data", "uploads");
}

/**
 * Guarda una foto subida por el usuario y devuelve la URL para servirla por
 * /api/uploads/[filename], o null si no vino ningún archivo.
 *
 * La foto se re-codifica con sharp: se rota según EXIF, se achica a 1600px
 * como máximo y se guarda como WebP. Eso (1) valida que sea una imagen de
 * verdad y no otra cosa con extensión de imagen, (2) borra los metadatos EXIF
 * —incluida la ubicación GPS de donde se sacó la foto, que suele ser la casa
 * del dueño— y (3) hace que el perfil cargue rápido con datos móviles.
 */
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

  const filename = `${randomUUID()}.webp`;
  if (blobEnabled()) {
    await put(blobPath(filename), output, {
      access: "private",
      contentType: "image/webp",
      addRandomSuffix: false,
    });
  } else {
    const dir = uploadsDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), output);
  }

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

/** Los bytes de una foto subida, o null si no existe o el nombre no es válido. */
export async function readUpload(filename: string): Promise<Buffer | null> {
  if (!UPLOAD_NAME.test(filename)) return null;
  if (blobEnabled()) {
    const result = await get(blobPath(filename), { access: "private" }).catch(() => null);
    if (!result || result.statusCode !== 200) return null;
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
  try {
    return fs.readFileSync(path.join(uploadsDir(), filename));
  } catch {
    return null;
  }
}

/** El archivo detrás de una URL /api/uploads/..., o null si es otra cosa (por ejemplo /demo/...). */
export function uploadNameFromUrl(url: string | null | undefined): string | null {
  return url?.match(UPLOAD_URL)?.[1] ?? null;
}

/** Borra una foto guardada con savePhotoIfPresent. Ignora URLs ajenas. */
export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  const filename = uploadNameFromUrl(url);
  if (!filename) return;
  try {
    if (blobEnabled()) await del(blobPath(filename));
    else fs.unlinkSync(path.join(uploadsDir(), filename));
  } catch {
    // Ya no existía: nada que hacer.
  }
}
