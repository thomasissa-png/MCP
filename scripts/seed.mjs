/**
 * Seed idempotent du socle demandeur.
 *
 * Source UNIQUE : data/base-parrainage.json (jamais le .xlsx). Rejouable sans effet de bord :
 *   - offre / parrain / lien : INSERT ... ON CONFLICT(id) DO UPDATE (les compteurs de quota et le
 *     dateDernierTour d'un lien existant sont PRESERVES, jamais remis a zero par un re-seed).
 *
 * Zero donnee inventee : les 9 offres et leurs liens viennent du JSON reel. Thomas est cree comme
 * parrain du cercle ferme mais SANS lien (ses URLs ne sont pas dans la source -> non inventees). Le
 * jeu de 9 liens reels appartient a Emmanuel (source Linktree EmelGoez). La rotation T&E (US-03)
 * s'activera quand les liens de Thomas seront saisis via le back-office (US-02, vague 2b).
 *
 * Champs de divulgation (docs/legal/textes/08) calcules depuis les gabarits legal, pas stockes a la main.
 *
 * Usage : npm run db:seed
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function resolveDbFile() {
  const url = process.env.DATABASE_URL ?? 'file:./drizzle/local.db';
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}

// Programmes non diffusables (pilote par config, defaut vide : aucune restriction pour le pilote).
const NON_PUBLIC = (process.env.SOCLE_NON_PUBLIC_PROGRAMS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Enum de statut offre du schema (garde-fou : toute valeur JSON hors liste retombe sur en_attente_verification).
const OFFRE_STATUTS = new Set([
  'actif',
  'restreint',
  'en_attente_verification',
  'suspendu',
  'retire',
  'expire',
  'en_attente_parrain',
]);

const CRYPTO_CATS = new Set(['Crypto']);
const INVEST_CATS = new Set([
  'Finance personnelle',
  'Investissement',
  'Gestion de patrimoine',
  'Placement trésorerie',
]);

function normalizeStatut(raw, nomProgramme) {
  if (NON_PUBLIC.includes(String(nomProgramme).toLowerCase())) return 'restreint';
  const map = { 'expiré': 'expire', 'expire': 'expire', 'suspendu': 'suspendu', 'actif': 'actif' };
  const v = map[String(raw).toLowerCase()] ?? String(raw);
  return OFFRE_STATUTS.has(v) ? v : 'en_attente_verification';
}

function mentionRisque(categorie) {
  if (CRYPTO_CATS.has(categorie)) {
    return 'Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier.';
  }
  if (INVEST_CATS.has(categorie)) {
    return 'Investir comporte des risques de perte en capital.';
  }
  return null;
}

function main() {
  const jsonPath = join(ROOT, 'data', 'base-parrainage.json');
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const programmes = Array.isArray(data.Programmes) ? data.Programmes : [];
  if (programmes.length === 0) {
    console.error('Aucun programme trouve dans data/base-parrainage.json — abandon.');
    process.exit(1);
  }

  const db = new Database(resolveDbFile());
  db.pragma('foreign_keys = ON');

  const now = Date.now();

  const upsertOffre = db.prepare(`
    INSERT INTO offre (
      id, nom_programme, categorie, sous_categorie, cible, pays, langue,
      url_parrainage, code_parrainage, description_courte, avantage_filleul, avantage_parrain,
      conditions, statut, priorite_affichage, tags_mcp, date_ajout, date_verification, source, notes,
      divulgation_affiliation, mention_risque, mention_non_affiliation, created_at, updated_at
    ) VALUES (
      @id, @nom_programme, @categorie, @sous_categorie, @cible, @pays, @langue,
      @url_parrainage, @code_parrainage, @description_courte, @avantage_filleul, @avantage_parrain,
      @conditions, @statut, @priorite_affichage, @tags_mcp, @date_ajout, @date_verification, @source, @notes,
      @divulgation_affiliation, @mention_risque, @mention_non_affiliation, @created_at, @updated_at
    )
    ON CONFLICT(id) DO UPDATE SET
      nom_programme=excluded.nom_programme, categorie=excluded.categorie,
      sous_categorie=excluded.sous_categorie, cible=excluded.cible, pays=excluded.pays,
      langue=excluded.langue, url_parrainage=excluded.url_parrainage,
      code_parrainage=excluded.code_parrainage, description_courte=excluded.description_courte,
      avantage_filleul=excluded.avantage_filleul, avantage_parrain=excluded.avantage_parrain,
      conditions=excluded.conditions, statut=excluded.statut,
      priorite_affichage=excluded.priorite_affichage, tags_mcp=excluded.tags_mcp,
      date_ajout=excluded.date_ajout, date_verification=excluded.date_verification,
      source=excluded.source, notes=excluded.notes,
      divulgation_affiliation=excluded.divulgation_affiliation,
      mention_risque=excluded.mention_risque, mention_non_affiliation=excluded.mention_non_affiliation,
      updated_at=excluded.updated_at
  `);

  const upsertParrain = db.prepare(`
    INSERT INTO parrain (id, nom, email, statut, created_at)
    VALUES (@id, @nom, @email, @statut, @created_at)
    ON CONFLICT(id) DO UPDATE SET nom=excluded.nom, email=excluded.email
  `);

  // Emails de l'allowlist auth (config/socle.ts). Defauts .test, surchargeables par env.
  const THOMAS_EMAIL = (process.env.AUTH_THOMAS_EMAIL ?? 'thomas@parrainly.test').toLowerCase();
  const EMMANUEL_EMAIL = (process.env.AUTH_EMMANUEL_EMAIL ?? 'emmanuel@parrainly.test').toLowerCase();

  const upsertLien = db.prepare(`
    INSERT INTO lien_parrainage (
      id, parrain_id, offre_id, url_parrainage, code_parrainage,
      quota_max, quota_utilise, date_dernier_tour, date_reinitialisation, statut, created_at
    ) VALUES (
      @id, @parrain_id, @offre_id, @url_parrainage, @code_parrainage,
      @quota_max, 0, NULL, NULL, 'actif', @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      url_parrainage=excluded.url_parrainage, code_parrainage=excluded.code_parrainage
      -- quota_utilise / date_dernier_tour PRESERVES (jamais remis a zero par un re-seed)
  `);

  const EMMANUEL = 'PAR-EMMANUEL';
  const THOMAS = 'PAR-THOMAS';

  const run = db.transaction(() => {
    // Cercle ferme T&E.
    upsertParrain.run({ id: EMMANUEL, nom: 'Emmanuel', email: EMMANUEL_EMAIL, statut: 'actif', created_at: now });
    upsertParrain.run({ id: THOMAS, nom: 'Thomas', email: THOMAS_EMAIL, statut: 'actif', created_at: now });

    for (const p of programmes) {
      const statut = normalizeStatut(p.statut, p.nom_programme);
      const priorite = Number.parseInt(p.priorite_affichage, 10);
      upsertOffre.run({
        id: p.id,
        nom_programme: p.nom_programme,
        categorie: p.categorie,
        sous_categorie: p.sous_categorie ?? null,
        cible: p.cible ?? null,
        pays: p.pays ?? null,
        langue: p.langue ?? null,
        url_parrainage: p.url_parrainage,
        code_parrainage: p.code_parrainage ?? null,
        description_courte: p.description_courte ?? null,
        avantage_filleul: p.avantage_filleul ?? null,
        avantage_parrain: p.avantage_parrain ?? null,
        conditions: p.conditions ?? null,
        statut,
        priorite_affichage: Number.isFinite(priorite) ? priorite : 99,
        tags_mcp: p.tags_mcp ?? null,
        date_ajout: p.date_ajout ?? null,
        date_verification: p.date_verification ?? null,
        source: p.source ?? null,
        notes: p.notes ?? null,
        divulgation_affiliation: `Lien de parrainage ${p.nom_programme} : Parrainly perçoit un avantage personnel (Thomas ou Emmanuel) si vous l'utilisez pour vous inscrire.`,
        mention_risque: mentionRisque(p.categorie),
        mention_non_affiliation: `Parrainly n'est pas affilié officiellement à ${p.nom_programme}.`,
        created_at: now,
        updated_at: now,
      });

      // Lien reel appartenant a Emmanuel (source Linktree EmelGoez). Quota illimite (NULL) par defaut.
      upsertLien.run({
        id: `LP-${EMMANUEL}-${p.id}`,
        parrain_id: EMMANUEL,
        offre_id: p.id,
        url_parrainage: p.url_parrainage,
        code_parrainage: p.code_parrainage ?? null,
        quota_max: null,
        created_at: now,
      });
    }
  });

  run();

  const offres = db.prepare('SELECT id, nom_programme, statut, priorite_affichage FROM offre ORDER BY id').all();
  const nbLiens = db.prepare('SELECT COUNT(*) AS n FROM lien_parrainage').get().n;
  const nbParrains = db.prepare('SELECT COUNT(*) AS n FROM parrain').get().n;

  console.log(`Seed termine : ${offres.length} offres importees, ${nbLiens} liens, ${nbParrains} parrains.`);
  for (const o of offres) {
    console.log(`  ${o.id.padEnd(8)} ${o.nom_programme.padEnd(18)} statut=${o.statut} priorite=${o.priorite_affichage}`);
  }

  db.close();
}

main();
