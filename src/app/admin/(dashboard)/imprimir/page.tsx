import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listTagsForBatch } from "@/lib/repo/tags";
import { qrSvgInline } from "@/lib/qr";
import { getBaseUrl, displayUrl } from "@/lib/url";
import { formatCode } from "@/lib/ui";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Hoja de QR", robots: { index: false } };

const PER_PAGE = 35; // 5 × 7 en A4

/**
 * Hoja para imprenta: el QR de cada chapita del lote con su código debajo,
 * en grilla de 5×7 por A4. Solo las que siguen sin usar o activadas (las
 * dadas de baja no se imprimen).
 */
export default async function ImprimirPage({ searchParams }: { searchParams: Promise<{ lote?: string }> }) {
  const { lote } = await searchParams;
  const tags = lote ? listTagsForBatch(lote).filter((t) => t.status !== "REVOKED") : [];
  const base = await getBaseUrl();
  const cells = await Promise.all(
    tags.map(async (t) => ({ code: t.code, svg: await qrSvgInline(`${base}/p/${t.code}`, { margin: 0 }) }))
  );
  const pages: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += PER_PAGE) pages.push(cells.slice(i, i + PER_PAGE));

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-2 no-underline hover:text-ink">
          <ArrowLeft size={18} aria-hidden />
          Chapitas
        </Link>
        {cells.length > 0 && <PrintButton label={`Imprimir ${cells.length} QR`} />}
      </div>

      <div className="no-print mb-6">
        <h1 className="font-wide text-[2rem] font-extrabold leading-none tracking-tight">Hoja de QR</h1>
        <p className="mt-2 text-[1.0625rem] text-ink-2">
          {lote ? `Lote “${lote}”.` : "Elegí un lote desde la lista de lotes."} Cada QR abre {displayUrl(base)}/p/CÓDIGO, la
          misma URL que se graba en el chip.
        </p>
      </div>

      {pages.map((page, p) => (
        <section
          key={p}
          className="scheme-light print-page mx-auto mb-8 aspect-[210/297] w-full max-w-[210mm] bg-white p-[5%] text-[#1c1a17] shadow-[var(--shadow-plate)] print:mb-0 print:shadow-none"
          aria-label={`Hoja ${p + 1}`}
        >
          <p className="mb-[3%] flex justify-between text-[0.7rem] font-semibold">
            <span>ChapiTag · {lote}</span>
            <span>
              Hoja {p + 1} de {pages.length}
            </span>
          </p>
          <div className="grid grid-cols-5 gap-x-[3%] gap-y-[2.2%]">
            {page.map((cell) => (
              <div key={cell.code} className="flex flex-col items-center">
                <div className="aspect-square w-full" dangerouslySetInnerHTML={{ __html: cell.svg }} />
                <p className="tag-code mt-1 text-[0.72rem]">{formatCode(cell.code)}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
