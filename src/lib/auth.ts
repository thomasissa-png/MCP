/**
 * Auth magic-link espace parrain (cercle ferme T&E). Logique importee directement par les route
 * handlers (pas de self-fetch). Tokens : Web Crypto (compatible Node + Cloudflare D1/Workers).
 *
 * Securite : on ne stocke JAMAIS le token brut, seulement son hash SHA-256. Le brut vit dans l'URL
 * (lien magique) ou le cookie (session).
 */
import { and, eq, gte, isNull, lt } from 'drizzle-orm';
import { db } from '@/db';
import { magicLinkToken, session } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';
import {
  MAGIC_LINK_COOLDOWN_SECONDS,
  MAGIC_LINK_MAX_PER_HOUR,
  MAGIC_LINK_TTL_MINUTES,
  SESSION_TTL_DAYS,
  findParrainAccount,
} from '@/config/socle';

const RAW_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** Genere un token opaque url-safe (defaut 40 caracteres, entropie largement suffisante). */
export function generateOpaqueToken(length = 40): string {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i += 1) out += RAW_ALPHABET[(bytes[i] ?? 0) % RAW_ALPHABET.length];
  return out;
}

/** Hash SHA-256 hexadecimal d'un token (Web Crypto, async, compatible edge). */
export async function hashToken(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type MagicLinkResult =
  | { ok: true; rawToken: string }
  | { ok: false; error: 'cooldown' | 'rate_limit'; retryAfterSeconds: number };

/**
 * Cree un lien magique pour un email DEJA valide en amont (allowlist verifiee par l'appelant).
 * Applique cooldown (60 s) + plafond horaire (5/h). Invalide les tokens anterieurs non consommes
 * (un seul lien valide a la fois par email, spec §4 point 3).
 */
export async function createMagicLinkToken(email: string, returnTo: string | null): Promise<MagicLinkResult> {
  const now = Date.now();
  const emailNorm = email.trim().toLowerCase();

  // Cooldown : derniere demande < 60 s.
  const recent = db
    .select({ createdAt: magicLinkToken.createdAt })
    .from(magicLinkToken)
    .where(and(eq(magicLinkToken.email, emailNorm), gte(magicLinkToken.createdAt, new Date(now - MAGIC_LINK_COOLDOWN_SECONDS * 1000))))
    .all();
  if (recent.length > 0) {
    const oldest = Math.min(...recent.map((r) => r.createdAt.getTime()));
    const retry = Math.max(1, Math.ceil((MAGIC_LINK_COOLDOWN_SECONDS * 1000 - (now - oldest)) / 1000));
    return { ok: false, error: 'cooldown', retryAfterSeconds: retry };
  }

  // Plafond horaire.
  const lastHour = db
    .select({ createdAt: magicLinkToken.createdAt })
    .from(magicLinkToken)
    .where(and(eq(magicLinkToken.email, emailNorm), gte(magicLinkToken.createdAt, new Date(now - 3_600_000))))
    .all();
  if (lastHour.length >= MAGIC_LINK_MAX_PER_HOUR) {
    return { ok: false, error: 'rate_limit', retryAfterSeconds: 3600 };
  }

  // Invalide les tokens anterieurs non consommes.
  db.update(magicLinkToken)
    .set({ consumedAt: new Date(now) })
    .where(and(eq(magicLinkToken.email, emailNorm), isNull(magicLinkToken.consumedAt)))
    .run();

  const rawToken = generateOpaqueToken();
  const tokenHash = await hashToken(rawToken);
  db.insert(magicLinkToken)
    .values({
      tokenHash,
      email: emailNorm,
      returnTo,
      createdAt: new Date(now),
      expiresAt: new Date(now + MAGIC_LINK_TTL_MINUTES * 60_000),
    })
    .run();

  return { ok: true, rawToken };
}

export type ConsumeResult =
  | { ok: true; email: string; returnTo: string | null }
  | { ok: false; reason: 'expired' | 'consumed' | 'invalid' };

/**
 * Consomme un lien magique (usage unique), de facon ATOMIQUE (anti-rejeu).
 *
 * La consommation est un UPDATE conditionnel `... WHERE consumed_at IS NULL` : sur deux requetes
 * concurrentes portant le meme token, une seule voit `changes === 1` (SQLite serialise les ecritures),
 * l'autre obtient `changes === 0` -> `consumed`. On evite ainsi la fenetre de course du schema
 * read-check-update (deux lecteurs voyant le token non consomme puis l'utilisant tous les deux).
 */
export async function consumeMagicLinkToken(rawToken: string): Promise<ConsumeResult> {
  const tokenHash = await hashToken(rawToken);
  const row = db.select().from(magicLinkToken).where(eq(magicLinkToken.tokenHash, tokenHash)).get();
  if (!row) return { ok: false, reason: 'invalid' };
  if (row.consumedAt) return { ok: false, reason: 'consumed' };
  if (Date.now() > row.expiresAt.getTime()) return { ok: false, reason: 'expired' };

  // Consommation atomique : ne reussit que si le token est encore non consomme au moment de l'ecriture.
  const res = db
    .update(magicLinkToken)
    .set({ consumedAt: new Date() })
    .where(and(eq(magicLinkToken.tokenHash, tokenHash), isNull(magicLinkToken.consumedAt)))
    .run();
  if (res.changes !== 1) return { ok: false, reason: 'consumed' };

  return { ok: true, email: row.email, returnTo: row.returnTo };
}

/** Cree une session et renvoie le token brut (a poser en cookie httpOnly). */
export async function createSession(email: string): Promise<string> {
  const rawToken = generateOpaqueToken(48);
  const tokenHash = await hashToken(rawToken);
  const now = Date.now();
  db.insert(session)
    .values({
      tokenHash,
      email: email.trim().toLowerCase(),
      createdAt: new Date(now),
      expiresAt: new Date(now + SESSION_TTL_DAYS * 86_400_000),
      lastSeenAt: new Date(now),
    })
    .run();
  return rawToken;
}

export type SessionUser = { email: string; nom: string; parrainId: string };

/**
 * Valide un cookie de session. Renvoie l'utilisateur (mappe sur un compte T&E) ou null.
 * Duree glissante : repousse `expiresAt` a chaque acces valide.
 */
export async function getSessionUser(rawToken: string | undefined): Promise<SessionUser | null> {
  if (!rawToken) return null;
  const tokenHash = await hashToken(rawToken);
  const row = db.select().from(session).where(eq(session.tokenHash, tokenHash)).get();
  if (!row) return null;
  if (Date.now() > row.expiresAt.getTime()) {
    db.delete(session).where(eq(session.tokenHash, tokenHash)).run();
    // Session valide auparavant mais expiree : friction de reconnexion forcee (tracking-plan, etat 12).
    emitEvent('session_parrain_expiree', { email_domaine: row.email.split('@')[1] ?? null });
    return null;
  }
  const account = findParrainAccount(row.email);
  if (!account) return null; // email retire de l'allowlist entre-temps

  const now = Date.now();
  db.update(session)
    .set({ lastSeenAt: new Date(now), expiresAt: new Date(now + SESSION_TTL_DAYS * 86_400_000) })
    .where(eq(session.tokenHash, tokenHash))
    .run();

  return { email: row.email, nom: account.nom, parrainId: account.id };
}

/** Detruit une session (deconnexion). */
export async function destroySession(rawToken: string | undefined): Promise<void> {
  if (!rawToken) return;
  const tokenHash = await hashToken(rawToken);
  db.delete(session).where(eq(session.tokenHash, tokenHash)).run();
}

/** Purge best-effort des tokens/sessions expires (peut etre appelee par un cron). */
export function purgeExpiredAuth(): void {
  const now = new Date();
  db.delete(magicLinkToken).where(lt(magicLinkToken.expiresAt, now)).run();
  db.delete(session).where(lt(session.expiresAt, now)).run();
}
