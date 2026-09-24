import type { CSSProperties, ReactNode } from "react";
import { getTheme, themeVars, type PetTheme } from "@/lib/themes";

/**
 * La chapita: un disco de aluminio anodizado con agujero y aro partido.
 * Geometría en un viewBox de 200×250: aro centrado en (100,36) r32 (su borde
 * de arriba queda en y=4, donde se apoya el gancho), disco en (100,150) r100
 * y agujero en (100,68) r10 — el punto más bajo del aro pasa justo por el
 * centro del agujero. El aro se dibuja detrás del disco: se ve arriba y a
 * través del agujero, como en la chapita real.
 *
 * El contenido (nombre grabado, foto, dorso) va en una capa HTML encima del
 * disco, así puede usar la tipografía, animarse y tener texto accesible.
 */

const VB_W = 200;
const VB_H = 250;
const DISC_CY = 150;
const DISC_R = 100;
const HOLE_CY = 68;
const HOLE_R = 10;
const RING_CY = 36;
const RING_R = 32;

/** Punto de giro (el borde de arriba del aro) en % del alto total, para el péndulo. */
export const CHAPITA_PIVOT = `50% ${((RING_CY - RING_R) / VB_H) * 100}%`;

const hole = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
const circle = (cx: number, cy: number, r: number) => hole(cx, cy, r);

/**
 * Siluetas de chapita. Todas comparten el agujero en (100,68) y el aro, así
 * cuelgan igual del gancho. La pieza que contiene el agujero va con
 * evenodd; el resto de las piezas no lo tapan. `content` es la zona segura
 * para el grabado, en unidades del viewBox.
 */
export type ChapitaShape = "round" | "bone" | "cat";

const SHAPES: Record<ChapitaShape, { parts: string[]; content: { top: number; height: number; padX: number } }> = {
  round: {
    parts: [`${circle(100, DISC_CY, DISC_R)} ${hole(100, HOLE_CY, HOLE_R)}`],
    content: { top: 50, height: 200, padX: 26 },
  },
  // Hueso: caña con el agujero arriba y cuatro nudos en las puntas.
  bone: {
    parts: [
      `M 38 56 H 162 V 176 H 38 Z ${hole(100, HOLE_CY, HOLE_R)}`,
      circle(38, 76, 34),
      circle(38, 156, 34),
      circle(162, 76, 34),
      circle(162, 156, 34),
    ],
    content: { top: 84, height: 88, padX: 30 },
  },
  // Cabeza de gato: disco con dos orejas.
  cat: {
    parts: [
      `${circle(100, 152, 94)} ${hole(100, HOLE_CY, HOLE_R)}`,
      "M 20 118 L 30 30 L 86 70 Z",
      "M 180 118 L 170 30 L 114 70 Z",
    ],
    content: { top: 70, height: 176, padX: 30 },
  },
};

export function Chapita({
  theme,
  themeId,
  shape = "round",
  size = 200,
  children,
  className = "",
  style,
  shadow = true,
  label,
}: {
  theme?: PetTheme;
  themeId?: string;
  shape?: ChapitaShape;
  /** Diámetro del disco en px. */
  size?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  shadow?: boolean;
  /** Texto accesible; si no hay, la chapita es decorativa. */
  label?: string;
}) {
  const t = theme ?? getTheme(themeId);
  const geo = SHAPES[shape];
  const scale = size / (DISC_R * 2);
  const width = VB_W * scale;
  const height = VB_H * scale;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width, height, ...themeVars(t), ...style }}
      data-engrave={t.lightEngrave ? "light" : "dark"}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={width}
        height={height}
        className="absolute inset-0 overflow-visible"
        style={shadow ? { filter: `drop-shadow(0 ${Math.max(2, 10 * scale)}px ${Math.max(3, 12 * scale)}px rgb(28 26 23 / .32))` } : undefined}
        aria-hidden
      >
        {/* Aro partido: dos vueltas de alambre, detrás del disco. */}
        <circle cx="100" cy={RING_CY} r={RING_R} fill="none" stroke="var(--metal)" strokeWidth="6" />
        <circle cx="100" cy={RING_CY} r={RING_R - 4.5} fill="none" stroke="var(--metal)" strokeWidth="3.5" opacity=".85" />
        <path
          d={`M ${100 - RING_R + 2} ${RING_CY - 6} A ${RING_R - 1} ${RING_R - 1} 0 0 1 ${100 + 8} ${RING_CY - RING_R + 1.5}`}
          fill="none"
          stroke="var(--metal-hi)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* El canto primero (todas las piezas con trazo) y encima el relleno:
            así solo queda el borde exterior de la silueta, sin costuras. */}
        {geo.parts.map((d, i) => (
          <path key={`e${i}`} d={d} fillRule="evenodd" fill={t.color} stroke="rgb(0 0 0 / .24)" strokeWidth="3" strokeLinejoin="round" />
        ))}
        {geo.parts.map((d, i) => (
          <path key={`f${i}`} d={d} fillRule="evenodd" fill={t.color} stroke={t.color} strokeWidth="0.6" strokeLinejoin="round" />
        ))}
        {shape === "round" && (
          <circle cx="100" cy={DISC_CY} r={DISC_R - 7} fill="none" stroke="rgb(255 255 255 / .16)" strokeWidth="1.4" />
        )}
        <circle cx="100" cy={HOLE_CY} r={HOLE_R + 1} fill="none" stroke="rgb(0 0 0 / .35)" strokeWidth="2" />
      </svg>

      {/* Capa de contenido sobre la zona segura de la silueta. */}
      <div
        className="absolute left-0 flex items-center justify-center"
        style={{ top: geo.content.top * scale, width, height: geo.content.height * scale }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center text-center"
          style={
            shape === "round"
              ? { padding: `${size * 0.2}px ${size * 0.13}px ${size * 0.12}px` }
              : { padding: `0 ${geo.content.padX * scale}px` }
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Tamaño de letra para que un nombre entre grabado en el disco: el 70% del
 * diámetro repartido entre las letras (Archivo expandido en extrabold mide
 * ~0.92em por mayúscula con el espaciado), con tope para nombres cortos.
 */
export function engravedNameSize(name: string, discSize: number): number {
  const len = Math.max(1, name.trim().length);
  return Math.floor(Math.min(discSize * 0.21, (discSize * 0.7) / (len * 0.92)));
}

/** Nombre grabado en el frente de la chapita. */
export function EngravedName({
  name,
  size,
  className = "",
}: {
  name: string;
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`engraved font-wide block max-w-full whitespace-nowrap font-extrabold uppercase leading-none ${className}`}
      style={{ fontSize: engravedNameSize(name, size), letterSpacing: "0.04em" }}
    >
      {name || " "}
    </span>
  );
}

/** Gancho del exhibidor: la varilla de metal de la que cuelga el aro. */
export function Hook({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`mx-auto block h-6 w-2.5 rounded-b-md bg-[var(--metal)] shadow-[0_2px_2px_rgb(0_0_0/.2)] ${className}`} />
  );
}

/** Un ícono (lucide) grabado: mismo metal y mismo filo que el texto. */
export function EngravedIcon({
  icon: Icon,
  size,
  className = "",
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  size: number;
  className?: string;
}) {
  return (
    <Icon
      size={size}
      strokeWidth={2.1}
      aria-hidden
      className={`engraved-icon shrink-0 ${className}`}
    />
  );
}

/** El inlay NFC visto desde el dorso: una bobina de antena y el chip. */
export function NfcCoil({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden fill="none">
      {[0, 5, 10, 15].map((inset) => (
        <rect
          key={inset}
          x={4 + inset}
          y={4 + inset}
          width={56 - inset * 2}
          height={56 - inset * 2}
          rx={10 - inset * 0.4}
          stroke="currentColor"
          strokeWidth="1.8"
          opacity={1 - inset * 0.03}
        />
      ))}
      <rect x="26" y="26" width="12" height="12" rx="2" fill="currentColor" />
      <path d="M38 32 H56" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
