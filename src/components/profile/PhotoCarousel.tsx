"use client";

import { useRef, useState } from "react";
import { Chapita, EngravedName } from "@/components/Chapita";

/**
 * Fotos de la mascota: carrusel con scroll-snap (se desliza con el dedo,
 * nativo) y miniaturas para saltar a una foto. Sin fotos, la chapita con el
 * nombre grabado ocupa su lugar.
 */
export function PhotoCarousel({
  photos,
  petName,
  themeId,
}: {
  photos: string[];
  petName: string;
  themeId: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] max-h-[42svh] items-center justify-center rounded-[22px] bg-black/10">
        <Chapita themeId={themeId} size={170} label={`Chapita de ${petName}`}>
          <EngravedName name={petName} size={170} />
        </Chapita>
      </div>
    );
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    if (i !== active) setActive(i);
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex aspect-[4/3] max-h-[42svh] w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[22px] bg-black/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`Fotos de ${petName}`}
        role="region"
        tabIndex={0}
      >
        {photos.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- foto subida por el dueño, servida por /api/uploads
          <img
            key={url}
            src={url}
            alt={i === 0 ? `Foto de ${petName}` : `Foto ${i + 1} de ${petName}`}
            className="h-full w-full shrink-0 snap-center object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : undefined}
            draggable={false}
          />
        ))}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-2" role="group" aria-label="Elegir foto">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-[border-color,opacity] duration-150 ${
                i === active ? "border-[var(--anod-ink)] opacity-100" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de foto subida */}
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
