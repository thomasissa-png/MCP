/**
 * Sécurité — routes internes fail-closed en production (audit Phase 2, point 3 blocker).
 *
 * `next start` tourne en NODE_ENV=production : sans header `x-internal-key` valide, /internal/* doit
 * répondre 401 (jamais ouvert). Avec le header correct, l'accès est autorisé (testé par US-09).
 */
import { test, expect } from '@playwright/test';
import { REF_TRADE_REPUBLIC, internalHeaders } from './helpers';

test.describe('Sécurité /internal fail-closed (prod)', () => {
  test('moteur d arbitrage sans clé -> 401', async ({ request }) => {
    const res = await request.post('/internal/attribution-engine/select', {
      data: { offre_id: REF_TRADE_REPUBLIC },
    });
    expect(res.status()).toBe(401);
    expect((await res.json()).error).toBe('non_autorise');
  });

  test('moteur d arbitrage avec mauvaise clé -> 401', async ({ request }) => {
    const res = await request.post('/internal/attribution-engine/select', {
      headers: { 'x-internal-key': 'mauvaise-cle' },
      data: { offre_id: REF_TRADE_REPUBLIC },
    });
    expect(res.status()).toBe(401);
  });

  test('job de fraîcheur sans clé -> 401', async ({ request }) => {
    const res = await request.post('/internal/freshness-check/run', { data: {} });
    expect(res.status()).toBe(401);
  });

  test('avec la bonne clé -> autorisé (pas 401)', async ({ request }) => {
    const res = await request.post('/internal/freshness-check/run', {
      headers: internalHeaders,
      data: {},
    });
    expect(res.status()).not.toBe(401);
  });
});
