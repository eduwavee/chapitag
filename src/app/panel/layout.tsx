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
    <div className="flex flex-1 flex-col bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur">
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
