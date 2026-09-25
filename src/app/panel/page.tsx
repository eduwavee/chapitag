import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plus, Smartphone } from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { listPetsByOwner } from "@/lib/repo/pets";
import { formatCode, speciesLabel, timeAgo } from "@/lib/ui";
import { PetChapita } from "@/components/PetChapita";
import { Dog } from "@/components/Animals";
import { FormMessage } from "@/components/form";
import { StatusChip } from "./StatusChip";

export const metadata: Metadata = { title: "Mis mascotas" };

export default async function PanelHomePage({
  searchParams,
}: {
  searchParams: Promise<{ borrada?: string }>;
}) {
  const session = await requireOwnerSession();
  const pets = session ? await listPetsByOwner(session.sub) : [];
  const { borrada } = await searchParams;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-wide text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]">Mis mascotas</h1>
        {pets.length > 0 && (
          <Link href="/panel/mascotas/nueva" className="btn btn-primary">
            <Plus size={20} aria-hidden />
            Activar otra chapita
          </Link>
        )}
      </div>

      {borrada === "1" && (
        <div className="mt-6 max-w-xl">
          <FormMessage success="Borramos el perfil. La chapita quedó libre para activarla de nuevo." />
        </div>
      )}

      {pets.length === 0 ? (
        <section className="plate mt-8 grid overflow-hidden md:grid-cols-2">
          <div className="pegboard flex items-end justify-center gap-6 border-b border-line px-6 pt-8 md:border-b-0 md:border-r">
            <div className="flex flex-col items-center self-start">
              <span className="block h-7 w-3 rounded-b-md bg-[var(--metal)]" />
              <p className="mt-3 max-w-[10rem] text-center text-[0.9375rem] font-semibold text-ink-2">
                Este gancho está esperando su chapita.
              </p>
            </div>
            <Dog size={130} tagTheme="classic" tiltKey={1} className="-mb-1 h-auto w-[130px]" />
          </div>
          <div className="p-6 sm:p-10">
            <h2 className="font-semiwide text-2xl font-bold tracking-tight">Activá tu primera chapita</h2>
            <p className="mt-2 text-[1.0625rem] text-ink-2">
              Necesitás el código impreso en el dorso. Cargás los datos de tu mascota, elegís el color y queda lista
              para que cualquiera la escanee.
            </p>
            <Link href="/panel/mascotas/nueva" className="btn btn-primary btn-lg mt-6">
              Activar chapita
            </Link>
          </div>
        </section>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <li key={pet.id}>
              <Link
                href={`/panel/mascotas/${pet.id}`}
                className={`plate group flex items-center gap-4 p-4 pr-5 no-underline transition-[border-color,box-shadow] hover:border-line-strong sm:gap-5 ${
                  pet.lost ? "!border-2 !border-alert" : ""
                }`}
              >
                <PetChapita themeId={pet.theme} name={pet.name} photoUrl={pet.photo_url} size={92} className="swing-on-group" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semiwide truncate text-xl font-extrabold tracking-tight text-ink">{pet.name}</h2>
                    <StatusChip lost={!!pet.lost} />
                  </div>
                  <p className="mt-0.5 truncate text-[0.9375rem] text-ink-2">
                    {speciesLabel(pet.species)}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-3">
                    <Smartphone size={15} aria-hidden />
                    {pet.last_scan_at ? `Escaneada ${timeAgo(pet.last_scan_at)}` : "Todavía nadie la escaneó"}
                    {pet.scans_7d > 1 ? ` · ${pet.scans_7d} veces esta semana` : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink-3">
                    {pet.tag_code ? (
                      <>
                        Chapita <span className="tag-code text-ink-2">{formatCode(pet.tag_code)}</span>
                      </>
                    ) : (
                      "Sin chapita activa"
                    )}
                  </p>
                </div>
                <ChevronRight size={22} className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
