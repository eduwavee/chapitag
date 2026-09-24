"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { resetPasswordAction } from "../actions";

export function NewPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction.bind(null, token), {});

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="Contraseña nueva"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        hint="Al menos 8 caracteres. Se cierra la sesión en tus otros dispositivos."
      />
      <FormMessage error={state.error} />
      <SubmitButton className="btn btn-primary btn-lg w-full" pendingLabel="Guardando…">
        Guardar contraseña
      </SubmitButton>
    </form>
  );
}
