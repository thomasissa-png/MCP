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
import {
  SITE_URL,
  ATTRIBUTION_RATE_MAX,
  ATTRIBUTION_RATE_WINDOW_SECONDS,
  ATTRIBUTION_DEDUP_WINDOW_SECONDS,
} from '@/config/socle';
import { getClientIp, rateLimit, dedupGet, dedupSet } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

type AttributionPayload = {
  attribution_id: string;
  token: string;
  lien_genere: string;
  date_verification_offre: string | null;
};

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  let body: { canal_source?: unknown; session_id?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }
  const canalSource = body.canal_source === 'api_json' ? 'api_json' : 'page_web';
  const sessionId = typeof body.session_id === 'string' ? body.session_id : undefined;

  // Anti-abus (protection du quota T&E) : rate-limit + dedup par source (IP + session anonyme).
  const ip = getClientIp(req);
  const source = `${ip}:${sessionId ?? '-'}`;

  const rate = rateLimit(`attr:${source}`, ATTRIBUTION_RATE_MAX, ATTRIBUTION_RATE_WINDOW_SECONDS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'trop_de_requetes' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  // Dedup serveur : meme source + meme offre dans la fenetre -> on renvoie le lien deja genere
  // (evite de consommer du quota sur un rechargement / double appel non couvert par la dedup client).
  const dedupKey = `attr:${source}:${id}`;
  const cached = dedupGet<AttributionPayload>(dedupKey, ATTRIBUTION_DEDUP_WINDOW_SECONDS);
  if (cached) {
    return NextResponse.json(cached, { status: 201 });
  }

  try {
    const result = generateAttribution({
      offreId: id,
      canalSource,
      sessionId,
    });

    const offreRow = db
      .select({ dateVerification: offre.dateVerification })
      .from(offre)
      .where(eq(offre.id, id))
      .get();

    const payload: AttributionPayload = {
      attribution_id: result.attributionId,
      token: result.token,
      lien_genere: `${SITE_URL.replace(/\/$/, '')}/r/${result.token}`,
      date_verification_offre: offreRow?.dateVerification ?? null,
    };
    dedupSet(dedupKey, payload);

    return NextResponse.json(payload, { status: 201 });
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
