/**
 * PATCH /api/v1/admin/offres/{id} — mise à jour d'une offre du catalogue (US-02, session parrain requise).
 *
 * Request : { url_parrainage?, code_parrainage?, conditions?, statut? }
 * Garde-fou US-02 crit.5 : passage à `actif` interdit si `conditions` (plafond) vide -> 400 plafond_manquant.
 * Response 200 : { id, statut, date_verification } · 400 · 401 · 404
 */
import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { OFFRE_STATUTS, offre } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import { emitEvent } from '@/lib/analytics';
import { SESSION_COOKIE } from '@/config/socle';

export const dynamic = 'force-dynamic';

const EDITABLE_STATUTS = ['actif', 'en_attente_verification', 'suspendu', 'retire'];

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: 'non_autorise' }, { status: 401 });

  const { id } = await ctx.params;
  const current = db.select().from(offre).where(eq(offre.id, id)).get();
  if (!current) return NextResponse.json({ error: 'offre_inconnue' }, { status: 404 });

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const next: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.url_parrainage === 'string') next.urlParrainage = body.url_parrainage;
  if (typeof body.code_parrainage === 'string') next.codeParrainage = body.code_parrainage;
  if (typeof body.conditions === 'string') next.conditions = body.conditions;

  let statut = current.statut;
  if (typeof body.statut === 'string') {
    if (!EDITABLE_STATUTS.includes(body.statut) || !OFFRE_STATUTS.includes(body.statut as (typeof OFFRE_STATUTS)[number])) {
      emitEvent('offre_mise_a_jour_echec', { offre_id: id, type_erreur: 'statut_invalide' });
      return NextResponse.json({ error: 'statut_invalide' }, { status: 400 });
    }
    statut = body.statut as typeof current.statut;
  }

  // Garde-fou plafond avant activation (US-02 crit.5).
  const conditionsFinal = (next.conditions as string | undefined) ?? current.conditions;
  if (statut === 'actif' && (!conditionsFinal || conditionsFinal.trim().length === 0)) {
    emitEvent('offre_mise_a_jour_echec', { offre_id: id, type_erreur: 'plafond_manquant' });
    return NextResponse.json({ error: 'plafond_manquant' }, { status: 400 });
  }

  next.statut = statut;
  next.dateVerification = new Date().toISOString().slice(0, 10); // repasse à aujourd'hui (US-02 crit.1)

  db.update(offre).set(next).where(eq(offre.id, id)).run();

  emitEvent('offre_mise_a_jour', { offre_id: id, statut, operateur: user.nom.toLowerCase() });
  if (statut === 'actif' && current.statut !== 'actif') emitEvent('offre_activee', { offre_id: id });

  return NextResponse.json({ id, statut, date_verification: next.dateVerification }, { status: 200 });
}
