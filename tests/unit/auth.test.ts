/**
 * Auth magic-link (cercle ferme T&E). Allowlist, usage unique, expiration, cooldown, plafond horaire,
 * invalidation des tokens anterieurs. On ne stocke JAMAIS le token brut (verification indirecte du hash).
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/db';
import { magicLinkToken } from '@/db/schema';
import {
  consumeMagicLinkToken,
  createMagicLinkToken,
  generateOpaqueToken,
  hashToken,
} from '@/lib/auth';
import { findParrainAccount } from '@/config/socle';
import { resetDb } from './fixtures';

const EMMANUEL_EMAIL = 'emmanuel@parrainly.test';

beforeEach(async () => {
  await resetDb();
});

describe('findParrainAccount — allowlist stricte T&E', () => {
  it('reconnait Thomas et Emmanuel (casse ignoree)', () => {
    expect(findParrainAccount('emmanuel@parrainly.test')?.id).toBe('PAR-EMMANUEL');
    expect(findParrainAccount('  THOMAS@Parrainly.Test  ')?.id).toBe('PAR-THOMAS');
  });

  it('rejette une adresse non autorisee (base de la reponse 403)', () => {
    expect(findParrainAccount('intrus@exemple.com')).toBeUndefined();
    expect(findParrainAccount('')).toBeUndefined();
  });
});

describe('createMagicLinkToken + consume — usage unique', () => {
  it('cree un lien puis le consomme UNE seule fois (2e tentative -> consumed)', async () => {
    const created = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const first = await consumeMagicLinkToken(created.rawToken);
    expect(first).toEqual({ ok: true, email: EMMANUEL_EMAIL, returnTo: null });

    const second = await consumeMagicLinkToken(created.rawToken);
    expect(second).toEqual({ ok: false, reason: 'consumed' });
  });

  it('ne stocke jamais le token brut : seul le hash SHA-256 est en base', async () => {
    const created = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    if (!created.ok) return;
    const db = await getDb();
    const rows = await db.select().from(magicLinkToken).all();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.tokenHash).toBe(await hashToken(created.rawToken));
    expect(rows[0]?.tokenHash).not.toBe(created.rawToken);
  });

  it('token inconnu -> invalid', async () => {
    expect(await consumeMagicLinkToken(generateOpaqueToken())).toEqual({ ok: false, reason: 'invalid' });
  });

  it('token expire -> expired (jamais consomme si perime)', async () => {
    const raw = generateOpaqueToken();
    const tokenHash = await hashToken(raw);
    const db = await getDb();
    await db
      .insert(magicLinkToken)
      .values({
        tokenHash,
        email: EMMANUEL_EMAIL,
        returnTo: null,
        createdAt: new Date(Date.now() - 3_600_000),
        expiresAt: new Date(Date.now() - 60_000), // expire il y a 1 min
      })
      .run();
    expect(await consumeMagicLinkToken(raw)).toEqual({ ok: false, reason: 'expired' });
  });
});

describe('createMagicLinkToken — cooldown, plafond horaire, invalidation', () => {
  it('cooldown : une 2e demande dans les 60 s est refusee (error cooldown + retryAfter)', async () => {
    const first = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    expect(first.ok).toBe(true);

    const second = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.error).toBe('cooldown');
      expect(second.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it('plafond horaire : 5 demandes deja passees dans l heure -> rate_limit', async () => {
    // On insere 5 tokens dto il y a 5 min (hors fenetre cooldown 60 s, dans la fenetre 1 h).
    const fiveMinAgo = Date.now() - 5 * 60_000;
    const db = await getDb();
    for (let i = 0; i < 5; i += 1) {
      await db
        .insert(magicLinkToken)
        .values({
          tokenHash: await hashToken(generateOpaqueToken()),
          email: EMMANUEL_EMAIL,
          returnTo: null,
          createdAt: new Date(fiveMinAgo + i * 1000),
          expiresAt: new Date(Date.now() + 900_000),
        })
        .run();
    }
    const res = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe('rate_limit');
  });

  it('invalide les tokens anterieurs non consommes (un seul lien valide a la fois)', async () => {
    // Token anterieur non consomme, cree il y a 2 min (hors cooldown).
    const oldRaw = generateOpaqueToken();
    const db = await getDb();
    await db
      .insert(magicLinkToken)
      .values({
        tokenHash: await hashToken(oldRaw),
        email: EMMANUEL_EMAIL,
        returnTo: null,
        createdAt: new Date(Date.now() - 120_000),
        expiresAt: new Date(Date.now() + 900_000),
      })
      .run();

    const created = await createMagicLinkToken(EMMANUEL_EMAIL, null);
    expect(created.ok).toBe(true);

    // L ancien token est desormais consomme -> inutilisable.
    expect(await consumeMagicLinkToken(oldRaw)).toEqual({ ok: false, reason: 'consumed' });
    // Aucun token non consomme autre que le nouveau.
    const openTokens = await db
      .select()
      .from(magicLinkToken)
      .where(and(eq(magicLinkToken.email, EMMANUEL_EMAIL), isNull(magicLinkToken.consumedAt)))
      .all();
    expect(openTokens).toHaveLength(1);
  });
});
