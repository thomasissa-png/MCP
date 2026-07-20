import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * E2E Playwright — flux critiques du socle Parrainly (un fichier par US : US-01, US-06, auth, US-09).
 *
 * ROBUSTESSE (corrige la flakiness du smoke) :
 *  - Port DYNAMIQUE (E2E_PORT ou aleatoire large) : plus de conflit sur un 3010 fixe.
 *  - Teardown PROPRE : le webServer Playwright demarre ET arrete le serveur automatiquement.
 *  - DB E2E dediee, recreee+seedee AVANT `next start` (chaine &&) : jamais de DB vide/partielle.
 *  - workers=1, fullyParallel=false : suite courte, etat serveur/DB deterministe (pas de course).
 *
 * Chromium PRE-INSTALLE : PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers, aucun `playwright install`.
 */

// Sandbox local : Chromium pre-installe dans /opt/pw-browsers (ne PAS lancer `playwright install`).
// CI GitHub Actions : le repertoire n'existe pas -> on laisse le cache Playwright par defaut, alimente
// par `npx playwright install chromium` dans le workflow. Jamais de valeur "undefined" forcee.
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

// Port DYNAMIQUE mais STABLE : fige dans E2E_PORT au premier chargement de la config. Playwright
// recharge la config dans chaque worker (process distinct) ; sans ce fige, chaque rechargement
// tirerait un port different que le serveur (demarre par le process principal). L'env est herite au fork.
process.env.E2E_PORT ||= String(20000 + Math.floor(Math.random() * 20000));
const PORT = Number(process.env.E2E_PORT);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DB_URL = process.env.DATABASE_URL ?? 'file:./drizzle/test-e2e.db';
const SERVER_LOG = join(process.cwd(), 'e2e-server.log');

// Cle interne E2E : depuis la securisation fail-closed, `next start` (NODE_ENV=production) exige la cle
// sur /internal/*. On la fixe ici et on l'expose aux workers pour qu'ils envoient le header x-internal-key.
const E2E_INTERNAL_KEY = 'e2e-internal-key';

// Expose aux workers de test (herites au fork) : chemin du log serveur (capture du lien magique) + DB.
process.env.DATABASE_URL = DB_URL;
process.env.PARRAINLY_SERVER_LOG = SERVER_LOG;
process.env.E2E_BASE_URL = BASE_URL;
process.env.E2E_INTERNAL_KEY = E2E_INTERNAL_KEY;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // prepare-test-db (recree+seed la DB E2E) PUIS next start, sortie serveur redirigee vers le log
    // (le test auth y lit le lien magique emis par le mailer console).
    command: `node scripts/prepare-test-db.mjs && next start -p ${PORT} > ${SERVER_LOG} 2>&1`,
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      DATABASE_URL: DB_URL,
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      MAILER_TRANSPORT: 'console',
      AUTH_THOMAS_EMAIL: 'thomas@parrainly.test',
      AUTH_EMMANUEL_EMAIL: 'emmanuel@parrainly.test',
      // E2E : cooldown minimal (1 s) et plafond horaire large, pour ne pas transformer les demandes
      // repetees (tests + retries) en 429. La logique cooldown/rate reste testee unitairement.
      AUTH_MAGIC_LINK_COOLDOWN_SECONDS: '1',
      AUTH_MAGIC_LINK_MAX_PER_HOUR: '100',
      // Cle interne requise en prod (fail-closed) : les tests /internal/* envoient le header correspondant.
      INTERNAL_API_KEY: E2E_INTERNAL_KEY,
    },
  },
});
