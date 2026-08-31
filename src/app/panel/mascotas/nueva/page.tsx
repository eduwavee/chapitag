import { requireOwnerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PetForm } from "@/components/PetForm";
import { createPetAction } from "./actions";

export default async function NuevaMascotaPage() {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        aria-hidden
        className="deco-blob -right-16 -top-20 h-48 w-48 bg-gradient-to-br from-fuchsia-200 to-amber-200 opacity-30 dark:from-fuchsia-900 dark:to-amber-900 dark:opacity-15"
        style={{ animation: "float-a 9s ease-in-out infinite" }}
      />
      <div className="anim-load-1">
        <h1 className="font-heading text-2xl font-bold dark:text-white">
          Registrar mascota
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Necesitás el código de una tarjeta NFC ya comprada para activarla.
        </p>
      </div>
      <div className="anim-load-2 relative mt-6">
        <PetForm
          action={createPetAction}
          showTagCodeField
          submitLabel="Registrar mascota"
        />
      </div>
    </div>
  );
}
