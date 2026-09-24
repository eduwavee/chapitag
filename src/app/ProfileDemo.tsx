"use client";

import { useState } from "react";
import { House, Megaphone } from "lucide-react";
import { PetProfile } from "@/components/profile/PetProfile";
import type { ProfileData } from "@/components/profile/profileData";

/** Datos de ejemplo (marcados como tales en la página). No es una mascota real. */
const DEMO: ProfileData = {
  code: "DEMO",
  name: "Firulais",
  species: "perro",
  breed: "Mestizo",
  color: "Marrón y blanco",
  sex: "macho",
  birthYear: new Date().getFullYear() - 3,
  sterilized: true,
  microchip: null,
  medicalNotes: "Alérgico a la penicilina.",
  reward: "Se ofrece recompensa",
  contactName: "Familia Demo",
  contactPhone: "+54 9 11 0000-0000",
  contactWhatsapp: "+54 9 11 0000-0000",
  contactPhone2: null,
  contactName2: null,
  contactInstagram: "familia.demo",
  locationText: "Villa Crespo, CABA",
  themeId: "sunny",
  badges: ["reactive", "friendly", "vaccinated"],
  vetName: "Dra. Gómez",
  vetPhone: "+54 9 11 0000-0001",
  insurance: null,
  personality: "Juguetón, le encanta la pelota. Se asusta con los truenos: si está temblando, hablale bajito.",
  lost: false,
  lostSince: null,
  lostNote: null,
  updatedAt: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 19).replace("T", " "),
  // Foto de stock (Unsplash, licencia libre): public/demo/firulais.webp.
  photos: ["/demo/firulais.webp"],
};

const DEMO_LOST: ProfileData = {
  ...DEMO,
  lost: true,
  lostSince: new Date(Date.now() - 86400000).toISOString().slice(0, 19).replace("T", " "),
  lostNote: "Se escapó cerca de Parque Centenario. Tiene collar rojo.",
};

export function ProfileDemo() {
  const [lost, setLost] = useState(false);
  const data = lost ? DEMO_LOST : DEMO;

  return (
    <div className="flex flex-col items-center">
      <div role="group" aria-label="Estado de la mascota de ejemplo" className="inline-flex rounded-full border border-line bg-surface p-1">
        <button
          type="button"
          aria-pressed={!lost}
          onClick={() => setLost(false)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors ${
            !lost ? "bg-ink text-ground" : "text-ink-2 hover:text-ink"
          }`}
        >
          <House size={18} aria-hidden />
          En casa
        </button>
        <button
          type="button"
          aria-pressed={lost}
          onClick={() => setLost(true)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition-colors ${
            lost ? "alert-band" : "text-ink-2 hover:text-ink"
          }`}
        >
          <Megaphone size={18} aria-hidden />
          Perdido
        </button>
      </div>

      {/* Teléfono */}
      <div className="mt-6 w-full max-w-[360px] rounded-[44px] border-[10px] border-[#1c1a17] bg-[#1c1a17] shadow-[0_30px_60px_-24px_rgb(28_26_23/.55)]">
        <div className="relative h-[680px] overflow-y-auto overscroll-contain rounded-[34px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label="Vista previa del perfil de ejemplo">
          <PetProfile data={data} demo />
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-3">Perfil de ejemplo. Los botones no llaman a nadie.</p>
    </div>
  );
}
