"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

/**
 * true solo del lado del cliente, después de hidratar. `useTheme` no sabe
 * qué tema está activo hasta ese momento, así que hasta entonces se muestra
 * un botón vacío del mismo tamaño (sin salto de layout).
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
    return <span aria-hidden className={`inline-block h-11 w-11 ${className}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-well hover:text-ink ${className}`}
    >
      {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
}
