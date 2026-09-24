"use client";

import { useEffect } from "react";

/**
 * Registra el escaneo una vez que el perfil se abrió en un navegador de
 * verdad. Se hace desde el cliente (y no al renderizar en el servidor) para
 * no contar prefetches ni los bots que generan la vista previa de un link
 * en WhatsApp: esos no ejecutan JavaScript.
 */
export function ScanBeacon({ code }: { code: string }) {
  useEffect(() => {
    const url = `/api/p/${encodeURIComponent(code)}/scan`;
    if (navigator.sendBeacon?.(url)) return;
    fetch(url, { method: "POST", keepalive: true }).catch(() => {});
  }, [code]);
  return null;
}
