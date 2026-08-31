"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Spinner } from "@/components/Spinner";

export default function IngresarPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-indigo-200 opacity-50 blur-3xl dark:from-amber-900 dark:via-pink-900 dark:to-indigo-900 dark:opacity-30"
      />
      <ThemeToggle className="absolute right-6 top-6" />
      <div className="anim-card-in relative w-full max-w-md rounded-3xl border bg-white p-8 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <p className="text-3xl">🐾</p>
        <h1 className="mt-2 font-heading text-2xl font-bold dark:text-white">
          Ingresá a tu cuenta
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Para administrar los perfiles de tus mascotas.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Contraseña
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          {state?.error && (
            <p className="anim-fade-in rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="press-scale hover-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {pending && <Spinner />}
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-medium text-indigo-600 dark:text-indigo-400">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
