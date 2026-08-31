import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/logout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            🐾 ChapiTag NFC <span className="text-slate-400">· Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-300">{session.name}</span>
            <form action={logoutAction}>
              <button className="text-slate-300 hover:text-white">Salir</button>
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
