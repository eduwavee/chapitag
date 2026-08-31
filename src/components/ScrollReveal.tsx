"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps children in a div that fades/slides into place the first time it
 * scrolls into view (see .reveal / .reveal.is-visible in globals.css).
 *
 * - `delay` (seconds) staggers a group of siblings.
 * - `variant="scale"` swaps the upward slide for a subtle scale-up — better
 *   for grids and things that "appear in place" (stat cards, swatches) than
 *   for stacked content blocks.
 * - `as` lets the wrapper be a semantic element instead of a plain div.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  variant = "fade",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "fade" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variant === "scale" ? "reveal-scale" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
