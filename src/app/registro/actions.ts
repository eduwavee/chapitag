"use server";

import { redirect } from "next/navigation";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/repo/users";

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");

  if (!name || !email || !phone || !password) {
    return { error: "Completá nombre, email, teléfono y contraseña." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (password !== passwordConfirm) {
    return { error: "Las contraseñas no coinciden." };
  }
  if (findUserByEmail(email)) {
    return { error: "Ya existe una cuenta registrada con ese email." };
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ email, passwordHash, name, phone, whatsapp });

  await setSessionCookie({ sub: user.id, role: "OWNER", name: user.name });
  redirect("/panel");
}
