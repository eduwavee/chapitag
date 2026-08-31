import { requireOwnerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PetForm } from "@/components/PetForm";
import { createPetAction } from "./actions";

export default async function NuevaMascotaPage() {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-bold">Registrar mascota</h1>
      <p className="mt-1 text-slate-600">
        Necesitás el código de una tarjeta NFC ya comprada para activarla.
      </p>
      <div className="mt-6">
        <PetForm
          action={createPetAction}
          showTagCodeField
          submitLabel="Registrar mascota"
        />
      </div>
    </div>
  );
}
