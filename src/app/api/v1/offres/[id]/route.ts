/**
 * GET /api/v1/offres/{id|slug} — miroir JSON d'une offre unique (par id REF-001 ou par slug trade-republic).
 *
 * 200 : objet PublicOffre (champs publics + divulgation/mention de risque embarquees).
 * 404 : offre inconnue OU non servable (statut restreint/expire/en_attente/... exclu du miroir public).
 *
 * Coexiste avec les POST /api/v1/offres/{id}/attribution et /signalement (segment [id] partage).
 */
import { NextResponse } from 'next/server';
import { getPublicOffre } from '@/lib/ai/public-offre';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const offre = await getPublicOffre(id);

  if (!offre) {
    return NextResponse.json({ error: 'offre_introuvable' }, { status: 404 });
  }

  return NextResponse.json(
    { version: 'v1', generated_at: new Date().toISOString(), offre },
    { status: 200, headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } },
  );
}
