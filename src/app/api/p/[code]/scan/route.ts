import { NextResponse, after } from "next/server";
import { getSession } from "@/lib/auth";
import { lookupTag } from "@/lib/repo/pets";
import { recordScan } from "@/lib/repo/scans";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { notifyOwnerOfScan } from "@/lib/notify";
import { getBaseUrl } from "@/lib/url";

const BOT_UA = /bot|crawler|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|headless/i;

/** Registra un escaneo (apertura del perfil público) y avisa al dueño por email. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return new NextResponse(null, { status: 204 });

  const view = lookupTag(code);
  if (view.state !== "assigned") return new NextResponse(null, { status: 204 });
  const { pet, tag } = view;

  // El dueño mirando su propio perfil no cuenta como escaneo.
  const session = await getSession();
  if (session?.role === "OWNER" && session.sub === pet.owner_id) {
    return new NextResponse(null, { status: 204 });
  }

  // Una recarga o volver atrás no es un escaneo nuevo: 1 cada 10 min por persona y chapita.
  const ip = await clientIp();
  if (!rateLimit(`scan:${ip}:${tag.code}`, 1, 10 * 60 * 1000).ok) {
    return new NextResponse(null, { status: 204 });
  }

  const scan = recordScan({ petId: pet.id, tagCode: tag.code, kind: "view" });
  const panelUrl = `${await getBaseUrl()}/panel/mascotas/${pet.id}`;
  after(() => notifyOwnerOfScan(pet, scan, panelUrl));

  return new NextResponse(null, { status: 204 });
}
