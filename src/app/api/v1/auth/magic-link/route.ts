/**
 * POST /api/v1/auth/magic-link — demande d'un lien de connexion (US auth §1).
 *
 * Allowlist stricte T&E. Cooldown 60 s + plafond 5/h (config). Email envoye via mailer pluggable
 * (transport console par defaut : le lien apparait dans les logs serveur pour le pilote).
 *
 * Response 200 : { ok: true }
 * Response 400 : { error: "email_invalide" }
 * Response 403 : { error: "non_autorise" }
 * Response 429 : { error: "cooldown" | "rate_limit", retry_after: number }
 * Response 503 : { error: "envoi_indisponible" }
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createMagicLinkToken, hashToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/mailer';
import { emitEvent } from '@/lib/analytics';
import { SITE_URL, findParrainAccount } from '@/config/socle';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeReturnTo(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/parrain/') ? value : null;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; returnTo?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'email_invalide' }, { status: 400 });
  }

  const emailHash = (await hashToken(email.toLowerCase())).slice(0, 12);

  // Allowlist : message neutre, aucun email envoye si l'adresse n'est pas autorisee.
  if (!findParrainAccount(email)) {
    emitEvent('connexion_lien_demande', { email_hash: emailHash, resultat: 'non_autorise' });
    return NextResponse.json({ error: 'non_autorise' }, { status: 403 });
  }

  const result = await createMagicLinkToken(email, safeReturnTo(body.returnTo));
  if (!result.ok) {
    emitEvent('connexion_lien_demande', { email_hash: emailHash, resultat: 'frequence_depassee', motif: result.error });
    return NextResponse.json({ error: result.error, retry_after: result.retryAfterSeconds }, { status: 429 });
  }

  const returnTo = safeReturnTo(body.returnTo);
  const verifyUrl = `${SITE_URL.replace(/\/$/, '')}/api/v1/auth/verify?token=${result.rawToken}${
    returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''
  }`;

  const sent = await sendMagicLinkEmail(email, verifyUrl);
  if (!sent) {
    return NextResponse.json({ error: 'envoi_indisponible' }, { status: 503 });
  }

  emitEvent('connexion_lien_demande', { email_hash: emailHash, resultat: 'envoye' });
  return NextResponse.json({ ok: true }, { status: 200 });
}
