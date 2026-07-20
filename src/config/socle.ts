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

/** URL publique de base pour composer les liens /r/{token}. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
