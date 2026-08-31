"use client";

import { useState } from "react";

export function PhotoGallery({
  photos,
  petName,
  fallbackEmoji,
}: {
  photos: string[];
  petName: string;
  fallbackEmoji: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = photos[activeIndex];

  return (
    <div>
      <div className="aspect-square w-full bg-slate-100">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto subida por el usuario, servida desde /api/uploads (no vive en /public)
          <img
            key={activeIndex}
            src={active}
            alt={petName}
            className="anim-img-in h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-7xl">
            {fallbackEmoji}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-white p-3">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`press-scale h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition-[box-shadow] duration-150 ${
                i === activeIndex ? "ring-indigo-500" : "ring-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de foto subida por el usuario */}
              <img
                src={url}
                alt={`Foto ${i + 1} de ${petName}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
