"use client";

import { useActionState } from "react";
import { SPECIES_OPTIONS, SEX_OPTIONS } from "@/lib/ui";
import { PET_THEMES, DEFAULT_THEME_ID } from "@/lib/themes";
import { PET_BADGES } from "@/lib/badges";

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
        <Section title="Tarjeta NFC" emoji="🏷️">
          <Field
            label="Código de la tarjeta"
            name="tagCode"
            placeholder="Ej: K7M2P9XQ"
            required
          />
          <p className="-mt-2 text-xs text-slate-500">
            Es el código impreso en la chapita/tarjeta que compraste.
          </p>
        </Section>
      )}

      <Section title="Datos de la mascota" emoji="🐾">
        <Field
          label="Nombre"
          name="name"
          required
          defaultValue={defaults?.name}
        />
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Especie</span>
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
            <span className="mb-1 block font-medium text-slate-700">Sexo</span>
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="sterilized"
            defaultChecked={defaults?.sterilized}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
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

      <Section title="Personalización del perfil" emoji="🎨">
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">
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
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-slate-900"
                >
                  {theme.emoji}
                </span>
                <span className="mt-1 block text-[11px] text-slate-600">
                  {theme.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">
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
                  className={`inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-slate-500 ring-1 ring-slate-200 transition peer-checked:text-slate-900 peer-checked:ring-2 peer-checked:ring-indigo-500 ${badge.className} peer-checked:opacity-100 opacity-60 peer-checked:border-transparent`}
                >
                  {badge.emoji} {badge.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Foto de portada (JPG, PNG o WEBP, máx. 5MB)
          </span>
          <Field label="" name="photo" type="file" hideLabel />
        </div>

        {existingPhotos.length > 0 && (
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Fotos de la galería actuales
            </span>
            <div className="flex flex-wrap gap-3">
              {existingPhotos.map((photo) => (
                <label
                  key={photo.id}
                  className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-xl border"
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
            <p className="mt-1 text-xs text-slate-500">
              Marcá una foto para eliminarla al guardar.
            </p>
          </div>
        )}

        {gallerySlotsLeft > 0 && (
          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Agregar fotos a la galería (hasta {gallerySlotsLeft} más)
            </span>
            <input
              name="galleryPhotos"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </Section>

      <Section title="Información médica y veterinario (opcional)" emoji="🩺">
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

      <Section title="Contacto que verá quien la encuentre" emoji="📞">
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

      <Section title="Ubicación (opcional)" emoji="📍">
        <Field label="Ciudad / barrio" name="city" defaultValue={defaults?.city} />
        <Field
          label="Dirección"
          name="address"
          defaultValue={defaults?.address}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="showExactAddress"
            defaultChecked={defaults?.showExactAddress}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
          />
          Mostrar la dirección exacta en el perfil público (si no, solo se
          muestra la ciudad/barrio)
        </label>
      </Section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}

const selectClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

function Section({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-3xl border bg-white p-6 shadow-sm">
      <legend className="px-1 text-sm font-semibold text-slate-900">
        {emoji ? `${emoji} ` : ""}
        {title}
      </legend>
      <div className="mt-3 space-y-4">{children}</div>
    </fieldset>
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
        <span className="mb-1 block font-medium text-slate-700">{label}</span>
      )}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        accept={type === "file" ? "image/jpeg,image/png,image/webp" : undefined}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </label>
  );
}
