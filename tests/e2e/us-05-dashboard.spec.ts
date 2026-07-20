/**
 * US-05 — Consulter son tableau de bord parrain (prime estimee + liste des liens).
 * Flux : login Emmanuel (cookie injecte) -> /parrain/tableau-de-bord affiche la carte prime et la
 * liste "Mes liens" (Emmanuel detient les 9 liens seedes). Garde-fou d'acces : sans session,
 * l'acces au dashboard redirige vers la page de connexion (avec returnTo preserve).
 */
import { test, expect } from '@playwright/test';
import { EMMANUEL_EMAIL, loginParrainBrowser, openDb } from './helpers';

test.describe('US-05 tableau de bord parrain', () => {
  test('acces authentifie -> carte prime + liste des liens', async ({ page, context, request }) => {
    await loginParrainBrowser(context, request, EMMANUEL_EMAIL);

    await page.goto('/parrain/tableau-de-bord');
    await expect(page).toHaveURL(/\/parrain\/tableau-de-bord$/);

    // Zone 2 — carte prime estimee cumulee (montant formate en EUR, jamais "undefined"/"NaN").
    await expect(page.getByText(/Prime estimée cumulée/i)).toBeVisible();
    const primeCard = page.locator('section').filter({ hasText: /Prime estimée cumulée/i }).first();
    await expect(primeCard).toContainText('€');
    await expect(primeCard).not.toContainText(/undefined|NaN|null/);

    // Zone 4 — liste "Mes liens" : Emmanuel detient tous les liens seedes (au moins 1 ligne).
    await expect(page.getByRole('heading', { name: 'Mes liens' })).toBeVisible();
    const db = openDb();
    const nbLiens = (db.prepare('SELECT COUNT(*) AS n FROM lien_parrainage WHERE parrain_id = ?').get('PAR-EMMANUEL') as { n: number }).n;
    db.close();
    expect(nbLiens, 'Emmanuel possede des liens seedes').toBeGreaterThan(0);
    // La table est rendue (une ligne au moins) et pas l'etat vide.
    await expect(page.getByText(/pas encore de lien enregistré/i)).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Trade Republic/i })).toBeVisible();
  });

  test('acces sans session -> redirection vers la connexion (returnTo preserve)', async ({ page }) => {
    await page.goto('/parrain/tableau-de-bord');
    // requireUser redirige vers /parrain/connexion?returnTo=/parrain/tableau-de-bord
    await expect(page).toHaveURL(/\/parrain\/connexion\?returnTo=/);
    expect(page.url()).toContain(encodeURIComponent('/parrain/tableau-de-bord'));
    await expect(page.getByText(/Prime estimée cumulée/i)).toHaveCount(0);
  });
});
