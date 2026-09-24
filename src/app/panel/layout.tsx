import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PanelNav } from "./PanelNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  return (
    <div className="flex flex-1 flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-3 py-2 sm:gap-3 sm:px-6">
          <Brand href="/panel" compact />
          <PanelNav />
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-10 print:p-0">{children}</main>
    </div>
  );
}
