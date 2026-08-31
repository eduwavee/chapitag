"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tarjeta de métrica del panel admin. Al entrar en viewport la primera vez:
 * reveal (fade + scale) y el número cuenta hacia arriba. Es el momento de
 * carga del dashboard, se ve pocas veces → entra en el presupuesto de
 * "delight". Bajo reduced-motion aparece con el valor final, sin conteo.
 *
 * El estado inicial de `display` es el valor final: así el SSR y el primer
 * render (y el caso sin JS) muestran el número correcto. El conteo, cuando
 * corresponde, arranca desde 0 dentro del callback del observer (async → no
 * es setState sincrónico en el cuerpo del efecto).
 */
export function StatCard({
  label,
  value,
  emoji,
  index = 0,
}: {
  label: string;
  value: number;
  emoji: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          el.classList.add("is-visible");
          if (reduced || value === 0) return; // display ya es `value`

          timer = setTimeout(() => {
            const duration = 650;
            const start = performance.now();
            setDisplay(0);
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 4); // ease-out cuártico
              setDisplay(Math.round(eased * value));
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }, 120 + index * 90);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [value, index]);

  return (
    <div
      ref={ref}
      className="reveal reveal-scale rounded-3xl border bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
      style={index ? { transitionDelay: `${index * 0.09}s` } : undefined}
    >
      <p className="text-2xl">{emoji}</p>
      <p className="mt-1 font-heading text-3xl font-bold tabular-nums">
        {display}
      </p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}
