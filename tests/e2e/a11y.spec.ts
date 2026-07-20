/**
 * Accessibilite (WCAG 2.2 A/AA) — controle automatise axe-core sur les pages a fort trafic.
 * Echoue si une violation `serious` ou `critical` est detectee (bruit `minor`/`moderate` tolere,
 * a traiter en revue manuelle). Couvre : accueil, une page-offre, le tableau de bord authentifie.
 *
 * @axe-core/playwright injecte axe-core (deja present en devDep) puis l'execute dans la page rendue.
 *
 * DETERMINISME : axe est lance en `prefers-reduced-motion: reduce` (neutralise le fade-up de globals.css).
 * Sans ce reglage, axe pouvait echantillonner une frame TRANSITOIRE de l'animation d'entree (opacity < 1),
 * ou la couleur composee sur le fond blanc faussait le contraste (faux positif ~4.05:1 flaky sur le badge
 * verifie). L'etat stable respecte bien l'AA (badge verifie mesure a 4.52:1). Voir Handoff QA.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { EMMANUEL_EMAIL, loginParrainBrowser } from './helpers';

/** Regles WCAG 2.0/2.1/2.2 niveaux A + AA. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const BLOQUANT = new Set(['serious', 'critical']);

function resume(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  return violations
    .filter((v) => BLOQUANT.has(v.impact ?? ''))
    .map((v) => `[${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} noeud(s))`);
}

test.describe('Accessibilite axe-core (serious/critical bloquants)', () => {
  // Neutralise les animations d'entree : axe mesure l'etat stable, pas une frame de transition.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('accueil — aucune violation serious/critical', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { level: 1 }).first().waitFor();
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const bloquantes = resume(violations);
    expect(bloquantes, bloquantes.join('\n')).toEqual([]);
  });

  test('page-offre Trade Republic — aucune violation serious/critical', async ({ page }) => {
    await page.goto('/offres/trade-republic');
    await page.getByRole('button', { name: 'Obtenir mon lien de parrainage' }).waitFor();
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const bloquantes = resume(violations);
    expect(bloquantes, bloquantes.join('\n')).toEqual([]);
  });

  test('tableau de bord parrain (authentifie) — aucune violation serious/critical', async ({ page, context, request }) => {
    await loginParrainBrowser(context, request, EMMANUEL_EMAIL);
    await page.goto('/parrain/tableau-de-bord');
    await page.getByRole('heading', { name: 'Mes liens' }).waitFor();
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const bloquantes = resume(violations);
    expect(bloquantes, bloquantes.join('\n')).toEqual([]);
  });
});
