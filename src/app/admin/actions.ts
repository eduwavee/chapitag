"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { generateTagBatch, revokeTag } from "@/lib/repo/tags";

export async function generateBatchAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  const countRaw = String(formData.get("count") || "");
  const count = parseInt(countRaw, 10);
  const batchLabel = String(formData.get("batchLabel") || "").trim();

  if (!count || count < 1 || count > 500) {
    return { error: "Ingresá una cantidad entre 1 y 500." };
  }

  const created = generateTagBatch(count, batchLabel);
  revalidatePath("/admin");
  return {
    success: `Se generaron ${created.length} tarjetas nuevas${
      batchLabel ? ` (lote "${batchLabel}")` : ""
    }.`,
  };
}

export async function revokeTagAction(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/ingresar");

  const code = String(formData.get("code") || "").trim();
  if (code) revokeTag(code);
  revalidatePath("/admin");
}
