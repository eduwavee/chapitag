export const SPECIES_OPTIONS = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "otro", label: "Otro" },
];

export const SEX_OPTIONS = [
  { value: "macho", label: "Macho" },
  { value: "hembra", label: "Hembra" },
];

export function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
