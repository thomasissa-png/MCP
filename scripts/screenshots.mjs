/**
 * Boucle visuelle (gate avant @qa) : capture accueil + page-offre (Trade Republic) sur 3 devices.
 * Sauvegarde dans tests/screenshots/. Compare visuellement a docs/design/page-compositions.md.
 *
 * Chromium pre-installe (/opt/pw-browsers) : on resout le binaire reel via executablePath.
 * Usage : npm run build && npm run db:seed && node scripts/screenshots.mjs
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PORT = process.env.SHOT_PORT ?? '3020';
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(process.cwd(), 'tests', 'screenshots');

const DEVICES = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const PAGES = [
  { name: 'accueil', path: '/' },
  { name: 'page-offre-trade-republic', path: '/offres/trade-republic' },
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

    for (const page of PAGES) {
      for (const device of DEVICES) {
        const ctx = await browser.newContext({
          viewport: { width: device.width, height: device.height },
          deviceScaleFactor: 2,
        });
        // Baselines propres : on pre-enregistre le choix cookies (le bandeau CNIL est teste separement).
        await ctx.addInitScript(() => {
          try {
            window.localStorage.setItem('parrainly-consent', JSON.stringify({ choice: 'refused', ts: Date.now() }));
          } catch {
            /* stockage indisponible */
          }
        });
        const p = await ctx.newPage();
        await p.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle' });
        await p.waitForTimeout(600); // laisse jouer le fade-up
        const file = join(OUT, `${page.name}-${device.name}.png`);
        await p.screenshot({ path: file, fullPage: true });
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
