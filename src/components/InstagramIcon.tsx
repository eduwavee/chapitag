/**
 * Glifo de Instagram con el mismo trazo que los íconos de lucide (lucide
 * v1 ya no trae íconos de marcas). Se usa solo para el botón que abre el
 * perfil de Instagram del dueño.
 */
export function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.4 6.6h.01" />
    </svg>
  );
}
