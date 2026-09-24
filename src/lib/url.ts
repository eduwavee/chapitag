import { headers } from "next/headers";

/**
 * URL base pública de la app ("https://chapitag.com.ar"). En producción
 * conviene fijarla con APP_URL (es la que va grabada en los chips NFC, en los
 * QR y en los emails). Si no está, se deduce de los headers del request.
 */
export async function getBaseUrl(): Promise<string> {
  const fromEnv = process.env.APP_URL?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export function publicPetPath(code: string): string {
  return `/p/${code}`;
}

export async function publicPetUrl(code: string): Promise<string> {
  return `${await getBaseUrl()}${publicPetPath(code)}`;
}

/** "tudominio.com/p/K7M2P9XQ" — la URL sin protocolo, para mostrar. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
