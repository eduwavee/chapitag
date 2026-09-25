import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { readUpload, UPLOAD_NAME } from "@/lib/upload";

// Nunca cachear estáticamente esta ruta: los archivos se agregan en tiempo
// de ejecución (fotos subidas por los usuarios).
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Evita path traversal: solo permitimos nombres de archivo "planos".
  if (!UPLOAD_NAME.test(filename)) {
    return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }

  const data = await readUpload(filename);
  if (!data) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      // Los nombres son UUID aleatorios (no se reutilizan), así que se
      // pueden cachear "para siempre" en el navegador/CDN sin riesgo.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
