/**
 * Hero illustration: a stylized ChapiTag NFC tag being scanned by a phone,
 * with pulsing rings standing in for the NFC signal. Pure CSS/SVG, no JS —
 * safe to render on the server.
 *
 * The tag and phone carry their resting transform *inside* their keyframes
 * (tag-wobble / phone-bob in globals.css) rather than in Tailwind classes,
 * so the idle animation and the base offset don't fight. `.deco-wobble`
 * gets frozen under prefers-reduced-motion.
 */
export function NfcScanIllustration() {
  return (
    <div className="relative mx-auto flex h-40 w-64 items-center justify-center sm:h-48 sm:w-80">
      {/* pulsing NFC rings */}
      <span
        className="deco-ping absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-400"
        style={{ animation: "ping-ring 2.6s ease-out infinite" }}
      />
      <span
        className="deco-ping absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fuchsia-400"
        style={{ animation: "ping-ring 2.6s ease-out infinite 0.9s" }}
      />
      <span
        className="deco-ping absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400"
        style={{ animation: "ping-ring 2.6s ease-out infinite 1.8s" }}
      />

      {/* the tag */}
      <div
        className="deco-wobble deco-wobble-tag relative z-10 flex h-20 w-32 flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-3 shadow-xl sm:h-24 sm:w-40"
        style={{ animation: "tag-wobble 5s ease-in-out infinite" }}
      >
        <span className="text-lg sm:text-xl">🐾</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
          ChapiTag
        </span>
      </div>

      {/* the phone */}
      <div
        className="deco-wobble deco-wobble-phone relative z-10 flex h-24 w-14 items-start justify-center rounded-xl border-2 border-slate-700 bg-slate-900 pt-2 shadow-xl sm:h-28 sm:w-16"
        style={{ animation: "phone-bob 5s ease-in-out infinite 0.4s" }}
      >
        <div className="h-1 w-4 rounded-full bg-slate-600" />
      </div>
    </div>
  );
}
