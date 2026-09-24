import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdminSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  return (
    <div className="flex flex-1 flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
          <Brand href="/admin" suffix="Operador" compact />
          <nav aria-label="Administración" className="flex items-center gap-0.5 sm:ml-6 sm:gap-1">
            <Link href="/admin" className="inline-flex h-11 items-center rounded-full px-2.5 text-[0.9375rem] font-semibold text-ink-2 no-underline hover:text-ink sm:px-3">
              Chapitas
            </Link>
            <Link href="/admin/cuenta" className="inline-flex h-11 items-center rounded-full px-2.5 text-[0.9375rem] font-semibold text-ink-2 no-underline hover:text-ink sm:px-3">
              Cuenta
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <span className="mr-2 hidden text-[0.9375rem] text-ink-2 md:inline">{session.name}</span>
            <ThemeToggle />
            <form action={logoutAction}>
              <button className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[0.9375rem] font-semibold text-ink-2 hover:bg-well hover:text-ink">
                <LogOut size={18} aria-hidden />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}
