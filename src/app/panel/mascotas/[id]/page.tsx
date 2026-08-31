import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth";
import { findPetById } from "@/lib/repo/pets";
import { findActiveTagForPet } from "@/lib/repo/tags";
import { listPetPhotos } from "@/lib/repo/petPhotos";
import { parseBadges } from "@/lib/badges";
import { PetForm } from "@/components/PetForm";
import { updatePetAction } from "./actions";

export default async function EditarMascotaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creada?: string; guardada?: string }>;
}) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const { id } = await params;
  const { creada, guardada } = await searchParams;

  const pet = findPetById(id);
  if (!pet || pet.owner_id !== session.sub) notFound();

  const tag = findActiveTagForPet(pet.id);
  const publicPath = tag ? `/p/${tag.code}` : null;
  const photos = listPetPhotos(pet.id);

  const boundAction = updatePetAction.bind(null, pet.id);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        aria-hidden
        className="deco-blob -right-16 -top-20 h-48 w-48 bg-gradient-to-br from-indigo-200 to-emerald-200 opacity-25 dark:from-indigo-900 dark:to-emerald-900 dark:opacity-15"
        style={{ animation: "float-b 10s ease-in-out infinite" }}
      />
      <div className="anim-load-1 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold dark:text-white">{pet.name}</h1>
        <Link href="/panel" className="text-sm text-indigo-600 dark:text-indigo-400">
          ← Volver a mis mascotas
        </Link>
      </div>

      {creada === "1" && (
        <p className="anim-pop-in mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          ¡Mascota registrada! Ya podés grabar el siguiente link en la tarjeta
          NFC.
        </p>
      )}
      {guardada === "1" && (
        <p className="anim-pop-in mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Cambios guardados.
        </p>
      )}

      {publicPath ? (
        <div className="anim-load-2 relative mt-4 rounded-3xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Perfil público (esto es lo que se abre al escanear la tarjeta):
          </p>
          <Link
            href={publicPath}
            target="_blank"
            className="mt-1 block break-all font-mono text-sm text-indigo-600 dark:text-indigo-400"
          >
            tudominio.com{publicPath}
          </Link>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            Código de la tarjeta: <strong>{tag!.code}</strong>
          </p>
        </div>
      ) : (
        <p className="anim-load-2 mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          Esta mascota no tiene ninguna tarjeta NFC activa.
        </p>
      )}

      <div className="relative mt-6">
        <PetForm
          action={boundAction}
          defaults={{
            name: pet.name,
            species: pet.species,
            breed: pet.breed || undefined,
            color: pet.color || undefined,
            sex: pet.sex || undefined,
            birthYear: pet.birth_year,
            sterilized: !!pet.sterilized,
            microchipNumber: pet.microchip_number || undefined,
            medicalNotes: pet.medical_notes || undefined,
            rewardOffered: pet.reward_offered || undefined,
            contactName: pet.contact_name,
            contactPhone: pet.contact_phone,
            contactWhatsapp: pet.contact_whatsapp || undefined,
            contactPhone2: pet.contact_phone2 || undefined,
            contactName2: pet.contact_name2 || undefined,
            city: pet.city || undefined,
            address: pet.address || undefined,
            showExactAddress: !!pet.show_exact_address,
            photoUrl: pet.photo_url,
            theme: pet.theme,
            badges: parseBadges(pet.badges),
            vetName: pet.vet_name || undefined,
            vetPhone: pet.vet_phone || undefined,
            insuranceInfo: pet.insurance_info || undefined,
            personality: pet.personality || undefined,
          }}
          existingPhotos={photos.map((p) => ({ id: p.id, url: p.url }))}
          showTagCodeField={false}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
