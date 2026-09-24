"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Agrega `.is-in` la primera vez que el bloque entra en pantalla. Los hijos
 * con `.hang-on-view` caen a su gancho en ese momento (escalonados con --i).
 * Sin JS o sin IntersectionObserver, el contenido se muestra igual.
 */
export function InView({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
