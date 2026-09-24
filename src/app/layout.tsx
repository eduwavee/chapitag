import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Archivo es de Omnibus-Type (Buenos Aires). Variable en peso y ancho: el
// eje `wdth` expandido es la letra del grabado; el normal, la de lectura.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.APP_URL ? new URL(process.env.APP_URL) : undefined,
  title: {
    default: "ChapiTag — la chapita NFC que trae a tu mascota de vuelta",
    template: "%s · ChapiTag",
  },
  description:
    "Chapitas NFC para mascotas. Quien la encuentra acerca el celular, sin instalar nada, y ve cómo avisarte al instante. Perfil editable, modo perdido y aviso por email cuando la escanean.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edebe7" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={`h-full antialiased ${archivo.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sin JavaScript no hay animación de entrada: lo que espera "caer al gancho" se muestra directo. */}
        <noscript>
          <style>{`.hang-on-view{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
