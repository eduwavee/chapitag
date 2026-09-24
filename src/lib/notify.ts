import { findUserById } from "@/lib/repo/users";
import { markScanEmailSent, type PetRow } from "@/lib/repo/pets";
import { mapsUrl, type ScanRow } from "@/lib/repo/scans";
import { sendEmail } from "@/lib/email";

/** Cada cuánto, como máximo, avisamos por email de simples aperturas del perfil. */
const VIEW_EMAIL_COOLDOWN_MIN = 30;
const VIEW_EMAIL_COOLDOWN_LOST_MIN = 5;

function minutesSince(sqliteTimestamp: string | null): number {
  if (!sqliteTimestamp) return Infinity;
  const t = new Date(sqliteTimestamp.replace(" ", "T") + "Z").getTime();
  return (Date.now() - t) / 60000;
}

const TIME_FMT = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  day: "numeric",
  month: "long",
  timeZone: "America/Argentina/Buenos_Aires",
});

function scanTime(scan: ScanRow): string {
  return TIME_FMT.format(new Date(scan.created_at.replace(" ", "T") + "Z"));
}

/**
 * Avisa al dueño que alguien abrió el perfil de su mascota. Las aperturas se
 * agrupan (un email cada 30 min, o cada 5 si está en modo perdido) para no
 * llenarle la casilla; las ubicaciones compartidas se avisan siempre.
 */
export async function notifyOwnerOfScan(
  pet: PetRow,
  scan: ScanRow,
  panelUrl: string
): Promise<void> {
  if (!pet.notify_scans) return;
  const owner = findUserById(pet.owner_id);
  if (!owner) return;

  if (scan.kind === "view") {
    const cooldown = pet.lost ? VIEW_EMAIL_COOLDOWN_LOST_MIN : VIEW_EMAIL_COOLDOWN_MIN;
    if (minutesSince(pet.last_scan_email_at) < cooldown) return;
    markScanEmailSent(pet.id);
    await sendEmail({
      to: owner.email,
      subject: pet.lost
        ? `Alguien acaba de escanear la chapita de ${pet.name}`
        : `Escanearon la chapita de ${pet.name}`,
      lines: [
        `Hola, ${owner.name}.`,
        `Alguien abrió el perfil de ${pet.name} desde su chapita (${scanTime(scan)}).`,
        pet.lost
          ? `Como ${pet.name} está en modo perdido, es probable que la hayan encontrado: tené el teléfono a mano. Si comparten su ubicación, te llega otro email con el mapa.`
          : `Si ${pet.name} está con vos, no hace falta que hagas nada. Si no, revisá tu panel: quien la encontró puede compartirte su ubicación.`,
      ],
      action: { label: "Ver escaneos", url: panelUrl },
      footer: "Podés desactivar estos avisos desde el perfil de la mascota en tu panel.",
    });
    return;
  }

  // Ubicación compartida: siempre se avisa.
  markScanEmailSent(pet.id);
  const lines = [
    `Hola, ${owner.name}.`,
    `Alguien que encontró a ${pet.name} te compartió su ubicación (${scanTime(scan)}).`,
  ];
  if (scan.note) lines.push(`Mensaje: “${scan.note}”`);
  if (scan.accuracy) lines.push(`Precisión aproximada: ${Math.round(scan.accuracy)} metros.`);
  await sendEmail({
    to: owner.email,
    subject: `Te compartieron la ubicación de ${pet.name}`,
    lines,
    action:
      scan.lat != null && scan.lng != null
        ? { label: "Abrir en el mapa", url: mapsUrl(scan.lat, scan.lng) }
        : { label: "Ver en tu panel", url: panelUrl },
    footer: `También lo tenés en tu panel: ${panelUrl}`,
  });
}
