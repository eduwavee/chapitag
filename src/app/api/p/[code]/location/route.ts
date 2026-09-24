import { NextResponse, after } from "next/server";
import { lookupTag } from "@/lib/repo/pets";
import { mapsUrl, recordScan } from "@/lib/repo/scans";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { notifyOwnerOfScan } from "@/lib/notify";
import { getBaseUrl } from "@/lib/url";

function num(v: unknown, min: number, max: number): number | undefined {
  return typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : undefined;
}

/** Quien encontró a la mascota comparte su ubicación (y/o un mensaje) con la familia. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const view = lookupTag(code);
  if (view.state !== "assigned") {
    return NextResponse.json({ error: "Esta chapita no tiene un perfil activo." }, { status: 404 });
  }

  const ip = await clientIp();
  if (!rateLimit(`location:${ip}`, 6, 15 * 60 * 1000).ok) {
    return NextResponse.json(
      { error: "Ya enviaste varias ubicaciones. Esperá unos minutos o llamá directamente." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const lat = num(body.lat, -90, 90);
  const lng = num(body.lng, -180, 180);
  const accuracy = num(body.accuracy, 0, 100000);
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 280) : undefined;
  const hasCoords = lat !== undefined && lng !== undefined;

  if (!hasCoords && !note) {
    return NextResponse.json({ error: "Falta la ubicación o un mensaje." }, { status: 400 });
  }

  const { pet, tag } = view;
  const scan = recordScan({
    petId: pet.id,
    tagCode: tag.code,
    kind: "location",
    lat: hasCoords ? lat : undefined,
    lng: hasCoords ? lng : undefined,
    accuracy: hasCoords ? accuracy : undefined,
    note,
  });

  const panelUrl = `${await getBaseUrl()}/panel/mascotas/${pet.id}`;
  after(() => notifyOwnerOfScan({ ...pet, notify_scans: 1 }, scan, panelUrl));

  return NextResponse.json({ ok: true, mapsUrl: hasCoords ? mapsUrl(lat!, lng!) : null });
}
