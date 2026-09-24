import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import { findUserById } from "@/lib/repo/users";
import { PasswordForm, ProfileForm } from "./AccountForms";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");
  const user = findUserById(session.sub);
  if (!user) redirect("/ingresar");

  return (
    <div className="max-w-3xl">
      <h1 className="font-wide text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]">Mi cuenta</h1>

      <section className="plate mt-8 p-5 sm:p-7" aria-labelledby="h-datos">
        <h2 id="h-datos" className="font-semiwide text-xl font-bold tracking-tight">
          Tus datos
        </h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">
          Los usamos para tu cuenta y para avisarte por email cuando escanean una chapita.
        </p>
        <div className="mt-5">
          <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone, whatsapp: user.whatsapp }} />
        </div>
      </section>

      <section className="plate mt-6 p-5 sm:p-7" aria-labelledby="h-pass">
        <h2 id="h-pass" className="font-semiwide text-xl font-bold tracking-tight">
          Contraseña
        </h2>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </section>
    </div>
  );
}
