import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { findValidPasswordReset } from "@/lib/repo/users";
import { NewPasswordForm } from "./NewPasswordForm";

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false } };

export default async function NuevaContrasenaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await findValidPasswordReset(token);

  if (!user) {
    return (
      <AuthShell title="Este link ya no sirve" subtitle="Venció (duran una hora) o ya se usó." engrave="Uy" themeId="sunset">
        <Link href="/recuperar" className="btn btn-primary btn-lg w-full">
          Pedir un link nuevo
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Elegí una contraseña nueva" subtitle={`Para la cuenta ${user.email}.`} engrave="Nueva" themeId="ocean">
      <NewPasswordForm token={token} />
    </AuthShell>
  );
}
