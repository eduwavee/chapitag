"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { valueOf } from "@/lib/formValues";
import { registerAction } from "./actions";

export function RegisterForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(registerAction, {});
  const v = (key: string) => valueOf(state.values, key);
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <>
      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}
        <Field label="Tu nombre" name="name" autoComplete="name" required maxLength={60} defaultValue={v("name")} />
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required defaultValue={v("email")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Teléfono"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="11 2345-6789"
            required
            defaultValue={v("phone")}
          />
          <Field label="WhatsApp" name="whatsapp" type="tel" placeholder="Si es otro número" defaultValue={v("whatsapp")} />
        </div>
        <Field
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          hint="Al menos 8 caracteres."
        />

        <FormMessage error={state.error} />

        <SubmitButton className="btn btn-primary btn-lg w-full" pendingLabel="Creando tu cuenta…">
          Crear cuenta
        </SubmitButton>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-ink-2">
        ¿Ya tenés cuenta?{" "}
        <Link href={`/ingresar${nextQuery}`} className="link">
          Ingresá
        </Link>
      </p>
    </>
  );
}
