import { NextResponse, type NextRequest } from "next/server";

/**
 * Chequeo optimista: si entrás al panel sin cookie de sesión, te manda a
 * ingresar recordando a dónde ibas (?next=), así volvés ahí después de
 * loguearte. La verificación real de la sesión la hace el layout del panel.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has("chapitag_session")) return NextResponse.next();
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/ingresar";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/panel/:path*",
};
