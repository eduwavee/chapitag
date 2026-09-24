// Insignias de estado opcionales para el perfil de la mascota. Se guardan
// como un array JSON de "key" en pets.badges. El campo `sterilized` no vive
// acá: ya es su propia columna/checkbox y se muestra aparte.
//
// `caution` marca las que le importan a quien la encuentra para manejar al
// animal con cuidado (medicación, reactivo, etc.): se muestran primero y con
// más peso en el perfil público.

export type BadgeIcon =
  | "syringe"
  | "pill"
  | "smile"
  | "footprints"
  | "accessibility"
  | "alert";

export interface PetBadge {
  key: string;
  label: string;
  /** Texto de ayuda para quien encuentra a la mascota. */
  hint: string;
  icon: BadgeIcon;
  caution: boolean;
}

export const PET_BADGES: PetBadge[] = [
  {
    key: "needs_medication",
    label: "Necesita medicación",
    hint: "Toma medicación diaria: avisá cuanto antes.",
    icon: "pill",
    caution: true,
  },
  {
    key: "reactive",
    label: "Reactivo con otros animales",
    hint: "Mantenelo lejos de otros perros o gatos.",
    icon: "alert",
    caution: true,
  },
  {
    key: "special_needs",
    label: "Necesidades especiales",
    hint: "Puede necesitar ayuda extra.",
    icon: "accessibility",
    caution: true,
  },
  {
    key: "shy",
    label: "Tímido/a",
    hint: "Acercate despacio y sin correr.",
    icon: "footprints",
    caution: false,
  },
  {
    key: "friendly",
    label: "Sociable",
    hint: "Se deja acercar y tocar.",
    icon: "smile",
    caution: false,
  },
  {
    key: "vaccinated",
    label: "Vacunado/a",
    hint: "Tiene sus vacunas al día.",
    icon: "syringe",
    caution: false,
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

/** Insignias en orden de importancia para quien encuentra: primero las de cuidado. */
export function sortedBadges(keys: string[]): PetBadge[] {
  return PET_BADGES.filter((b) => keys.includes(b.key));
}
