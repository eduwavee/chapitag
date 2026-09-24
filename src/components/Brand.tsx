import Link from "next/link";

/** Marca: una chapita chica (disco con agujero y aro) + "ChapiTag" en el ancho de grabado. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 48" width={size * (40 / 48)} height={size} aria-hidden>
      <circle cx="20" cy="9" r="6.5" fill="none" stroke="var(--metal)" strokeWidth="2.4" />
      <path
        fillRule="evenodd"
        fill="var(--brand)"
        d="M2 30a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z M17.6 15.2a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0Z"
      />
      <path d="M13 31.5 h14" stroke="var(--brand-ink)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 36.5 h8" stroke="var(--brand-ink)" strokeWidth="2.6" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function Brand({
  href = "/",
  suffix,
  compact = false,
  className = "",
}: {
  href?: string;
  suffix?: string;
  /** En pantallas chicas muestra solo la marca (sin el nombre), para dejar lugar a la navegación. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg text-ink no-underline ${className}`}
      aria-label={suffix ? `ChapiTag ${suffix}` : "ChapiTag, inicio"}
    >
      <BrandMark />
      <span className={`font-wide text-[1.05rem] font-extrabold tracking-tight ${compact ? "hidden sm:inline" : ""}`}>ChapiTag</span>
      {suffix && (
        <span className={`rounded-full border border-line-strong px-2 py-0.5 text-xs font-semibold text-ink-2 ${compact ? "hidden sm:inline" : ""}`}>
          {suffix}
        </span>
      )}
    </Link>
  );
}
