/**
 * US-07 — Valider ou bloquer la conformite d'une offre (POST /api/v1/admin/offres/{id}/validation).
 * Couvre les 2 transitions de statut et leurs events :
 *   - bloquer  -> statut `en_attente_verification` + event `offre_bloquee_conformite`
 *   - valider  -> statut `actif`                    + event `offre_validee_conformite`
 * Garde-fou US-07 crit.5 : valider sans reference de fiche -> 400. Refus sans session -> 401.
 *
 * Offre utilisee : REF-004 (Dougs) — isolee de REF-001/002/003 pour ne pas perturber les autres specs.
 */
import { test, expect, request as apiRequest } from '@playwright/test';
import { EMMANUEL_EMAIL, loginParrain, openDb, waitForEvent } from './helpers';

function statutDe(id: string): string {
  const db = openDb();
  const row = db.prepare('SELECT statut FROM offre WHERE id = ?').get(id) as { statut: string };
  db.close();
  return row.statut;
}

test.describe('US-07 validation conformite', () => {
  let headers: { cookie: string };
  test.beforeAll(async () => {
    const ctx = await apiRequest.newContext({ baseURL: process.env.E2E_BASE_URL });
    const cookie = await loginParrain(ctx, EMMANUEL_EMAIL);
    await ctx.dispose();
    headers = { cookie: `parrainly_session=${cookie}` };
  });

  test('valider sans reference de fiche -> 400 reference_fiche_manquante', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-004/validation', {
      headers,
      data: { decision: 'valider' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('reference_fiche_manquante');
  });

  test('bloquer -> statut en_attente_verification + event offre_bloquee_conformite', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-004/validation', {
      headers,
      data: { decision: 'bloquer' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).statut).toBe('en_attente_verification');
    expect(statutDe('REF-004')).toBe('en_attente_verification');

    const evt = await waitForEvent('offre_bloquee_conformite', (e) => e.offre_id === 'REF-004');
    expect(evt.admin_id).toBe('emmanuel');
  });

  test('valider avec reference -> statut actif + event offre_validee_conformite', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-004/validation', {
      headers,
      data: { decision: 'valider', reference_fiche_conformite: 'FICHE-DOUGS-2026-07' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).statut).toBe('actif');
    expect(statutDe('REF-004')).toBe('actif');

    const evt = await waitForEvent(
      'offre_validee_conformite',
      (e) => e.offre_id === 'REF-004' && e.reference_fiche === 'FICHE-DOUGS-2026-07',
    );
    expect(evt.admin_id).toBe('emmanuel');
  });

  test('decision inconnue -> 400 decision_invalide', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-004/validation', {
      headers,
      data: { decision: 'peut_etre' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('decision_invalide');
  });

  test('offre inconnue -> 404', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-INEXISTANTE/validation', {
      headers,
      data: { decision: 'bloquer' },
    });
    expect(res.status()).toBe(404);
    expect((await res.json()).error).toBe('offre_inconnue');
  });

  test('validation sans session -> 401', async ({ request }) => {
    const res = await request.post('/api/v1/admin/offres/REF-004/validation', {
      data: { decision: 'valider', reference_fiche_conformite: 'X' },
    });
    expect(res.status()).toBe(401);
    expect((await res.json()).error).toBe('non_autorise');
  });
});
