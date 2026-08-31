export const SPECIES_OPTIONS = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "otro", label: "Otro" },
];

export const SEX_OPTIONS = [
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
];

export function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * "Actualizado hace 2 días" a partir de un timestamp SQLite (`datetime('now')`,
 * UTC, formato "YYYY-MM-DD HH:MM:SS"). Se usa en el perfil público para que
 * quien encuentra a la mascota vea que la info es reciente/confiable.
 */
export function formatRelativeTime(sqliteTimestamp: string): string {
  const date = new Date(sqliteTimestamp.replace(" ", "T") + "Z");
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "actualizado recién";
  if (minutes < 60) return `actualizado hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `actualizado hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "actualizado ayer";
  if (days < 30) return `actualizado hace ${days} días`;

  const months = Math.floor(days / 30);
  if (months < 12) return `actualizado hace ${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(months / 12);
  return `actualizado hace ${years} ${years === 1 ? "año" : "años"}`;
}
