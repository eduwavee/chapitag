"use client";

import { useActionState, useState } from "react";
import { Cat, Dog, Rabbit } from "lucide-react";
import { SEX_OPTIONS } from "@/lib/ui";
import { PET_THEMES, DEFAULT_THEME_ID, getTheme } from "@/lib/themes";
import { PET_BADGES } from "@/lib/badges";
import { MAX_GALLERY_PHOTOS } from "@/lib/limits";
import { listOf, valueOf, type FormValues } from "@/lib/formValues";
import { Chapita, EngravedName } from "@/components/Chapita";
import { CheckField, Field, FormMessage, SelectField, SubmitButton, TextArea } from "@/components/form";

export interface PetFormDefaults {
  name?: string;
  species?: string;
  breed?: string | null;
  color?: string | null;
  sex?: string | null;
  birthYear?: number | null;
  sterilized?: boolean;
  microchipNumber?: string | null;
  medicalNotes?: string | null;
  rewardOffered?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactPhone2?: string | null;
  contactName2?: string | null;
  contactInstagram?: string | null;
  city?: string | null;
  address?: string | null;
  showExactAddress?: boolean;
  photoUrl?: string | null;
  theme?: string;
  badges?: string[];
  vetName?: string | null;
  vetPhone?: string | null;
  insuranceInfo?: string | null;
  personality?: string | null;
}

export interface ExistingPhoto {
  id: string;
  url: string;
}

export type PetFormState = { error?: string; values?: FormValues };

const SPECIES = [
  { value: "perro", label: "Perro", Icon: Dog },
  { value: "gato", label: "Gato", Icon: Cat },
  { value: "otro", label: "Otro", Icon: Rabbit },
];

export function PetForm({
  action,
  defaults = {},
  existingPhotos = [],
  tagCode,
  showTagCodeField,
  submitLabel,
}: {
  action: (prevState: PetFormState | undefined, formData: FormData) => Promise<PetFormState>;
  defaults?: PetFormDefaults;
  existingPhotos?: ExistingPhoto[];
  /** Código precargado (al activar desde el escaneo o /activar). */
  tagCode?: string;
  showTagCodeField: boolean;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const sent = state.values;
  // Si la action devolvió un error, lo enviado manda sobre los datos guardados.
  const v = (key: string, fallback?: string | number | null) =>
    sent ? (valueOf(sent, key) ?? "") : (fallback ?? undefined);
  const checked = (key: string, fallback?: boolean) => (sent ? valueOf(sent, key) === "on" : !!fallback);

  const [name, setName] = useState(String(v("name", defaults.name) ?? ""));
  const [themeId, setThemeId] = useState(String(v("theme", defaults.theme) || DEFAULT_THEME_ID));
  const selectedBadges = new Set(sent ? (listOf(sent, "badges") ?? []) : (defaults.badges ?? []));
  const species = String(v("species", defaults.species) || "perro");
  const gallerySlotsLeft = Math.max(0, MAX_GALLERY_PHOTOS - existingPhotos.length);
  const theme = getTheme(themeId);

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-12 lg:items-start" key={JSON.stringify(sent ?? {})}>
      <div className="space-y-6 lg:col-span-8">
        {showTagCodeField && (
          <Section title="La chapita" description="El código está impreso en el dorso: 8 letras y números.">
            <Field
              label="Código de la chapita"
              name="tagCode"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="K7M2 P9XQ"
              defaultValue={v("tagCode", tagCode)}
              className="max-w-xs"
              inputClassName="tag-code text-lg uppercase"
            />
          </Section>
        )}

        <Section title="Tu mascota">
          <Field
            label="Nombre"
            name="name"
            required
            maxLength={40}
            defaultValue={v("name", defaults.name)}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <fieldset>
            <legend className="label">Especie</legend>
            <div className="grid grid-cols-3 gap-2 sm:max-w-md">
              {SPECIES.map(({ value, label, Icon }) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="species" value={value} defaultChecked={species === value} className="peer sr-only" />
                  <span className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-line-strong bg-surface font-semibold text-ink-2 transition-colors peer-checked:border-brand peer-checked:bg-brand-wash peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]">
                    <Icon size={20} aria-hidden />
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Raza" name="breed" maxLength={60} placeholder="Ej: Mestizo" defaultValue={v("breed", defaults.breed)} />
            <Field label="Color de pelo" name="color" maxLength={60} placeholder="Ej: Marrón y blanco" defaultValue={v("color", defaults.color)} />
            <SelectField
              label="Sexo"
              name="sex"
              defaultValue={String(v("sex", defaults.sex) ?? "")}
              options={[{ value: "", label: "Sin especificar" }, ...SEX_OPTIONS]}
            />
            <Field
              label="Año de nacimiento"
              name="birthYear"
              type="number"
              inputMode="numeric"
              min={new Date().getFullYear() - 40}
              max={new Date().getFullYear()}
              placeholder={String(new Date().getFullYear() - 3)}
              defaultValue={v("birthYear", defaults.birthYear)}
            />
          </div>
          <CheckField name="sterilized" label="Está castrado/a" defaultChecked={checked("sterilized", defaults.sterilized)} />
        </Section>

        <Section title="Color de la chapita" description="Es el color de su perfil: lo primero que ve quien la encuentra.">
          <div className="flex items-center gap-5 lg:hidden">
            <Chapita theme={theme} size={104} shadow={false}>
              <EngravedName name={name || "Nombre"} size={104} />
            </Chapita>
            <p className="text-[0.9375rem] text-ink-2">Así queda grabada.</p>
          </div>
          <fieldset>
            <legend className="sr-only">Color</legend>
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-8">
              {PET_THEMES.map((t) => (
                <label key={t.id} className="group flex cursor-pointer flex-col items-center gap-1.5">
                  <input
                    type="radio"
                    name="theme"
                    value={t.id}
                    defaultChecked={themeId === t.id}
                    onChange={() => setThemeId(t.id)}
                    className="peer sr-only"
                  />
                  <span
                    className="h-12 w-12 rounded-full shadow-[inset_0_-3px_0_rgb(0_0_0/.2),inset_0_2px_0_rgb(255_255_255/.2)] ring-1 ring-black/10 dark:ring-white/20 ring-offset-2 ring-offset-[var(--surface)] transition-transform duration-150 group-hover:scale-105 peer-checked:ring-[3px] peer-checked:ring-ink peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--focus)]"
                    style={{ background: t.color }}
                  />
                  <span className="text-sm font-medium text-ink-2 peer-checked:font-bold peer-checked:text-ink">{t.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </Section>

        <Section title="Fotos" description="Una foto clara de la cara ayuda a reconocerla. Se achican solas y se les borra la ubicación GPS.">
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            {defaults.photoUrl && (
              <div className="w-28">
                {/* eslint-disable-next-line @next/next/no-img-element -- foto subida por el dueño */}
                <img src={defaults.photoUrl} alt="Portada actual" className="aspect-square w-28 rounded-2xl object-cover" />
                <CheckField name="removePhoto" label="Sacar" />
              </div>
            )}
            <Field
              label={defaults.photoUrl ? "Cambiar foto de portada" : "Foto de portada"}
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              hint="JPG, PNG o WEBP, hasta 10 MB."
            />
          </div>

          {existingPhotos.length > 0 && (
            <fieldset>
              <legend className="label">Galería</legend>
              <div className="flex flex-wrap gap-3">
                {existingPhotos.map((photo, i) => (
                  <label key={photo.id} className="relative block h-24 w-24 cursor-pointer overflow-hidden rounded-2xl">
                    <input type="checkbox" name="deletePhotoIds" value={photo.id} className="peer sr-only" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- foto subida por el dueño */}
                    <img src={photo.url} alt={`Foto ${i + 1} de la galería`} className="h-full w-full object-cover transition-opacity peer-checked:opacity-40" />
                    <span className="absolute inset-x-1 bottom-1 rounded-lg bg-surface/90 py-1 text-center text-xs font-bold text-ink peer-checked:hidden peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-[var(--focus)]">
                      Quitar
                    </span>
                    <span className="absolute inset-x-1 bottom-1 hidden rounded-lg bg-danger py-1 text-center text-xs font-bold text-white peer-checked:block">
                      Se borra
                    </span>
                  </label>
                ))}
              </div>
              <p className="hint mt-2">Tocá una foto para marcarla; se borra al guardar.</p>
            </fieldset>
          )}

          {gallerySlotsLeft > 0 && (
            <Field
              label={`Más fotos para la galería (hasta ${gallerySlotsLeft})`}
              name="galleryPhotos"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic"
            />
          )}
        </Section>

        <Section title="Cómo es">
          <TextArea
            label="Personalidad"
            name="personality"
            maxLength={280}
            placeholder="Ej: Juguetona, le encanta la pelota. Se asusta con los truenos."
            defaultValue={v("personality", defaults.personality) as string}
          />
          <fieldset>
            <legend className="label">
              Para quien la encuentre <span className="font-normal text-ink-3">(opcional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {PET_BADGES.map((badge) => (
                <label key={badge.key} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="badges"
                    value={badge.key}
                    defaultChecked={selectedBadges.has(badge.key)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-line-strong bg-surface px-4 text-[0.9375rem] font-semibold text-ink-2 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ground peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]">
                    {badge.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="hint mt-2">Medicación, reactividad y necesidades especiales se destacan arriba en el perfil.</p>
          </fieldset>
        </Section>

        <Section title="Salud" description="Útil si la lleva un vecino o una veterinaria.">
          <TextArea
            label="Alergias, medicación u otra información"
            name="medicalNotes"
            maxLength={500}
            placeholder="Ej: Alérgica a la penicilina. Toma media pastilla de fenobarbital a la noche."
            defaultValue={v("medicalNotes", defaults.medicalNotes) as string}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Veterinaria o veterinario" name="vetName" maxLength={60} placeholder="Ej: Dra. Pérez" defaultValue={v("vetName", defaults.vetName)} />
            <Field label="Teléfono de la veterinaria" name="vetPhone" type="tel" defaultValue={v("vetPhone", defaults.vetPhone)} />
            <Field label="Número de microchip" name="microchipNumber" maxLength={30} defaultValue={v("microchipNumber", defaults.microchipNumber)} />
            <Field label="Seguro o cobertura" name="insuranceInfo" maxLength={120} defaultValue={v("insuranceInfo", defaults.insuranceInfo)} />
          </div>
        </Section>

        <Section title="Contacto" description="Es lo que va a usar quien la encuentre para avisarte.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" name="contactName" required maxLength={60} autoComplete="name" defaultValue={v("contactName", defaults.contactName)} />
            <Field
              label="Teléfono"
              name="contactPhone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="11 2345-6789"
              defaultValue={v("contactPhone", defaults.contactPhone)}
            />
            <Field
              label="WhatsApp"
              name="contactWhatsapp"
              type="tel"
              placeholder="11 2345-6789"
              hint="Con código de área. Suele ser lo más rápido."
              defaultValue={v("contactWhatsapp", defaults.contactWhatsapp)}
            />
            <div className="hidden sm:block" />
            <Field label="Contacto alternativo" name="contactName2" maxLength={60} placeholder="Ej: Vecina, Marta" defaultValue={v("contactName2", defaults.contactName2)} />
            <Field label="Teléfono alternativo" name="contactPhone2" type="tel" defaultValue={v("contactPhone2", defaults.contactPhone2)} />
          </div>
          <Field
            label="Instagram"
            name="contactInstagram"
            maxLength={80}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="@usuario"
            hint="Tu usuario o el link a tu perfil. Quien la encuentre puede escribirte por ahí."
            defaultValue={v("contactInstagram", defaults.contactInstagram ? `@${defaults.contactInstagram}` : undefined)}
          />
          <Field
            label="Recompensa"
            name="rewardOffered"
            maxLength={120}
            placeholder="Ej: Se ofrece recompensa"
            defaultValue={v("rewardOffered", defaults.rewardOffered)}
          />
        </Section>

        <Section title="Zona">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Barrio o ciudad" name="city" maxLength={80} placeholder="Ej: Villa Crespo, CABA" defaultValue={v("city", defaults.city)} />
            <Field label="Dirección" name="address" maxLength={120} defaultValue={v("address", defaults.address)} />
          </div>
          <CheckField
            name="showExactAddress"
            label="Mostrar la dirección exacta en el perfil"
            hint="Si no, solo se ve el barrio o ciudad."
            defaultChecked={checked("showExactAddress", defaults.showExactAddress)}
          />
        </Section>

        <div className="space-y-4">
          <FormMessage error={state.error} />
          <SubmitButton className="btn btn-primary btn-lg w-full sm:w-auto sm:min-w-64" pendingLabel="Guardando…">
            {submitLabel}
          </SubmitButton>
        </div>
      </div>

      {/* Vista previa en vivo de la chapita. */}
      <aside className="hidden lg:sticky lg:top-24 lg:col-span-4 lg:block" aria-hidden>
        <div className="pegboard flex flex-col items-center rounded-[22px] border border-line px-6 pb-8 pt-6">
          <span className="block h-6 w-2.5 rounded-b-md bg-[var(--metal)]" />
          <Chapita theme={theme} size={220} className="-mt-2" key={themeId}>
            <EngravedName name={name || "Nombre"} size={220} />
            <span className="engraved mt-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] opacity-90">Escaneame</span>
          </Chapita>
          <p className="mt-5 text-center text-[0.9375rem] font-semibold text-ink-2">{theme.label}</p>
        </div>
      </aside>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="plate p-5 sm:p-7">
      <h2 className="font-semiwide text-xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-[0.9375rem] text-ink-2">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
