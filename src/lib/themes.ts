// Presets de tema visual para el perfil público de cada mascota. El dueño
// elige uno al cargar/editar la mascota (ver PetForm). Se aplican con estilos
// inline (no clases dinámicas de Tailwind) para que funcionen sin importar
// qué clases haya detectado el purge de Tailwind en build time.
//
// Cada `gradient` es una cadena de dos capas: un brillo radial arriba a la
// izquierda (da profundidad, evita el look "plano") sobre un degradado
// lineal de 3 stops (anclado oscuro → color → cola clara). Va tal cual en
// `style={{ background: gradient }}`.

/** Brillo radial compartido — misma luz para todos los temas. */
const SHEEN =
  "radial-gradient(115% 115% at 12% 0%, rgba(255,255,255,0.26), rgba(255,255,255,0) 46%)";

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
    gradient: `${SHEEN}, linear-gradient(150deg, #4338ca 0%, #6366f1 44%, #a5b4fc 100%)`,
    accent: "#4f46e5",
    onGradientText: "#ffffff",
  },
  {
    id: "sunny",
    label: "Soleado",
    emoji: "🌞",
    gradient: `${SHEEN}, linear-gradient(150deg, #d97706 0%, #f59e0b 42%, #fcd34d 100%)`,
    accent: "#d97706",
    onGradientText: "#3f2d00",
  },
  {
    id: "ocean",
    label: "Océano",
    emoji: "🌊",
    gradient: `${SHEEN}, linear-gradient(150deg, #0369a1 0%, #0ea5e9 44%, #67e8f9 100%)`,
    accent: "#0284c7",
    onGradientText: "#ffffff",
  },
  {
    id: "berry",
    label: "Frutilla",
    emoji: "🍓",
    gradient: `${SHEEN}, linear-gradient(150deg, #be185d 0%, #ec4899 44%, #f9a8d4 100%)`,
    accent: "#db2777",
    onGradientText: "#ffffff",
  },
  {
    id: "forest",
    label: "Bosque",
    emoji: "🌿",
    gradient: `${SHEEN}, linear-gradient(150deg, #047857 0%, #10b981 44%, #6ee7b7 100%)`,
    accent: "#047857",
    onGradientText: "#ffffff",
  },
  {
    id: "lavender",
    label: "Lavanda",
    emoji: "💜",
    gradient: `${SHEEN}, linear-gradient(150deg, #6d28d9 0%, #a78bfa 44%, #ddd6fe 100%)`,
    accent: "#7c3aed",
    onGradientText: "#ffffff",
  },
  {
    id: "sunset",
    label: "Atardecer",
    emoji: "🌅",
    gradient: `${SHEEN}, linear-gradient(150deg, #c2410c 0%, #f97316 40%, #ec4899 100%)`,
    accent: "#ea580c",
    onGradientText: "#ffffff",
  },
  {
    id: "midnight",
    label: "Medianoche",
    emoji: "🌙",
    gradient:
      "radial-gradient(115% 115% at 12% 0%, rgba(255,255,255,0.14), rgba(255,255,255,0) 46%), linear-gradient(150deg, #0f172a 0%, #1e293b 38%, #4338ca 100%)",
    accent: "#312e81",
    onGradientText: "#ffffff",
  },
];

export const DEFAULT_THEME_ID = "classic";

export function getTheme(id: string | null | undefined): PetTheme {
  return PET_THEMES.find((t) => t.id === id) ?? PET_THEMES[0];
}
