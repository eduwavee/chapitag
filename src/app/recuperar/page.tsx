import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { RequestResetForm } from "./RequestResetForm";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <AuthShell
      title="Recuperá tu contraseña"
      subtitle="Te mandamos un link por email para elegir una nueva."
      engrave="Tranqui"
      themeId="ocean"
    >
      <RequestResetForm />
    </AuthShell>
  );
}
