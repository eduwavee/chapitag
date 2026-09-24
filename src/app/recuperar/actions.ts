"use server";

import { redirect } from "next/navigation";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth";
import {
  createPasswordReset,
  findUserByEmail,
  findValidPasswordReset,
  markPasswordResetUsed,
  updateUserPassword,
} from "@/lib/repo/users";
import { clientIp, rateLimit, tooManyAttemptsMessage } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/url";
import { formValues } from "@/lib/formValues";
import type { AuthFormState } from "@/app/ingresar/actions";

/**
 * Paso 1: pedir el link. Responde siempre lo mismo exista o no la cuenta,
 * para no revelar qué emails están registrados.
 */
export async function requestResetAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const values = formValues(formData);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { error: "Escribí el email de tu cuenta.", values };

  const ip = await clientIp();
  const limit = rateLimit(`reset:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) return { error: tooManyAttemptsMessage(limit.retryAfterSeconds), values };

  const user = findUserByEmail(email);
  if (user) {
    const token = createPasswordReset(user.id);
    const url = `${await getBaseUrl()}/recuperar/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Cambiá tu contraseña de ChapiTag",
      lines: [
        `Hola, ${user.name}.`,
        "Pediste cambiar la contraseña de tu cuenta de ChapiTag. El link vale por una hora y se puede usar una sola vez.",
      ],
      action: { label: "Elegir una contraseña nueva", url },
      footer: "Si no fuiste vos, ignorá este email: tu contraseña no cambia.",
    });
  }

  return {
    success: `Si hay una cuenta con ${email}, te mandamos un link para elegir una contraseña nueva. Revisá también la carpeta de spam.`,
  };
}

/** Paso 2: elegir la contraseña nueva con el token del email. */
export async function resetPasswordAction(
  token: string,
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get("password") || "");
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }

  const user = findValidPasswordReset(token);
  if (!user) {
    return { error: "Este link venció o ya se usó. Pedí uno nuevo." };
  }

  updateUserPassword(user.id, await hashPassword(password));
  markPasswordResetUsed(token);
  redirect("/ingresar?reset=1");
}
