import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findUserById } from "@/lib/repo/users";
import { findAdminById } from "@/lib/repo/admins";

const COOKIE_NAME = "chapitag_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 días

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "Falta la variable de entorno JWT_SECRET. Definila en tu archivo .env"
    );
  }
  return new TextEncoder().encode(secret);
}

export type Role = "OWNER" | "ADMIN";

export interface SessionPayload {
  sub: string; // id del usuario o admin
  role: Role;
  name: string;
  /** session_version del usuario al emitir el token; si cambió, la sesión ya no vale. */
  ver: number;
}

export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ role: payload.role, name: payload.name, ver: payload.ver })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || !payload.role) return null;
    return {
      sub: payload.sub as string,
      role: payload.role as Role,
      name: (payload.name as string) ?? "",
      ver: typeof payload.ver === "number" ? payload.ver : 0,
    };
  } catch {
    return null;
  }
}

/** Guarda la sesión en una cookie httpOnly. Debe llamarse desde un Server Action o Route Handler. */
export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Lee y valida la firma de la sesión actual (sin consultar la base). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Sesión de dueño vigente: firma válida, el usuario sigue existiendo y no
 * cambió su contraseña desde que se emitió el token.
 */
export async function requireOwnerSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "OWNER") return null;
  const user = await findUserById(session.sub);
  if (!user || user.session_version !== session.ver) return null;
  return { ...session, name: user.name };
}

export async function requireAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  const admin = await findAdminById(session.sub);
  if (!admin || admin.session_version !== session.ver) return null;
  return { ...session, name: admin.name };
}

/**
 * Destino seguro para redirigir después de ingresar: solo rutas internas
 * ("/panel/..."), nunca URLs absolutas ni "//otro-sitio.com".
 */
export function safeNextPath(raw: unknown, fallback = "/panel"): string {
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return fallback;
  }
  return raw;
}
