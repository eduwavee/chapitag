/**
 * Spinner chico para estados "pendiente" de botones. Movimiento lineal
 * constante (correcto para un loader indeterminado); es feedback de una
 * acción en curso, así que se mantiene bajo reduced-motion.
 */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80 ${className}`}
    />
  );
}
