"use server";

import { redirect } from "next/navigation";
import { hashPassword, MIN_PASSWORD_LENGTH, safeNextPath, setSessionCookie } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/repo/users";
import { clientIp, rateLimit, tooManyAttemptsMessage } from "@/lib/rateLimit";
import { formValues, looksLikeEmail, looksLikePhone } from "@/lib/formValues";
import type { AuthFormState } from "@/app/ingresar/actions";

export async function registerAction(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const values = formValues(formData);
  const name = String(formData.get("name") || "").trim().slice(0, 60);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || !phone || !password) {
    return { error: "Completá nombre, email, teléfono y contraseña.", values };
  }
  if (!looksLikeEmail(email)) {
    return { error: "Ese email no parece válido. Revisalo.", values };
  }
  if (!looksLikePhone(phone) || (whatsapp && !looksLikePhone(whatsapp))) {
    return { error: "El teléfono parece incompleto. Escribilo con código de área, ej: 11 2345-6789.", values };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`, values };
  }

  const ip = await clientIp();
  const limit = rateLimit(`register:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.ok) return { error: tooManyAttemptsMessage(limit.retryAfterSeconds), values };

  if (findUserByEmail(email)) {
    return { error: "Ya hay una cuenta con ese email. Ingresá o recuperá tu contraseña.", values };
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ email, passwordHash, name, phone, whatsapp });

  await setSessionCookie({ sub: user.id, role: "OWNER", name: user.name, ver: user.session_version });
  redirect(safeNextPath(formData.get("next")));
}
