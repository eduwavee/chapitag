import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Chapita, CHAPITA_PIVOT, EngravedName } from "@/components/Chapita";
import { Dog } from "@/components/Animals";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col px-5 py-6 sm:px-8">
      <Brand />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center py-12 text-center">
        <div className="flex items-end gap-4">
          <div>
            <span aria-hidden className="mx-auto block h-6 w-2.5 rounded-b-md bg-[var(--metal)]" />
            <Chapita themeId="midnight" size={150} className="swing-now -mt-2" style={{ ["--pivot" as string]: CHAPITA_PIVOT }}>
              <EngravedName name="404" size={150} />
            </Chapita>
          </div>
          <Dog size={120} tagTheme="midnight" tiltKey={1} className="h-auto w-[120px]" />
        </div>
        <h1 className="font-wide mt-8 text-[2rem] font-extrabold leading-tight tracking-tight">No encontramos esta página</h1>
        <p className="mt-3 text-[1.0625rem] text-ink-2">
          Si escaneaste una chapita, revisá que el link esté completo. Si el código es de 8 letras y números, podés
          activarla desde acá.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Ir al inicio
          </Link>
          <Link href="/activar" className="btn btn-secondary">
            Activar una chapita
          </Link>
        </div>
      </div>
    </main>
  );
}
