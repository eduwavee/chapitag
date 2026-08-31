"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/repo/users";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const user = findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Email o contraseña incorrectos." };
  }

  await setSessionCookie({ sub: user.id, role: "OWNER", name: user.name });
  redirect("/panel");
}
