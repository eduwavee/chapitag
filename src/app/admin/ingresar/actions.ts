"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { findAdminByEmail } from "@/lib/repo/admins";
import { clientIp, rateLimit, tooManyAttemptsMessage } from "@/lib/rateLimit";
import { formValues } from "@/lib/formValues";
import type { AuthFormState } from "@/app/ingresar/actions";

export async function adminLoginAction(
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
  const limit = rateLimit(`admin-login:${ip}`, 6, 15 * 60 * 1000);
  if (!limit.ok) return { error: tooManyAttemptsMessage(limit.retryAfterSeconds), values };

  const admin = findAdminByEmail(email);
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return { error: "El email o la contraseña no coinciden.", values };
  }

  await setSessionCookie({ sub: admin.id, role: "ADMIN", name: admin.name, ver: admin.session_version });
  redirect("/admin");
}
