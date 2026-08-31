import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth";
import { listPetsByOwner } from "@/lib/repo/pets";
import { findActiveTagForPet } from "@/lib/repo/tags";
import { getTheme } from "@/lib/themes";
import { getBadge, parseBadges } from "@/lib/badges";
import { ScrollReveal } from "@/components/ScrollReveal";

export default async function PanelHomePage() {
  const session = await requireOwnerSession();
  const pets = session ? listPetsByOwner(session.sub) : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Mis mascotas</h1>
        <Link
          href="/panel/mascotas/nueva"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Registrar mascota
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed bg-white p-10 text-center">
          <p className="text-4xl">🐾</p>
          <p className="mt-2 text-slate-600">
            Todavía no registraste ninguna mascota.
          </p>
          <Link
            href="/panel/mascotas/nueva"
            className="mt-4 inline-block font-medium text-indigo-600"
          >
            Registrar mi primera mascota →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pets.map((pet, i) => {
            const tag = findActiveTagForPet(pet.id);
            const theme = getTheme(pet.theme);
            const badges = parseBadges(pet.badges);
            return (
              <ScrollReveal key={pet.id} delay={Math.min(i, 5) * 0.06}>
              <Link
                href={`/panel/mascotas/${pet.id}`}
                className="group block overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-2" style={{ background: theme.gradient }} />
                <div className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {pet.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- foto subida por el usuario, servida desde /api/uploads
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        {theme.emoji}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-heading font-semibold">
                      {pet.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {pet.species === "perro"
                        ? "Perro"
                        : pet.species === "gato"
                          ? "Gato"
                          : "Mascota"}
                      {pet.breed ? ` · ${pet.breed}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {tag
                        ? `Tarjeta ${tag.code} activa`
                        : "Sin tarjeta NFC asignada"}
                    </p>
                    {badges.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {badges.slice(0, 3).map((key) => {
                          const badge = getBadge(key);
                          if (!badge) return null;
                          return (
                            <span key={key} title={badge.label} className="text-sm">
                              {badge.emoji}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
