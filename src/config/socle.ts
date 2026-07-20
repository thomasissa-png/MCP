/**
 * Configuration du socle demandeur (vague 2a).
 *
 * REGLE : aucun seuil metier n'est code en dur dans la logique. Tout est ici, surchargeable par env.
 * Les valeurs par defaut sont des `[HYPOTHESE]` documentees (specs US-04/US-09, tracking-plan §2.5),
 * a confirmer par @data-analyst / @product-manager avant prod.
 */

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Longueur du token de redirection /r/{token} (tracking-plan §2.5 : 6-8 caracteres). */
export const TOKEN_LENGTH = intFromEnv('SOCLE_TOKEN_LENGTH', 8);

/** Fenetre de conversion en jours entre generation et confirmation (tracking-plan §2.5). */
export const CONVERSION_WINDOW_DAYS = intFromEnv('SOCLE_CONVERSION_WINDOW_DAYS', 60);

/**
 * Fraicheur maximale d'une offre en jours (US-04). Au-dela de ce delai depuis `date_verification`,
 * une offre `actif` passe `expire`. A la limite exacte = expiree (US-04 crit.7, principe de precaution).
 */
export const FRESHNESS_MAX_DAYS = intFromEnv('SOCLE_FRESHNESS_MAX_DAYS', 30);

/**
 * Programmes NON diffusables publiquement, pilotes par CONFIG (jamais par un test en dur sur la marque).
 *
 * DECISION FONDATEUR (pilote) : la restriction Trade Republic / Kraken (CGU interdisant la diffusion
 * publique) est REPORTEE a une revue juridique finale et ne s'applique PAS au pilote. Le seed importe
 * donc le `statut` REEL du JSON pour les 9 offres (aucune restriction artificielle) -> defaut vide.
 *
 * Le levier reste disponible : tout programme liste ici recoit le statut `restreint` a l'import, ce qui
 * l'exclut du listing public ET fait renvoyer la page generique par /r/{token}. C'est le SEUL mecanisme,
 * generique et pilote par statut. Surchargeable via SOCLE_NON_PUBLIC_PROGRAMS (virgules, casse ignoree).
 */
export const NON_PUBLIC_PROGRAMS: readonly string[] = (process.env.SOCLE_NON_PUBLIC_PROGRAMS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/**
 * Cle d'authentification des routes internes (/internal/*). En dev (variable absente), les routes
 * internes sont ouvertes pour faciliter le smoke test, avec un warning. En PROD, la variable DOIT
 * etre definie : sans elle, les routes internes sont FERMEES (fail-closed, 401) — jamais ouvertes.
 */
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? '';

/** Vrai en production (bascule le regime de securite de fail-open dev vers fail-closed prod). */
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/* -------------------------------------------------------------------------- */
/* Anti-abus attribution publique (POST /api/v1/offres/{id}/attribution)        */
/* Objectif : proteger le quota T&E (fondation du modele de rotation) contre    */
/* l'epuisement par appels repetes. Seuils CONFIGURABLES (jamais en dur).       */
/* -------------------------------------------------------------------------- */

/** Nombre max de generations de lien par fenetre glissante et par source (IP + session anonyme). */
export const ATTRIBUTION_RATE_MAX = intFromEnv('SOCLE_ATTRIBUTION_RATE_MAX', 10);

/** Largeur de la fenetre glissante du rate-limit d'attribution, en secondes (defaut 60 s). */
export const ATTRIBUTION_RATE_WINDOW_SECONDS = intFromEnv('SOCLE_ATTRIBUTION_RATE_WINDOW_SECONDS', 60);

/**
 * Fenetre de deduplication serveur (secondes) : dans cet intervalle, une meme source qui redemande
 * un lien pour la MEME offre recoit le lien deja genere au lieu d'en creer un nouveau (evite de
 * consommer du quota sur un rechargement / double appel non couvert par la dedup client). Defaut 30 s.
 */
export const ATTRIBUTION_DEDUP_WINDOW_SECONDS = intFromEnv('SOCLE_ATTRIBUTION_DEDUP_WINDOW_SECONDS', 30);

/* -------------------------------------------------------------------------- */
/* Signalement de lien mort (US-06) — dedup + seuil de re-verification          */
/* -------------------------------------------------------------------------- */

/**
 * Fenetre de deduplication d'un signalement (secondes) : un meme signalement (offre + source/IP)
 * dans cette fenetre est ignore (idempotent, US-06 crit.7). Defaut 3600 s (1 h).
 */
export const SIGNALEMENT_DEDUP_WINDOW_SECONDS = intFromEnv('SOCLE_SIGNALEMENT_DEDUP_WINDOW_SECONDS', 3600);

/**
 * Seuil de signalements distincts sur une meme offre (dans la fenetre de re-verification) au-dela
 * duquel l'event `lien_priorite_reverification` est emis (priorise le controle manuel). Defaut 3.
 */
export const SIGNALEMENT_REVERIFICATION_THRESHOLD = intFromEnv('SOCLE_SIGNALEMENT_REVERIFICATION_THRESHOLD', 3);

/** Fenetre glissante (secondes) sur laquelle on compte les signalements pour le seuil ci-dessus. Defaut 7 j. */
export const SIGNALEMENT_REVERIFICATION_WINDOW_SECONDS = intFromEnv('SOCLE_SIGNALEMENT_REVERIFICATION_WINDOW_SECONDS', 604800);

/* -------------------------------------------------------------------------- */
/* Contact legal (pages CGU / divulgation)                                      */
/* -------------------------------------------------------------------------- */

/**
 * Adresse de contact affichee sur les pages legales. Si NON definie, les pages rendent un lien vers
 * le formulaire /rgpd/demande — JAMAIS de crochet placeholder (garde-fou G15). Valeur reelle a
 * confirmer a la revue juridique finale (voir .env.example : LEGAL_CONTACT_EMAIL).
 */
export const LEGAL_CONTACT_EMAIL = (process.env.LEGAL_CONTACT_EMAIL ?? '').trim();

/** URL publique de base pour composer les liens /r/{token} et les liens magiques. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/* -------------------------------------------------------------------------- */
/* Auth magic-link (espace parrain, cercle ferme T&E) — spec auth-parrain-*.md  */
/* -------------------------------------------------------------------------- */

/**
 * Comptes autorises (allowlist stricte). Emails configurables par env (jamais de vrais emails inventes
 * en dur : defauts `.test`, a remplacer par les vraies adresses via AUTH_THOMAS_EMAIL / AUTH_EMMANUEL_EMAIL).
 * L'id correspond au parrain seede (PAR-THOMAS / PAR-EMMANUEL) : la session mappe email -> parrain.
 */
export const PARRAIN_ACCOUNTS: { email: string; nom: string; id: string }[] = [
  { email: (process.env.AUTH_THOMAS_EMAIL ?? 'thomas@parrainly.test').toLowerCase(), nom: 'Thomas', id: 'PAR-THOMAS' },
  { email: (process.env.AUTH_EMMANUEL_EMAIL ?? 'emmanuel@parrainly.test').toLowerCase(), nom: 'Emmanuel', id: 'PAR-EMMANUEL' },
];

export function findParrainAccount(email: string): { email: string; nom: string; id: string } | undefined {
  const e = email.trim().toLowerCase();
  return PARRAIN_ACCOUNTS.find((a) => a.email === e);
}

/** Validite d'un lien magique (spec §4 point 1, defaut 15 min, usage unique). */
export const MAGIC_LINK_TTL_MINUTES = intFromEnv('AUTH_MAGIC_LINK_TTL_MINUTES', 15);

/** Duree de session glissante (spec §4 point 2, defaut 30 jours), cookie httpOnly/secure/sameSite=strict. */
export const SESSION_TTL_DAYS = intFromEnv('AUTH_SESSION_TTL_DAYS', 30);

/** Cooldown entre deux demandes de lien pour un meme email (spec §4 point 3, defaut 60 s). */
export const MAGIC_LINK_COOLDOWN_SECONDS = intFromEnv('AUTH_MAGIC_LINK_COOLDOWN_SECONDS', 60);

/** Nombre maximum de demandes de lien par heure glissante et par email (spec §4 point 3, defaut 5). */
export const MAGIC_LINK_MAX_PER_HOUR = intFromEnv('AUTH_MAGIC_LINK_MAX_PER_HOUR', 5);

/** Nom du cookie de session. */
export const SESSION_COOKIE = 'parrainly_session';

/** Transport d'envoi d'email : 'console' (pilote, log le lien) ou 'resend' (prod, RESEND_API_KEY). */
export const MAILER_TRANSPORT = process.env.MAILER_TRANSPORT ?? 'console';

/* -------------------------------------------------------------------------- */
/* Confirmation de conversion (US-09) — seuils configurables                    */
/* -------------------------------------------------------------------------- */

/** Fenetre de plausibilite (jours glissants) : confirmations <= redirections suivies (tracking §2.7). */
export const PLAUSIBILITY_WINDOW_DAYS = intFromEnv('SOCLE_PLAUSIBILITY_WINDOW_DAYS', 30);
