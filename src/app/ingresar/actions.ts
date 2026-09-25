"use server";

import { redirect } from "next/navigation";
import { safeNextPath, setSessionCookie, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/repo/users";
import { clientIp, rateLimit, tooManyAttemptsMessage } from "@/lib/rateLimit";
import { formValues, type FormValues } from "@/lib/formValues";

export type AuthFormState = { error?: string; success?: string; values?: FormValues };

export async function loginAction(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const values = formValues(formData);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Completá email y contraseña.", values };
  }

  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}:${email}`, 8, 15 * 60 * 1000);
  if (!limit.ok) return { error: tooManyAttemptsMessage(limit.retryAfterSeconds), values };

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "El email o la contraseña no coinciden. Revisalos o recuperá tu contraseña.", values };
  }

  await setSessionCookie({ sub: user.id, role: "OWNER", name: user.name, ver: user.session_version });
  redirect(safeNextPath(formData.get("next")));
}
