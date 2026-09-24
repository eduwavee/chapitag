/**
 * `template.tsx` se re-monta en cada navegación: un fundido corto del área de
 * contenido. El header vive en el layout y no se re-anima.
 */
export default function PanelTemplate({ children }: { children: React.ReactNode }) {
  return <div className="anim-route">{children}</div>;
}
