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
 *   - `/offres/*` `/categories/*` : slug hors allowlist -> vrai HTTP 404 (soft-404 seo P0-3).
 *
 * Exemptions :
 *   - `/parrain/connexion` et `/parrain/verifier` (modale de connexion + page d'erreur du lien magique).
 *   - `/api/health` (public), `/api/cron/*` (CRON_SECRET), `/api/webhook/*` (signature provider) et
 *     `/internal/*` (INTERNAL_API_KEY) ne sont PAS matches ici : ils n'ont pas de session navigateur.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { VALID_OFFRE_SLUGS, VALID_CATEGORY_SLUGS } from '@/lib/route-allowlist';

const SESSION_COOKIE = 'parrainly_session';
const PUBLIC_PARRAIN_PATHS = ['/parrain/connexion', '/parrain/verifier'];

// Chemin volontairement non matché par le routeur App Router : une réécriture vers lui déclenche le
// not-found global de Next AVEC un vrai statut HTTP 404 (l'URL d'origine reste affichée).
const NOT_FOUND_REWRITE_PATH = '/_soft-404-inexistant';

/**
 * Soft-404 (seo P0-3) : renvoie un VRAI HTTP 404 pour un slug offre/catégorie inconnu. On réécrit vers
 * un chemin non matché plutôt que d'appeler notFound() dans la page : sur une route dynamique
 * `force-dynamic`, la réponse est streamée et notFound() retombe en HTTP 200 « soft 404 » (limitation
 * Next.js core). Le middleware, lui, décide AVANT tout rendu, donc le statut 404 est correct.
 */
function realNotFound(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = NOT_FOUND_REWRITE_PATH;
  return NextResponse.rewrite(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Soft-404 des slugs publics (offre / catégorie) hors allowlist edge-safe (source : seed).
  const offreMatch = /^\/offres\/([^/]+)\/?$/.exec(pathname);
  if (offreMatch && !VALID_OFFRE_SLUGS.has(decodeURIComponent(offreMatch[1] ?? ''))) {
    return realNotFound(req);
  }
  const categorieMatch = /^\/categories\/([^/]+)\/?$/.exec(pathname);
  if (categorieMatch && !VALID_CATEGORY_SLUGS.has(decodeURIComponent(categorieMatch[1] ?? ''))) {
    return realNotFound(req);
  }
  // Toute autre requête publique sous /offres ou /categories (slug valide, sous-routes comme
  // opengraph-image) : laisser passer sans jamais appliquer la logique d'auth parrain ci-dessous.
  if (pathname.startsWith('/offres') || pathname.startsWith('/categories')) {
    return NextResponse.next();
  }

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

  // Redirection auth STRICTEMENT limitée à /parrain (le matcher couvre aussi /offres, /categories,
  // /api/v1/admin, déjà traités au-dessus).
  if (pathname.startsWith('/parrain') && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/parrain/connexion';
    url.search = `?returnTo=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/parrain/:path*', '/api/v1/admin/:path*', '/offres/:path*', '/categories/:path*'],
};
