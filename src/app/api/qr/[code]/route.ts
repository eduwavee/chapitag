import { NextResponse } from "next/server";
import { findTagByCode } from "@/lib/repo/tags";
import { qrSvg } from "@/lib/qr";
import { publicPetUrl } from "@/lib/url";

/**
 * QR vectorial (SVG) con la URL pública de una chapita. Sirve como respaldo
 * del NFC (para celulares sin NFC o con NFC apagado), para el afiche y para
 * la hoja de impresión. `?descargar=1` lo baja como archivo.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const tag = findTagByCode(code);
  if (!tag || tag.status === "REVOKED") {
    return NextResponse.json({ error: "Chapita no encontrada" }, { status: 404 });
  }

  const svg = await qrSvg(await publicPetUrl(tag.code), { margin: 2 });
  const download = new URL(request.url).searchParams.has("descargar");

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...(download ? { "Content-Disposition": `attachment; filename="chapitag-${tag.code}.svg"` } : {}),
    },
  });
}
