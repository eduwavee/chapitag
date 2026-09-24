import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = { title: "Acceso operador", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <AuthShell
      title="Acceso operador"
      subtitle="Generación de lotes, impresión y bajas de chapitas."
      engrave="Taller"
      themeId="midnight"
    >
      <AdminLoginForm />
    </AuthShell>
  );
}
