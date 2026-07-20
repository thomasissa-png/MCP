/**
 * POST /internal/freshness-check/run — job de fraicheur US-04 (interne / planifie).
 *
 * Auth : cle interne (`INTERNAL_API_KEY`), meme regime que le moteur d'arbitrage.
 * Fail-safe : ne casse jamais le catalogue (cf. lib/freshness.ts). Seuils configurables (config/socle.ts).
 *
 * Request  : {} (optionnel : { max_age_days?: number } pour surcharger le seuil de fraicheur).
 * Response 200 : { offres_expirees, liens_invalides, offres_en_attente_parrain }
 * Response 401 : { error: "non_autorise" }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { runFreshnessCheck } from '@/lib/freshness';
import { FRESHNESS_MAX_DAYS, INTERNAL_API_KEY } from '@/config/socle';

export const dynamic = 'force-dynamic';

function authorized(req: NextRequest): boolean {
  if (!INTERNAL_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('[internal] INTERNAL_API_KEY non definie : route interne ouverte (dev uniquement).');
    return true;
  }
  return req.headers.get('x-internal-key') === INTERNAL_API_KEY;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'non_autorise' }, { status: 401 });
  }

  let maxAgeDays = FRESHNESS_MAX_DAYS;
  try {
    const body = (await req.json()) as { max_age_days?: unknown };
    if (typeof body?.max_age_days === 'number' && body.max_age_days > 0) {
      maxAgeDays = Math.floor(body.max_age_days);
    }
  } catch {
    // corps vide : on garde le seuil par defaut.
  }

  const result = runFreshnessCheck(maxAgeDays);
  return NextResponse.json(
    {
      offres_expirees: result.offres_expirees,
      liens_invalides: result.liens_invalides,
      offres_en_attente_parrain: result.offres_en_attente_parrain,
    },
    { status: result.ok ? 200 : 200 }, // fail-safe : toujours 200, jamais de crash cote appelant
  );
}
