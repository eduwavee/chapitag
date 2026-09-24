"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Bone, Cat as CatIcon, Dog as DogIcon, Fish, Heart, type LucideIcon } from "lucide-react";
import { RotateCw } from "lucide-react";
import { Chapita, CHAPITA_PIVOT, EngravedIcon, engravedNameSize, NfcCoil, type ChapitaShape } from "@/components/Chapita";
import { Cat, Dog, HangingCollar } from "@/components/Animals";
import { PET_THEMES, getTheme } from "@/lib/themes";

const BIG = 300;

/**
 * El resto del exhibidor: chapitas de otras formas con un animal grabado,
 * cada una meciéndose a su ritmo. En mobile quedan solo dos.
 */
const BLANKS: {
  theme: string;
  shape: ChapitaShape;
  icon: LucideIcon;
  size: number;
  pos: CSSProperties;
  sway: [number, number];
  smallScreen?: boolean;
}[] = [
  { theme: "sunset", shape: "round", icon: DogIcon, size: 92, pos: { left: "6%", top: 28 }, sway: [5.6, 0], smallScreen: true },
  { theme: "sunny", shape: "bone", icon: Heart, size: 104, pos: { left: "15%", top: 290 }, sway: [6.4, -2.1] },
  { theme: "berry", shape: "cat", icon: CatIcon, size: 100, pos: { right: "7%", top: 40 }, sway: [6, -1.2], smallScreen: true },
  { theme: "ocean", shape: "round", icon: Fish, size: 88, pos: { right: "16%", top: 320 }, sway: [5.2, -3.4] },
  { theme: "lavender", shape: "bone", icon: Bone, size: 94, pos: { right: "30%", top: 520 }, sway: [7, -0.6] },
];

function Hook() {
  return <span aria-hidden className="mx-auto block h-6 w-2.5 rounded-b-md bg-[var(--metal)] shadow-[0_2px_2px_rgb(0_0_0/.2)]" />;
}

export function LandingHero() {
  const [name, setName] = useState("");
  const [themeId, setThemeId] = useState("sunny");
  const [flipped, setFlipped] = useState(false);
  const [swingKey, setSwingKey] = useState(0);
  const display = (name.trim() || "Luna").toUpperCase();

  // Lo "grabado" (quemado por la fresa) va un paso atrás de lo tipeado: se
  // graba cuando dejás de escribir. La primera vez, después de que la
  // chapita termina de colgarse.
  const [burned, setBurned] = useState("");
  const [burnKey, setBurnKey] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    const delay = first.current ? 1150 : 420;
    first.current = false;
    const t = setTimeout(() => {
      setBurned(display);
      setBurnKey((k) => k + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [display]);

  const theme = getTheme(themeId);
  const fontSize = engravedNameSize(display, BIG);
  // El perro "escucha" cada nombre nuevo que se graba.
  const tiltKey = burnKey;
  const pending = burned !== display;

  function pickTheme(id: string) {
    setThemeId(id);
    setSwingKey((k) => k + 1);
  }

  return (
    <section className="relative border-b border-line" aria-labelledby="hero-title">
      {/* El exhibidor va a sangre hasta el borde derecho; el texto se alinea con el contenedor de la página. */}
      <div className="grid lg:min-h-[min(calc(100svh-61px),860px)] lg:grid-cols-12">
        {/* Texto y controles */}
        <div className="order-2 flex flex-col justify-center px-4 pb-14 pt-7 sm:px-6 lg:order-1 lg:col-span-5 lg:py-12 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-7">
          {/* 11.4cqw: la palabra más larga ("cualquiera") entra justa en el ancho de la columna. */}
          <div className="@container">
            <h1
              id="hero-title"
              className="font-wide text-[min(11.4cqw,3.85rem)] font-black leading-[0.96] tracking-[-0.02em]"
            >
              Si se pierde, cualquiera te avisa en segundos.
            </h1>
          </div>
          <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-[1.125rem]">
            Una chapita NFC con el perfil de tu mascota. Quien la encuentra acerca el celular, sin instalar nada, y te
            llama, te escribe o te manda su ubicación.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/activar" className="btn btn-primary btn-lg">
              Activar mi chapita
            </Link>
            <Link href="/p/demo" className="btn btn-secondary btn-lg">
              Ver perfil de ejemplo
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>

          <div className="mt-9 max-w-[30rem] border-t border-line pt-6">
            <label htmlFor="hero-name" className="label">
              Probá: ¿cómo se llama tu mascota?
            </label>
            <input
              id="hero-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 14))}
              placeholder="Luna"
              autoComplete="off"
              spellCheck={false}
              className="field font-semiwide text-lg font-bold uppercase placeholder:normal-case placeholder:font-medium"
            />
            <fieldset className="mt-4">
              <legend className="sr-only">Color de la chapita</legend>
              <div className="flex flex-wrap gap-2">
                {PET_THEMES.map((t) => (
                  <label key={t.id} className="cursor-pointer" title={t.label}>
                    <input
                      type="radio"
                      name="hero-theme"
                      value={t.id}
                      checked={themeId === t.id}
                      onChange={() => pickTheme(t.id)}
                      className="peer sr-only"
                    />
                    <span className="sr-only">{t.label}</span>
                    <span
                      aria-hidden
                      className="block h-10 w-10 rounded-full shadow-[inset_0_-3px_0_rgb(0_0_0/.22),inset_0_2px_0_rgb(255_255_255/.22)] ring-1 ring-black/10 dark:ring-white/20 ring-offset-2 ring-offset-[var(--ground)] transition-transform duration-150 hover:scale-105 peer-checked:ring-[3px] peer-checked:ring-ink peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--focus)]"
                      style={{ background: t.color }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

        </div>

        {/* Exhibidor */}
        <div className="pegboard relative order-1 h-[340px] overflow-hidden border-b border-line sm:h-[500px] lg:order-2 lg:col-span-7 lg:h-auto lg:border-b-0 lg:border-l">
          {BLANKS.map((b, i) => (
            <div
              key={b.theme}
              className={`absolute ${b.smallScreen ? "" : "hidden lg:block"}`}
              style={b.pos}
            >
              <div className="hang-in" style={{ "--i": i + 1, "--pivot": "50% 0%" } as CSSProperties}>
                <Hook />
                <div
                  className="sway"
                  style={{ "--pivot": CHAPITA_PIVOT, "--sway-d": `${b.sway[0]}s`, "--sway-delay": `${b.sway[1]}s` } as CSSProperties}
                >
                  <div className="swing-on-hover -mt-1.5" style={{ "--pivot": CHAPITA_PIVOT } as CSSProperties}>
                    <Chapita themeId={b.theme} shape={b.shape} size={b.size} className="origin-top scale-[.7] sm:scale-[.85] lg:scale-100">
                      <EngravedIcon icon={b.icon} size={Math.round(b.size * (b.shape === "bone" ? 0.34 : 0.38))} />
                    </Chapita>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Un collar colgado entre las chapitas. */}
          <div className="absolute left-[7%] top-[470px] hidden lg:block">
            <div className="hang-in" style={{ "--i": 6, "--pivot": "50% 0%" } as CSSProperties}>
              <Hook />
              <div className="sway -mt-1" style={{ "--pivot": "50% 4%", "--sway-d": "6.8s", "--sway-delay": "-1.7s" } as CSSProperties}>
                <HangingCollar themeId="sunset" size={88} className="swing-on-hover" style={{ "--pivot": "50% 4%" } as CSSProperties} />
              </div>
            </div>
          </div>

          {/* El gato sentado abajo a la izquierda y el perro que se asoma al mostrador. */}
          <div className="absolute bottom-[-28px] left-[19%] hidden lg:block">
            <div className="anim-peek" style={{ "--peek-delay": "1.3s" } as CSSProperties}>
              <Cat size={128} tagTheme="berry" />
            </div>
          </div>
          <div className="absolute bottom-[-54px] right-[1%] sm:bottom-[-64px] sm:right-[5%]">
            <div className="anim-peek" style={{ "--peek-delay": "1.05s" } as CSSProperties}>
              <Dog size={170} tagTheme={themeId} tiltKey={tiltKey} className="h-auto w-[96px] sm:w-[140px] lg:w-[170px]" label="Un perro con su chapita" />
            </div>
          </div>

          {/* La chapita principal */}
          <div className="absolute left-1/2 top-3 -translate-x-1/2 sm:top-8 lg:top-[7%]">
            <div className="hang-in" style={{ "--i": 0, "--pivot": "50% 0%" } as CSSProperties}>
              <Hook />
              <div
                key={swingKey}
                className={`swing-on-hover -mt-1.5 ${swingKey ? "swing-now" : ""}`}
                style={{ "--pivot": CHAPITA_PIVOT } as CSSProperties}
              >
                <div className="flip-scene origin-top scale-[.62] sm:scale-[.9] lg:scale-100">
                  <div className="flip-card" data-flipped={flipped}>
                    <div className="flip-face">
                      <Chapita theme={theme} size={BIG} label={`Chapita ${theme.label.toLowerCase()} con el nombre ${display} grabado`}>
                        <span className="grid" style={{ fontSize }}>
                          {pending && (
                            <span className="engraved font-wide col-start-1 row-start-1 font-extrabold uppercase leading-none tracking-[0.04em] opacity-40">
                              {display}
                            </span>
                          )}
                          {burned && !pending && (
                            <span key={burnKey} className="relative col-start-1 row-start-1">
                              <span className="engraved engrave-in font-wide block font-extrabold uppercase leading-none tracking-[0.04em]">
                                {burned}
                              </span>
                              <span className="laser-dot" aria-hidden />
                            </span>
                          )}
                          {!burned && !pending && <span className="opacity-0">.</span>}
                        </span>
                        <span className="engraved mt-3 text-[0.8rem] font-bold uppercase tracking-[0.22em] opacity-90">
                          Escaneame
                        </span>
                      </Chapita>
                    </div>
                    <div className="flip-face flip-back">
                      <Chapita theme={theme} size={BIG} label="Dorso de la chapita: chip NFC y código">
                        <span className="relative inline-flex">
                          <span aria-hidden className="nfc-wave" style={{ "--w": 0 } as CSSProperties} />
                          <span aria-hidden className="nfc-wave" style={{ "--w": 1 } as CSSProperties} />
                          <NfcCoil size={78} className="relative text-[var(--anod-ink)] opacity-85" />
                        </span>
                        <span className="engraved tag-code mt-4 text-[1.05rem]">K7M2 P9XQ</span>
                        <span className="engraved mt-2 text-[0.75rem] font-bold uppercase tracking-[0.16em] opacity-90">
                          Acercá el celular
                        </span>
                      </Chapita>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 sm:bottom-6">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              aria-pressed={flipped}
              className="btn btn-secondary btn-sm shadow-[var(--shadow-plate)]"
            >
              <RotateCw size={16} aria-hidden />
              {flipped ? "Ver el frente" : "Dar vuelta"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
