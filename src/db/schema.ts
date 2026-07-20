/**
 * Schema Drizzle — Parrainly.
 *
 * ==> A REMPLIR PAR @fullstack (Phase 2, socle demandeur). <==
 *
 * Dialecte du squelette : SQLite (drizzle-orm/sqlite-core) — meme dialecte en dev (better-sqlite3)
 * et en prod Cloudflare D1. Si une bascule Neon/Postgres est decidee, remplacer les imports par
 * `drizzle-orm/pg-core` et ajuster drizzle.config.ts (dialect: 'postgresql') + src/db/index.ts.
 *
 * 3 objets metier a definir ici (modele de donnees : docs/product/functional-specs.md,
 * schema 20 champs "Schema_MCP" de project-context.md, donnees reelles data/base-parrainage.json) :
 *
 *   1. programme / offre  — les 9 programmes (Trade Republic, Qonto, ...), champs de base-parrainage.json
 *                           (id, nom_programme, categorie, url_parrainage, code_parrainage, avantage_*,
 *                            conditions, statut, priorite_affichage, date_verification, source, ...).
 *   2. parrain            — en V1, cercle ferme Thomas & Emmanuel (rotation entre leurs 2 jeux de liens
 *                           pour respecter les plafonds par enseigne).
 *   3. attribution        — coeur du tracking IA->conversion : token (=> /r/{token}), parrain_id_attribue,
 *                           offre_id, statut, origine_detectee, dates. Alimente le NSM (PCA-IA).
 *
 * Exemple minimal de forme attendue (a supprimer / remplacer) :
 *
 *   import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
 *   export const offre = sqliteTable('offre', {
 *     id: text('id').primaryKey(),
 *     nomProgramme: text('nom_programme').notNull(),
 *     // ...
 *   });
 *
 * Le fichier est volontairement vide de tables pour que `npm run build` passe des maintenant.
 * NE PAS retirer ce fichier : il est la source de verite importee par src/db/index.ts et drizzle.config.ts.
 */

export {};
