import type { Metadata } from "next";
import { AdminPasswordForm } from "./AdminPasswordForm";

export const metadata: Metadata = { title: "Cuenta de operador", robots: { index: false } };

export default function AdminCuentaPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-wide text-[2rem] font-extrabold leading-none tracking-tight">Cuenta</h1>
      <section className="plate mt-8 p-5 sm:p-7" aria-labelledby="h-pass">
        <h2 id="h-pass" className="font-semiwide text-xl font-bold tracking-tight">
          Cambiar contraseña
        </h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">
          Si seguís con la contraseña de ejemplo del seed, cambiala antes de salir a producción.
        </p>
        <div className="mt-5">
          <AdminPasswordForm />
        </div>
      </section>
    </div>
  );
}
