"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { valueOf } from "@/lib/formValues";
import { changePasswordAction, updateProfileAction } from "./actions";

export function ProfileForm({
  user,
}: {
  user: { name: string; email: string; phone: string; whatsapp: string | null };
}) {
  const [state, formAction] = useActionState(updateProfileAction, {});
  const v = (key: string, fallback: string | null) => (state.values ? valueOf(state.values, key) : fallback) ?? "";

  return (
    <form action={formAction} className="space-y-5" key={JSON.stringify(state.values ?? {})}>
      <Field label="Nombre" name="name" required maxLength={60} autoComplete="name" defaultValue={v("name", user.name)} />
      <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={v("email", user.email)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Teléfono" name="phone" type="tel" required autoComplete="tel" defaultValue={v("phone", user.phone)} />
        <Field label="WhatsApp" name="whatsapp" type="tel" defaultValue={v("whatsapp", user.whatsapp)} />
      </div>
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Guardando…">Guardar datos</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, {});
  return (
    <form action={formAction} className="space-y-5">
      <Field label="Contraseña actual" name="currentPassword" type="password" required autoComplete="current-password" />
      <Field
        label="Contraseña nueva"
        name="newPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        hint="Al menos 8 caracteres."
      />
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Cambiando…">Cambiar contraseña</SubmitButton>
    </form>
  );
}
