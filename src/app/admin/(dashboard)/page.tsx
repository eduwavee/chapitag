import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileSpreadsheet, Printer, Search, X } from "lucide-react";
import {
  countTagsByStatus,
  countTagsDetailed,
  listBatches,
  listTagsDetailed,
  TAG_STATUSES,
  type TagStatus,
} from "@/lib/repo/tags";
import { countScansSince } from "@/lib/repo/scans";
import { formatCode, formatDate } from "@/lib/ui";
import { GenerateBatchForm, RevokeButton } from "./AdminClient";

export const metadata: Metadata = { title: "Chapitas", robots: { index: false } };

const PAGE_SIZE = 50;

const STATUS_LABEL: Record<TagStatus, string> = {
  UNASSIGNED: "Sin usar",
  ASSIGNED: "Activada",
  REVOKED: "Dada de baja",
};

type SearchParams = { q?: string; estado?: string; lote?: string; pagina?: string };

function hrefWith(current: SearchParams, patch: Partial<SearchParams>): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const status = TAG_STATUSES.includes(sp.estado as TagStatus) ? (sp.estado as TagStatus) : undefined;
  const filter = { q: sp.q, status, batch: sp.lote };
  const page = Math.max(1, parseInt(sp.pagina || "1", 10) || 1);

  const counts = await countTagsByStatus();
  const scansWeek = await countScansSince(7);
  const batches = await listBatches();
  const total = await countTagsDetailed(filter);
  const tags = await listTagsDetailed(filter, PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = !!(filter.q || filter.status || filter.batch);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-wide text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]">Chapitas</h1>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-y border-line py-4">
          {[
            ["Sin usar", counts.UNASSIGNED],
            ["Activadas", counts.ASSIGNED],
            ["Dadas de baja", counts.REVOKED],
            ["Escaneos, últimos 7 días", scansWeek],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2">
              <dd className="font-semiwide tabular text-2xl font-extrabold">{value}</dd>
              <dt className="text-[0.9375rem] text-ink-2">{label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className="plate p-5 sm:p-7 xl:col-span-5" aria-labelledby="h-generar">
          <h2 id="h-generar" className="font-semiwide text-xl font-bold tracking-tight">
            Generar un lote
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            Códigos nuevos listos para grabar en los chips con NFC Tools (la URL es la del perfil) e imprimir en el dorso.
          </p>
          <div className="mt-5">
            <GenerateBatchForm />
          </div>
        </section>

        <section className="plate p-5 sm:p-7 xl:col-span-7" aria-labelledby="h-lotes">
          <h2 id="h-lotes" className="font-semiwide text-xl font-bold tracking-tight">
            Lotes
          </h2>
          {batches.length === 0 ? (
            <p className="mt-3 text-ink-2">Todavía no hay lotes. Generá el primero.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {batches.slice(0, 8).map((b) => {
                const free = b.total - b.assigned - b.revoked;
                const lote = encodeURIComponent(b.label);
                return (
                  <li key={b.label} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={hrefWith({}, { lote: b.label })} className="font-semibold text-ink no-underline hover:underline">
                        {b.label}
                      </Link>
                      <div className="flex gap-1">
                        <Link href={`/admin/imprimir?lote=${lote}`} className="btn btn-ghost btn-sm" aria-label={`Imprimir QR de ${b.label}`}>
                          <Printer size={16} aria-hidden />
                          <span className="hidden sm:inline">QR</span>
                        </Link>
                        <a href={`/admin/exportar?lote=${lote}`} className="btn btn-ghost btn-sm" aria-label={`Exportar CSV de ${b.label}`}>
                          <FileSpreadsheet size={16} aria-hidden />
                          <span className="hidden sm:inline">CSV</span>
                        </a>
                      </div>
                    </div>
                    {/* El lote como exhibidor: una chapita por código, el estado se lee de un barrido. */}
                    <BatchRow assigned={b.assigned} free={free} revoked={b.revoked} />
                    <p className="mt-1.5 text-sm text-ink-3 tabular">
                      {b.total} códigos · {b.assigned} activadas · {free} sin usar
                      {b.revoked ? ` · ${b.revoked} de baja` : ""} · {formatDate(b.created_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="h-todas">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="h-todas" className="font-semiwide text-xl font-bold tracking-tight">
            Todas las chapitas
            <span className="ml-2 text-base font-semibold text-ink-3 tabular">{total}</span>
          </h2>
        </div>

        <form method="get" className="mt-4 flex flex-wrap items-end gap-3" role="search">
          {sp.lote && <input type="hidden" name="lote" value={sp.lote} />}
          {status && <input type="hidden" name="estado" value={status} />}
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <label htmlFor="q" className="sr-only">
              Buscar
            </label>
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
            <input id="q" name="q" defaultValue={sp.q} placeholder="Código, mascota o email" className="field pl-10" />
          </div>
          <button className="btn btn-secondary">Buscar</button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <FilterChip href={hrefWith(sp, { estado: undefined, pagina: undefined })} active={!status}>
            Todas
          </FilterChip>
          {TAG_STATUSES.map((s) => (
            <FilterChip key={s} href={hrefWith(sp, { estado: s, pagina: undefined })} active={status === s}>
              {STATUS_LABEL[s]}
            </FilterChip>
          ))}
          {sp.lote && (
            <FilterChip href={hrefWith(sp, { lote: undefined, pagina: undefined })} active>
              Lote: {sp.lote}
              <X size={16} className="ml-1.5" aria-label="Quitar filtro" />
            </FilterChip>
          )}
        </div>

        <div className="plate relative mt-4 overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-[0.9375rem]">
            <thead className="border-b border-line text-sm text-ink-2">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Código</th>
                <th scope="col" className="px-5 py-3 font-semibold">Estado</th>
                <th scope="col" className="px-5 py-3 font-semibold">Lote</th>
                <th scope="col" className="px-5 py-3 font-semibold">Mascota</th>
                <th scope="col" className="px-5 py-3 font-semibold">Dueño</th>
                <th scope="col" className="px-5 py-3 font-semibold"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-ground">
                  <td className="whitespace-nowrap px-5 py-3">
                    <a href={`/p/${tag.code}`} target="_blank" rel="noopener noreferrer" className="tag-code text-ink no-underline hover:underline">
                      {formatCode(tag.code)}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <StatusDot status={tag.status} />
                  </td>
                  <td className="max-w-[14rem] truncate px-5 py-3 text-ink-2">{tag.batch_label || "—"}</td>
                  <td className="px-5 py-3">{tag.pet_name || <span className="text-ink-3">—</span>}</td>
                  <td className="max-w-[16rem] truncate px-5 py-3 text-ink-2">{tag.owner_email || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-2 text-right">
                    {tag.status !== "REVOKED" && <RevokeButton code={tag.code} assigned={tag.status === "ASSIGNED"} />}
                  </td>
                </tr>
              ))}
              {tags.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-ink-2">
                    {filtered ? "Ninguna chapita coincide con la búsqueda." : "Todavía no generaste ninguna chapita."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <nav aria-label="Paginación" className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-ink-2 tabular">
              Página {page} de {pages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={hrefWith(sp, { pagina: String(page - 1) })} className="btn btn-secondary btn-sm">
                  <ChevronLeft size={16} aria-hidden />
                  Anterior
                </Link>
              )}
              {page < pages && (
                <Link href={hrefWith(sp, { pagina: String(page + 1) })} className="btn btn-secondary btn-sm">
                  Siguiente
                  <ChevronRight size={16} aria-hidden />
                </Link>
              )}
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`inline-flex min-h-10 items-center rounded-full border-[1.5px] px-3.5 text-[0.9375rem] font-semibold no-underline transition-colors ${
        active ? "border-ink bg-ink text-ground" : "border-line-strong bg-surface text-ink-2 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function StatusDot({ status }: { status: TagStatus }) {
  const dot =
    status === "ASSIGNED"
      ? "bg-brand"
      : status === "REVOKED"
        ? "border-2 border-danger bg-transparent"
        : "bg-line-strong";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

const MAX_DOTS = 120;

function BatchRow({ assigned, free, revoked }: { assigned: number; free: number; revoked: number }) {
  const total = assigned + free + revoked;
  const scale = total > MAX_DOTS ? MAX_DOTS / total : 1;
  const a = Math.round(assigned * scale);
  const r = Math.round(revoked * scale);
  const f = Math.max(0, Math.round(total * scale) - a - r);
  const dots = [
    ...Array.from({ length: a }, () => "bg-brand"),
    ...Array.from({ length: f }, () => "bg-line-strong"),
    ...Array.from({ length: r }, () => "border-[1.5px] border-danger"),
  ];
  return (
    <div className="mt-2 flex flex-wrap gap-[3px]" aria-hidden>
      {dots.map((cls, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${cls}`} />
      ))}
      {scale < 1 && <span className="ml-1 text-xs text-ink-3">(escala)</span>}
    </div>
  );
}
