/**
 * Middleware — protection de l'espace parrain (/parrain/*).
 *
 * Edge-safe : ne verifie QUE la presence du cookie de session (pas d'acces DB en Edge). La validation
 * reelle du token (expiration, allowlist) est faite cote serveur dans le layout /parrain (getSessionUser).
 *
 * Exemptions : /parrain/connexion (modal de connexion) et /parrain/verifier (page d'erreur du lien).
 * Les routes /api/health et /internal/* ne sont PAS matchees ici : /internal/* reste protege par
 * INTERNAL_API_KEY, /api/health reste public.
 */
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'parrainly_session';
const PUBLIC_PARRAIN_PATHS = ['/parrain/connexion', '/parrain/verifier'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PARRAIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/parrain/connexion';
    url.search = `?returnTo=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/parrain/:path*'],
};
