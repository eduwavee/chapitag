"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  label = "Copiar",
  className = "btn btn-secondary btn-sm",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin permiso de portapapeles: el texto sigue visible para copiarlo a mano.
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
      <span aria-live="polite">{copied ? "Copiado" : label}</span>
    </button>
  );
}
