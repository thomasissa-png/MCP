/**
 * Middleware — defense en profondeur de l'espace parrain et de l'API d'administration.
 *
 * Edge-safe : ne verifie QUE la presence du cookie de session (pas d'acces DB en Edge). La validation
 * reelle du token (expiration, allowlist) reste faite cote serveur (getSessionUser dans le layout
 * /parrain et dans chaque route /api/v1/admin/* via `requireUser`/`getSessionUser`). Le middleware est
 * une premiere barriere, PAS l'unique controle.
 *
 * Couverture :
 *   - `/parrain/*`         : pas de cookie -> redirection vers la connexion (avec returnTo).
 *   - `/api/v1/admin/*`    : pas de cookie -> 401 JSON (pas de redirection : c'est une API).
 *
 * Exemptions :
 *   - `/parrain/connexion` et `/parrain/verifier` (modale de connexion + page d'erreur du lien magique).
 *   - `/api/health` (public), `/api/cron/*` (CRON_SECRET), `/api/webhook/*` (signature provider) et
 *     `/internal/*` (INTERNAL_API_KEY) ne sont PAS matches ici : ils n'ont pas de session navigateur.
 */
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'parrainly_session';
const PUBLIC_PARRAIN_PATHS = ['/parrain/connexion', '/parrain/verifier'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  // API d'administration : gate cookie -> 401 JSON (jamais de redirection HTML sur une API).
  if (pathname.startsWith('/api/v1/admin')) {
    if (!hasSession) {
      return NextResponse.json({ error: 'non_autorise' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Espace parrain : pages publiques exemptees, sinon redirection vers la connexion.
  if (PUBLIC_PARRAIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/parrain/connexion';
    url.search = `?returnTo=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/parrain/:path*', '/api/v1/admin/:path*'],
};
