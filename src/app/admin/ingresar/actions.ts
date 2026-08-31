"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { findAdminByEmail } from "@/lib/repo/admins";

export async function adminLoginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const admin = findAdminByEmail(email);
  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return { error: "Email o contraseña incorrectos." };
  }

  await setSessionCookie({ sub: admin.id, role: "ADMIN", name: admin.name });
  redirect("/admin");
}
