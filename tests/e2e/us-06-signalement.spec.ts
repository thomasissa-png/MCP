/**
 * US-06 — Signaler un lien de parrainage mort ou invalide.
 * Flux : page-offre -> "Ce lien ne fonctionne pas ?" -> confirmation + signalement enregistre en base.
 * Cas API : offre inconnue -> 404 (contrat vague 2b).
 */
import { test, expect } from '@playwright/test';
import { openDb } from './helpers';

test.describe('US-06 signalement lien mort', () => {
  test('signalement depuis la page-offre -> confirmation + ligne creee en base', async ({ page }) => {
    const db0 = openDb();
    const before = (db0.prepare('SELECT COUNT(*) AS n FROM signalement WHERE offre_id = ?').get('REF-001') as { n: number }).n;
    db0.close();

    await page.goto('/offres/trade-republic');
    const report = page.getByRole('button', { name: /Ce lien ne fonctionne pas/i });
    await expect(report).toBeVisible();
    await report.click();

    await expect(page.getByText(/votre signalement a été transmis/i)).toBeVisible();

    const db = openDb();
    const after = (db.prepare('SELECT COUNT(*) AS n FROM signalement WHERE offre_id = ?').get('REF-001') as { n: number }).n;
    const last = db
      .prepare('SELECT offre_id, statut FROM signalement WHERE offre_id = ? ORDER BY created_at DESC LIMIT 1')
      .get('REF-001') as { offre_id: string; statut: string } | undefined;
    db.close();

    expect(after).toBe(before + 1);
    expect(last?.statut).toBe('ouvert');
  });

  test('signalement sur une offre inconnue -> 404', async ({ request }) => {
    const res = await request.post('/api/v1/offres/REF-INEXISTANTE/signalement', { data: {} });
    expect(res.status()).toBe(404);
    expect((await res.json()).error).toBe('offre_inconnue');
  });
});
