import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BellRing, EyeOff, ImageOff, LocateFixed, MapPin, MessageCircle, Phone, Printer, Smartphone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { BrandMark } from "@/components/Brand";
import { Chapita, CHAPITA_PIVOT, EngravedIcon, EngravedName, Hook, NfcCoil, type ChapitaShape } from "@/components/Chapita";
import { Cat, Dog } from "@/components/Animals";
import { InView } from "@/components/InView";

/** Una pieza colgada del exhibidor que cae a su gancho al entrar en pantalla y después se mece. */
function HangingOnView({ i, children, sway = [6, 0] }: { i: number; children: ReactNode; sway?: [number, number] }) {
  return (
    <div className="hang-on-view" style={{ "--i": i, "--pivot": "50% 0%" } as CSSProperties}>
      <Hook />
      <div className="sway" style={{ "--pivot": CHAPITA_PIVOT, "--sway-d": `${sway[0]}s`, "--sway-delay": `${sway[1]}s` } as CSSProperties}>
        <div className="swing-on-hover -mt-1.5" style={{ "--pivot": CHAPITA_PIVOT } as CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

const PRIVACY: { Icon: typeof MapPin; word: string; title: string; text: string; theme: string; shape: ChapitaShape }[] = [
  { Icon: MapPin, word: "Barrio", title: "Barrio, no dirección", text: "Se muestra la zona. La dirección exacta, solo si la activás.", theme: "forest", shape: "round" },
  { Icon: EyeOff, word: "Privado", title: "Fuera de Google", text: "Los perfiles no aparecen en buscadores: solo los abre quien tiene la chapita.", theme: "midnight", shape: "cat" },
  { Icon: ImageOff, word: "Sin GPS", title: "Fotos sin ubicación", text: "Al subirlas les borramos los datos GPS que guarda el celular.", theme: "sunny", shape: "bone" },
  { Icon: Smartphone, word: "Sin app", title: "Sin app para nadie", text: "Ni vos ni quien la encuentra tienen que instalar nada.", theme: "lavender", shape: "round" },
];
import { LandingHero } from "./LandingHero";
import { ProfileDemo } from "./ProfileDemo";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LandingHero />

        {/* Cómo funciona: la secuencia importa, por eso va numerada. */}
        <section id="como-funciona" className="scroll-mt-4 border-b border-line" aria-labelledby="h-pasos">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-28">
            <div className="lg:col-span-4">
              <h2 id="h-pasos" className="font-wide text-[clamp(2rem,3.4vw,3rem)] font-black leading-[0.98] tracking-tight">
                Tres pasos y queda colgada.
              </h2>
              <p className="mt-4 max-w-sm text-[1.0625rem] text-ink-2">
                La chapita no guarda tus datos: guarda un link a un perfil que editás cuando quieras.
              </p>
            </div>
            <InView className="grid gap-12 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
              {[
                {
                  n: "1",
                  title: "Conseguí la chapita",
                  text: "Viene con un chip NFC y un código único impreso en el dorso. No necesita pila ni carga.",
                },
                {
                  n: "2",
                  title: "Activala",
                  text: "Creá tu cuenta, cargá el código y armá el perfil: fotos, color, contactos y datos de salud.",
                },
                {
                  n: "3",
                  title: "Si se pierde",
                  text: "Quien la encuentra acerca el celular y ve cómo avisarte. Vos te enterás por email en el momento.",
                },
              ].map((step, i) => (
                <div key={step.n}>
                  {/* El objeto de cada paso: la chapita (dorso), la chapita grabada, la mascota con su chapita. */}
                  <div className="flex h-[176px] items-end justify-center" aria-hidden>
                    {i === 0 && (
                      <HangingOnView i={0} sway={[6.2, -1]}>
                        <Chapita themeId="classic" size={120}>
                          <NfcCoil size={34} className="text-[var(--anod-ink)] opacity-85" />
                          <span className="engraved tag-code mt-1.5 text-[0.6rem]">K7M2 P9XQ</span>
                        </Chapita>
                      </HangingOnView>
                    )}
                    {i === 1 && (
                      <HangingOnView i={1} sway={[5.4, -2.6]}>
                        <Chapita themeId="forest" size={120}>
                          <EngravedName name="Luna" size={120} />
                        </Chapita>
                      </HangingOnView>
                    )}
                    {i === 2 && (
                      <div className="hang-on-view" style={{ "--i": 2 } as CSSProperties}>
                        <Dog size={124} tagTheme="forest" className="h-auto w-[124px]" />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 border-t-2 border-ink pt-5">
                    <span className="font-wide tabular block text-[3.5rem] font-black leading-none text-brand-text">{step.n}</span>
                    <h3 className="font-semiwide mt-4 text-xl font-bold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-2">{step.text}</p>
                  </div>
                </div>
              ))}
            </InView>
          </div>
        </section>

        {/* Lo que ve quien la encuentra */}
        <section className="border-b border-line bg-surface" aria-labelledby="h-perfil">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-28">
            <div className="lg:col-span-5 lg:col-start-2">
              <h2 id="h-perfil" className="font-wide text-[clamp(2rem,3.4vw,3rem)] font-black leading-[0.98] tracking-tight">
                Esto ve quien la encuentra.
              </h2>
              <p className="mt-4 max-w-md text-[1.0625rem] text-ink-2">
                Se abre en el navegador de cualquier celular, sin app ni registro. Lo primero es la cara y el nombre; lo
                segundo, cómo avisarte.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { Icon: Phone, title: "Llamar o WhatsApp de un toque", text: "Siempre a mano, abajo, al alcance del pulgar." },
                  { Icon: LocateFixed, title: "Mandarte su ubicación", text: "Con un botón: te llega por email y la ves en tu panel." },
                  { Icon: MessageCircle, title: "Lo que tiene que saber", text: "Si toma medicación, si es reactivo, cómo acercarse." },
                ].map(({ Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-ink">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[1.0625rem] font-bold">{title}</span>
                      <span className="block text-ink-2">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <ProfileDemo />
            </div>
          </div>
        </section>

        {/* Modo perdido: la única sección donde vive el naranja de alerta. */}
        <section className="alert-band border-b border-line" aria-labelledby="h-perdido">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-6">
              <h2 id="h-perdido" className="font-wide text-[clamp(2.2rem,4.2vw,3.75rem)] font-black uppercase leading-[0.94] tracking-tight">
                Si se pierde, un botón.
              </h2>
              <p className="mt-5 max-w-lg text-[1.125rem] font-medium leading-relaxed">
                Activás el modo perdido desde tu panel y el perfil pasa a “Me están buscando”, con tu mensaje y la
                recompensa arriba de todo.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                <li className="flex gap-3">
                  <BellRing size={22} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="text-[1.0625rem] font-medium">Te avisamos por email cada vez que la escanean.</span>
                </li>
                <li className="flex gap-3">
                  <Printer size={22} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="text-[1.0625rem] font-medium">Imprimís un afiche “Se busca” con su foto y un QR a su perfil.</span>
                </li>
              </ul>
            </div>

            {/* Email de ejemplo */}
            <figure className="lg:col-span-5 lg:col-start-8">
              <div className="scheme-light rounded-[22px] bg-surface p-6 text-ink shadow-[0_24px_48px_-24px_rgb(28_26_23/.6)]">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <BrandMark size={20} />
                    ChapiTag
                  </span>
                  <span className="text-sm text-ink-3">hace 2 min</span>
                </div>
                <p className="mt-4 text-lg font-bold">Te compartieron la ubicación de Firulais</p>
                <p className="mt-2 text-ink-2">
                  Alguien que encontró a Firulais te compartió su ubicación. Mensaje: “Lo tengo en la puerta del kiosco de
                  Av. Corrientes y Scalabrini Ortiz”.
                </p>
                <span className="btn btn-primary mt-5">
                  <MapPin size={18} aria-hidden />
                  Abrir en el mapa
                </span>
              </div>
              <figcaption className="mt-3 text-sm font-medium">Ejemplo del aviso que te llega por email.</figcaption>
            </figure>
          </div>
        </section>

        {/* Privacidad */}
        <section className="border-b border-line" aria-labelledby="h-privacidad">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
            <h2 id="h-privacidad" className="font-wide max-w-3xl text-[clamp(2rem,3.4vw,3rem)] font-black leading-[0.98] tracking-tight">
              Vos decidís qué se ve.
            </h2>
            <p className="mt-4 max-w-xl text-[1.0625rem] text-ink-2">Cuatro cosas que vienen grabadas de fábrica en cada perfil.</p>
            <InView className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {PRIVACY.map(({ Icon, word, title, text, theme, shape }, i) => (
                <div key={title} className="flex flex-col items-center text-center">
                  {/* Cada chapita cuelga de su tramo de exhibidor; el texto queda afuera, sobre fondo liso. */}
                  <div className="pegboard flex w-full justify-center rounded-[22px] border border-line pb-6">
                    <HangingOnView i={i} sway={[5.2 + i * 0.7, -i * 1.3]}>
                      <Chapita themeId={theme} shape={shape} size={124}>
                        <EngravedIcon icon={Icon} size={shape === "bone" ? 30 : 36} />
                        <span className="engraved mt-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em]">{word}</span>
                      </Chapita>
                    </HangingOnView>
                  </div>
                  <h3 className="mt-5 text-[1.0625rem] font-bold">{title}</h3>
                  <p className="mt-1.5 max-w-[16rem] text-ink-2">{text}</p>
                </div>
              ))}
            </InView>
          </div>
        </section>

        {/* Cierre: activar */}
        <section className="pegboard" aria-labelledby="h-activar">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="flex items-end justify-center gap-2 lg:col-span-4">
              <div>
                <Hook />
                <Chapita themeId="classic" size={180} className="swing-on-hover -mt-1.5" style={{ ["--pivot" as string]: CHAPITA_PIVOT }}>
                  <NfcCoil size={50} className="text-[var(--anod-ink)] opacity-85" />
                  <span className="engraved tag-code mt-3 text-[0.8rem]">TU CÓDIGO</span>
                </Chapita>
              </div>
              <Cat size={120} tagTheme="classic" className="h-auto w-[120px] shrink-0" />
            </div>
            <div className="plate p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
              <h2 id="h-activar" className="font-wide text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-[1] tracking-tight">
                ¿Ya tenés tu chapita?
              </h2>
              <p className="mt-3 text-[1.0625rem] text-ink-2">Escribí el código del dorso y activala en dos minutos.</p>
              <form action="/activar" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="codigo-cierre" className="sr-only">
                  Código de la chapita
                </label>
                <input
                  id="codigo-cierre"
                  name="codigo"
                  required
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="K7M2 P9XQ"
                  className="field tag-code text-lg uppercase sm:max-w-xs"
                />
                <button type="submit" className="btn btn-primary btn-lg">
                  Activar
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-ground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="flex items-center gap-2 font-semibold">
            <BrandMark />
            <span className="font-wide font-extrabold">ChapiTag</span>
          </span>
          <nav aria-label="Pie" className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            <Link href="/activar" className="text-ink-2 no-underline hover:text-ink">Activar chapita</Link>
            <Link href="/ingresar" className="text-ink-2 no-underline hover:text-ink">Ingresar</Link>
            <Link href="/p/demo" className="text-ink-2 no-underline hover:text-ink">Perfil de ejemplo</Link>
            <Link href="/admin/ingresar" className="text-ink-3 no-underline hover:text-ink">Acceso operador</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
