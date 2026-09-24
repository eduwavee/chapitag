"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/panel", label: "Mis mascotas", match: (p: string) => p === "/panel" || p.startsWith("/panel/mascotas") },
  { href: "/panel/cuenta", label: "Mi cuenta", match: (p: string) => p.startsWith("/panel/cuenta") },
];

export function PanelNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Panel" className="flex items-center gap-0.5 sm:ml-6 sm:gap-1">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-11 items-center whitespace-nowrap rounded-full px-2.5 text-[0.9375rem] sm:px-3 font-semibold no-underline transition-colors ${
              active ? "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]" : "text-ink-2 hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
