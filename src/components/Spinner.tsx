/**
 * Spinner chico para estados "pending" de botones de submit. Movimiento
 * constante/lineal (correcto para un loader indeterminado). Es feedback
 * ligado a una acción en curso, no motion decorativo, así que se mantiene
 * bajo reduced-motion — igual que `press-scale`.
 */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70 ${className}`}
    />
  );
}
