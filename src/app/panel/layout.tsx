import { redirect } from "next/navigation";
import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50">
      <div
        aria-hidden
        className="deco-blob -right-24 -top-24 h-72 w-72 bg-gradient-to-br from-indigo-200 to-fuchsia-200 opacity-40"
        style={{ animation: "float-a 10s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="deco-blob -bottom-28 -left-24 h-64 w-64 bg-gradient-to-br from-emerald-200 to-sky-200 opacity-35"
        style={{ animation: "float-b 11s ease-in-out infinite" }}
      />
      <header className="relative border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/panel" className="text-lg font-bold tracking-tight">
            🐾 ChapiTag <span className="text-indigo-600">NFC</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600">Hola, {session.name}</span>
            <form action={logoutAction}>
              <button className="text-slate-600 hover:text-slate-900">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
