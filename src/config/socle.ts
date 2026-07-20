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
 * internes sont ouvertes pour faciliter le smoke test, avec un warning. En prod, la variable DOIT
 * etre definie (wrangler secret) : sans elle, les routes internes restent ouvertes -> a configurer.
 */
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? '';

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
