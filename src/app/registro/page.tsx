import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Creá tu cuenta"
      subtitle="Con tu cuenta activás la chapita y armás el perfil de tu mascota."
      engrave="Firulais"
      themeId="forest"
      animal="cat"
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
