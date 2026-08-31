import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "ChapiTag NFC — Chapitas inteligentes para mascotas",
  description:
    "Chapitas con tarjeta NFC para mascotas: quien la encuentre puede ver los datos de contacto del dueño al instante, sin instalar ninguna app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${baloo.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
