import { customAlphabet } from "nanoid";
import { randomUUID } from "node:crypto";

// Alfabeto sin caracteres ambiguos (sin 0/O, 1/I/L) para que el código
// impreso en la chapita/tarjeta NFC sea fácil de leer y transcribir a mano.
const TAG_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const generateTagCode = customAlphabet(TAG_ALPHABET, 8);

/** Código corto y legible para una tarjeta/chapita NFC, ej: "K7M2P9XQ". */
export function newTagCode(): string {
  return generateTagCode();
}

/** Id interno para filas de la base de datos. */
export function newId(): string {
  return randomUUID();
}
