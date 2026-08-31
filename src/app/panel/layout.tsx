import { redirect } from "next/navigation";
import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950">
      <div
        aria-hidden
        className="deco-blob -right-24 -top-24 h-72 w-72 bg-gradient-to-br from-indigo-200 to-fuchsia-200 opacity-40 dark:from-indigo-800 dark:to-fuchsia-900 dark:opacity-25"
        style={{ animation: "float-a 10s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="deco-blob deco-blob-sm-hide -bottom-28 -left-24 h-64 w-64 bg-gradient-to-br from-emerald-200 to-sky-200 opacity-35 dark:from-emerald-900 dark:to-sky-900 dark:opacity-20"
        style={{ animation: "float-b 11s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="deco-blob deco-blob-sm-hide left-1/3 top-1/2 h-40 w-40 bg-gradient-to-br from-amber-200 to-pink-200 opacity-25 dark:from-amber-900 dark:to-pink-900 dark:opacity-15"
        style={{ animation: "float-a 13s ease-in-out infinite 1.2s" }}
      />
      <div
        aria-hidden
        className="deco-ring deco-blob-sm-hide right-1/3 top-24 h-3 w-3 border-fuchsia-300 opacity-60 dark:border-fuchsia-700"
        style={{ animation: "float-b 7s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="deco-ring deco-blob-sm-hide left-1/4 top-2/3 h-4 w-4 border-indigo-300 opacity-50 dark:border-indigo-700"
        style={{ animation: "float-a 8s ease-in-out infinite .6s" }}
      />

      <header className="relative border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/panel" className="text-lg font-bold tracking-tight">
            🐾 ChapiTag <span className="text-indigo-600 dark:text-indigo-400">NFC</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">Hola, {session.name}</span>
            <form action={logoutAction}>
              <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Salir
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
