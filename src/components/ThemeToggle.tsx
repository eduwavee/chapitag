"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

/**
 * true solo del lado del cliente, después de hidratar. `useTheme` no sabe
 * qué tema está activo hasta ese momento (para evitar mismatch de
 * hidratación con el tema del sistema), así que mostramos un botón "vacío"
 * del mismo tamaño hasta entonces. useSyncExternalStore (en vez de
 * useState+useEffect) evita el antipatrón de hacer setState dentro de un
 * efecto solo para detectar el montaje.
 */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={`press-scale hover-lift inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white ${className}`}
    >
      <span key={isDark ? "sun" : "moon"} className="anim-icon-swap inline-block">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
