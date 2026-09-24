import { Chapita, EngravedName } from "@/components/Chapita";

/** La chapita de una mascota: con su foto engarzada o, si no tiene, con el nombre grabado. */
export function PetChapita({
  themeId,
  name,
  photoUrl,
  size,
  className,
  label,
}: {
  themeId: string;
  name: string;
  photoUrl?: string | null;
  size: number;
  className?: string;
  label?: string;
}) {
  const photoSize = Math.round(size * 0.62);
  return (
    <Chapita themeId={themeId} size={size} className={className} label={label}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- foto subida por el dueño
        <img
          src={photoUrl}
          alt=""
          width={photoSize}
          height={photoSize}
          className="shrink-0 rounded-full object-cover"
          style={{
            width: photoSize,
            height: photoSize,
            boxShadow: "0 0 0 3px color-mix(in srgb, var(--anod-ink) 55%, transparent), inset 0 0 0 1px rgb(0 0 0 / .2)",
          }}
        />
      ) : (
        <EngravedName name={name} size={size} />
      )}
    </Chapita>
  );
}
