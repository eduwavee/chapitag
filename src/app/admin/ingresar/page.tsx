"use client";

import { useActionState } from "react";
import { adminLoginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, {});

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-700 via-fuchsia-700 to-slate-900 opacity-40 blur-3xl"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-3xl">🐾</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white">
          Panel de administración
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Acceso exclusivo para el equipo de ChapiTag NFC.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-300">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-300">
              Contraseña
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </label>

          {state?.error && (
            <p className="anim-fade-in rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="press-scale w-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
