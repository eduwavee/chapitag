import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;
  return (
    <AuthShell title="Ingresá a tu cuenta" subtitle="Para ver y editar los perfiles de tus mascotas." engrave="Hola">
      <LoginForm next={next} resetDone={reset === "1"} />
    </AuthShell>
  );
}
