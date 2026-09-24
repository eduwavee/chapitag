import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/themes";
import { uploadsDir } from "@/lib/upload";
import { getTagView } from "./data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Perfil de mascota en ChapiTag";

/** La foto de portada como data URL (ImageResponse no lee rutas locales). WebP no está soportado: se convierte con sharp. */
async function photoDataUrl(url: string | null): Promise<string | null> {
  // Fotos subidas (data/uploads) o las de ejemplo versionadas en public/demo.
  const upload = url?.match(/^\/api\/uploads\/([a-zA-Z0-9-]+\.(?:jpg|jpeg|png|webp))$/);
  const demo = url?.match(/^\/demo\/([a-zA-Z0-9-]+\.(?:jpg|jpeg|png|webp))$/);
  const filePath = upload
    ? path.join(uploadsDir(), upload[1])
    : demo
      ? path.join(process.cwd(), "public", "demo", demo[1])
      : null;
  if (!filePath) return null;
  try {
    const file = fs.readFileSync(filePath);
    const sharp = (await import("sharp")).default;
    const png = await sharp(file).resize(560, 560, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Vista previa al compartir el link (WhatsApp, redes). En modo perdido es un
 * mini afiche: franja naranja "SE BUSCA", foto y nombre.
 */
export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const view = getTagView(code);
  const pet = view.state === "assigned" ? view.pet : null;
  const theme = getTheme(pet?.theme);
  const photo = await photoDataUrl(pet?.photo_url ?? view.photos[0] ?? null);
  const name = pet?.name ?? "ChapiTag";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: theme.color }}>
        {pet?.lost ? (
          <div style={{ display: "flex", background: "#ff5b14", color: "#15181c", padding: "22px 48px", fontSize: 44, fontWeight: 900, letterSpacing: 2 }}>
            SE BUSCA · ¿ME VISTE?
          </div>
        ) : null}
        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 56px", gap: 48 }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse usa <img> plano
            <img src={photo} width={pet?.lost ? 400 : 460} height={pet?.lost ? 400 : 460} style={{ borderRadius: 36, objectFit: "cover" }} alt="" />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", color: theme.ink, flex: 1 }}>
            <div style={{ fontSize: name.length > 10 ? 76 : 104, fontWeight: 900, lineHeight: 1, textTransform: "uppercase" }}>{name}</div>
            <div style={{ fontSize: 34, marginTop: 20, opacity: 0.88 }}>
              {pet?.lost ? "Tocá el link para avisarle a su familia" : "Si la encontraste, avisale a su familia"}
            </div>
            <div style={{ fontSize: 26, marginTop: 36, fontWeight: 800, letterSpacing: 3, opacity: 0.75 }}>CHAPITAG</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
