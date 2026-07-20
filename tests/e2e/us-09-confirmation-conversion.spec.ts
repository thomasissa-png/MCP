/**
 * US-09 — Confirmer l'attribution d'une conversion par le parrain.
 * Flux : login Emmanuel -> attribution generee (moteur) + redirection suivie -> confirmation 200 confirmee.
 * Garde-fou d'acces : confirmer sous un autre parrain (cross-parrain) -> 403.
 */
import { test, expect } from '@playwright/test';
import { EMMANUEL_EMAIL, REF_TRADE_REPUBLIC, loginParrain } from './helpers';

test.describe('US-09 confirmation de conversion', () => {
  test('confirmation d une attribution suivie -> statut confirmee ; cross-parrain -> 403', async ({ request }) => {
    // 1) Session Emmanuel
    const cookie = await loginParrain(request, EMMANUEL_EMAIL);
    const authHeaders = { cookie: `parrainly_session=${cookie}` };

    // 2) Genere une attribution via le moteur (interne, ouvert en dev) pour l'offre Trade Republic
    const select = await request.post('/internal/attribution-engine/select', {
      data: { offre_id: REF_TRADE_REPUBLIC, canal_source: 'api_json', origine_detectee: 'chatgpt' },
    });
    expect(select.status()).toBe(200);
    const { attribution_id, parrain_id, token } = await select.json();
    expect(parrain_id).toBe('PAR-EMMANUEL');

    // 3) La redirection doit avoir ete suivie avant de pouvoir confirmer (US-09 crit.5)
    const redir = await request.get(`/r/${token}`, { maxRedirects: 0 });
    expect(redir.status()).toBe(301);

    // 4) Confirmation par le proprietaire (Emmanuel) -> 200 confirmee
    const conf = await request.post(
      `/api/v1/parrains/PAR-EMMANUEL/attributions/${attribution_id}/confirmation`,
      {
        headers: authHeaders,
        data: { date_conversion_declaree: new Date().toISOString().slice(0, 10), montant_commission_declare: 35 },
      },
    );
    expect(conf.status()).toBe(200);
    expect((await conf.json()).statut).toBe('confirmee');

    // 5) Cross-parrain : la meme session tente de confirmer sous PAR-THOMAS -> 403
    const cross = await request.post(
      `/api/v1/parrains/PAR-THOMAS/attributions/${attribution_id}/confirmation`,
      { headers: authHeaders, data: {} },
    );
    expect(cross.status()).toBe(403);
    expect((await cross.json()).error).toBe('acces_refuse');
  });

  test('confirmation sans session -> 401', async ({ request }) => {
    const res = await request.post(
      '/api/v1/parrains/PAR-EMMANUEL/attributions/nimporte/confirmation',
      { data: {} },
    );
    expect(res.status()).toBe(401);
  });
});
