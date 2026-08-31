import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-hidden">
      <header className="relative z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            🐾 ChapiTag <span className="text-indigo-600">NFC</span>
          </span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/ingresar" className="text-slate-600 hover:text-slate-900">
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="rounded-full bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Registrar mi mascota
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative px-6 py-16 text-center sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-indigo-200 opacity-60 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 text-5xl">🐶🐱</p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Si tu mascota se pierde,
            <br className="hidden sm:block" /> que{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              cualquiera
            </span>{" "}
            pueda contactarte al instante
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Una chapita con tarjeta NFC. Quien la encuentre acerca el celular,
            sin instalar nada, y ve el nombre de tu mascota, sus fotos, datos
            médicos y tus contactos para avisarte enseguida.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/registro"
              className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
            >
              Quiero mi chapita
            </Link>
            <Link
              href="/p/demo"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ver perfil de ejemplo
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-3">
        <Step
          n={1}
          emoji="🛒"
          title="Comprá la tarjeta"
          text="Recibís una chapita o tarjeta con un chip NFC único, ya lista para activar."
        />
        <Step
          n={2}
          emoji="🎨"
          title="Cargá los datos y personalizá"
          text="Creá tu cuenta, ingresá el código de la tarjeta y armá el perfil: fotos, tema de color, insignias, datos médicos y contactos."
        />
        <Step
          n={3}
          emoji="✨"
          title="Listo para el momento en que más importa"
          text="Cualquiera que la encuentre acerca el celular a la chapita y ve tu perfil al instante, sin apps ni registros."
        />
      </section>

      <section className="relative border-t bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200 to-sky-200 opacity-50 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-heading text-2xl font-bold">
            ¿Sos administrador de ChapiTag NFC?
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Generá y gestioná los lotes de tarjetas NFC desde el panel de
            administración.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/admin/ingresar"
              className="rounded-full border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Ir al panel de administración
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t bg-white py-6 text-center text-sm text-slate-500">
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
    <div className="relative rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 font-bold text-white">
        {n}
      </div>
      <p className="mt-3 text-2xl">{emoji}</p>
      <h3 className="mt-2 font-heading font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
