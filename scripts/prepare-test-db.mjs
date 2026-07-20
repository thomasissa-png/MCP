/**
 * Prepare une base E2E propre et reproductible : recree le fichier, applique les migrations versionnees,
 * puis rejoue le seed reel (9 offres, liens Emmanuel, parrains T&E). Idempotent et rejouable a volonte.
 *
 * Lance par le webServer Playwright AVANT `next start` (chaine &&), garantissant que la DB existe et est
 * peuplee avant la premiere requete du serveur (corrige la flakiness du smoke : plus de DB vide/partielle).
 *
 * DATABASE_URL doit etre defini par l'appelant (ex. file:./drizzle/test-e2e.db).
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createAndMigrate, dbFileFromUrl } from '../tests/setup/apply-migrations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('prepare-test-db : DATABASE_URL manquant.');
  process.exit(1);
}

const file = dbFileFromUrl(url);
createAndMigrate(file);

// Rejoue le seed reel avec le meme environnement (DATABASE_URL + emails allowlist).
execFileSync('node', [join(ROOT, 'scripts', 'seed.mjs')], {
  stdio: 'inherit',
  env: process.env,
});

console.log(`prepare-test-db : base E2E prete (${file}).`);
