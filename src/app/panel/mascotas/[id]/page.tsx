import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Download,
  ExternalLink,
  MapPin,
  Pencil,
  Printer,
  Smartphone,
} from "lucide-react";
import { requireOwnerSession } from "@/lib/auth";
import { findOwnedPet } from "@/lib/repo/pets";
import { findActiveTagForPet } from "@/lib/repo/tags";
import { countScansForPet, listScansForPet, mapsUrl } from "@/lib/repo/scans";
import { qrSvgInline } from "@/lib/qr";
import { displayUrl, publicPetUrl } from "@/lib/url";
import { formatCode, formatDate, formatDateTime, speciesLabel, timeAgo } from "@/lib/ui";
import { PetChapita } from "@/components/PetChapita";
import { CopyButton } from "@/components/CopyButton";
import { FormMessage, SubmitButton } from "@/components/form";
import { StatusChip } from "@/app/panel/StatusChip";
import { DeletePetForm, LostModeControl, ReplaceTagForm } from "./PetControls";
import { setNotifyAction } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creada?: string; guardada?: string; reemplazada?: string; borrar?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await requireOwnerSession();
  const { id } = await params;
  const pet = session ? await findOwnedPet(id, session.sub) : undefined;
  return { title: pet?.name ?? "Mascota" };
}

export default async function MascotaPage({ params, searchParams }: Props) {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const { id } = await params;
  const flags = await searchParams;
  const pet = await findOwnedPet(id, session.sub);
  if (!pet) notFound();

  const tag = await findActiveTagForPet(pet.id);
  const publicUrl = tag ? await publicPetUrl(tag.code) : null;
  const qr = publicUrl ? await qrSvgInline(publicUrl, { margin: 0 }) : null;
  const scans = await listScansForPet(pet.id, 15);
  const totalScans = await countScansForPet(pet.id);
  const lost = !!pet.lost;

  const notice =
    flags.creada === "1"
      ? "¡Chapita activada! Ya podés probarla: acercá tu celular o abrí el perfil público."
      : flags.guardada === "1"
        ? "Cambios guardados. El perfil público ya está actualizado."
        : flags.reemplazada === "1"
          ? "Chapita reemplazada. La anterior quedó dada de baja."
          : null;

  return (
    <div>
      <Link href="/panel" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline hover:text-ink">
        <ArrowLeft size={18} aria-hidden />
        Mis mascotas
      </Link>

      {/* En mobile la columna principal se "desarma" (display: contents) y cada
          bloque se ordena: nombre, estado, escaneos, recién después la chapita
          y el borrado. En desktop, dos columnas. */}
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
        {/* Columna de la chapita */}
        <div className="order-5 lg:order-none lg:col-span-4">
          <div className={`pegboard flex flex-col items-center rounded-[22px] border px-6 pb-8 pt-5 ${lost ? "border-2 border-alert" : "border-line"}`}>
            <span className="block h-6 w-2.5 rounded-b-md bg-[var(--metal)]" />
            {/* Se hamaca cada vez que cambia de estado (en casa / perdida). */}
            <div key={lost ? "perdida" : "casa"} className="swing-now" style={{ ["--pivot" as string]: "50% 2%" }}>
              <PetChapita
                themeId={pet.theme}
                name={pet.name}
                photoUrl={pet.photo_url}
                size={200}
                className="swing-on-hover -mt-2"
                label={`Chapita de ${pet.name}`}
              />
            </div>
          </div>

          {tag && publicUrl ? (
            <section className="plate mt-4 p-5" aria-labelledby="h-chapita">
              <h2 id="h-chapita" className="font-semiwide text-xl font-bold tracking-tight">
                Chapita <span className="tag-code ml-1 text-ink-2">{formatCode(tag.code)}</span>
              </h2>
              <p className="mt-3 break-all text-[0.9375rem] text-ink-2">{displayUrl(publicUrl)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton text={publicUrl} label="Copiar link" />
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <ExternalLink size={16} aria-hidden />
                  Ver perfil
                </a>
              </div>

              <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
                {qr && (
                  <div
                    className="h-24 w-24 shrink-0 rounded-lg bg-white p-1.5"
                    // SVG generado por la librería qrcode a partir de nuestra propia URL.
                    dangerouslySetInnerHTML={{ __html: qr }}
                  />
                )}
                <div className="space-y-2">
                  <p className="text-[0.9375rem] text-ink-2">QR de respaldo, para celulares sin NFC.</p>
                  <a href={`/api/qr/${tag.code}?descargar=1`} className="btn btn-secondary btn-sm">
                    <Download size={16} aria-hidden />
                    Descargar QR
                  </a>
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <ReplaceTagForm petId={pet.id} />
              </div>
            </section>
          ) : (
            <section className="plate mt-4 p-5">
              <p className="font-semibold">Esta mascota no tiene una chapita activa.</p>
              <p className="mt-1 text-[0.9375rem] text-ink-2">Cargá el código de una chapita nueva para volver a activarla.</p>
              <div className="mt-4">
                <ReplaceTagForm petId={pet.id} />
              </div>
            </section>
          )}
        </div>

        {/* Columna principal */}
        <div className="contents lg:block lg:col-span-8 lg:space-y-6">
          <header className="order-1 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-wide text-[2.5rem] font-black uppercase leading-none tracking-tight sm:text-[3.25rem]">
                  {pet.name}
                </h1>
                <StatusChip lost={lost} />
              </div>
              <p className="mt-2 text-[1.0625rem] text-ink-2">
                {speciesLabel(pet.species)}
                {pet.breed ? ` · ${pet.breed}` : ""} · Perfil actualizado {timeAgo(pet.updated_at)}
              </p>
            </div>
            <Link href={`/panel/mascotas/${pet.id}/editar`} className="btn btn-secondary">
              <Pencil size={18} aria-hidden />
              Editar perfil
            </Link>
          </header>

          {notice && (
            <div className="order-2">
              <FormMessage success={notice} />
            </div>
          )}

          {/* Estado: en casa / perdida */}
          <section
            aria-labelledby="h-estado"
            className={`order-3 ${lost ? "overflow-hidden rounded-[22px] border-2 border-alert bg-surface" : "plate p-5 sm:p-7"}`}
          >
            {lost ? (
              <>
                <div className="alert-band px-5 py-4 sm:px-7">
                  <h2 id="h-estado" className="font-wide text-xl font-black uppercase tracking-tight">
                    {pet.name} está en modo perdido
                  </h2>
                  <p className="mt-1 font-semibold">
                    {pet.lost_since ? `Desde el ${formatDate(pet.lost_since)}. ` : ""}
                    Te avisamos por email cada vez que alguien escanea la chapita.
                  </p>
                </div>
                <div className="space-y-5 p-5 sm:p-7">
                  {pet.lost_note && (
                    <p className="text-[1.0625rem]">
                      <span className="font-semibold">Mensaje en el perfil:</span> {pet.lost_note}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/panel/mascotas/${pet.id}/afiche`} className="btn btn-secondary btn-lg">
                      <Printer size={20} aria-hidden />
                      Afiche “Se busca”
                    </Link>
                    {publicUrl && <CopyButton text={publicUrl} label="Copiar link para compartir" className="btn btn-secondary btn-lg" />}
                  </div>
                  <div className="border-t border-line pt-5">
                    <LostModeControl petId={pet.id} petName={pet.name} lost />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 id="h-estado" className="font-semiwide text-xl font-bold tracking-tight">
                  {pet.name} está en casa
                </h2>
                <p className="mt-1 text-[1.0625rem] text-ink-2">
                  Si se pierde, activá el modo perdido: el perfil pasa a modo urgente y podés imprimir un afiche con su QR.
                </p>
                <div className="mt-5">
                  <LostModeControl petId={pet.id} petName={pet.name} lost={false} />
                </div>
              </>
            )}
          </section>

          {/* Escaneos */}
          <section className="plate order-4 p-5 sm:p-7" aria-labelledby="h-escaneos">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="h-escaneos" className="font-semiwide text-xl font-bold tracking-tight">
                Escaneos
                <span className="ml-2 text-base font-semibold text-ink-3 tabular">{totalScans}</span>
              </h2>
              <form action={setNotifyAction.bind(null, pet.id)}>
                <input type="hidden" name="notify" value={pet.notify_scans ? "0" : "1"} />
                <SubmitButton className="btn btn-ghost btn-sm" pendingLabel="Guardando…">
                  {pet.notify_scans ? <Bell size={16} aria-hidden /> : <BellOff size={16} aria-hidden />}
                  {pet.notify_scans ? "Aviso por email: activado" : "Aviso por email: desactivado"}
                </SubmitButton>
              </form>
            </div>

            {scans.length === 0 ? (
              <p className="mt-4 text-[1.0625rem] text-ink-2">
                Todavía nadie escaneó la chapita. Probala: acercá tu celular (o abrí el link) desde otro dispositivo sin
                tu sesión.
              </p>
            ) : (
              <ol className="mt-4 divide-y divide-line">
                {scans.map((scan) => {
                  const hasCoords = scan.lat != null && scan.lng != null;
                  const isLocation = scan.kind === "location";
                  return (
                    <li key={scan.id} className="flex gap-4 py-4">
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isLocation ? "bg-brand text-brand-ink" : "bg-well text-ink-2"
                        }`}
                      >
                        {isLocation ? <MapPin size={20} aria-hidden /> : <Smartphone size={20} aria-hidden />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">
                          {isLocation ? "Te compartieron su ubicación" : "Alguien abrió el perfil"}
                        </p>
                        <p className="text-[0.9375rem] text-ink-3">
                          {timeAgo(scan.created_at)} · {formatDateTime(scan.created_at)}
                          {scan.accuracy ? ` · precisión ${Math.round(scan.accuracy)} m` : ""}
                        </p>
                        {scan.note && <p className="mt-1.5 text-[1.0625rem]">“{scan.note}”</p>}
                        {hasCoords && (
                          <a
                            href={mapsUrl(scan.lat!, scan.lng!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm mt-3"
                          >
                            <MapPin size={16} aria-hidden />
                            Ver en el mapa
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Borrar */}
          <section id="borrar" className="order-6 rounded-[22px] border border-line p-5 sm:p-7" aria-labelledby="h-borrar">
            <h2 id="h-borrar" className="font-semiwide text-lg font-bold tracking-tight">
              Borrar el perfil
            </h2>
            <div className="mt-3">
              <DeletePetForm petId={pet.id} petName={pet.name} failed={flags.borrar === "error"} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
