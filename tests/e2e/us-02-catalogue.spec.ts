/**
 * US-02 — Editer une offre du catalogue depuis l'espace parrain (PATCH /api/v1/admin/offres/{id}).
 * Couvre : edition + persistance + re-verification de date, garde-fou plafond avant activation,
 * cycle de reactivation (event `offre_activee`), et refus sans session (401).
 *
 * Offres utilisees : REF-002 (Ramify) et REF-003 (Finary) — jamais REF-001 (Trade Republic, reserve
 * a US-01/US-06/US-09) pour eviter toute interference d'etat entre specs (workers=1, DB partagee).
 */
import { test, expect, request as apiRequest } from '@playwright/test';
import { EMMANUEL_EMAIL, loginParrain, openDb, waitForEvent } from './helpers';

const TODAY = new Date().toISOString().slice(0, 10);

test.describe('US-02 edition catalogue', () => {
  // Login une seule fois pour tout le fichier (evite d'empiler les demandes de lien magique -> cooldown).
  let headers: { cookie: string };
  test.beforeAll(async () => {
    const ctx = await apiRequest.newContext({ baseURL: process.env.E2E_BASE_URL });
    const cookie = await loginParrain(ctx, EMMANUEL_EMAIL);
    await ctx.dispose();
    headers = { cookie: `parrainly_session=${cookie}` };
  });

  test('edition d une offre -> persistance + date_verification du jour + event offre_mise_a_jour', async ({ request }) => {
    const nouvelleUrl = 'https://ramify.fr/parrainage/qa-e2e-us02';
    const res = await request.patch('/api/v1/admin/offres/REF-002', {
      headers,
      data: { url_parrainage: nouvelleUrl, conditions: 'Plafond QA : 5 filleuls / an.', statut: 'actif' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('REF-002');
    expect(body.statut).toBe('actif');
    expect(body.date_verification).toBe(TODAY);

    // Persistance reelle en base (US-02 crit.1 : re-verification datee du jour).
    const db = openDb();
    const row = db
      .prepare('SELECT url_parrainage, conditions, statut, date_verification FROM offre WHERE id = ?')
      .get('REF-002') as { url_parrainage: string; conditions: string; statut: string; date_verification: string };
    db.close();
    expect(row.url_parrainage).toBe(nouvelleUrl);
    expect(row.conditions).toContain('Plafond QA');
    expect(row.statut).toBe('actif');
    expect(row.date_verification).toBe(TODAY);

    // Event emis cote serveur (tracking-plan).
    const evt = await waitForEvent('offre_mise_a_jour', (e) => e.offre_id === 'REF-002');
    expect(evt.statut).toBe('actif');
    expect(evt.operateur).toBe('emmanuel');
  });

  test('garde-fou plafond : activation avec conditions vides -> 400 plafond_manquant (pas de mutation)', async ({ request }) => {
    const res = await request.patch('/api/v1/admin/offres/REF-003', {
      headers,
      data: { conditions: '   ', statut: 'actif' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('plafond_manquant');
  });

  test('cycle de reactivation : suspendu puis actif -> event offre_activee + statut persiste', async ({ request }) => {
    // 1) Suspension (transition depuis actif).
    const suspend = await request.patch('/api/v1/admin/offres/REF-003', {
      headers,
      data: { statut: 'suspendu' },
    });
    expect(suspend.status()).toBe(200);
    expect((await suspend.json()).statut).toBe('suspendu');

    // 2) Reactivation avec plafond present -> 200 + transition non-actif -> actif => event offre_activee.
    const reactivate = await request.patch('/api/v1/admin/offres/REF-003', {
      headers,
      data: { conditions: 'Plafond QA : reactivation.', statut: 'actif' },
    });
    expect(reactivate.status()).toBe(200);
    expect((await reactivate.json()).statut).toBe('actif');

    const db = openDb();
    const statut = (db.prepare('SELECT statut FROM offre WHERE id = ?').get('REF-003') as { statut: string }).statut;
    db.close();
    expect(statut).toBe('actif');

    await waitForEvent('offre_activee', (e) => e.offre_id === 'REF-003');
  });

  test('edition sans session -> 401', async ({ request }) => {
    const res = await request.patch('/api/v1/admin/offres/REF-002', {
      data: { statut: 'suspendu' },
    });
    expect(res.status()).toBe(401);
    expect((await res.json()).error).toBe('non_autorise');
  });
});
