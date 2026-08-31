"use client";

import { useState } from "react";
import type { DailyCount } from "@/lib/repo/tags";

// Los "day" que llegan en `data` son claves UTC ("YYYY-MM-DD", ver
// countTagsGeneratedByDay). Forzamos timeZone: "UTC" acá para que la fecha
// mostrada no se corra un día según la zona horaria del navegador.
const DAY_LABEL = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/**
 * Mini gráfico de barras (sparkline) de tarjetas generadas por día, con
 * tooltip al pasar el mouse. Serie única: sin leyenda, el título la nombra.
 */
export function TagsSparkline({ data }: { data: DailyCount[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const active = hovered !== null ? data[hovered] : null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-heading text-2xl font-bold">{total}</span>
          <span className="ml-1.5 text-sm text-slate-500">
            generadas en los últimos {data.length} días
          </span>
        </div>
        <div className="h-5 text-xs font-medium text-slate-600">
          {active ? `${DAY_LABEL.format(new Date(active.date))} · ${active.count}` : ""}
        </div>
      </div>

      <div className="mt-3 flex h-14 items-end gap-[3px]">
        {data.map((d, i) => {
          const heightPct = Math.max(6, (d.count / max) * 100);
          const isHovered = hovered === i;
          return (
            <div
              key={d.date}
              className="group relative flex-1"
              style={{ height: "100%" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex h-full items-end">
                <div
                  className={`anim-bar w-full rounded-t transition-colors ${
                    isHovered ? "bg-indigo-500" : "bg-indigo-200"
                  } ${d.count > 0 ? "" : "bg-slate-100"}`}
                  style={{
                    height: `${heightPct}%`,
                    transformOrigin: "bottom",
                    animationDelay: `${i * 22}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 h-px w-full bg-slate-100" />
    </div>
  );
}
