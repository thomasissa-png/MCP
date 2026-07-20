/**
 * POST /api/v1/parrains/{parrainId}/attributions/{attributionId}/confirmation (US-09).
 *
 * Auth : session parrain, et le parrainId du chemin doit correspondre à la session (sinon 403).
 * Request : { date_conversion_declaree: string(ISO), montant_commission_declare: number|null }
 * Response 200 : { statut } · 403 acces_refuse · 409 redirection_absente|fenetre_expiree · 503
 */
import { NextResponse, type NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { confirmAttribution } from '@/lib/conversion';
import { SESSION_COOKIE } from '@/config/socle';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ parrainId: string; attributionId: string }> },
) {
  const user = await getSessionUser(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: 'non_autorise' }, { status: 401 });

  const { parrainId, attributionId } = await ctx.params;
  if (parrainId !== user.parrainId) {
    return NextResponse.json({ error: 'acces_refuse' }, { status: 403 });
  }

  let body: { montant_commission_declare?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }
  const montant =
    typeof body.montant_commission_declare === 'number' && body.montant_commission_declare >= 0
      ? body.montant_commission_declare
      : null;

  try {
    const result = confirmAttribution(user.parrainId, attributionId, montant);
    if (!result.ok) {
      if (result.error === 'acces_refuse') return NextResponse.json({ error: 'acces_refuse' }, { status: 403 });
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json({ statut: result.statut }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'service_indisponible' }, { status: 503 });
  }
}
