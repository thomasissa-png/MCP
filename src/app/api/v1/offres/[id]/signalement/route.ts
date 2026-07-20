/**
 * POST /api/v1/offres/{id}/signalement — signalement anonyme d'un lien mort au niveau de l'offre (US-06).
 *
 * Le lien contextuel de la page-offre n'a pas toujours d'attribution générée : on signale donc l'offre.
 * (Le signalement rattaché à une attribution précise, US-06 crit.1/3, relève de l'espace parrain, vague 2b+.)
 *
 * Anti-abus (US-06 crit.7) : déduplication par offre + source (session anonyme / IP) sur une fenêtre
 * configurable, et émission de `lien_priorite_reverification` au seuil de signalements distincts.
 *
 * Response 201 : { signalement_id } · 200 : { signalement_id, deduplique: true } · 404 : offre inexistante.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { and, eq, gte } from 'drizzle-orm';
import { getDb } from '@/db';
import { offre, signalement } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';
import {
  SIGNALEMENT_DEDUP_WINDOW_SECONDS,
  SIGNALEMENT_REVERIFICATION_THRESHOLD,
  SIGNALEMENT_REVERIFICATION_WINDOW_SECONDS,
} from '@/config/socle';
import { getClientIp, dedupGet, dedupSet } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const db = await getDb();

  const offreRow = await db.select({ id: offre.id }).from(offre).where(eq(offre.id, id)).get();
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

  // Déduplication (US-06 crit.7) : même offre + même source dans la fenêtre -> idempotent (200, pas d'insert).
  const source = sessionId ?? getClientIp(req);
  const dedupKey = `sig:${id}:${source}`;
  const already = dedupGet<string>(dedupKey, SIGNALEMENT_DEDUP_WINDOW_SECONDS);
  if (already) {
    return NextResponse.json({ signalement_id: already, deduplique: true }, { status: 200 });
  }

  const signalementId = crypto.randomUUID();
  await db
    .insert(signalement)
    .values({ id: signalementId, offreId: id, sessionId, statut: 'ouvert' })
    .run();
  dedupSet(dedupKey, signalementId);

  emitEvent('lien_signale', { offre_id: id, signalement_id: signalementId });

  // Seuil de re-vérification : compte les signalements distincts de l'offre sur la fenêtre glissante.
  const windowStart = new Date(Date.now() - SIGNALEMENT_REVERIFICATION_WINDOW_SECONDS * 1000);
  const recent = await db
    .select({ id: signalement.id })
    .from(signalement)
    .where(and(eq(signalement.offreId, id), gte(signalement.createdAt, windowStart)))
    .all();

  // Émis une seule fois, au franchissement exact du seuil (évite le spam d'alerte).
  if (recent.length === SIGNALEMENT_REVERIFICATION_THRESHOLD) {
    emitEvent('lien_priorite_reverification', { offre_id: id, nb_signalements: recent.length });
  }

  return NextResponse.json({ signalement_id: signalementId }, { status: 201 });
}
