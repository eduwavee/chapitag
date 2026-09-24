"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { valueOf } from "@/lib/formValues";
import { requestResetAction } from "./actions";

export function RequestResetForm() {
  const [state, formAction] = useActionState(requestResetAction, {});

  if (state.success) {
    return (
      <div className="space-y-6">
        <FormMessage success={state.success} />
        <Link href="/ingresar" className="btn btn-secondary w-full">
          Volver a ingresar
        </Link>
      </div>
    );
  }

  return (
    <>
      <form action={formAction} className="space-y-5">
        <Field
          label="Email de tu cuenta"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={valueOf(state.values, "email")}
        />
        <FormMessage error={state.error} />
        <SubmitButton className="btn btn-primary btn-lg w-full" pendingLabel="Enviando…">
          Mandarme el link
        </SubmitButton>
      </form>
      <p className="mt-8 border-t border-line pt-6 text-ink-2">
        ¿Te acordaste?{" "}
        <Link href="/ingresar" className="link">
          Ingresá
        </Link>
      </p>
    </>
  );
}
