import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { uploadsDir } from "@/lib/upload";

// Nunca cachear estáticamente esta ruta: los archivos se agregan en tiempo
// de ejecución (fotos subidas por los usuarios) y necesitamos leerlos del
// disco en cada request.
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
  if (!/^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/.test(filename)) {
    return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }

  const filePath = path.join(uploadsDir(), filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  const data = fs.readFileSync(filePath);

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      // Los nombres son UUID aleatorios (no se reutilizan), así que se
      // pueden cachear "para siempre" en el navegador/CDN sin riesgo.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
