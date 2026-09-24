"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { valueOf } from "@/lib/formValues";
import { loginAction } from "./actions";

export function LoginForm({ next, resetDone }: { next?: string; resetDone?: boolean }) {
  const [state, formAction] = useActionState(loginAction, {});
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <>
      {resetDone && !state.error && (
        <div className="mb-5">
          <FormMessage success="Listo, ya podés ingresar con tu nueva contraseña." />
        </div>
      )}
      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={valueOf(state.values, "email")}
        />
        <div>
          <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required />
          <p className="mt-2 text-right text-[0.9375rem]">
            <Link href="/recuperar" className="link">
              Me olvidé la contraseña
            </Link>
          </p>
        </div>

        <FormMessage error={state.error} />

        <SubmitButton className="btn btn-primary btn-lg w-full" pendingLabel="Ingresando…">
          Ingresar
        </SubmitButton>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-ink-2">
        ¿Primera vez?{" "}
        <Link href={`/registro${nextQuery}`} className="link">
          Creá tu cuenta
        </Link>
      </p>
    </>
  );
}
