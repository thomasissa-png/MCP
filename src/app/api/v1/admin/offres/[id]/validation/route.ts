/**
 * POST /api/v1/admin/offres/{id}/validation — validation de conformité (US-07, session parrain requise).
 *
 * Request : { decision: "valider" | "bloquer", reference_fiche_conformite: string }
 * "valider" exige une référence de fiche non vide (US-07 crit.5) -> sinon 400.
 * Response 200 : { statut } · 400 · 401 · 404
 */
import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { offre } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { emitEvent } from '@/lib/analytics';
import { SESSION_COOKIE } from '@/config/socle';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: 'non_autorise' }, { status: 401 });

  const { id } = await ctx.params;
  const db = await getDb();
  const current = await db.select({ id: offre.id, conditions: offre.conditions }).from(offre).where(eq(offre.id, id)).get();
  if (!current) return NextResponse.json({ error: 'offre_inconnue' }, { status: 404 });

  let body: { decision?: unknown; reference_fiche_conformite?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }

  const reference = typeof body.reference_fiche_conformite === 'string' ? body.reference_fiche_conformite.trim() : '';

  if (body.decision === 'valider') {
    if (!reference) {
      return NextResponse.json({ error: 'reference_fiche_manquante' }, { status: 400 });
    }
    // Le plafond doit être présent avant activation (cohérent US-02 crit.5).
    if (!current.conditions || current.conditions.trim().length === 0) {
      return NextResponse.json({ error: 'plafond_manquant' }, { status: 400 });
    }
    await db.update(offre).set({ statut: 'actif', updatedAt: new Date() }).where(eq(offre.id, id)).run();
    emitEvent('offre_validee_conformite', { offre_id: id, admin_id: user.nom.toLowerCase(), reference_fiche: reference });
    return NextResponse.json({ statut: 'actif' }, { status: 200 });
  }

  if (body.decision === 'bloquer') {
    await db.update(offre).set({ statut: 'en_attente_verification', updatedAt: new Date() }).where(eq(offre.id, id)).run();
    emitEvent('offre_bloquee_conformite', { offre_id: id, admin_id: user.nom.toLowerCase() });
    return NextResponse.json({ statut: 'en_attente_verification' }, { status: 200 });
  }

  return NextResponse.json({ error: 'decision_invalide' }, { status: 400 });
}
