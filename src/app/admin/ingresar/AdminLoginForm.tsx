"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { valueOf } from "@/lib/formValues";
import { adminLoginAction } from "./actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLoginAction, {});
  return (
    <form action={formAction} className="space-y-5">
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={valueOf(state.values, "email")} />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      <FormMessage error={state.error} />
      <SubmitButton className="btn btn-primary btn-lg w-full" pendingLabel="Ingresando…">
        Ingresar
      </SubmitButton>
    </form>
  );
}
