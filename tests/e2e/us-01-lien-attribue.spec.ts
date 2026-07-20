/**
 * US-01 — Consulter une offre et recuperer un lien de parrainage attribue.
 * Flux critique : accueil -> page-offre Trade Republic -> "Obtenir mon lien" -> /r/{token} 301 +
 * attribution creee avec date_redirection journalisee. Locators resilients (getByRole).
 */
import { test, expect } from '@playwright/test';
import { openDb, REF_TRADE_REPUBLIC } from './helpers';

test.describe('US-01 lien attribue', () => {
  test('accueil -> page-offre -> lien attribue -> redirection 301 + attribution creee', async ({ page, request }) => {
    // 1) Accueil
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /vérifié avant d'être cité/i })).toBeVisible();

    // 2) Vers la page-offre Trade Republic (carte du catalogue)
    await page.getByRole('link', { name: /Trade Republic/i }).first().click();
    await expect(page).toHaveURL(/\/offres\/trade-republic$/);

    // 3) La divulgation d'affiliation est visible sans clic (exigence produit US-01 crit.2)
    await expect(page.getByText(/perçoit un avantage si vous/i)).toBeVisible();

    // 4) "Obtenir mon lien de parrainage" -> etat succes
    const cta = page.getByRole('button', { name: 'Obtenir mon lien de parrainage' });
    await expect(cta).toBeVisible();
    await cta.click();

    const continueLink = page.getByRole('link', { name: /Continuer vers Trade Republic/i });
    await expect(continueLink).toBeVisible({ timeout: 10_000 });
    const href = await continueLink.getAttribute('href');
    const token = href?.match(/\/r\/([A-Za-z0-9]+)/)?.[1];
    expect(token, 'token present dans le lien attribue').toBeTruthy();

    // 5) /r/{token} -> 301 vers l'URL de souscription reelle de l'offre
    const redir = await request.get(`/r/${token}`, { maxRedirects: 0 });
    expect(redir.status()).toBe(301);
    expect(redir.headers()['location']).toBe('https://ref.trade.re/1dw9h6jf');

    // 6) Attribution creee en base + date_redirection journalisee (US-01 crit.3)
    const db = openDb();
    const row = db
      .prepare('SELECT offre_id, parrain_id, statut, date_redirection FROM attribution WHERE token = ?')
      .get(token) as { offre_id: string; parrain_id: string; statut: string; date_redirection: number | null } | undefined;
    db.close();

    expect(row, 'attribution presente en base').toBeTruthy();
    expect(row?.offre_id).toBe(REF_TRADE_REPUBLIC);
    expect(row?.parrain_id).toBe('PAR-EMMANUEL'); // seul detenteur du lien Trade Republic en V1
    expect(row?.date_redirection, 'date_redirection renseignee apres le clic').not.toBeNull();
  });

  test('token inconnu -> 307 vers la page generique /lien-invalide (aucune exposition d enseigne)', async ({ request }) => {
    const res = await request.get('/r/ZZZbogusZZZ', { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()['location']).toMatch(/\/lien-invalide$/);
  });
});
