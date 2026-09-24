import type { CSSProperties } from "react";

// Colores de la chapita de cada mascota. El dueño elige uno al cargar/editar
// la mascota (ver PetForm) y ese color anodizado es la identidad de su
// perfil público: el campo de color de arriba, la chapita dibujada, el
// botón principal. Se aplican con estilos inline (no clases dinámicas de
// Tailwind) para que funcionen sin depender del purge de clases.
//
// `ink` es el color del texto grabado sobre el anodizado. En los colores
// oscuros el grabado deja ver el aluminio claro de abajo; en los claros
// (dorado) el grabado se rellena de tinta oscura, como se hace en la
// realidad para que se lea. Todos los pares cumplen contraste AA.
// Los `id` son los de siempre (se guardan en la base), aunque cambiaron los
// nombres visibles.

export interface PetTheme {
  id: string;
  label: string;
  /** Anodizado: campo de color principal. */
  color: string;
  /** Tono más profundo del mismo anodizado: bordes, estado presionado. */
  deep: string;
  /** Texto grabado sobre `color`. */
  ink: string;
  /** true = grabado claro (metal a la vista); false = grabado relleno oscuro. */
  lightEngrave: boolean;
}

export const PET_THEMES: PetTheme[] = [
  { id: "classic", label: "Azul", color: "#1b46c2", deep: "#12308a", ink: "#eef1f5", lightEngrave: true },
  { id: "sunset", label: "Rojo", color: "#b8261c", deep: "#841a13", ink: "#f6efec", lightEngrave: true },
  { id: "sunny", label: "Dorado", color: "#d6a21e", deep: "#a67a0e", ink: "#1d1606", lightEngrave: false },
  { id: "forest", label: "Verde", color: "#13704a", deep: "#0b4f33", ink: "#edf4f0", lightEngrave: true },
  { id: "ocean", label: "Celeste", color: "#0b6d93", deep: "#084e6a", ink: "#eef5f8", lightEngrave: true },
  { id: "lavender", label: "Violeta", color: "#5b2bb5", deep: "#3f1d80", ink: "#f1edf8", lightEngrave: true },
  { id: "berry", label: "Rosa", color: "#b32a64", deep: "#7f1c46", ink: "#fbf0f5", lightEngrave: true },
  { id: "midnight", label: "Negro", color: "#23262c", deep: "#0f1114", ink: "#e8ebee", lightEngrave: true },
];

/** Color por defecto de una chapita nueva: el dorado, que acompaña al bronce de la marca. */
export const DEFAULT_THEME_ID = "sunny";

export function getTheme(id: string | null | undefined): PetTheme {
  return PET_THEMES.find((t) => t.id === id) ?? PET_THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
}

/** Variables CSS del tema, para `style={themeVars(theme)}` en un contenedor. */
export function themeVars(theme: PetTheme): CSSProperties {
  return {
    "--anod": theme.color,
    "--anod-deep": theme.deep,
    "--anod-ink": theme.ink,
  } as CSSProperties;
}
