"use client";

import { useActionState } from "react";
import { SPECIES_OPTIONS, SEX_OPTIONS } from "@/lib/ui";
import { PET_THEMES, DEFAULT_THEME_ID } from "@/lib/themes";
import { PET_BADGES } from "@/lib/badges";
import { ScrollReveal } from "@/components/ScrollReveal";

export interface PetFormDefaults {
  name?: string;
  species?: string;
  breed?: string;
  color?: string;
  sex?: string;
  birthYear?: number | null;
  sterilized?: boolean;
  microchipNumber?: string;
  medicalNotes?: string;
  rewardOffered?: string;
  contactName?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactPhone2?: string;
  contactName2?: string;
  city?: string;
  address?: string;
  showExactAddress?: boolean;
  photoUrl?: string | null;
  theme?: string;
  badges?: string[];
  vetName?: string;
  vetPhone?: string;
  insuranceInfo?: string;
  personality?: string;
}

export interface ExistingPhoto {
  id: string;
  url: string;
}

export type PetFormState = { error?: string };

export function PetForm({
  action,
  defaults,
  existingPhotos = [],
  showTagCodeField,
  submitLabel,
}: {
  action: (
    prevState: PetFormState | undefined,
    formData: FormData
  ) => Promise<PetFormState>;
  defaults?: PetFormDefaults;
  existingPhotos?: ExistingPhoto[];
  showTagCodeField: boolean;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const selectedBadges = new Set(defaults?.badges || []);
  const gallerySlotsLeft = Math.max(0, 4 - existingPhotos.length);

  return (
    <form action={formAction} className="space-y-8">
      {showTagCodeField && (
        <Section title="Tarjeta NFC" emoji="🏷️" delay={0}>
          <Field
            label="Código de la tarjeta"
            name="tagCode"
            placeholder="Ej: K7M2P9XQ"
            required
          />
          <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">
            Es el código impreso en la chapita/tarjeta que compraste.
          </p>
        </Section>
      )}

      <Section title="Datos de la mascota" emoji="🐾" delay={showTagCodeField ? 0.08 : 0}>
        <Field
          label="Nombre"
          name="name"
          required
          defaultValue={defaults?.name}
        />
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
            Especie
          </span>
          <select
            name="species"
            required
            defaultValue={defaults?.species || "perro"}
            className={selectClass}
          >
            {SPECIES_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Raza" name="breed" defaultValue={defaults?.breed} />
          <Field label="Color" name="color" defaultValue={defaults?.color} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Sexo
            </span>
            <select
              name="sex"
              defaultValue={defaults?.sex || ""}
              className={selectClass}
            >
              <option value="">Sin especificar</option>
              {SEX_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Año de nacimiento"
            name="birthYear"
            type="number"
            defaultValue={defaults?.birthYear ?? undefined}
          />
        </div>
        <label className="flex items-center gap-2 text-sm dark:text-slate-300">
          <input
            type="checkbox"
            name="sterilized"
            defaultChecked={defaults?.sterilized}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-slate-800"
          />
          Está castrado/a
        </label>
        <TextArea
          label="Personalidad / carácter (opcional)"
          name="personality"
          placeholder="Ej: Juguetón, le encanta la pelota, un poco miedoso con los truenos"
          defaultValue={defaults?.personality}
        />
      </Section>

      <Section title="Personalización del perfil" emoji="🎨" delay={showTagCodeField ? 0.16 : 0.08}>
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tema de color
          </span>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {PET_THEMES.map((theme) => (
              <label key={theme.id} className="cursor-pointer text-center">
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  defaultChecked={
                    (defaults?.theme || DEFAULT_THEME_ID) === theme.id
                  }
                  className="peer sr-only"
                />
                <span
                  style={{ background: theme.gradient }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-slate-900 dark:ring-offset-slate-900 dark:peer-checked:ring-white"
                >
                  {theme.emoji}
                </span>
                <span className="mt-1 block text-[11px] text-slate-600 dark:text-slate-400">
                  {theme.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Insignias de estado (opcional)
          </span>
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
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-slate-500 ring-1 ring-slate-200 transition peer-checked:text-slate-900 peer-checked:ring-2 peer-checked:ring-indigo-500 dark:text-slate-400 dark:ring-slate-700 dark:peer-checked:text-white ${badge.className} peer-checked:opacity-100 opacity-60 peer-checked:border-transparent dark:opacity-50 dark:peer-checked:opacity-90`}
                >
                  {badge.emoji} {badge.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Foto de portada (JPG, PNG o WEBP, máx. 5MB)
          </span>
          <Field label="" name="photo" type="file" hideLabel />
        </div>

        {existingPhotos.length > 0 && (
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fotos de la galería actuales
            </span>
            <div className="flex flex-wrap gap-3">
              {existingPhotos.map((photo) => (
                <label
                  key={photo.id}
                  className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-xl border dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    name="deletePhotoIds"
                    value={photo.id}
                    className="peer sr-only"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- foto subida por el usuario, servida desde /api/uploads */}
                  <img
                    src={photo.url}
                    alt="Foto de la galería"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-red-600/0 text-xs font-semibold text-transparent transition peer-checked:bg-red-600/70 peer-checked:text-white">
                    Eliminar
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Marcá una foto para eliminarla al guardar.
            </p>
          </div>
        )}

        {gallerySlotsLeft > 0 && (
          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Agregar fotos a la galería (hasta {gallerySlotsLeft} más)
            </span>
            <input
              name="galleryPhotos"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:file:bg-slate-700 dark:file:text-slate-200"
            />
          </div>
        )}
      </Section>

      <Section
        title="Información médica y veterinario (opcional)"
        emoji="🩺"
        delay={showTagCodeField ? 0.24 : 0.16}
      >
        <Field
          label="Número de microchip"
          name="microchipNumber"
          defaultValue={defaults?.microchipNumber}
        />
        <TextArea
          label="Alergias, medicación u otra información relevante"
          name="medicalNotes"
          defaultValue={defaults?.medicalNotes}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Veterinario/a"
            name="vetName"
            placeholder="Ej: Dra. Pérez"
            defaultValue={defaults?.vetName}
          />
          <Field
            label="Teléfono del veterinario"
            name="vetPhone"
            type="tel"
            defaultValue={defaults?.vetPhone}
          />
        </div>
        <Field
          label="Seguro / cobertura (opcional)"
          name="insuranceInfo"
          placeholder="Ej: OMINT Mascotas, póliza #1234"
          defaultValue={defaults?.insuranceInfo}
        />
      </Section>

      <Section
        title="Contacto que verá quien la encuentre"
        emoji="📞"
        delay={showTagCodeField ? 0.32 : 0.24}
      >
        <Field
          label="Nombre del contacto"
          name="contactName"
          required
          defaultValue={defaults?.contactName}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Teléfono"
            name="contactPhone"
            type="tel"
            required
            defaultValue={defaults?.contactPhone}
          />
          <Field
            label="WhatsApp (opcional)"
            name="contactWhatsapp"
            type="tel"
            defaultValue={defaults?.contactWhatsapp}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre del contacto alternativo (opcional)"
            name="contactName2"
            defaultValue={defaults?.contactName2}
          />
          <Field
            label="Teléfono alternativo (opcional)"
            name="contactPhone2"
            type="tel"
            defaultValue={defaults?.contactPhone2}
          />
        </div>
        <Field
          label="Recompensa (opcional)"
          name="rewardOffered"
          placeholder="Ej: Se ofrece recompensa"
          defaultValue={defaults?.rewardOffered}
        />
      </Section>

      <Section title="Ubicación (opcional)" emoji="📍" delay={showTagCodeField ? 0.4 : 0.32}>
        <Field label="Ciudad / barrio" name="city" defaultValue={defaults?.city} />
        <Field
          label="Dirección"
          name="address"
          defaultValue={defaults?.address}
        />
        <label className="flex items-center gap-2 text-sm dark:text-slate-300">
          <input
            type="checkbox"
            name="showExactAddress"
            defaultChecked={defaults?.showExactAddress}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-slate-800"
          />
          Mostrar la dirección exacta en el perfil público (si no, solo se
          muestra la ciudad/barrio)
        </label>
      </Section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

const selectClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

function Section({
  title,
  emoji,
  delay = 0,
  children,
}: {
  title: string;
  emoji?: string;
  /** Escalona el scroll-reveal entre secciones; se pasa explícitamente desde
   * cada llamado (en vez de un contador compartido, que se desincroniza
   * entre re-renders del formulario). */
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal delay={delay}>
      <fieldset className="rounded-3xl border bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-white">
          {emoji ? `${emoji} ` : ""}
          {title}
        </legend>
        <div className="mt-3 space-y-4">{children}</div>
      </fieldset>
    </ScrollReveal>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  placeholder,
  hideLabel = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  hideLabel?: boolean;
}) {
  return (
    <label className="block text-sm">
      {!hideLabel && (
        <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        accept={type === "file" ? "image/jpeg,image/png,image/webp" : undefined}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:file:bg-slate-700 dark:file:text-slate-200 dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}
