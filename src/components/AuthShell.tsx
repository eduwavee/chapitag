import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Chapita, CHAPITA_PIVOT, EngravedName } from "@/components/Chapita";
import { Cat, Dog } from "@/components/Animals";

/**
 * Marco de las pantallas de cuenta (ingresar, registro, recuperar): el
 * formulario a la izquierda y, en pantallas grandes, el exhibidor con una
 * chapita grabada a la derecha.
 */
export function AuthShell({
  title,
  subtitle,
  engrave,
  themeId = "sunny",
  animal = "dog",
  children,
}: {
  animal?: "dog" | "cat";
  title: string;
  subtitle?: React.ReactNode;
  /** Palabra grabada en la chapita del exhibidor. */
  engrave: string;
  themeId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-12">
      <div className="flex flex-col px-5 pb-12 pt-4 sm:px-8 lg:col-span-6 xl:col-span-5">
        <header className="flex items-center justify-between">
          <Brand />
          <ThemeToggle />
        </header>
        <main className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center pt-10 lg:pt-0">
          <h1 className="font-wide text-[2rem] font-extrabold leading-[1.05] tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-[1.0625rem] text-ink-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </main>
      </div>
      <aside
        aria-hidden
        className="pegboard relative hidden overflow-hidden border-l border-line lg:col-span-6 lg:flex lg:items-start lg:justify-center xl:col-span-7"
      >
        <div className="anim-peek absolute bottom-[-18px] right-[12%]" style={{ ["--peek-delay" as string]: "0.9s" }}>
          {animal === "cat" ? (
            <Cat size={150} tagTheme={themeId} className="h-auto w-[150px]" />
          ) : (
            <Dog size={170} tagTheme={themeId} tiltKey={1} className="h-auto w-[170px]" />
          )}
        </div>
        <div className="mt-[14vh] flex flex-col items-center">
          <span className="block h-7 w-3 rounded-b-md bg-[var(--metal)]" />
          <Chapita themeId={themeId} size={300} className="hang-in swing-on-hover -mt-2" style={{ ["--pivot" as string]: CHAPITA_PIVOT }}>
            <EngravedName name={engrave} size={300} />
          </Chapita>
        </div>
      </aside>
    </div>
  );
}
