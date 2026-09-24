import { House, Megaphone } from "lucide-react";

/** "En casa" / "Perdida". El naranja de alerta solo aparece en el estado perdido. */
export function StatusChip({ lost }: { lost: boolean }) {
  return lost ? (
    <span className="alert-band inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.06em]">
      <Megaphone size={14} strokeWidth={2.6} aria-hidden />
      Perdida
    </span>
  ) : (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-ok-wash px-2.5 text-[0.8125rem] font-semibold text-ok">
      <House size={14} strokeWidth={2.4} aria-hidden />
      En casa
    </span>
  );
}
