"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "./actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(registerAction, {});

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200 via-sky-200 to-indigo-200 opacity-50 blur-3xl dark:from-emerald-900 dark:via-sky-900 dark:to-indigo-900 dark:opacity-30"
      />
      <ThemeToggle className="absolute right-6 top-6" />
      <div className="relative w-full max-w-md rounded-3xl border bg-white p-8 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <p className="text-3xl">🐾</p>
        <h1 className="mt-2 font-heading text-2xl font-bold dark:text-white">
          Creá tu cuenta
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Para registrar tu mascota y activar su tarjeta NFC.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <Field label="Tu nombre" name="name" autoComplete="name" required />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <Field
            label="Teléfono de contacto"
            name="phone"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            required
          />
          <Field
            label="WhatsApp (opcional, si es distinto al teléfono)"
            name="whatsapp"
            type="tel"
            required={false}
          />
          <Field
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <Field
            label="Repetir contraseña"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
          />

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {pending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tenés cuenta?{" "}
          <Link href="/ingresar" className="font-medium text-indigo-600 dark:text-indigo-400">
            Ingresá acá
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />
    </label>
  );
}
