import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { listTagsDetailed, listTagsForBatch } from "@/lib/repo/tags";
import { getBaseUrl } from "@/lib/url";

function csvCell(value: string | null | undefined): string {
  const s = value ?? "";
  // Evita que Excel interprete celdas como fórmulas (inyección CSV).
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/**
 * CSV del lote (o de todas las chapitas) para la imprenta / grabado: código,
 * URL a grabar en el chip, estado y datos de asignación. Separado por comas,
 * con BOM para que Excel lo abra con acentos.
 */
export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const lote = new URL(request.url).searchParams.get("lote");
  const tags = lote ? listTagsForBatch(lote) : listTagsDetailed({}, 100000, 0);
  const base = await getBaseUrl();

  const header = ["codigo", "url_nfc", "estado", "lote", "creada", "activada", "mascota", "dueño_email"];
  const rows = tags.map((t) =>
    [t.code, `${base}/p/${t.code}`, t.status, t.batch_label, t.created_at, t.assigned_at, t.pet_name, t.owner_email]
      .map(csvCell)
      .join(",")
  );
  const csv = "﻿" + [header.join(","), ...rows].join("\n");
  const filename = `chapitag-${(lote || "todas").replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
