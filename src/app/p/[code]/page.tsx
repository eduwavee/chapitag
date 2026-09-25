import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { getSession } from "@/lib/auth";
import { speciesLabel, formatCode } from "@/lib/ui";
import { Brand } from "@/components/Brand";
import { Chapita, NfcCoil } from "@/components/Chapita";
import { PetProfile } from "@/components/profile/PetProfile";
import { ScanBeacon } from "@/components/profile/ScanBeacon";
import { toProfileData } from "@/components/profile/profileData";
import { getTagView } from "./data";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const view = await getTagView(code);
  // Los perfiles tienen teléfonos: fuera de los buscadores siempre.
  const robots = { index: false, follow: false };

  if (view.state !== "assigned") {
    return { title: "Chapita ChapiTag", robots };
  }
  const { pet } = view;
  const title = pet.lost ? `¿Viste a ${pet.name}? Se busca` : `${pet.name} · ${speciesLabel(pet.species)}`;
  const description = pet.lost
    ? `${pet.name} se perdió${pet.city ? ` en ${pet.city}` : ""}. Si la ves, abrí este link para avisarle a su familia.`
    : `Si encontraste a ${pet.name}, desde acá podés avisarle a su familia.`;
  return {
    title,
    description,
    robots,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicPetPage({ params }: Props) {
  const { code } = await params;
  const view = await getTagView(code);

  if (view.state === "missing") notFound();

  if (view.state === "unassigned" || view.state === "revoked") {
    return <InactiveTag code={view.tag.code} revoked={view.state === "revoked"} />;
  }

  const { pet, tag } = view;
  const session = await getSession();
  const isOwner = session?.role === "OWNER" && session.sub === pet.owner_id;
  const data = toProfileData(pet, view.photos, tag.code);

  return (
    <div className="flex flex-1 flex-col bg-ground">
      {isOwner && (
        <div className="scheme-light border-b border-line bg-surface px-4 py-2.5">
          <div className="mx-auto flex max-w-[30rem] flex-wrap items-center justify-between gap-2 text-[0.9375rem]">
            <p className="flex items-center gap-2 text-ink-2">
              <Eye size={18} aria-hidden />
              Así lo ve quien encuentra a {pet.name}.
            </p>
            <Link href={`/panel/mascotas/${pet.id}`} className="btn btn-secondary btn-sm">
              <Pencil size={16} aria-hidden />
              Ir al panel
            </Link>
          </div>
        </div>
      )}
      <main className="mx-auto flex w-full max-w-[30rem] flex-1 flex-col">
        <PetProfile data={data} />
      </main>
      {!isOwner && <ScanBeacon code={tag.code} />}
    </div>
  );
}

/** Chapita que existe pero no tiene perfil: sin activar o dada de baja. */
function InactiveTag({ code, revoked }: { code: string; revoked: boolean }) {
  return (
    <main className="scheme-light flex flex-1 flex-col bg-ground text-ink">
      <div className="mx-auto flex w-full max-w-[30rem] flex-1 flex-col px-5 pb-10 pt-6">
        <Brand />
        <div className="pegboard mt-6 flex justify-center rounded-[22px] py-8">
          <Chapita themeId={revoked ? "midnight" : "classic"} size={180}>
            <NfcCoil size={52} className="text-[var(--anod-ink)] opacity-80" />
            <span className="engraved tag-code mt-3 text-[0.95rem]">{formatCode(code)}</span>
          </Chapita>
        </div>

        <h1 className="font-wide mt-8 text-[2rem] font-extrabold leading-[1.05] tracking-tight">
          {revoked ? "Esta chapita fue dada de baja" : "Esta chapita todavía no está activada"}
        </h1>

        <section className="mt-5 space-y-2" aria-labelledby="h-encontre">
          <h2 id="h-encontre" className="text-lg font-bold">
            ¿Encontraste una mascota con esta chapita?
          </h2>
          <p className="text-[1.0625rem] leading-relaxed text-ink-2">
            {revoked
              ? "Su dueño la reemplazó por otra o la reportó perdida, así que no tiene datos de contacto."
              : "Su dueño todavía no cargó los datos."}{" "}
            Podés llevarla a la veterinaria más cercana: si tiene microchip, lo pueden leer.
          </p>
        </section>

        {!revoked && (
          <section className="plate mt-6 p-5" aria-labelledby="h-activar">
            <h2 id="h-activar" className="text-lg font-bold">
              ¿Es tu chapita?
            </h2>
            <p className="mt-1 text-ink-2">
              Activala en dos minutos: creás el perfil de tu mascota y queda lista para escanear.
            </p>
            <Link href={`/activar?codigo=${encodeURIComponent(code)}`} className="btn btn-primary btn-lg mt-4 w-full">
              Activar esta chapita
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
