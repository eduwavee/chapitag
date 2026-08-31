"use client";

import { useActionState } from "react";
import { generateBatchAction } from "@/app/admin/actions";

export function GenerateBatchForm() {
  const [state, formAction, pending] = useActionState(generateBatchAction, {});

  return (
    <form
      action={formAction}
      className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end"
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Cantidad</span>
        <input
          name="count"
          type="number"
          min={1}
          max={500}
          defaultValue={20}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Etiqueta del lote (opcional)
        </span>
        <input
          name="batchLabel"
          placeholder="Ej: Lote agosto 2026 / Proveedor X"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Generando..." : "Generar tarjetas"}
      </button>

      {state?.error && (
        <p className="sm:col-span-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="sm:col-span-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.success}
        </p>
      )}
    </form>
  );
}
