// Insignias de estado opcionales para el perfil de la mascota. Se guardan
// como un array JSON de "key" en pets.badges. El campo `sterilized` no vive
// acá: ya es su propia columna/checkbox y se muestra como pill aparte para no
// duplicar la misma información en dos lugares.

export interface PetBadge {
  key: string;
  label: string;
  emoji: string;
  /** Clases Tailwind (estáticas, no dinámicas) para la pill. */
  className: string;
}

export const PET_BADGES: PetBadge[] = [
  {
    key: "vaccinated",
    label: "Vacunado/a",
    emoji: "💉",
    className: "bg-sky-100 text-sky-800",
  },
  {
    key: "needs_medication",
    label: "Necesita medicación",
    emoji: "💊",
    className: "bg-rose-100 text-rose-800",
  },
  {
    key: "friendly",
    label: "Sociable",
    emoji: "😄",
    className: "bg-amber-100 text-amber-800",
  },
  {
    key: "shy",
    label: "Tímido/a",
    emoji: "🙈",
    className: "bg-slate-200 text-slate-700",
  },
  {
    key: "special_needs",
    label: "Necesidades especiales",
    emoji: "⚠️",
    className: "bg-orange-100 text-orange-800",
  },
  {
    key: "reactive",
    label: "Reactivo con otros animales",
    emoji: "🐕",
    className: "bg-fuchsia-100 text-fuchsia-800",
  },
];

const BADGE_MAP = new Map(PET_BADGES.map((b) => [b.key, b]));

export function parseBadges(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((k): k is string => typeof k === "string" && BADGE_MAP.has(k));
  } catch {
    return [];
  }
}

export function serializeBadges(keys: string[]): string {
  const valid = keys.filter((k) => BADGE_MAP.has(k));
  return JSON.stringify(valid);
}

export function getBadge(key: string): PetBadge | undefined {
  return BADGE_MAP.get(key);
}
