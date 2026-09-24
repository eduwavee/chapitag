"use client";

import { useActionState, useState } from "react";
import { House, Megaphone, RefreshCw, Trash2 } from "lucide-react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { deletePetAction, replaceTagAction, setLostAction } from "./actions";

/** Pasar a modo perdido pide confirmación y un mensaje opcional; volver a casa es un toque. */
export function LostModeControl({ petId, petName, lost }: { petId: string; petName: string; lost: boolean }) {
  const [open, setOpen] = useState(false);
  const action = setLostAction.bind(null, petId);

  if (lost) {
    return (
      <form action={action}>
        <input type="hidden" name="lost" value="0" />
        <SubmitButton className="btn btn-primary btn-lg w-full sm:w-auto" pendingLabel="Guardando…">
          <House size={20} aria-hidden />
          {petName} ya volvió a casa
        </SubmitButton>
      </form>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-alert btn-lg w-full sm:w-auto">
        <Megaphone size={20} aria-hidden />
        Se perdió: activar modo perdido
      </button>
    );
  }

  return (
    <form action={action} className="anim-fade-in space-y-4 rounded-[18px] border-2 border-alert bg-alert-wash p-4 sm:p-5">
      <input type="hidden" name="lost" value="1" />
      <p className="font-semibold">
        El perfil de {petName} va a mostrar “Me están buscando” arriba de todo y te avisamos por email en cada escaneo.
      </p>
      <div>
        <label htmlFor="lostNote" className="label">
          ¿Dónde y cuándo se perdió? <span className="font-normal text-ink-3">(opcional)</span>
        </label>
        <textarea
          id="lostNote"
          name="lostNote"
          className="field"
          rows={2}
          maxLength={280}
          placeholder="Ej: Se escapó el sábado a la tarde cerca de Parque Centenario. Tiene collar rojo."
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="btn btn-alert" pendingLabel="Activando…">
          Activar modo perdido
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function ReplaceTagForm({ petId }: { petId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(replaceTagAction.bind(null, petId), {});

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-secondary btn-sm">
        <RefreshCw size={16} aria-hidden />
        Reemplazar chapita
      </button>
    );
  }

  return (
    <form action={formAction} className="anim-fade-in mt-2 space-y-4 rounded-[18px] border border-line bg-ground p-4">
      <p className="text-[0.9375rem] text-ink-2">
        ¿Perdiste o se rompió la chapita? Cargá el código de una nueva. La vieja queda dada de baja: si alguien la
        escanea, no va a ver tus datos.
      </p>
      <Field
        label="Código de la chapita nueva"
        name="newCode"
        required
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder="K7M2 P9XQ"
        inputClassName="tag-code uppercase"
      />
      <FormMessage error={state.error} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="btn btn-primary" pendingLabel="Reemplazando…">
          Reemplazar
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function DeletePetForm({ petId, petName, failed }: { petId: string; petName: string; failed?: boolean }) {
  const [open, setOpen] = useState(!!failed);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-danger btn-sm">
        <Trash2 size={16} aria-hidden />
        Borrar perfil
      </button>
    );
  }

  return (
    <form action={deletePetAction.bind(null, petId)} className="anim-fade-in space-y-4">
      <p className="text-[0.9375rem] text-ink-2">
        Se borran el perfil, las fotos y el historial de escaneos. La chapita queda libre para activarla con otra
        mascota. No se puede deshacer.
      </p>
      <Field
        label={`Para confirmar, escribí “${petName}”`}
        name="confirmName"
        required
        autoComplete="off"
      />
      {failed && <FormMessage error="El nombre no coincide. No se borró nada." />}
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="btn btn-danger" pendingLabel="Borrando…">
          <Trash2 size={16} aria-hidden />
          Borrar para siempre
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}
