import QRCode from "qrcode";

/**
 * QR en SVG (vectorial: se imprime nítido a cualquier tamaño). Corrección de
 * errores "M": aguanta rayones leves en una chapita o un afiche al sol.
 */
export async function qrSvg(
  text: string,
  options: { dark?: string; light?: string; margin?: number } = {}
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: options.margin ?? 1,
    color: {
      dark: options.dark ?? "#1c1a17",
      light: options.light ?? "#ffffff",
    },
  });
}

/** El SVG listo para incrustar con dangerouslySetInnerHTML, escalando al contenedor. */
export async function qrSvgInline(text: string, options?: Parameters<typeof qrSvg>[1]) {
  const svg = await qrSvg(text, options);
  return svg.replace("<svg ", '<svg width="100%" height="100%" aria-hidden="true" ');
}
