"use client";

/**
 * `template.tsx` se re-monta en cada navegación (a diferencia de `layout.tsx`),
 * así que es el lugar para la transición de entrada del área de contenido del
 * panel. El header vive en `layout.tsx` → no se re-anima, queda como ancla
 * espacial fija. Fade + micro-desplazamiento; `.reveal`/reduced-motion ya
 * neutraliza el movimiento vía la media query de globals.css.
 */
export default function PanelTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="anim-route">{children}</div>;
}
