import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { findOwnedPet } from "@/lib/repo/pets";
import { listPetPhotos } from "@/lib/repo/petPhotos";
import { parseBadges } from "@/lib/badges";
import { PetForm } from "@/components/PetForm";
import { updatePetAction } from "../actions";

export const metadata: Metadata = { title: "Editar perfil" };

export default async function EditarMascotaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");
  const { id } = await params;
  const pet = await findOwnedPet(id, session.sub);
  if (!pet) notFound();

  const photos = await listPetPhotos(pet.id);

  return (
    <div>
      <Link
        href={`/panel/mascotas/${pet.id}`}
        className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline hover:text-ink"
      >
        <ArrowLeft size={18} aria-hidden />
        {pet.name}
      </Link>
      <h1 className="font-wide mt-2 text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]">
        Editar perfil
      </h1>
      <div className="mt-8">
        <PetForm
          action={updatePetAction.bind(null, pet.id)}
          defaults={{
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            color: pet.color,
            sex: pet.sex,
            birthYear: pet.birth_year,
            sterilized: !!pet.sterilized,
            microchipNumber: pet.microchip_number,
            medicalNotes: pet.medical_notes,
            rewardOffered: pet.reward_offered,
            contactName: pet.contact_name,
            contactPhone: pet.contact_phone,
            contactWhatsapp: pet.contact_whatsapp,
            contactPhone2: pet.contact_phone2,
            contactName2: pet.contact_name2,
            contactInstagram: pet.contact_instagram,
            city: pet.city,
            address: pet.address,
            showExactAddress: !!pet.show_exact_address,
            photoUrl: pet.photo_url,
            theme: pet.theme,
            badges: parseBadges(pet.badges),
            vetName: pet.vet_name,
            vetPhone: pet.vet_phone,
            insuranceInfo: pet.insurance_info,
            personality: pet.personality,
          }}
          existingPhotos={photos.map((p) => ({ id: p.id, url: p.url }))}
          showTagCodeField={false}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
