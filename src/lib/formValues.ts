/**
 * Valores de texto enviados en un formulario, para devolverlos junto con un
 * error de validación. React 19 resetea el <form> al terminar la action, así
 * que sin esto el usuario perdía todo lo que había escrito. Los campos del
 * formulario usan `defaultValue={values.x ?? ...}`.
 *
 * Nunca incluye archivos ni contraseñas.
 */
export type FormValues = Record<string, string | string[]>;

export function formValues(formData: FormData): FormValues {
  const out: FormValues = {};
  for (const key of new Set(formData.keys())) {
    if (/password/i.test(key) || key.startsWith("$ACTION")) continue;
    const all = formData.getAll(key).filter((v): v is string => typeof v === "string");
    if (all.length === 0) continue;
    out[key] = all.length > 1 || key.endsWith("[]") || MULTI_KEYS.has(key) ? all : all[0];
  }
  return out;
}

/** Campos que siempre son listas (checkboxes con el mismo name). */
const MULTI_KEYS = new Set(["badges", "deletePhotoIds"]);

export function valueOf(values: FormValues | undefined, key: string): string | undefined {
  const v = values?.[key];
  return Array.isArray(v) ? v[0] : v;
}

export function listOf(values: FormValues | undefined, key: string): string[] | undefined {
  const v = values?.[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}

/** Al menos 8 dígitos: descarta teléfonos incompletos sin ser estrictos con el formato. */
export function looksLikePhone(phone: string): boolean {
  return phone.replace(/[^\d]/g, "").length >= 8;
}

export function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
