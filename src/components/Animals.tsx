import type { CSSProperties } from "react";
import { getTheme } from "@/lib/themes";

/**
 * Perro y gato sentados, de frente, con su collar y su chapita. Siluetas
 * planas en la tinta del tema (graphite en claro, casi blanco en oscuro) con
 * detalles en el color del fondo: se leen bien en los dos modos y la única
 * nota de color es la chapita anodizada, que es el producto.
 *
 * Motion (ver globals.css, todo se apaga con reduced-motion):
 *  - perro: la cola mueve en ráfagas, parpadea, sacude una oreja y, cuando
 *    cambia `tiltKey`, inclina la cabeza (lo usa el hero cuando escribís el
 *    nombre: "escuchó su nombre").
 *  - gato: la cola barre lento, parpadea despacio.
 *  - la chapita del collar se hamaca.
 */

const MUZZLE = "color-mix(in srgb, var(--ink) 60%, var(--ground))";
const EAR = "color-mix(in srgb, var(--ink) 82%, var(--ground))";

type AnimalProps = {
  size?: number;
  /** Color de la chapita (id de tema). */
  tagTheme?: string;
  /** Color del collar; por defecto, el hondo del mismo anodizado. */
  collar?: string;
  className?: string;
  style?: CSSProperties;
  /** Cambiarlo dispara la inclinación de cabeza (solo perro). */
  tiltKey?: number | string;
  label?: string;
};

function CollarTag({ tagTheme, collar }: { tagTheme: string; collar?: string }) {
  const t = getTheme(tagTheme);
  return (
    <g>
      <path d="M52 92 C 64 103 96 103 108 92" fill="none" stroke={collar ?? t.deep} strokeWidth="7" strokeLinecap="round" />
      <g className="anim-collar-tag" style={{ transformOrigin: "80px 100px" }}>
        <circle cx="80" cy="102" r="3.4" fill="none" stroke="var(--metal)" strokeWidth="2.2" />
        <circle cx="80" cy="115" r="10" fill={t.color} stroke="rgb(0 0 0 / .22)" strokeWidth="1.2" />
        <circle cx="80" cy="115" r="6.6" fill="none" stroke="rgb(255 255 255 / .22)" strokeWidth="1" />
        <circle cx="80" cy="107.2" r="1.6" fill="var(--ground)" />
      </g>
    </g>
  );
}

export function Dog({ size = 160, tagTheme = "classic", collar, className = "", style, tiltKey, label }: AnimalProps) {
  return (
    <svg
      viewBox="0 0 160 200"
      width={size}
      height={size * 1.25}
      className={`overflow-visible ${className}`}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* Cola, detrás del cuerpo. */}
      <path
        className="anim-tail-wag"
        style={{ transformOrigin: "112px 178px" }}
        d="M112 178 C 131 175 142 160 139 141"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Cuerpo sentado. */}
      <path
        d="M56 92 C 44 112 36 150 38 176 C 39 188 46 196 58 196 L 102 196 C 114 196 121 188 122 176 C 124 150 116 112 104 92 Z"
        fill="var(--ink)"
      />
      <path d="M68 150 V 193 M92 150 V 193" stroke="var(--ground)" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
      <path d="M56 194 H 76 M84 194 H 104" stroke={MUZZLE} strokeWidth="3" strokeLinecap="round" />

      <CollarTag tagTheme={tagTheme} collar={collar} />

      {/* Cabeza (se inclina entera). */}
      <g key={tiltKey} className={tiltKey ? "anim-head-tilt" : undefined} style={{ transformOrigin: "80px 92px" }}>
        <path
          className="anim-ear-flick"
          style={{ transformOrigin: "52px 36px" }}
          d="M52 34 C 37 36 28 56 31 78 C 33 91 44 93 50 85 C 53 70 55 52 52 34 Z"
          fill={EAR}
        />
        <path d="M108 34 C 123 36 132 56 129 78 C 127 91 116 93 110 85 C 107 70 105 52 108 34 Z" fill={EAR} />
        <path d="M80 18 C 103 18 116 34 116 56 C 116 78 101 94 80 94 C 59 94 44 78 44 56 C 44 34 57 18 80 18 Z" fill="var(--ink)" />
        <ellipse cx="80" cy="75" rx="20" ry="15" fill={MUZZLE} />
        <path d="M72 67 C 72 62 88 62 88 67 C 88 72 83 75 80 75 C 77 75 72 72 72 67 Z" fill="var(--ink)" />
        <path
          d="M80 75 V 80 M80 80 C 77 84 72 84 70 81 M80 80 C 83 84 88 84 90 81"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g className="anim-blink" style={{ transformOrigin: "80px 50px" }}>
          <circle cx="66" cy="50" r="5.2" fill="var(--ground)" />
          <circle cx="94" cy="50" r="5.2" fill="var(--ground)" />
          <circle cx="66.6" cy="50.6" r="3.2" fill="var(--ink)" />
          <circle cx="94.6" cy="50.6" r="3.2" fill="var(--ink)" />
          <circle cx="65.4" cy="49.2" r="1.1" fill="var(--ground)" />
          <circle cx="93.4" cy="49.2" r="1.1" fill="var(--ground)" />
        </g>
      </g>
    </svg>
  );
}

export function Cat({ size = 160, tagTheme = "berry", collar, className = "", style, label }: AnimalProps) {
  return (
    <svg
      viewBox="0 0 160 200"
      width={size}
      height={size * 1.25}
      className={`overflow-visible ${className}`}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path
        className="anim-cat-tail"
        style={{ transformOrigin: "110px 188px" }}
        d="M110 188 C 136 191 149 172 144 152 C 141 140 131 138 128 147"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M58 88 C 46 110 42 150 44 176 C 45 190 52 196 62 196 L 98 196 C 108 196 115 190 116 176 C 118 150 114 110 102 88 Z"
        fill="var(--ink)"
      />
      <path d="M70 150 V 193 M90 150 V 193" stroke="var(--ground)" strokeWidth="2.4" strokeLinecap="round" opacity=".5" />

      <CollarTag tagTheme={tagTheme} collar={collar} />

      <g>
        {/* Orejas con puntas redondeadas (trazo del mismo color). */}
        <path d="M50 46 L 47 11 L 77 30 Z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M110 46 L 113 11 L 83 30 Z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M55 38 L 53 20 L 69 31 Z" fill={MUZZLE} />
        <path d="M105 38 L 107 20 L 91 31 Z" fill={MUZZLE} />
        <path d="M80 22 C 104 22 118 36 118 56 C 118 76 102 90 80 90 C 58 90 42 76 42 56 C 42 36 56 22 80 22 Z" fill="var(--ink)" />
        <g className="anim-blink-slow" style={{ transformOrigin: "80px 54px" }}>
          <ellipse cx="66" cy="54" rx="6.4" ry="5.4" fill="var(--ground)" />
          <ellipse cx="94" cy="54" rx="6.4" ry="5.4" fill="var(--ground)" />
          <ellipse cx="66" cy="54" rx="1.9" ry="4.6" fill="var(--ink)" />
          <ellipse cx="94" cy="54" rx="1.9" ry="4.6" fill="var(--ink)" />
        </g>
        <path d="M76 65 H 84 L 80 70 Z" fill={MUZZLE} />
        <path
          d="M80 70 C 78 74 74 74 72 72 M80 70 C 82 74 86 74 88 72 M62 66 L 41 62 M62 70 L 41 72 M98 66 L 119 62 M98 70 L 119 72"
          fill="none"
          stroke={MUZZLE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Collar colgado de un gancho: la cinta en U, la hebilla, los ojalillos y el aro en D. */
export function HangingCollar({ themeId = "sunset", size = 90, className = "", style }: { themeId?: string; size?: number; className?: string; style?: CSSProperties }) {
  const t = getTheme(themeId);
  return (
    <svg viewBox="0 0 100 190" width={size} height={size * 1.9} className={`overflow-visible ${className}`} style={style} aria-hidden>
      <path d="M36 14 C 12 60 14 138 50 170 C 86 138 88 60 64 14" fill="none" stroke="rgb(0 0 0 / .22)" strokeWidth="19" strokeLinecap="round" />
      <path d="M36 14 C 12 60 14 138 50 170 C 86 138 88 60 64 14" fill="none" stroke={t.color} strokeWidth="16" strokeLinecap="round" />
      <path d="M36 14 C 12 60 14 138 50 170 C 86 138 88 60 64 14" fill="none" stroke="rgb(255 255 255 / .18)" strokeWidth="1.2" strokeDasharray="3 4" />
      {[70, 88, 106].map((y) => (
        <circle key={y} cx={y === 70 ? 76.5 : y === 88 ? 78 : 77} cy={y} r="2" fill="var(--ground)" opacity=".85" />
      ))}
      {/* Hebilla */}
      <rect x="11" y="78" width="20" height="26" rx="5" fill="none" stroke="var(--metal)" strokeWidth="3.4" />
      <path d="M21 80 V 102" stroke="var(--metal-hi)" strokeWidth="2" />
      {/* Aro en D con la chapita */}
      <path d="M42 174 H 58 A 8 8 0 0 1 42 174 Z" fill="none" stroke="var(--metal)" strokeWidth="3.2" transform="translate(0 2)" />
    </svg>
  );
}
