/**
 * Schema Drizzle — Parrainly (socle demandeur, vague 2a).
 *
 * Dialecte SQLite (dev better-sqlite3 / prod Cloudflare D1) — le meme fichier sert les deux.
 *
 * 3 objets metier + 2 tables de liaison/tracking :
 *   - `offre`            : les 9 programmes reels (schema Emmanuel 20 champs) + champs de divulgation legal.
 *   - `parrain`          : cercle ferme Thomas & Emmanuel en V1.
 *   - `lienParrainage`   : liaison parrain <-> offre (un jeu de liens par parrain, avec quota propre).
 *                          C'est l'unite de rotation du moteur d'arbitrage (US-02 crit.2, US-03).
 *   - `attribution`      : coeur du tracking IA -> conversion (token /r/{token}, dates, statut).
 *   - `signalement`      : signalements de liens morts (US-06).
 *
 * Toutes les dates d'evenement sont stockees en integer timestamp_ms (epoch ms) pour la precision
 * et la compatibilite D1 ; les dates "metier" heritees du JSON (date_ajout, date_verification) restent
 * en texte ISO (YYYY-MM-DD) tel que fourni par la source.
 */
import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

/* -------------------------------------------------------------------------- */
/* Enums (listes fermees documentees)                                          */
/* -------------------------------------------------------------------------- */

/** Categories du Referentiel_Categories de data/base-parrainage.json. */
export const CATEGORIES = [
  'Finance personnelle',
  'Investissement',
  'Gestion de patrimoine',
  'Placement trésorerie',
  'Services entrepreneur',
  'Crypto',
  'Télécom & Énergie',
  'Mobilité',
] as const;

/**
 * Statuts d'une offre.
 * - `actif`                : diffusable publiquement + servable par /r et le moteur.
 * - `restreint`            : NON diffusable publiquement (CGU du programme l'interdisent, ex. decision
 *                            @legal Trade Republic / Kraken). Exclue du listing public ET /r renvoie la
 *                            page generique. Pilote par ce statut, jamais par un test en dur sur la marque.
 * - `en_attente_verification` : enregistree mais pas encore validee (US-07).
 * - `suspendu`             : retiree temporairement (US-07).
 * - `retire`               : retiree definitivement.
 * - `expire`               : fraicheur depassee (US-04, job automatise).
 * - `en_attente_parrain`   : plus aucun parrain eligible dans le pool (US-04 crit.3).
 */
export const OFFRE_STATUTS = [
  'actif',
  'restreint',
  'en_attente_verification',
  'suspendu',
  'retire',
  'expire',
  'en_attente_parrain',
] as const;

/** Statut d'un parrain (cercle ferme V1). */
export const PARRAIN_STATUTS = ['actif', 'suspendu'] as const;

/** Statut d'un lien parrain<->offre dans le pool de rotation. */
export const LIEN_STATUTS = ['actif', 'en_pause', 'suspendu', 'invalide'] as const;

/** Canal d'origine d'une attribution (US-01/US-03). */
export const CANAUX = ['page_web', 'api_json'] as const;

/** Origine IA detectee (tracking-plan §2.4). */
export const ORIGINES = [
  'chatgpt',
  'perplexity',
  'gemini',
  'claude',
  'copilot',
  'ia_non_identifiee',
  'direct_autre',
] as const;

/** Cycle de vie d'une attribution (tracking-plan §2.4 + US-09 garde-fou plausibilité). */
export const ATTRIBUTION_STATUTS = [
  'en_attente',
  'confirmee',
  'en_verification_manuelle',
  'rejetee',
  'expiree',
] as const;

/** Statut d'un signalement (US-06). */
export const SIGNALEMENT_STATUTS = ['ouvert', 'traite', 'rejete'] as const;

/* -------------------------------------------------------------------------- */
/* Table `offre` — schema Emmanuel 20 champs + divulgation legal                */
/* -------------------------------------------------------------------------- */

export const offre = sqliteTable('offre', {
  id: text('id').primaryKey(), // REF-001, ... (cle stable, jamais reutilisee)
  nomProgramme: text('nom_programme').notNull(),
  categorie: text('categorie', { enum: CATEGORIES }).notNull(),
  sousCategorie: text('sous_categorie'),
  cible: text('cible'),
  pays: text('pays'),
  langue: text('langue'),
  urlParrainage: text('url_parrainage').notNull(),
  codeParrainage: text('code_parrainage'),
  descriptionCourte: text('description_courte'),
  avantageFilleul: text('avantage_filleul'),
  avantageParrain: text('avantage_parrain'),
  conditions: text('conditions'),
  statut: text('statut', { enum: OFFRE_STATUTS }).notNull().default('en_attente_verification'),
  prioriteAffichage: integer('priorite_affichage').notNull().default(99),
  tagsMcp: text('tags_mcp'),
  dateAjout: text('date_ajout'), // ISO YYYY-MM-DD (source)
  dateVerification: text('date_verification'), // ISO YYYY-MM-DD — champ critique fraicheur (US-04)
  source: text('source'),
  notes: text('notes'),
  // Divulgation embarquee (docs/legal/textes/08). Calculee a l'import depuis les gabarits legal.
  divulgationAffiliation: text('divulgation_affiliation'),
  mentionRisque: text('mention_risque'),
  mentionNonAffiliation: text('mention_non_affiliation'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

/* -------------------------------------------------------------------------- */
/* Table `parrain` — cercle ferme Thomas & Emmanuel                             */
/* -------------------------------------------------------------------------- */

export const parrain = sqliteTable('parrain', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  email: text('email'), // nullable en V1 ; support magic-link (P1-a) plus tard
  statut: text('statut', { enum: PARRAIN_STATUTS }).notNull().default('actif'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

/* -------------------------------------------------------------------------- */
/* Table `lien_parrainage` — unite de rotation (parrain x offre, quota propre)   */
/* -------------------------------------------------------------------------- */

export const lienParrainage = sqliteTable(
  'lien_parrainage',
  {
    id: text('id').primaryKey(),
    parrainId: text('parrain_id')
      .notNull()
      .references(() => parrain.id),
    offreId: text('offre_id')
      .notNull()
      .references(() => offre.id),
    urlParrainage: text('url_parrainage').notNull(), // cible reelle du 301 pour ce parrain
    codeParrainage: text('code_parrainage'),
    // Plafond anti-fraude (US-03). NULL = illimite. Renseigne par T&E via US-02 (jamais parse du texte libre).
    quotaMax: integer('quota_max'),
    quotaUtilise: integer('quota_utilise').notNull().default(0),
    // FIFO pondere : le lien dont dateDernierTour est la plus ancienne (ou NULL) est servi en priorite.
    dateDernierTour: integer('date_dernier_tour', { mode: 'timestamp_ms' }),
    dateReinitialisation: text('date_reinitialisation'), // ISO — reset periodique du quota (US-02 crit.9)
    statut: text('statut', { enum: LIEN_STATUTS }).notNull().default('actif'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  },
  (t) => ({
    // Un seul lien par couple (parrain, offre).
    parrainOffreUnique: uniqueIndex('lien_parrain_offre_unique').on(t.parrainId, t.offreId),
    offreIdx: index('lien_offre_idx').on(t.offreId),
  }),
);

/* -------------------------------------------------------------------------- */
/* Table `attribution` — tracking IA -> conversion (tracking-plan §2.4)          */
/* -------------------------------------------------------------------------- */

export const attribution = sqliteTable(
  'attribution',
  {
    attributionId: text('attribution_id').primaryKey(),
    offreId: text('offre_id')
      .notNull()
      .references(() => offre.id),
    parrainId: text('parrain_id')
      .notNull()
      .references(() => parrain.id),
    lienId: text('lien_id').references(() => lienParrainage.id),
    token: text('token').notNull().unique(), // survit dans le CHEMIN de /r/{token}
    canalSource: text('canal_source', { enum: CANAUX }).notNull().default('page_web'),
    origineDetectee: text('origine_detectee', { enum: ORIGINES }).notNull().default('direct_autre'),
    statut: text('statut', { enum: ATTRIBUTION_STATUTS }).notNull().default('en_attente'),
    sessionId: text('session_id'), // identifiant anonyme, jamais civil (RGPD, US-01 crit.8)
    dateGeneration: integer('date_generation', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
    dateRedirection: integer('date_redirection', { mode: 'timestamp_ms' }), // NULL tant que jamais clique
    referrerRedirection: text('referrer_redirection'),
    dateExpiration: integer('date_expiration', { mode: 'timestamp_ms' }), // fenetre de conversion (configurable)
    dateConfirmation: integer('date_confirmation', { mode: 'timestamp_ms' }),
    delaiConfirmationJ: integer('delai_confirmation_j'),
    modeConfirmation: text('mode_confirmation'), // declaratif_parrain | webhook_enseigne
    montantCommission: real('montant_commission'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  },
  (t) => ({
    tokenIdx: index('attribution_token_idx').on(t.token),
    offreIdx: index('attribution_offre_idx').on(t.offreId),
  }),
);

/* -------------------------------------------------------------------------- */
/* Table `signalement` — liens morts signales par les demandeurs (US-06)         */
/* -------------------------------------------------------------------------- */

export const signalement = sqliteTable(
  'signalement',
  {
    id: text('id').primaryKey(),
    attributionId: text('attribution_id').references(() => attribution.attributionId),
    offreId: text('offre_id').references(() => offre.id),
    sessionId: text('session_id'), // anonyme (US-06 crit.8) ; sert a la deduplication (crit.7)
    statut: text('statut', { enum: SIGNALEMENT_STATUTS }).notNull().default('ouvert'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  },
  (t) => ({
    attributionIdx: index('signalement_attribution_idx').on(t.attributionId),
  }),
);

/* -------------------------------------------------------------------------- */
/* Auth magic-link (espace parrain, cercle ferme T&E)                           */
/* -------------------------------------------------------------------------- */

/**
 * Token de connexion a usage unique (magic link). On stocke le HASH SHA-256 du token, jamais le token
 * brut (le token brut ne vit que dans l'URL envoyee par email). Validite courte (config), usage unique.
 */
export const magicLinkToken = sqliteTable(
  'magic_link_token',
  {
    tokenHash: text('token_hash').primaryKey(),
    email: text('email').notNull(),
    returnTo: text('return_to'), // page a rejoindre apres connexion (facultatif)
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    consumedAt: integer('consumed_at', { mode: 'timestamp_ms' }), // NULL = jamais utilise
  },
  (t) => ({ emailIdx: index('magic_link_email_idx').on(t.email) }),
);

/**
 * Session parrain. Stocke le HASH du token de session (le brut est dans le cookie httpOnly).
 * Duree glissante (config) : `expiresAt` repousse a chaque acces valide.
 */
export const session = sqliteTable(
  'session',
  {
    tokenHash: text('token_hash').primaryKey(),
    email: text('email').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  },
  (t) => ({ emailIdx: index('session_email_idx').on(t.email) }),
);

/* -------------------------------------------------------------------------- */
/* Types inferes (consommes par lib/ et les route handlers)                     */
/* -------------------------------------------------------------------------- */

export type Offre = typeof offre.$inferSelect;
export type NewOffre = typeof offre.$inferInsert;
export type Parrain = typeof parrain.$inferSelect;
export type LienParrainage = typeof lienParrainage.$inferSelect;
export type Attribution = typeof attribution.$inferSelect;
export type NewAttribution = typeof attribution.$inferInsert;
export type Signalement = typeof signalement.$inferSelect;
export type MagicLinkToken = typeof magicLinkToken.$inferSelect;
export type Session = typeof session.$inferSelect;
