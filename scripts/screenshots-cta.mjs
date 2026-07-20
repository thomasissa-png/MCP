/**
 * Boucle visuelle — etats du composant OfferCta non couverts par screenshots.mjs : `empty` et `error`.
 * Ces etats dependent de la reponse de POST /api/v1/offres/{id}/attribution ; on les force par
 * interception reseau deterministe (route.fulfill), plutot que d'attendre une condition serveur rare :
 *   - empty : l'API repond 404 (offre indisponible / pool epuise) -> etat "empty" de OfferCta.
 *   - error : l'API repond 500 (defaillance) -> etat "error" de OfferCta.
 *
 * Capture l'element d'etat (shot cible du composant) sur 3 devices, dans tests/screenshots/.
 * Chromium pre-installe (/opt/pw-browsers) : binaire resolu via executablePath, pas de `playwright install`.
 * Usage : npm run build && npm run db:seed && node scripts/screenshots-cta.mjs
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PORT = process.env.SHOT_PORT ?? '3021';
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(process.cwd(), 'tests', 'screenshots');
const OFFER_PATH = '/offres/trade-republic';

const DEVICES = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

// Etat -> { httpStatus force sur l'attribution, texte d'ancrage a l'ecran }.
const STATES = [
  { name: 'empty', status: 404, anchor: /plus disponible actuellement/i },
  { name: 'error', status: 500, anchor: /Impossible de générer votre lien/i },
];

function resolveChromium() {
  const root = '/opt/pw-browsers';
  if (!existsSync(root)) return undefined;
  const dir = readdirSync(root).find((d) => d.startsWith('chromium-') && !d.includes('headless'));
  if (!dir) return undefined;
  const bin = join(root, dir, 'chrome-linux', 'chrome');
  return existsSync(bin) ? bin : undefined;
}

async function waitForServer(timeoutMs = 40000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return true;
    } catch {
      /* pas encore pret */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['next', 'start', '-p', PORT], { stdio: 'ignore', env: { ...process.env } });

  try {
    if (!(await waitForServer())) {
      console.error('Serveur non demarre.');
      process.exit(1);
    }

    const executablePath = resolveChromium();
    const browser = await chromium.launch(executablePath ? { executablePath } : {});

    for (const state of STATES) {
      for (const device of DEVICES) {
        const ctx = await browser.newContext({
          viewport: { width: device.width, height: device.height },
          deviceScaleFactor: 2,
          reducedMotion: 'reduce', // etat stable, pas de frame de fade-up
        });
        // Consentement CNIL pre-enregistre (baselines propres, bandeau teste ailleurs).
        await ctx.addInitScript(() => {
          try {
            window.localStorage.setItem('parrainly-consent', JSON.stringify({ choice: 'refused', ts: Date.now() }));
          } catch {
            /* stockage indisponible */
          }
        });

        const p = await ctx.newPage();
        // Force la reponse de l'attribution AVANT le clic (les autres requetes suivent leur cours).
        await p.route('**/api/v1/offres/*/attribution', (route) =>
          route.fulfill({
            status: state.status,
            contentType: 'application/json',
            body: JSON.stringify({ error: state.name }),
          }),
        );

        await p.goto(`${BASE}${OFFER_PATH}`, { waitUntil: 'networkidle' });
        await p.getByRole('button', { name: 'Obtenir mon lien de parrainage' }).click();

        const anchor = p.getByText(state.anchor);
        await anchor.waitFor({ state: 'visible', timeout: 10000 });
        // Element d'etat = conteneur direct du texte d'ancrage (shot cible du composant).
        const container = anchor.locator('xpath=..');
        const file = join(OUT, `cta-${state.name}-${device.name}.png`);
        await container.screenshot({ path: file });
        console.log(`OK ${file} (${device.width}x${device.height})`);
        await ctx.close();
      }
    }

    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
