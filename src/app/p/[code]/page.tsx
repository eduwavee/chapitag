import { findPetByTagCode } from "@/lib/repo/pets";
import { listPetPhotos } from "@/lib/repo/petPhotos";
import { getTheme } from "@/lib/themes";
import { getBadge, parseBadges } from "@/lib/badges";
import { PhotoGallery } from "@/components/PhotoGallery";
import { waLink } from "@/lib/ui";

export default async function PublicPetPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = findPetByTagCode(code);

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <div>
          <p className="text-5xl">🏷️</p>
          <h1 className="mt-4 text-xl font-bold">
            Esta tarjeta todavía no fue activada
          </h1>
          <p className="mt-2 max-w-sm text-slate-600">
            Si sos el dueño de esta mascota, ingresá a tu cuenta para asociar
            esta tarjeta a su perfil.
          </p>
        </div>
      </div>
    );
  }

  const { pet } = result;
  const theme = getTheme(pet.theme);
  const badges = parseBadges(pet.badges);
  const photos = listPetPhotos(pet.id);
  const fallbackEmoji =
    pet.species === "perro" ? "🐶" : pet.species === "gato" ? "🐱" : "🐾";
  const galleryPhotos = [
    ...(pet.photo_url ? [pet.photo_url] : []),
    ...photos.map((p) => p.url),
  ];

  const speciesLabel =
    pet.species === "perro" ? "Perro" : pet.species === "gato" ? "Gato" : "Mascota";
  const age = pet.birth_year
    ? new Date().getFullYear() - pet.birth_year
    : null;
  const locationText = pet.show_exact_address
    ? [pet.address, pet.city].filter(Boolean).join(", ")
    : pet.city || null;

  const waText = `Hola! Encontré a ${pet.name}, vi tu contacto en su chapita NFC.`;

  return (
    <div
      className="flex-1 pb-10"
      style={{ background: `${theme.gradient}` }}
    >
      <div className="mx-auto w-full max-w-md px-4 pt-6">
        <p
          className="text-center text-sm font-semibold uppercase tracking-wide"
          style={{ color: theme.onGradientText }}
        >
          {theme.emoji} ¡Me perdí! Ayudame a volver a casa
        </p>

        <div className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-xl">
          <PhotoGallery
            photos={galleryPhotos}
            petName={pet.name}
            fallbackEmoji={fallbackEmoji}
          />

          <div className="p-6">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-3xl font-extrabold">{pet.name}</h1>
            </div>
            <p className="mt-1 text-slate-600">
              {speciesLabel}
              {pet.breed ? ` · ${pet.breed}` : ""}
              {pet.color ? ` · ${pet.color}` : ""}
              {age !== null ? ` · ${age} años` : ""}
              {pet.sex ? ` · ${pet.sex === "macho" ? "Macho" : "Hembra"}` : ""}
            </p>

            {(badges.length > 0 || pet.sterilized) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {!!pet.sterilized && (
                  <Pill className="bg-indigo-100 text-indigo-800">
                    ✂️ Esterilizado/a
                  </Pill>
                )}
                {badges.map((key) => {
                  const badge = getBadge(key);
                  if (!badge) return null;
                  return (
                    <Pill key={key} className={badge.className}>
                      {badge.emoji} {badge.label}
                    </Pill>
                  );
                })}
              </div>
            )}

            {pet.personality && (
              <p className="mt-3 text-sm italic text-slate-600">
                “{pet.personality}”
              </p>
            )}

            {pet.reward_offered && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                🎁 {pet.reward_offered}
              </p>
            )}

            {(pet.medical_notes || pet.microchip_number) && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                {pet.microchip_number && (
                  <p>
                    <span className="font-medium">Microchip:</span>{" "}
                    {pet.microchip_number}
                  </p>
                )}
                {pet.medical_notes && (
                  <p className="mt-1">
                    <span className="font-medium">Info médica:</span>{" "}
                    {pet.medical_notes}
                  </p>
                )}
              </div>
            )}

            {(pet.vet_name || pet.vet_phone || pet.insurance_info) && (
              <div className="mt-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-900">
                {(pet.vet_name || pet.vet_phone) && (
                  <p>
                    <span className="font-medium">🩺 Veterinario/a:</span>{" "}
                    {pet.vet_name}
                    {pet.vet_name && pet.vet_phone ? " · " : ""}
                    {pet.vet_phone}
                  </p>
                )}
                {pet.insurance_info && (
                  <p className="mt-1">
                    <span className="font-medium">Seguro:</span>{" "}
                    {pet.insurance_info}
                  </p>
                )}
              </div>
            )}

            {locationText && (
              <p className="mt-3 text-sm text-slate-600">
                📍 Vive por: {locationText}
              </p>
            )}

            <div className="mt-6 space-y-3">
              <a
                href={`tel:${pet.contact_phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ background: theme.accent }}
              >
                📞 Llamar a {pet.contact_name}
              </a>
              {pet.contact_whatsapp && (
                <a
                  href={waLink(pet.contact_whatsapp, waText)}
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-green-700"
                >
                  💬 WhatsApp
                </a>
              )}
              {pet.contact_phone2 && (
                <a
                  href={`tel:${pet.contact_phone2}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  📞 {pet.contact_name2 || "Contacto alternativo"}
                </a>
              )}
            </div>
          </div>
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: theme.onGradientText, opacity: 0.8 }}
        >
          Perfil provisto por ChapiTag NFC
        </p>
      </div>
    </div>
  );
}

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
