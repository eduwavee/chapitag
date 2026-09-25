"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword, MIN_PASSWORD_LENGTH, requireAdminSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { generateTagBatch, revokeTag } from "@/lib/repo/tags";
import { findAdminById, updateAdminPassword } from "@/lib/repo/admins";

export type BatchState = { error?: string; success?: string; label?: string };

export async function generateBatchAction(
  _prevState: BatchState | undefined,
  formData: FormData
): Promise<BatchState> {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  const count = parseInt(String(formData.get("count") || ""), 10);
  const batchLabel = String(formData.get("batchLabel") || "").trim().slice(0, 60);

  if (!count || count < 1 || count > 500) {
    return { error: "La cantidad tiene que estar entre 1 y 500." };
  }

  const { label, tags } = await generateTagBatch(count, batchLabel);
  revalidatePath("/admin");
  return {
    success: `Listo: ${tags.length} chapitas nuevas en “${label}”.`,
    label,
  };
}

export async function revokeTagAction(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  const code = String(formData.get("code") || "").trim();
  if (code) await revokeTag(code);
  revalidatePath("/admin");
}

export async function changeAdminPasswordAction(
  _prev: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");
  const admin = await findAdminById(session.sub);
  if (!admin) redirect("/admin/ingresar");

  const current = String(formData.get("currentPassword") || "");
  const next = String(formData.get("newPassword") || "");
  if (!(await verifyPassword(current, admin.password_hash))) {
    return { error: "La contraseña actual no coincide." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña nueva tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }
  const updated = await updateAdminPassword(admin.id, await hashPassword(next));
  await setSessionCookie({ sub: updated.id, role: "ADMIN", name: updated.name, ver: updated.session_version });
  return { success: "Contraseña cambiada." };
}
