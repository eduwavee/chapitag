"use client";

/** Transición de entrada del contenido del panel admin en cada navegación.
 *  El header (en `layout.tsx`) no se re-anima. Ver `panel/template.tsx`. */
export default function AdminDashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="anim-route">{children}</div>;
}
