// Presets de tema visual para el perfil público de cada mascota. El dueño
// elige uno al cargar/editar la mascota (ver PetForm). Se aplican con estilos
// inline (no clases dinámicas de Tailwind) para que funcionen sin importar
// qué clases haya detectado el purge de Tailwind en build time.

export interface PetTheme {
  id: string;
  label: string;
  emoji: string;
  /** Gradiente de fondo del header del perfil público. */
  gradient: string;
  /** Color sólido de acento (botones secundarios, barra en las tarjetas del panel). */
  accent: string;
  /** Color de texto que contrasta bien sobre el gradiente. */
  onGradientText: string;
}

export const PET_THEMES: PetTheme[] = [
  {
    id: "classic",
    label: "Clásico",
    emoji: "🐾",
    gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    accent: "#4f46e5",
    onGradientText: "#ffffff",
  },
  {
    id: "sunny",
    label: "Soleado",
    emoji: "🌞",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    accent: "#d97706",
    onGradientText: "#3f2d00",
  },
  {
    id: "ocean",
    label: "Océano",
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)",
    accent: "#0284c7",
    onGradientText: "#ffffff",
  },
  {
    id: "berry",
    label: "Frutilla",
    emoji: "🍓",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    accent: "#db2777",
    onGradientText: "#ffffff",
  },
  {
    id: "forest",
    label: "Bosque",
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
    accent: "#047857",
    onGradientText: "#ffffff",
  },
  {
    id: "lavender",
    label: "Lavanda",
    emoji: "💜",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)",
    accent: "#7c3aed",
    onGradientText: "#ffffff",
  },
  {
    id: "sunset",
    label: "Atardecer",
    emoji: "🌅",
    gradient: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    accent: "#ea580c",
    onGradientText: "#ffffff",
  },
  {
    id: "midnight",
    label: "Medianoche",
    emoji: "🌙",
    gradient: "linear-gradient(135deg, #1e293b 0%, #4338ca 100%)",
    accent: "#312e81",
    onGradientText: "#ffffff",
  },
];

export const DEFAULT_THEME_ID = "classic";

export function getTheme(id: string | null | undefined): PetTheme {
  return PET_THEMES.find((t) => t.id === id) ?? PET_THEMES[0];
}
