export const SPECIES_OPTIONS = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "otro", label: "Otro" },
];

export const SEX_OPTIONS = [
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
];

export function speciesLabel(species: string): string {
  return species === "perro" ? "Perro" : species === "gato" ? "Gato" : "Mascota";
}

export function sexLabel(sex: string | null): string | null {
  return sex === "macho" ? "Macho" : sex === "hembra" ? "Hembra" : null;
}

export function ageLabel(birthYear: number | null): string | null {
  if (!birthYear) return null;
  const years = new Date().getFullYear() - birthYear;
  if (years < 1) return "Menos de 1 año";
  return years === 1 ? "1 año" : `${years} años`;
}

/**
 * Número para wa.me: solo dígitos y con código de país. WhatsApp necesita el
 * formato internacional; en Argentina los celulares llevan "549" + código de
 * área + número. Cubre los formatos que la gente escribe más seguido:
 * "+54 9 11 2345-6789", "11 2345-6789", "011 15 2345-6789", "0351 15 234-5678".
 */
export function whatsappDigits(phone: string): string {
  let d = phone.replace(/[^\d]/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) {
    let rest = d.slice(2);
    if (rest.startsWith("0")) rest = rest.slice(1);
    if (!rest.startsWith("9") && rest.length === 10) rest = `9${rest}`;
    return `54${rest}`;
  }
  if (d.startsWith("0")) d = d.slice(1);
  // Código de área + "15" + número local (formato viejo de celulares).
  const with15 = d.match(/^(\d{2,4})15(\d{6,8})$/);
  if (with15 && with15[1].length + with15[2].length === 10) {
    d = with15[1] + with15[2];
  }
  if (d.length === 10) return `549${d}`;
  return d;
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(text)}`;
}

/**
 * Teléfono para leer de lejos (afiche): si el dueño ya lo escribió con
 * espacios o guiones se respeta; si vino todo junto se agrupa al estilo
 * argentino: "+54 9 11 2345-6789" (o "+54 9 351 234-5678" en el interior).
 */
export function formatPhone(phone: string): string {
  const raw = phone.trim();
  if (/[\s-]/.test(raw)) return raw;
  const d = whatsappDigits(raw);
  if (d.startsWith("549") && d.length === 13) {
    const local = d.slice(3);
    if (local.startsWith("11")) return `+54 9 11 ${local.slice(2, 6)}-${local.slice(6)}`;
    return `+54 9 ${local.slice(0, 3)} ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return raw;
}

/**
 * Usuario de Instagram a partir de lo que escribe la gente: "@luna.perrita",
 * "luna.perrita" o el link "https://www.instagram.com/luna.perrita/".
 * Devuelve null si no es un usuario válido (letras, números, punto y guion
 * bajo, hasta 30).
 */
export function normalizeInstagram(raw: string): string | null {
  let v = raw.trim();
  v = v.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^instagram\.com\//i, "");
  v = v.replace(/^@/, "").split(/[/?#]/)[0];
  return /^[A-Za-z0-9._]{1,30}$/.test(v) ? v : null;
}

export function instagramUrl(handle: string) {
  return `https://www.instagram.com/${encodeURIComponent(handle)}/`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function parseSqlite(ts: string): Date {
  return new Date(ts.replace(" ", "T") + "Z");
}

/** "hace 2 días", "recién" a partir de un timestamp SQLite (UTC, "YYYY-MM-DD HH:MM:SS"). */
export function timeAgo(sqliteTimestamp: string): string {
  const diffMs = Date.now() - parseSqlite(sqliteTimestamp).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "recién";
  if (minutes < 60) return `hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;

  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(months / 12);
  return `hace ${years} ${years === 1 ? "año" : "años"}`;
}

const DATE_TIME = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Argentina/Buenos_Aires",
});

const DATE_ONLY = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  timeZone: "America/Argentina/Buenos_Aires",
});

export function formatDateTime(sqliteTimestamp: string): string {
  return DATE_TIME.format(parseSqlite(sqliteTimestamp));
}

export function formatDate(sqliteTimestamp: string): string {
  return DATE_ONLY.format(parseSqlite(sqliteTimestamp));
}

/** "K7M2 P9XQ": el código en dos grupos, más fácil de leer y dictar. */
export function formatCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}
