import { countTagsByStatus, countTagsGeneratedByDay, listTagsDetailed } from "@/lib/repo/tags";
import { GenerateBatchForm } from "@/components/GenerateBatchForm";
import { TagsSparkline } from "@/components/TagsSparkline";
import { StatCard } from "@/components/StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { revokeTagAction } from "@/app/admin/actions";

const STATUS_LABEL: Record<string, string> = {
  UNASSIGNED: "Sin usar",
  ASSIGNED: "Asignada",
  REVOKED: "Dada de baja",
};

const STATUS_STYLE: Record<string, string> = {
  UNASSIGNED: "bg-slate-100 text-slate-700",
  ASSIGNED: "bg-green-100 text-green-800",
  REVOKED: "bg-red-100 text-red-700",
};

export default async function AdminHomePage() {
  const counts = countTagsByStatus();
  const tags = listTagsDetailed(300);
  const dailyCounts = countTagsGeneratedByDay(14);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tarjetas NFC</h1>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Sin usar" value={counts.UNASSIGNED} emoji="📦" index={0} />
          <StatCard label="Asignadas" value={counts.ASSIGNED} emoji="✅" index={1} />
          <StatCard label="Dadas de baja" value={counts.REVOKED} emoji="🚫" index={2} />
        </div>
      </div>

      <ScrollReveal className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading font-semibold">Actividad reciente</h2>
        <div className="mt-4">
          <TagsSparkline data={dailyCounts} />
        </div>
      </ScrollReveal>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading font-semibold">Generar nuevo lote de tarjetas</h2>
        <p className="mt-1 text-sm text-slate-600">
          Genera códigos únicos listos para grabar en tarjetas/chapitas NFC
          nuevas (por ejemplo, antes de enviarlas a imprimir/grabar).
        </p>
        <div className="mt-4">
          <GenerateBatchForm />
        </div>
      </div>

      <div className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-heading font-semibold">Todas las tarjetas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Código</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Lote</th>
                <th className="px-6 py-3 font-medium">Mascota</th>
                <th className="px-6 py-3 font-medium">Dueño</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-3 font-mono">{tag.code}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[tag.status]}`}
                    >
                      {STATUS_LABEL[tag.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {tag.batch_label || "—"}
                  </td>
                  <td className="px-6 py-3">{tag.pet_name || "—"}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {tag.owner_email || "—"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {tag.status !== "REVOKED" && (
                      <form action={revokeTagAction}>
                        <input type="hidden" name="code" value={tag.code} />
                        <button className="text-red-600 hover:underline">
                          Dar de baja
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {tags.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Todavía no generaste ninguna tarjeta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
