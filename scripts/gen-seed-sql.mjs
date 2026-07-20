/**
 * Generateur de seed SQL pour Cloudflare D1 (chemin de seed prod, equivalent de scripts/seed.mjs).
 *
 * scripts/seed.mjs cible better-sqlite3 (dev/test, driver synchrone) et n'est pas executable sur D1.
 * Ce script produit `drizzle/seed.sql`, un fichier SQL pur (INSERT ... ON CONFLICT idempotents) que
 * l'on applique sur D1 via wrangler :
 *   - local  : npm run d1:seed:local   (wrangler d1 execute parrainly-db --local  --file=./scripts/seed.sql)
 *   - remote : npm run d1:seed:remote  (wrangler d1 execute parrainly-db --remote --file=./scripts/seed.sql)
 *
 * IMPORTANT : le fichier est ecrit dans scripts/ (PAS dans drizzle/), sinon `wrangler d1 migrations
 * apply` le traiterait comme une migration (drizzle/ = migrations_dir). Seed et migrations sont disjoints.
 *
 * Source UNIQUE : data/base-parrainage.json (jamais le .xlsx). Meme logique metier que seed.mjs :
 *   - normalisation du statut (restreint si SOCLE_NON_PUBLIC_PROGRAMS), garde-fou enum ;
 *   - divulgation / mention de risque / non-affiliation calculees depuis les gabarits legal ;
 *   - 9 offres reelles + 9 liens d'Emmanuel + 2 parrains (cercle ferme T&E).
 *
 * Timestamps : expression SQL `(unixepoch() * 1000)` -> aucune valeur figee dans le fichier commite.
 * Emails parrain : lus depuis AUTH_THOMAS_EMAIL / AUTH_EMMANUEL_EMAIL (defauts .test). Pour la prod,
 * regenerer avec les vraies adresses : AUTH_THOMAS_EMAIL=... AUTH_EMMANUEL_EMAIL=... npm run d1:gen-seed
 *
 * Idempotent : ON CONFLICT(id) DO UPDATE. Les quotas/dates de tour d'un lien existant sont PRESERVES.
 *
 * Usage : npm run d1:gen-seed
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const NON_PUBLIC = (process.env.SOCLE_NON_PUBLIC_PROGRAMS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const OFFRE_STATUTS = new Set([
  'actif', 'restreint', 'en_attente_verification', 'suspendu', 'retire', 'expire', 'en_attente_parrain',
]);
const CRYPTO_CATS = new Set(['Crypto']);
const INVEST_CATS = new Set(['Finance personnelle', 'Investissement', 'Gestion de patrimoine', 'Placement trésorerie']);

const THOMAS_EMAIL = (process.env.AUTH_THOMAS_EMAIL ?? 'thomas@parrainly.test').toLowerCase();
const EMMANUEL_EMAIL = (process.env.AUTH_EMMANUEL_EMAIL ?? 'emmanuel@parrainly.test').toLowerCase();

/** Echappe une valeur SQL : NULL si null/undefined, sinon chaine quotee (simple quote doublee). */
function sql(v) {
  if (v === null || v === undefined || v === '') return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}
function num(v, fallback) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeStatut(raw, nomProgramme) {
  if (NON_PUBLIC.includes(String(nomProgramme).toLowerCase())) return 'restreint';
  const map = { 'expiré': 'expire', 'expire': 'expire', 'suspendu': 'suspendu', 'actif': 'actif' };
  const val = map[String(raw).toLowerCase()] ?? String(raw);
  return OFFRE_STATUTS.has(val) ? val : 'en_attente_verification';
}
function mentionRisque(categorie) {
  if (CRYPTO_CATS.has(categorie)) return 'Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier.';
  if (INVEST_CATS.has(categorie)) return 'Investir comporte des risques de perte en capital.';
  return null;
}

function main() {
  const data = JSON.parse(readFileSync(join(ROOT, 'data', 'base-parrainage.json'), 'utf-8'));
  const programmes = Array.isArray(data.Programmes) ? data.Programmes : [];
  if (programmes.length === 0) {
    console.error('Aucun programme dans data/base-parrainage.json — abandon.');
    process.exit(1);
  }

  const TS = '(unixepoch() * 1000)'; // epoch ms, cote D1/SQLite, evalue a l'execution
  const lines = [];
  lines.push('-- Seed D1 Parrainly — GENERE par scripts/gen-seed-sql.mjs (ne pas editer a la main).');
  lines.push('-- Source : data/base-parrainage.json. Idempotent (ON CONFLICT DO UPDATE).');
  lines.push('-- Applique via : npm run d1:seed:local | d1:seed:remote');
  lines.push('PRAGMA foreign_keys = ON;');
  lines.push('');

  // Parrains (cercle ferme T&E).
  lines.push("INSERT INTO parrain (id, nom, email, statut, created_at) VALUES");
  lines.push(`  ('PAR-EMMANUEL', 'Emmanuel', ${sql(EMMANUEL_EMAIL)}, 'actif', ${TS}),`);
  lines.push(`  ('PAR-THOMAS', 'Thomas', ${sql(THOMAS_EMAIL)}, 'actif', ${TS})`);
  lines.push('ON CONFLICT(id) DO UPDATE SET nom=excluded.nom, email=excluded.email;');
  lines.push('');

  for (const p of programmes) {
    const statut = normalizeStatut(p.statut, p.nom_programme);
    const priorite = num(p.priorite_affichage, 99);
    const divulgation = `Lien de parrainage ${p.nom_programme} : l'éditeur de ce site perçoit un avantage si vous l'utilisez pour vous inscrire.`;
    const nonAffil = `Parrainly n'est pas affilié officiellement à ${p.nom_programme}.`;
    const risque = mentionRisque(p.categorie);

    lines.push(`-- ${p.id} ${p.nom_programme} (${statut})`);
    lines.push(
      'INSERT INTO offre (id, nom_programme, categorie, sous_categorie, cible, pays, langue, ' +
        'url_parrainage, code_parrainage, description_courte, avantage_filleul, avantage_parrain, ' +
        'conditions, statut, priorite_affichage, tags_mcp, date_ajout, date_verification, source, notes, ' +
        'divulgation_affiliation, mention_risque, mention_non_affiliation, created_at, updated_at) VALUES (' +
        `${sql(p.id)}, ${sql(p.nom_programme)}, ${sql(p.categorie)}, ${sql(p.sous_categorie)}, ${sql(p.cible)}, ` +
        `${sql(p.pays)}, ${sql(p.langue)}, ${sql(p.url_parrainage)}, ${sql(p.code_parrainage)}, ` +
        `${sql(p.description_courte)}, ${sql(p.avantage_filleul)}, ${sql(p.avantage_parrain)}, ${sql(p.conditions)}, ` +
        `${sql(statut)}, ${priorite}, ${sql(p.tags_mcp)}, ${sql(p.date_ajout)}, ${sql(p.date_verification)}, ` +
        `${sql(p.source)}, ${sql(p.notes)}, ${sql(divulgation)}, ${sql(risque)}, ${sql(nonAffil)}, ${TS}, ${TS})`,
    );
    lines.push(
      'ON CONFLICT(id) DO UPDATE SET nom_programme=excluded.nom_programme, categorie=excluded.categorie, ' +
        'sous_categorie=excluded.sous_categorie, cible=excluded.cible, pays=excluded.pays, langue=excluded.langue, ' +
        'url_parrainage=excluded.url_parrainage, code_parrainage=excluded.code_parrainage, ' +
        'description_courte=excluded.description_courte, avantage_filleul=excluded.avantage_filleul, ' +
        'avantage_parrain=excluded.avantage_parrain, conditions=excluded.conditions, statut=excluded.statut, ' +
        'priorite_affichage=excluded.priorite_affichage, tags_mcp=excluded.tags_mcp, date_ajout=excluded.date_ajout, ' +
        'date_verification=excluded.date_verification, source=excluded.source, notes=excluded.notes, ' +
        'divulgation_affiliation=excluded.divulgation_affiliation, mention_risque=excluded.mention_risque, ' +
        'mention_non_affiliation=excluded.mention_non_affiliation, updated_at=excluded.updated_at;',
    );

    // Lien reel d'Emmanuel (quota illimite NULL). quota_utilise / date_dernier_tour PRESERVES au re-seed.
    lines.push(
      'INSERT INTO lien_parrainage (id, parrain_id, offre_id, url_parrainage, code_parrainage, ' +
        'quota_max, quota_utilise, date_dernier_tour, date_reinitialisation, statut, created_at) VALUES (' +
        `'LP-PAR-EMMANUEL-${p.id}', 'PAR-EMMANUEL', ${sql(p.id)}, ${sql(p.url_parrainage)}, ` +
        `${sql(p.code_parrainage)}, NULL, 0, NULL, NULL, 'actif', ${TS})`,
    );
    lines.push(
      'ON CONFLICT(id) DO UPDATE SET url_parrainage=excluded.url_parrainage, code_parrainage=excluded.code_parrainage;',
    );
    lines.push('');
  }

  const out = join(ROOT, 'scripts', 'seed.sql');
  writeFileSync(out, lines.join('\n'), 'utf-8');
  console.log(`Seed SQL genere : scripts/seed.sql (${programmes.length} offres, ${programmes.length} liens, 2 parrains).`);
  console.log(`Emails parrain : Thomas=${THOMAS_EMAIL} Emmanuel=${EMMANUEL_EMAIL}`);
}

main();
