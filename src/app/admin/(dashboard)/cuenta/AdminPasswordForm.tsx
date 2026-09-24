"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { changeAdminPasswordAction } from "@/app/admin/actions";

export function AdminPasswordForm() {
  const [state, formAction] = useActionState(changeAdminPasswordAction, {});
  return (
    <form action={formAction} className="space-y-5">
      <Field label="Contraseña actual" name="currentPassword" type="password" required autoComplete="current-password" />
      <Field label="Contraseña nueva" name="newPassword" type="password" required minLength={8} autoComplete="new-password" hint="Al menos 8 caracteres." />
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Cambiando…">Cambiar contraseña</SubmitButton>
    </form>
  );
}
