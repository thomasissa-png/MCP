/**
 * GET /r/{token} — redirection trackee (US-01).
 *
 * - token valide + offre `actif` + fenetre non depassee : journalise `lien_redirection_suivie` puis 301
 *   vers l'URL de parrainage du lien attribue.
 * - token inconnu / expire / offre non `actif` (dont `restreint`) : redirection 307 vers la page stylee
 *   /lien-invalide (page generique noindex, zero exposition de l'enseigne d'origine).
 *
 * Le token est dans le CHEMIN (pas en query) : il survit a la copie/troncature (tracking-plan §2.2).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { resolveAndRecordRedirect } from '@/lib/attribution';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const referrer = req.headers.get('referer');

  let resolution;
  try {
    resolution = await resolveAndRecordRedirect(token, referrer);
  } catch {
    // Fail-safe : jamais de 500 cote demandeur, on renvoie la page generique stylee.
    return NextResponse.redirect(new URL('/lien-invalide', req.url), 307);
  }

  if (!resolution.ok) {
    return NextResponse.redirect(new URL('/lien-invalide', req.url), 307);
  }

  return NextResponse.redirect(resolution.url, 301);
}
