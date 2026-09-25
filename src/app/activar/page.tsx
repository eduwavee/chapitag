import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth";
import { findTagByCode, normalizeCode } from "@/lib/repo/tags";
import { formatCode } from "@/lib/ui";
import { AuthShell } from "@/components/AuthShell";
import { FormMessage } from "@/components/form";

export const metadata: Metadata = { title: "Activar chapita" };

/**
 * Entrada para activar una chapita: desde la landing ("ya tengo una") o
 * desde el perfil de una chapita sin activar (al escanearla). Valida el
 * código y, si hay sesión, va directo al alta de la mascota.
 */
export default async function ActivarPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const { codigo } = await searchParams;
  const code = codigo ? normalizeCode(codigo) : "";
  const tag = code ? await findTagByCode(code) : undefined;

  let error: string | undefined;
  if (code && !tag) error = "No encontramos una chapita con ese código. Revisá que esté bien escrito (son 8 letras y números).";
  else if (tag && tag.status === "ASSIGNED") error = "Esa chapita ya está activada. Si es tuya, la ves en tu panel.";
  else if (tag && tag.status === "REVOKED") error = "Esa chapita fue dada de baja y no se puede volver a activar.";

  const ready = tag && tag.status === "UNASSIGNED";
  const newPetPath = ready ? `/panel/mascotas/nueva?codigo=${encodeURIComponent(tag.code)}` : "";

  if (ready) {
    const session = await requireOwnerSession();
    if (session) redirect(newPetPath);
  }

  return (
    <AuthShell
      title={ready ? "Tu chapita está lista para activar" : "Activá tu chapita"}
      subtitle={
        ready
          ? `Código ${formatCode(tag.code)}. Creá tu cuenta (o ingresá) y cargá los datos de tu mascota.`
          : "Escribí el código impreso en el dorso de la chapita."
      }
      engrave={ready ? formatCode(tag.code).replace(" ", "") : "Activar"}
    >
      {ready ? (
        <div className="space-y-3">
          <Link href={`/registro?next=${encodeURIComponent(newPetPath)}`} className="btn btn-primary btn-lg w-full">
            Crear cuenta y activar
          </Link>
          <Link href={`/ingresar?next=${encodeURIComponent(newPetPath)}`} className="btn btn-secondary btn-lg w-full">
            Ya tengo cuenta: ingresar
          </Link>
        </div>
      ) : (
        <form method="get" className="space-y-5">
          <div>
            <label htmlFor="codigo" className="label">
              Código de la chapita
            </label>
            <input
              id="codigo"
              name="codigo"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              defaultValue={codigo}
              placeholder="K7M2 P9XQ"
              className="field tag-code text-lg uppercase"
            />
          </div>
          <FormMessage error={error} />
          <button type="submit" className="btn btn-primary btn-lg w-full">
            Continuar
          </button>
        </form>
      )}
    </AuthShell>
  );
}
