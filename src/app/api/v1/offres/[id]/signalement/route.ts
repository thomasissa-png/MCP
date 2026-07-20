/**
 * POST /api/v1/offres/{id}/signalement — signalement anonyme d'un lien mort au niveau de l'offre (US-06).
 *
 * Le lien contextuel de la page-offre n'a pas toujours d'attribution générée : on signale donc l'offre.
 * (Le signalement rattaché à une attribution précise, US-06 crit.1/3, relève de l'espace parrain, vague 2b+.)
 *
 * Response 201 : { signalement_id } · 404 : offre inexistante.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { offre, signalement } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const offreRow = db.select({ id: offre.id }).from(offre).where(eq(offre.id, id)).get();
  if (!offreRow) {
    return NextResponse.json({ error: 'offre_inconnue' }, { status: 404 });
  }

  let sessionId: string | undefined;
  try {
    const body = (await req.json()) as { session_id?: unknown };
    if (typeof body.session_id === 'string') sessionId = body.session_id;
  } catch {
    // corps vide accepté
  }

  const signalementId = crypto.randomUUID();
  db.insert(signalement)
    .values({ id: signalementId, offreId: id, sessionId, statut: 'ouvert' })
    .run();

  emitEvent('lien_signale', { offre_id: id, signalement_id: signalementId });

  return NextResponse.json({ signalement_id: signalementId }, { status: 201 });
}
