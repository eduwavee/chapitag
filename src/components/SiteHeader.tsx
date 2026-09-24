import Link from "next/link";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-ground">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:px-6">
        <Brand />
        <nav aria-label="Principal" className="ml-auto flex items-center gap-1">
          <Link
            href="#como-funciona"
            className="hidden h-11 items-center rounded-full px-3 text-[0.9375rem] font-semibold text-ink-2 no-underline hover:text-ink md:inline-flex"
          >
            Cómo funciona
          </Link>
          <Link
            href="/p/demo"
            className="hidden h-11 items-center rounded-full px-3 text-[0.9375rem] font-semibold text-ink-2 no-underline hover:text-ink md:inline-flex"
          >
            Perfil de ejemplo
          </Link>
          <Link
            href="/ingresar"
            className="inline-flex h-11 items-center rounded-full px-3 text-[0.9375rem] font-semibold text-ink-2 no-underline hover:text-ink"
          >
            Ingresar
          </Link>
          <ThemeToggle />
          <Link href="/activar" className="btn btn-primary btn-sm ml-1 hidden sm:inline-flex">
            Activar chapita
          </Link>
        </nav>
      </div>
    </header>
  );
}
