"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir", className = "btn btn-primary btn-lg" }: { label?: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer size={20} aria-hidden />
      {label}
    </button>
  );
}
