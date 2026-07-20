/**
 * POST /api/v1/offres/{id}/attribution — génération du lien attribué (US-01, appelé par le CTA page-offre).
 *
 * Appelle directement generateAttribution (lib/attribution.ts) : moteur d'arbitrage + création de
 * l'attribution en transaction. Pas de self-fetch (contrainte Cloudflare).
 *
 * Response 201 : { attribution_id, lien_genere, token, date_verification_offre }
 * Response 404 : { error: "offre_indisponible" } · 409 : { error: "pool_vide" } · 503 : moteur.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { offre } from '@/db/schema';
import { generateAttribution, SocleError } from '@/lib/attribution';
import { SITE_URL } from '@/config/socle';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  let body: { canal_source?: unknown; session_id?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }
  const canalSource = body.canal_source === 'api_json' ? 'api_json' : 'page_web';

  try {
    const result = generateAttribution({
      offreId: id,
      canalSource,
      sessionId: typeof body.session_id === 'string' ? body.session_id : undefined,
    });

    const offreRow = db
      .select({ dateVerification: offre.dateVerification })
      .from(offre)
      .where(eq(offre.id, id))
      .get();

    return NextResponse.json(
      {
        attribution_id: result.attributionId,
        token: result.token,
        lien_genere: `${SITE_URL.replace(/\/$/, '')}/r/${result.token}`,
        date_verification_offre: offreRow?.dateVerification ?? null,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof SocleError && err.code === 'offre_indisponible') {
      return NextResponse.json({ error: 'offre_indisponible' }, { status: 404 });
    }
    if (err instanceof SocleError && err.code === 'pool_vide') {
      return NextResponse.json({ error: 'pool_vide' }, { status: 409 });
    }
    return NextResponse.json({ error: 'moteur_indisponible' }, { status: 503 });
  }
}
