/**
 * Boucle visuelle espace parrain (US-05 dashboard + US-09 modal). Injecte une session valide + une
 * attribution de demo directement en base, pose le cookie, capture 3 devices dans tests/screenshots/.
 *
 * Usage : npm run build && npm run db:seed && node scripts/screenshots-parrain.mjs
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PORT = process.env.SHOT_PORT ?? '3022';
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(process.cwd(), 'tests', 'screenshots');
const DB_FILE = (process.env.DATABASE_URL ?? 'file:./drizzle/local.db').replace(/^file:/, '');
const EMMANUEL = (process.env.AUTH_EMMANUEL_EMAIL ?? 'emmanuel@parrainly.test').toLowerCase();
const RAW_SESSION = 'visual-session-' + randomUUID().replace(/-/g, '');

const DEVICES = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

function seedSessionAndAttribution() {
  const db = new Database(DB_FILE);
  const now = Date.now();
  const tokenHash = createHash('sha256').update(RAW_SESSION).digest('hex');
  db.prepare('INSERT OR REPLACE INTO session (token_hash, email, created_at, expires_at, last_seen_at) VALUES (?,?,?,?,?)')
    .run(tokenHash, EMMANUEL, now, now + 30 * 86400000, now);
  // Attribution de demo confirmable (en_attente + redirection suivie) pour PAR-EMMANUEL.
  db.prepare(
    `INSERT INTO attribution (attribution_id, offre_id, parrain_id, lien_id, token, canal_source, origine_detectee, statut, date_generation, date_redirection, date_expiration, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(randomUUID(), 'REF-001', 'PAR-EMMANUEL', 'LP-PAR-EMMANUEL-REF-001', 'visual-' + randomUUID().slice(0, 8), 'page_web', 'chatgpt', 'en_attente', now - 5 * 86400000, now - 4 * 86400000, now + 60 * 86400000, now);
  db.close();
}

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
      /* pas pret */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  seedSessionAndAttribution();
  const server = spawn('npx', ['next', 'start', '-p', PORT], { stdio: 'ignore', env: { ...process.env } });

  try {
    if (!(await waitForServer())) { console.error('Serveur non demarre.'); process.exit(1); }
    const executablePath = resolveChromium();
    const browser = await chromium.launch(executablePath ? { executablePath } : {});

    const pages = [
      { name: 'parrain-dashboard', path: '/parrain/tableau-de-bord', modal: false },
      { name: 'parrain-attributions', path: '/parrain/attributions', modal: false },
    ];

    for (const page of pages) {
      for (const device of DEVICES) {
        const ctx = await browser.newContext({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 2 });
        await ctx.addCookies([{ name: 'parrainly_session', value: RAW_SESSION, url: BASE }]);
        await ctx.addInitScript(() => { try { localStorage.setItem('parrainly-consent', JSON.stringify({ choice: 'refused', ts: Date.now() })); } catch {} });
        const p = await ctx.newPage();
        await p.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle' });
        await p.waitForTimeout(500);
        await p.screenshot({ path: join(OUT, `${page.name}-${device.name}.png`), fullPage: true });
        console.log(`OK ${page.name}-${device.name}.png`);
        await ctx.close();
      }
    }

    // Modal US-09 (desktop) : ouvre le modal de confirmation.
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await ctx.addCookies([{ name: 'parrainly_session', value: RAW_SESSION, url: BASE }]);
    await ctx.addInitScript(() => { try { localStorage.setItem('parrainly-consent', JSON.stringify({ choice: 'refused', ts: Date.now() })); } catch {} });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/parrain/attributions`, { waitUntil: 'networkidle' });
    const btn = p.getByRole('button', { name: 'Confirmer la conversion' }).first();
    if (await btn.count()) {
      await btn.click();
      await p.waitForTimeout(400);
      await p.screenshot({ path: join(OUT, 'parrain-attributions-modal-desktop.png') });
      console.log('OK parrain-attributions-modal-desktop.png');
    }
    await ctx.close();

    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
