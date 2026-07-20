/**
 * POST /internal/attribution-engine/select — moteur d'arbitrage US-03 (interne uniquement).
 *
 * Selectionne un parrain eligible (FIFO + quota, verrouillage transactionnel) et cree l'attribution.
 * Auth : cle interne (`INTERNAL_API_KEY`). Absente en dev -> route ouverte (facilite le smoke test),
 * avec warning ; en prod la cle DOIT etre definie.
 *
 * Request  : { offre_id: string, canal_source?: "page_web"|"api_json", origine_detectee?: string, session_id?: string }
 * Response 200 : { parrain_id, attribution_id, token, lien_genere }
 * Response 400 : { error: "canal_invalide" | "offre_id_manquant" }
 * Response 401 : { error: "non_autorise" }
 * Response 404 : { error: "offre_indisponible" }
 * Response 409 : { error: "pool_vide" }
 * Response 503 : { error: "moteur_indisponible" }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { generateAttribution, SocleError } from '@/lib/attribution';
import { CANAUX, ORIGINES } from '@/db/schema';
import { INTERNAL_API_KEY, SITE_URL } from '@/config/socle';

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

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const offreId = typeof body.offre_id === 'string' ? body.offre_id : '';
  if (!offreId) {
    return NextResponse.json({ error: 'offre_id_manquant' }, { status: 400 });
  }

  const canalSource = body.canal_source;
  if (canalSource !== undefined && !CANAUX.includes(canalSource as (typeof CANAUX)[number])) {
    return NextResponse.json({ error: 'canal_invalide' }, { status: 400 });
  }

  const origine = body.origine_detectee;
  const origineDetectee =
    typeof origine === 'string' && ORIGINES.includes(origine as (typeof ORIGINES)[number])
      ? (origine as (typeof ORIGINES)[number])
      : undefined;

  try {
    const result = generateAttribution({
      offreId,
      canalSource: canalSource as (typeof CANAUX)[number] | undefined,
      origineDetectee,
      sessionId: typeof body.session_id === 'string' ? body.session_id : undefined,
    });

    return NextResponse.json(
      {
        parrain_id: result.parrainId,
        attribution_id: result.attributionId,
        token: result.token,
        lien_genere: `${SITE_URL.replace(/\/$/, '')}/r/${result.token}`,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof SocleError) {
      if (err.code === 'offre_indisponible') {
        return NextResponse.json({ error: 'offre_indisponible' }, { status: 404 });
      }
      if (err.code === 'pool_vide') {
        return NextResponse.json({ error: 'pool_vide' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'moteur_indisponible' }, { status: 503 });
  }
}
