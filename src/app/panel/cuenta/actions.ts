"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  hashPassword,
  MIN_PASSWORD_LENGTH,
  requireOwnerSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { findUserByEmail, findUserById, updateUserPassword, updateUserProfile } from "@/lib/repo/users";
import { formValues, looksLikeEmail, looksLikePhone } from "@/lib/formValues";
import type { AuthFormState } from "@/app/ingresar/actions";

export async function updateProfileAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");
  const values = formValues(formData);

  const name = String(formData.get("name") || "").trim().slice(0, 60);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();

  if (!name || !email || !phone) return { error: "Completá nombre, email y teléfono.", values };
  if (!looksLikeEmail(email)) return { error: "Ese email no parece válido.", values };
  if (!looksLikePhone(phone) || (whatsapp && !looksLikePhone(whatsapp))) {
    return { error: "El teléfono parece incompleto. Escribilo con código de área.", values };
  }
  const other = await findUserByEmail(email);
  if (other && other.id !== session.sub) {
    return { error: "Ya hay otra cuenta con ese email.", values };
  }

  const user = await updateUserProfile(session.sub, { name, email, phone, whatsapp });
  // El nombre viaja en la sesión: se renueva para que el header lo muestre.
  await setSessionCookie({ sub: user.id, role: "OWNER", name: user.name, ver: user.session_version });
  revalidatePath("/panel", "layout");
  return {
    success: "Datos guardados. Ojo: el contacto de cada mascota se edita en su perfil (puede ser otro número).",
  };
}

export async function changePasswordAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const session = await requireOwnerSession();
  if (!session) redirect("/ingresar");

  const current = String(formData.get("currentPassword") || "");
  const next = String(formData.get("newPassword") || "");
  const user = await findUserById(session.sub);
  if (!user) redirect("/ingresar");

  if (!(await verifyPassword(current, user.password_hash))) {
    return { error: "La contraseña actual no coincide." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña nueva tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }

  const updated = await updateUserPassword(user.id, await hashPassword(next));
  // Las otras sesiones quedan invalidadas; esta se renueva con la versión nueva.
  await setSessionCookie({ sub: updated.id, role: "OWNER", name: updated.name, ver: updated.session_version });
  return { success: "Contraseña cambiada. Cerramos la sesión en tus otros dispositivos." };
}
