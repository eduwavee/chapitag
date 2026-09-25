import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { findOwnedPet } from "@/lib/repo/pets";
import { findActiveTagForPet } from "@/lib/repo/tags";
import { listPetPhotos } from "@/lib/repo/petPhotos";
import { qrSvgInline } from "@/lib/qr";
import { displayUrl, publicPetUrl } from "@/lib/url";
import { formatDate, formatPhone, sexLabel, speciesLabel } from "@/lib/ui";
import { PetChapita } from "@/components/PetChapita";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Afiche Se busca" };

/**
 * Afiche A4 para pegar en postes y veterinarias: SE BUSCA, foto grande,
 * nombre, datos para reconocerla, teléfono, QR al perfil y las tiras con el
 * número para arrancar. Pensado para imprimir también en blanco y negro.
 */
export default async function AfichePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");
  const { id } = await params;
  const pet = await findOwnedPet(id, session.sub);
  if (!pet) notFound();

  const tag = await findActiveTagForPet(pet.id);
  const url = tag ? await publicPetUrl(tag.code) : null;
  const qr = url ? await qrSvgInline(url, { margin: 0 }) : null;
  // Portada o, si no hay, la primera foto de la galería (igual que el perfil y la vista previa).
  const photoUrl = pet.photo_url ?? (await listPetPhotos(pet.id))[0]?.url ?? null;
  const contactPhone = formatPhone(pet.contact_phone);
  const phone = formatPhone(pet.contact_whatsapp || pet.contact_phone);
  const facts = [speciesLabel(pet.species), pet.breed, pet.color, sexLabel(pet.sex)].filter(Boolean).join(" · ");
  // Tamaños relativos al ancho del afiche (cqw), ajustados al largo del texto para que nunca se corte.
  const nameSize = Math.min(7.5, 30 / (Math.max(4, pet.name.length) * 0.9)).toFixed(2);
  const phoneSize = Math.min(6, 57 / (Math.max(8, contactPhone.length) * 0.78)).toFixed(2);

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/panel/mascotas/${pet.id}`}
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline hover:text-ink"
        >
          <ArrowLeft size={18} aria-hidden />
          {pet.name}
        </Link>
        <PrintButton label="Imprimir afiche" />
      </div>
      <p className="no-print mb-6 max-w-2xl text-[1.0625rem] text-ink-2">
        Imprimilo en A4 (también sale bien en blanco y negro). Pegalo en postes, veterinarias, kioscos y comercios de
        la zona donde se perdió.
      </p>

      <article className="scheme-light @container mx-auto flex aspect-[210/297] w-full max-w-[210mm] flex-col overflow-hidden bg-white text-[#1c1a17] shadow-[var(--shadow-plate)] print:max-w-none print:shadow-none">
        <header className="alert-band px-[6%] pb-[3%] pt-[4%] text-center">
          <p className="font-wide text-[11cqw] font-black uppercase leading-[0.9] tracking-tight">Se busca</p>
          <p className="mt-[1%] text-[3.4cqw] font-bold uppercase tracking-[0.08em]">¿Me viste?</p>
        </header>

        <div className="flex flex-1 flex-col px-[6%] pt-[4%]">
          <div className="flex gap-[5%]">
            <div className="aspect-square w-[52%] shrink-0 overflow-hidden rounded-[4%] bg-[#e4e8eb]">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- foto subida por el dueño
                <img src={photoUrl} alt={`Foto de ${pet.name}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PetChapita themeId={pet.theme} name={pet.name} size={180} />
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h1
                className="font-wide font-black uppercase leading-[0.92] tracking-tight [overflow-wrap:anywhere]"
                style={{ fontSize: `${nameSize}cqw` }}
              >
                {pet.name}
              </h1>
              {facts && <p className="mt-[6%] text-[2.6cqw] font-semibold leading-snug">{facts}</p>}
              {pet.lost_since && (
                <p className="mt-[4%] text-[2.4cqw] leading-snug">
                  Se perdió el {formatDate(pet.lost_since)}
                  {pet.city ? ` en ${pet.city}` : ""}.
                </p>
              )}
              {pet.reward_offered && (
                <p className="mt-auto rounded-[6px] border-[3px] border-[#1c1a17] px-[6%] py-[4%] text-[2.6cqw] font-extrabold uppercase leading-tight">
                  {pet.reward_offered}
                </p>
              )}
            </div>
          </div>

          {pet.lost_note && <p className="mt-[4%] text-[2.8cqw] leading-snug">{pet.lost_note}</p>}

          <div className="mt-auto flex items-end justify-between gap-[5%] pb-[3%] pt-[4%]">
            <div className="min-w-0 flex-1">
              <p className="text-[2.6cqw] font-semibold">Si la ves, avisale a {pet.contact_name}:</p>
              <p className="font-wide mt-[1%] whitespace-nowrap font-black leading-none tracking-tight tabular" style={{ fontSize: `${phoneSize}cqw` }}>
                {contactPhone}
              </p>
            </div>
            {qr && url && (
              <div className="w-[22%] shrink-0 text-center">
                <div className="aspect-square w-full" dangerouslySetInnerHTML={{ __html: qr }} />
                <p className="mt-[6%] text-[1.5cqw] font-semibold leading-tight">
                  Escaneá para ver su perfil y avisar
                </p>
                <p className="mt-[2%] break-all text-[1.3cqw] leading-tight text-[#454d56]">{displayUrl(url)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tiras para arrancar con el teléfono. */}
        <div className="grid grid-cols-8 border-t-2 border-dashed border-[#1c1a17]" aria-label="Tiras con el teléfono">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex h-[24cqw] items-center justify-center border-dashed border-[#1c1a17] [&:not(:last-child)]:border-r-2"
            >
              <p className="rotate-180 whitespace-nowrap text-center leading-tight [writing-mode:vertical-rl]">
                <span className="block text-[1.4cqw] font-semibold">{pet.name}</span>
                <span className="tabular block text-[1.75cqw] font-extrabold">{phone}</span>
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
