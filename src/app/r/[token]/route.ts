/**
 * GET /r/{token} — redirection trackee (US-01).
 *
 * - token valide + offre `actif` + fenetre non depassee : journalise `lien_redirection_suivie` puis 301
 *   vers l'URL de parrainage du lien attribue.
 * - token inconnu / expire / offre non `actif` (dont `restreint`) : 404 + page generique "lien plus valide",
 *   sans exposer l'enseigne d'origine (anti-fingerprinting du catalogue, US-01 payload).
 *
 * Le token est dans le CHEMIN (pas en query) : il survit a la copie/troncature (tracking-plan §2.2).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { resolveAndRecordRedirect } from '@/lib/attribution';

export const dynamic = 'force-dynamic';

/** Page generique servie quand le lien n'est plus exploitable (zero tiret cadratin). */
function pageLienInvalide(): NextResponse {
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Lien plus valide</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1.5rem;color:#1a1a1a;line-height:1.6">
<h1 style="font-size:1.5rem">Ce lien de parrainage n'est plus valide</h1>
<p>Le lien que vous avez suivi a expire ou n'est plus disponible.</p>
<p>Retrouvez les offres verifiees a jour sur notre catalogue.</p>
<p><a href="/" style="color:#2563eb">Voir les offres verifiees</a></p>
</body>
</html>`;
  return new NextResponse(html, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const referrer = req.headers.get('referer');

  let resolution;
  try {
    resolution = resolveAndRecordRedirect(token, referrer);
  } catch {
    // Fail-safe : jamais de 500 cote demandeur, on renvoie la page generique.
    return pageLienInvalide();
  }

  if (!resolution.ok) return pageLienInvalide();

  return NextResponse.redirect(resolution.url, 301);
}
