"use client";

import { useState } from "react";
import { Check, LocateFixed, MessageCircle, Send } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { waLink } from "@/lib/ui";

type Status =
  | { kind: "idle" }
  | { kind: "open" }
  | { kind: "locating" }
  | { kind: "sending" }
  | { kind: "sent"; mapsUrl: string | null }
  | { kind: "error"; message: string };

/**
 * "Enviar mi ubicación": quien encontró a la mascota comparte dónde está.
 * Se guarda en el panel del dueño y le llega por email; después se ofrece
 * mandársela también por WhatsApp. Si el navegador no da la ubicación, se
 * puede mandar igual un mensaje escrito ("la tengo en la esquina de…").
 */
export function ShareLocation({
  code,
  petName,
  contactName,
  whatsapp,
  demo = false,
}: {
  code: string;
  petName: string;
  contactName: string;
  whatsapp: string | null;
  /** En la landing: muestra el flujo sin enviar nada. */
  demo?: boolean;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [note, setNote] = useState("");

  async function send(coords: GeolocationCoordinates | null) {
    if (demo) {
      setStatus({ kind: "sent", mapsUrl: null });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(`/api/p/${encodeURIComponent(code)}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: coords?.latitude,
          lng: coords?.longitude,
          accuracy: coords?.accuracy,
          note: note.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { mapsUrl?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "No se pudo enviar.");
      setStatus({ kind: "sent", mapsUrl: data.mapsUrl ?? null });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  function locateAndSend() {
    if (!("geolocation" in navigator)) {
      if (note.trim()) void send(null);
      else setStatus({ kind: "error", message: "Tu navegador no comparte la ubicación. Escribí dónde estás y enviá el mensaje." });
      return;
    }
    setStatus({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => void send(pos.coords),
      () => {
        if (note.trim()) {
          void send(null);
        } else {
          setStatus({
            kind: "error",
            message: "No pudimos obtener tu ubicación. Escribí dónde estás (calle, esquina, lugar) y enviá el mensaje.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  if (status.kind === "idle") {
    return (
      <button type="button" onClick={() => setStatus({ kind: "open" })} className="btn btn-secondary btn-lg w-full">
        <LocateFixed size={20} aria-hidden />
        Enviar mi ubicación
      </button>
    );
  }

  if (status.kind === "sent") {
    const waText = status.mapsUrl
      ? `Hola! Encontré a ${petName}. Estoy acá: ${status.mapsUrl}`
      : `Hola! Encontré a ${petName}.${note.trim() ? ` ${note.trim()}` : ""}`;
    return (
      <div className="rounded-[18px] border border-line bg-surface p-4" role="status">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <Check size={20} className="text-ok" aria-hidden />
          Listo, le avisamos a {contactName}.
        </p>
        <p className="mt-1 text-[0.9375rem] text-ink-2">
          {demo
            ? "En un perfil real, la familia recibe tu ubicación por email y en su panel."
            : "Le llega por email y la ve en su panel. Si podés, quedate cerca o llamalo."}
        </p>
        {whatsapp && !demo && (
          <a href={waLink(whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-3 w-full">
            <MessageCircle size={20} aria-hidden />
            Mandársela también por WhatsApp
          </a>
        )}
      </div>
    );
  }

  const busy = status.kind === "locating" || status.kind === "sending";

  return (
    <div className="rounded-[18px] border border-line bg-surface p-4">
      <p className="font-semibold text-ink">Contale a {contactName} dónde está {petName}</p>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        Te vamos a pedir permiso para usar la ubicación de tu celular. Solo la ve la familia.
      </p>
      <label htmlFor="finder-note" className="label mt-3">
        Mensaje <span className="font-normal text-ink-3">(opcional)</span>
      </label>
      <textarea
        id="finder-note"
        className="field"
        rows={2}
        maxLength={280}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ej: La tengo conmigo en la puerta del kiosco de Av. Corrientes y Medrano"
      />
      {status.kind === "error" && (
        <p role="alert" className="notice notice-error mt-3">
          {status.message}
        </p>
      )}
      <button type="button" onClick={locateAndSend} disabled={busy} className="btn btn-primary btn-lg mt-3 w-full">
        {busy ? <Spinner /> : <Send size={20} aria-hidden />}
        {status.kind === "locating" ? "Buscando tu ubicación…" : status.kind === "sending" ? "Enviando…" : "Enviar ubicación"}
      </button>
    </div>
  );
}
