/**
 * Envío de emails con Resend (https://resend.com), directo contra su API REST
 * para no sumar dependencias. Variables de entorno:
 *
 *   RESEND_API_KEY  → la API key (re_...). Sin ella, los emails se escriben
 *                     en la consola del servidor en vez de enviarse (útil en
 *                     desarrollo).
 *   EMAIL_FROM      → remitente verificado en Resend, ej:
 *                     "ChapiTag <avisos@chapitag.com.ar>".
 */

interface EmailMessage {
  to: string;
  subject: string;
  /** Párrafos del cuerpo, en orden. */
  lines: string[];
  action?: { label: string; url: string };
  footer?: string;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "ChapiTag <onboarding@resend.dev>";
  const text = renderText(message);

  if (!apiKey) {
    console.info(
      `\n[email:no-enviado — falta RESEND_API_KEY]\nPara: ${message.to}\nAsunto: ${message.subject}\n\n${text}\n`
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text,
        html: renderHtml(message),
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend respondió ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] No se pudo enviar:", err);
    return false;
  }
}

function renderText(m: EmailMessage): string {
  return [
    ...m.lines,
    m.action ? `${m.action.label}: ${m.action.url}` : "",
    m.footer ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML simple y compatible con clientes de correo (tablas + estilos inline). */
function renderHtml(m: EmailMessage): string {
  const paragraphs = m.lines
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1c1a17">${escapeHtml(line)}</p>`
    )
    .join("");
  const button = m.action
    ? `<p style="margin:22px 0"><a href="${escapeHtml(m.action.url)}" style="display:inline-block;background:#6e4b2a;color:#f4efe8;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px;font-size:16px">${escapeHtml(m.action.label)}</a></p>`
    : "";
  const footer = m.footer
    ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#4c4741">${escapeHtml(m.footer)}</p>`
    : "";
  return `<!doctype html><html lang="es"><body style="margin:0;background:#edebe7;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edebe7;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fbfaf8;border:1px solid #d6d2cb;border-radius:18px">
<tr><td style="padding:22px 26px 6px;font-weight:800;font-size:15px;letter-spacing:.08em;color:#6e4b2a">CHAPITAG</td></tr>
<tr><td style="padding:10px 26px 26px">${paragraphs}${button}${footer}</td></tr>
</table></td></tr></table></body></html>`;
}
