import Link from "next/link";
import {
  Accessibility,
  Footprints,
  Gift,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Pill,
  ShieldCheck,
  Smile,
  Stethoscope,
  Syringe,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { getTheme, themeVars } from "@/lib/themes";
import { sortedBadges, type BadgeIcon } from "@/lib/badges";
import { ageLabel, formatDate, instagramUrl, sexLabel, speciesLabel, telLink, timeAgo, waLink } from "@/lib/ui";
import { InstagramIcon } from "@/components/InstagramIcon";
import { BrandMark } from "@/components/Brand";
import { PhotoCarousel } from "./PhotoCarousel";
import { ShareLocation } from "./ShareLocation";
import type { ProfileData } from "./profileData";

const BADGE_ICONS: Record<BadgeIcon, LucideIcon> = {
  syringe: Syringe,
  pill: Pill,
  smile: Smile,
  footprints: Footprints,
  accessibility: Accessibility,
  alert: TriangleAlert,
};

/**
 * El nombre, lo más grande posible sin cortarse: el ancho disponible del
 * perfil (cqw) repartido entre las letras, con tope en 4rem. Archivo
 * expandido en black mide ~0.9em por mayúscula.
 */
function nameFontSize(name: string): string {
  const letters = Math.max(4, name.trim().length);
  return `clamp(1.75rem, calc((100cqw - 2.5rem) / ${(letters * 0.9).toFixed(2)}), 4rem)`;
}

/**
 * El perfil público: lo que abre la chapita. Pensado para alguien en la
 * calle, con una mano ocupada y el sol en la pantalla: la foto y el nombre
 * mandan, y llamar / WhatsApp quedan siempre al alcance del pulgar en la
 * barra fija de abajo. En modo perdido, la franja naranja de alerta (el único
 * lugar de la app donde existe ese color) encabeza todo.
 */
export function PetProfile({
  data,
  demo = false,
}: {
  data: ProfileData;
  /** Vista previa de la landing: nada envía datos reales. */
  demo?: boolean;
}) {
  const theme = getTheme(data.themeId);
  const badges = sortedBadges(data.badges);
  const caution = badges.filter((b) => b.caution);
  const traits = badges.filter((b) => !b.caution);
  const facts = [
    speciesLabel(data.species),
    data.breed,
    sexLabel(data.sex),
    ageLabel(data.birthYear),
    data.color,
  ].filter(Boolean);

  const waText = data.lost
    ? `Hola! Creo que encontré a ${data.name}, vi su chapita.`
    : `Hola! Encontré a ${data.name}, vi tu contacto en su chapita.`;
  const whatsapp = data.contactWhatsapp || null;
  const hasHealth = !!(data.medicalNotes || data.microchip || data.vetName || data.vetPhone || data.insurance);

  const contact = (
    <section aria-label="Contactar a la familia" className="space-y-3">
          <ShareLocation
            code={data.code}
            petName={data.name}
            contactName={data.contactName}
            whatsapp={whatsapp}
            demo={demo}
          />
          {data.contactPhone2 && (
            <a href={telLink(data.contactPhone2)} className="btn btn-secondary btn-lg w-full">
              <Phone size={20} aria-hidden />
              Llamar a {data.contactName2 || "contacto alternativo"}
            </a>
          )}
          {data.contactInstagram && (
            <a
              href={demo ? undefined : instagramUrl(data.contactInstagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg w-full"
              aria-label={`Escribirle por Instagram a @${data.contactInstagram}`}
            >
              <InstagramIcon size={20} />
              <span className="truncate">@{data.contactInstagram}</span>
            </a>
          )}
        </section>
  );

  return (
    <div
      className="scheme-light @container relative flex min-h-full flex-col bg-ground text-ink"
      style={themeVars(theme)}
      data-engrave={theme.lightEngrave ? "light" : "dark"}
    >
      {data.lost && (
        <div className="alert-band px-5 pb-4 pt-4">
          <p className="font-wide flex items-center gap-2 text-[1.35rem] font-black uppercase leading-none tracking-tight">
            <Megaphone size={24} strokeWidth={2.4} aria-hidden />
            Me están buscando
          </p>
          <p className="mt-1.5 text-[0.9375rem] font-semibold">
            {data.lostSince ? `Se perdió el ${formatDate(data.lostSince)}. ` : ""}
            Si me ves, avisale a mi familia.
          </p>
          {data.lostNote && <p className="mt-2 text-[0.9375rem] leading-snug">{data.lostNote}</p>}
        </div>
      )}

      {/* Campo anodizado: foto y nombre grabado. */}
      <section className="anodized px-4 pb-6 pt-4" aria-labelledby="pet-name">
        {!data.lost && (
          <p className="engraved mb-3 px-1 text-[0.9375rem] font-semibold">
            Si me encontraste suelto, avisale a mi familia.
          </p>
        )}
        <PhotoCarousel photos={data.photos} petName={data.name} themeId={data.themeId} />
        <h1
          id="pet-name"
          className="engraved engrave-in font-wide mt-5 px-1 font-black uppercase leading-[0.92] tracking-[-0.01em] [overflow-wrap:anywhere] [animation-delay:.25s]"
          style={{ fontSize: nameFontSize(data.name) }}
        >
          {data.name}
        </h1>
        {facts.length > 0 && (
          <p className="mt-2 px-1 text-[1.0625rem] font-medium" style={{ color: "color-mix(in srgb, var(--anod-ink) 86%, transparent)" }}>
            {facts.join(" · ")}
            {data.sterilized ? " · Castrado/a" : ""}
          </p>
        )}
      </section>

      <div className="flex-1 space-y-6 px-4 pb-8 pt-6">
        {data.lost && contact}

        {data.lost && data.reward && (
          <p className="flex items-start gap-3 rounded-[18px] border-2 border-alert bg-alert-wash px-4 py-3 text-[1.0625rem] font-semibold">
            <Gift size={22} className="mt-0.5 shrink-0" aria-hidden />
            {data.reward}
          </p>
        )}

        {caution.length > 0 && (
          <section aria-label="Cuidados importantes" className="space-y-2">
            {caution.map((b) => {
              const Icon = BADGE_ICONS[b.icon];
              return (
                <div key={b.key} className="flex items-start gap-3 rounded-[18px] bg-surface px-4 py-3 shadow-[inset_0_0_0_1.5px_var(--ink)]">
                  <Icon size={22} strokeWidth={2.2} className="mt-0.5 shrink-0" aria-hidden />
                  <p>
                    <span className="block font-bold">{b.label}</span>
                    <span className="block text-[0.9375rem] text-ink-2">{b.hint}</span>
                  </p>
                </div>
              );
            })}
          </section>
        )}


        {!data.lost && contact}

        {(data.personality || traits.length > 0) && (
          <section aria-labelledby="h-caracter">
            <h2 id="h-caracter" className="font-semiwide text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-2">
              Cómo es
            </h2>
            {data.personality && <p className="mt-2 text-[1.0625rem] leading-relaxed">{data.personality}</p>}
            {traits.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {traits.map((b) => {
                  const Icon = BADGE_ICONS[b.icon];
                  return (
                    <li key={b.key} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 text-[0.9375rem] font-semibold">
                      <Icon size={18} aria-hidden />
                      {b.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {hasHealth && (
          <section aria-labelledby="h-salud">
            <h2 id="h-salud" className="font-semiwide text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-2">
              Salud
            </h2>
            <dl className="mt-2 divide-y divide-line rounded-[18px] border border-line bg-surface">
              {data.medicalNotes && (
                <div className="px-4 py-3">
                  <dt className="text-sm font-semibold text-ink-2">Alergias y medicación</dt>
                  <dd className="mt-0.5 text-[1.0625rem]">{data.medicalNotes}</dd>
                </div>
              )}
              {(data.vetName || data.vetPhone) && (
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <dt className="text-sm font-semibold text-ink-2">Veterinaria</dt>
                    <dd className="mt-0.5 flex items-center gap-2 text-[1.0625rem]">
                      <Stethoscope size={18} aria-hidden />
                      {data.vetName || data.vetPhone}
                    </dd>
                  </div>
                  {data.vetPhone && (
                    <a href={telLink(data.vetPhone)} className="btn btn-secondary btn-sm">
                      <Phone size={16} aria-hidden />
                      Llamar
                    </a>
                  )}
                </div>
              )}
              {data.microchip && (
                <div className="px-4 py-3">
                  <dt className="text-sm font-semibold text-ink-2">Microchip</dt>
                  <dd className="tag-code mt-0.5 text-base">{data.microchip}</dd>
                </div>
              )}
              {data.insurance && (
                <div className="px-4 py-3">
                  <dt className="text-sm font-semibold text-ink-2">Seguro</dt>
                  <dd className="mt-0.5 flex items-center gap-2 text-[1.0625rem]">
                    <ShieldCheck size={18} aria-hidden />
                    {data.insurance}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {data.locationText && (
          <p className="flex items-center gap-2 text-[1.0625rem]">
            <MapPin size={20} className="shrink-0 text-ink-2" aria-hidden />
            <span>
              <span className="text-ink-2">Vive por </span>
              <span className="font-semibold">{data.locationText}</span>
            </span>
          </p>
        )}

        {!data.lost && data.reward && (
          <p className="flex items-center gap-2 text-[1.0625rem]">
            <Gift size={20} className="shrink-0 text-ink-2" aria-hidden />
            {data.reward}
          </p>
        )}

        <footer className="flex items-center justify-between gap-3 border-t border-line pt-4 text-sm text-ink-3">
          {/* En la demo (landing estática) el texto es fijo: calcularlo daría distinto en el build y en el navegador. */}
          <span>Perfil actualizado {demo ? "hace 2 días" : timeAgo(data.updatedAt)}</span>
          <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline">
            <BrandMark size={18} />
            ChapiTag
          </Link>
        </footer>
      </div>

      {/* Barra de contacto fija: llamar y WhatsApp siempre a mano. */}
      <div className="sticky bottom-0 z-10 border-t border-line bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-sm">
        <p className="mb-2 truncate text-center text-sm text-ink-2">
          Avisale a <span className="font-bold text-ink">{data.contactName}</span>
        </p>
        <div className={`grid gap-2 ${whatsapp ? "grid-cols-2" : "grid-cols-1"}`}>
          <a
            href={demo ? undefined : telLink(data.contactPhone)}
            className="btn btn-primary btn-lg min-w-0 px-4"
            aria-label={`Llamar a ${data.contactName}`}
          >
            <Phone size={20} strokeWidth={2.4} aria-hidden />
            Llamar
          </a>
          {whatsapp && (
            <a
              href={demo ? undefined : waLink(whatsapp, waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg min-w-0 px-4"
              aria-label={`Escribirle por WhatsApp a ${data.contactName}`}
            >
              <MessageCircle size={20} strokeWidth={2.4} aria-hidden />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
