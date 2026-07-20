/**
 * GET /api/v1/auth/verify?token=&returnTo= — landing du lien magique (US auth §1, ecran B).
 *
 * Consomme le token (usage unique) ; en cas de succes ouvre une session (cookie httpOnly/secure/
 * sameSite=strict, duree glissante) et redirige vers la page demandee ou le tableau de bord.
 * En cas d'echec redirige vers /parrain/verifier?error=expired|consumed|invalid (page d'erreur stylee).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { consumeMagicLinkToken, createSession } from '@/lib/auth';
import { emitEvent } from '@/lib/analytics';
import { SESSION_COOKIE, SESSION_TTL_DAYS, findParrainAccount } from '@/config/socle';

export const dynamic = 'force-dynamic';

function errorRedirect(req: NextRequest, reason: string) {
  const url = req.nextUrl.clone();
  url.pathname = '/parrain/verifier';
  url.search = `?error=${reason}`;
  return NextResponse.redirect(url, 307);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const returnToParam = req.nextUrl.searchParams.get('returnTo');
  if (!token) return errorRedirect(req, 'invalid');

  let result;
  try {
    result = await consumeMagicLinkToken(token);
  } catch {
    return errorRedirect(req, 'invalid');
  }

  if (!result.ok) {
    emitEvent('connexion_lien_ouvert', { resultat: result.reason });
    return errorRedirect(req, result.reason);
  }

  const account = findParrainAccount(result.email);
  if (!account) return errorRedirect(req, 'invalid');

  const rawSession = await createSession(result.email);

  const dest = req.nextUrl.clone();
  const returnTo = result.returnTo ?? returnToParam;
  dest.pathname = returnTo && returnTo.startsWith('/parrain/') ? returnTo : '/parrain/tableau-de-bord';
  dest.search = '';

  const res = NextResponse.redirect(dest, 307);
  res.cookies.set(SESSION_COOKIE, rawSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 86_400,
  });

  emitEvent('connexion_lien_ouvert', { resultat: 'succes' });
  emitEvent('session_parrain_ouverte', { operateur: account.nom.toLowerCase() });
  return res;
}
