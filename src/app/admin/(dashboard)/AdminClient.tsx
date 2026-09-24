"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { FileSpreadsheet, Printer } from "lucide-react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { generateBatchAction, revokeTagAction } from "@/app/admin/actions";

export function GenerateBatchForm() {
  const [state, formAction] = useActionState(generateBatchAction, {});
  const lote = state.label ? encodeURIComponent(state.label) : "";

  return (
    <div className="space-y-4">
      <form action={formAction} className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:items-end">
        <Field label="Cantidad" name="count" type="number" inputMode="numeric" min={1} max={500} defaultValue={50} required />
        <Field label="Nombre del lote" name="batchLabel" maxLength={60} placeholder="Ej: Imprenta octubre" />
        <div className="sm:col-span-2">
          <SubmitButton pendingLabel="Generando…">Generar códigos</SubmitButton>
        </div>
      </form>
      <FormMessage error={state.error} success={state.success} />
      {state.label && (
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/imprimir?lote=${lote}`} className="btn btn-secondary btn-sm">
            <Printer size={16} aria-hidden />
            Imprimir hoja de QR
          </Link>
          <a href={`/admin/exportar?lote=${lote}`} className="btn btn-secondary btn-sm">
            <FileSpreadsheet size={16} aria-hidden />
            Exportar CSV
          </a>
        </div>
      )}
    </div>
  );
}

/** Dar de baja pide una segunda confirmación en el lugar (sin modal). */
export function RevokeButton({ code, assigned }: { code: string; assigned: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost btn-sm text-danger">
        Dar de baja
      </button>
    );
  }

  return (
    <form action={revokeTagAction} className="flex items-center justify-end gap-1">
      <input type="hidden" name="code" value={code} />
      <span className="mr-1 text-sm text-ink-2">{assigned ? "El perfil deja de verse. ¿Seguro?" : "¿Seguro?"}</span>
      <SubmitButton className="btn btn-danger btn-sm" pendingLabel="…">
        Sí, dar de baja
      </SubmitButton>
      <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost btn-sm">
        No
      </button>
    </form>
  );
}
