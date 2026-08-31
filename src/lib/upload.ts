import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Guarda una foto subida por el usuario en un directorio privado (fuera de
 * /public) y devuelve la URL para acceder a ella a través de la ruta
 * /api/uploads/[filename], o null si no vino ningún archivo.
 *
 * Por qué no usamos /public directamente: Next.js optimiza y, en algunos
 * casos, cachea agresivamente los archivos estáticos de /public a nivel de
 * ruta, por lo que un archivo agregado en tiempo de ejecución (después del
 * build) puede no servirse hasta reiniciar/reconstruir. Sirviendo el archivo
 * mediante un route handler dinámico evitamos ese problema.
 *
 * NOTA para producción: esto guarda en el disco local del servidor, lo cual
 * funciona en un servidor tradicional con disco persistente (VPS, Docker,
 * Railway, Fly.io, etc.). En plataformas serverless (Vercel) el sistema de
 * archivos es efímero entre invocaciones, así que ahí conviene reemplazar
 * este storage por uno externo (Vercel Blob, S3, Cloudinary, etc.) sin tener
 * que tocar el resto de la app: alcanza con cambiar esta función y el route
 * handler de /api/uploads.
 */
export function uploadsDir(): string {
  return path.join(process.cwd(), "data", "uploads");
}

export async function savePhotoIfPresent(
  file: File | null | undefined
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_TYPES[file.type]) {
    throw new Error("La foto debe ser JPG, PNG o WEBP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La foto no puede pesar más de 5MB.");
  }

  const dir = uploadsDir();
  fs.mkdirSync(dir, { recursive: true });

  const ext = ALLOWED_TYPES[file.type];
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  return `/api/uploads/${filename}`;
}

/** Igual que savePhotoIfPresent pero para varios archivos (galería de fotos). Ignora entradas vacías. */
export async function savePhotos(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await savePhotoIfPresent(file);
    if (url) urls.push(url);
  }
  return urls;
}
