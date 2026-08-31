import Link from "next/link";
import { NfcScanIllustration } from "@/components/NfcScanIllustration";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <header className="relative z-10 border-b bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="anim-load-1 text-lg font-bold tracking-tight">
            🐾 ChapiTag <span className="text-indigo-600 dark:text-indigo-400">NFC</span>
          </span>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/ingresar"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="press-scale rounded-full bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
            >
              Registrar mi mascota
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <section className="relative px-6 py-16 text-center sm:py-24">
        <div
          aria-hidden
          className="deco-blob -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 bg-gradient-to-br from-amber-200 via-pink-200 to-indigo-200 opacity-60 dark:from-amber-900 dark:via-pink-900 dark:to-indigo-900 dark:opacity-30"
          style={{ animation: "float-a 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="deco-blob left-10 top-40 h-40 w-40 bg-emerald-200 opacity-40 dark:bg-emerald-900 dark:opacity-20"
          style={{ animation: "float-b 8s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="deco-blob right-16 top-20 h-32 w-32 bg-sky-200 opacity-40 dark:bg-sky-900 dark:opacity-20"
          style={{ animation: "float-a 10s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden
          className="deco-ring right-24 top-56 h-4 w-4 border-fuchsia-300 opacity-70 dark:border-fuchsia-700"
          style={{ animation: "float-b 6s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="deco-ring left-24 top-28 h-3 w-3 border-amber-300 opacity-70 dark:border-amber-700"
          style={{ animation: "float-a 7s ease-in-out infinite .5s" }}
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="anim-load-1">
            <NfcScanIllustration />
          </div>
          <h1 className="anim-load-2 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Si tu mascota se pierde,
            <br className="hidden sm:block" /> que{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              cualquiera
            </span>{" "}
            pueda contactarte al instante
          </h1>
          <p className="anim-load-3 mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Una chapita con tarjeta NFC. Quien la encuentre acerca el celular,
            sin instalar nada, y ve el nombre de tu mascota, sus fotos, datos
            médicos y tus contactos para avisarte enseguida.
          </p>
          <div className="anim-load-4 mt-8 flex justify-center gap-3">
            <Link
              href="/registro"
              className="press-scale rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:shadow-indigo-950"
            >
              Quiero mi chapita
            </Link>
            <Link
              href="/p/demo"
              className="press-scale rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Ver perfil de ejemplo
            </Link>
          </div>
        </div>
      </section>

      <svg
        aria-hidden
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="relative -mt-2 block h-10 w-full"
      >
        <path
          d="M0,30 C 180,60 360,0 540,28 C 720,56 900,4 1080,26 C 1260,48 1350,20 1440,32"
          fill="none"
          stroke="#c7d2fe"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".6"
        />
      </svg>

      <section className="relative mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-3">
        <ScrollReveal>
          <Step
            n={1}
            emoji="🛒"
            title="Comprá la tarjeta"
            text="Recibís una chapita o tarjeta con un chip NFC único, ya lista para activar."
          />
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <Step
            n={2}
            emoji="🎨"
            title="Cargá los datos y personalizá"
            text="Creá tu cuenta, ingresá el código de la tarjeta y armá el perfil: fotos, tema de color, insignias, datos médicos y contactos."
          />
        </ScrollReveal>
        <ScrollReveal delay={0.24}>
          <Step
            n={3}
            emoji="✨"
            title="Listo para el momento en que más importa"
            text="Cualquiera que la encuentre acerca el celular a la chapita y ve tu perfil al instante, sin apps ni registros."
          />
        </ScrollReveal>
      </section>

      <section className="relative overflow-hidden border-t bg-white dark:border-slate-800 dark:bg-slate-900">
        <div
          aria-hidden
          className="deco-blob -bottom-16 right-0 h-64 w-64 bg-gradient-to-br from-emerald-200 to-sky-200 opacity-50 dark:from-emerald-900 dark:to-sky-900 dark:opacity-25"
          style={{ animation: "float-a 8s ease-in-out infinite" }}
        />
        <div
          aria-hidden
          className="deco-blob -top-20 left-16 h-48 w-48 bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 dark:from-violet-900 dark:to-pink-900 dark:opacity-20"
          style={{ animation: "float-b 10s ease-in-out infinite" }}
        />
        <ScrollReveal className="relative mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-heading text-2xl font-bold dark:text-white">
            ¿Sos administrador de ChapiTag NFC?
          </h2>
          <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
            Generá y gestioná los lotes de tarjetas NFC desde el panel de
            administración.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/admin/ingresar"
              className="press-scale rounded-full border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Ir al panel de administración
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="relative mt-auto border-t bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
        ChapiTag NFC — Proyecto de demostración.
      </footer>
    </div>
  );
}

function Step({
  n,
  emoji,
  title,
  text,
}: {
  n: number;
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 font-bold text-white">
        {n}
      </div>
      <p className="mt-3 text-2xl">{emoji}</p>
      <h3 className="mt-2 font-heading font-semibold dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}
