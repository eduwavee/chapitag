import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { findUserById } from "@/lib/repo/users";
import { PetForm } from "@/components/PetForm";
import { createPetAction } from "./actions";

export const metadata: Metadata = { title: "Activar chapita" };

export default async function NuevaMascotaPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const session = await requireOwnerSession();
  const user = session ? findUserById(session.sub) : undefined;
  const { codigo } = await searchParams;

  return (
    <div>
      <Link href="/panel" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline hover:text-ink">
        <ArrowLeft size={18} aria-hidden />
        Mis mascotas
      </Link>
      <h1 className="font-wide mt-2 text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]">
        Activar chapita
      </h1>
      <p className="mt-3 max-w-2xl text-[1.0625rem] text-ink-2">
        Solo el nombre y un teléfono son obligatorios. Todo lo demás lo podés completar ahora o después.
      </p>
      <div className="mt-8">
        <PetForm
          action={createPetAction}
          showTagCodeField
          tagCode={codigo}
          defaults={{
            contactName: user?.name,
            contactPhone: user?.phone,
            contactWhatsapp: user?.whatsapp ?? user?.phone,
          }}
          submitLabel="Activar chapita"
        />
      </div>
    </div>
  );
}
