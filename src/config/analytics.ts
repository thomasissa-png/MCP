/**
 * Configuration analytics (sinks pluggables). Aucune valeur en dur : tout vient de l'env.
 *
 * Serveur (posthog-node)  : POSTHOG_KEY + POSTHOG_HOST (jamais exposes au client).
 * Client (Plausible)      : NEXT_PUBLIC_PLAUSIBLE_DOMAIN, charge UNIQUEMENT apres consentement cookies.
 * Client (PostHog, option): NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST.
 *
 * Le PILOTE tourne sans aucune de ces cles : le build et les tests ne dependent d'aucun compte externe.
 */

/* --- Serveur (posthog-node) --- */
export const POSTHOG_KEY = (process.env.POSTHOG_KEY ?? '').trim();
export const POSTHOG_HOST = (process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com').trim();

/* --- Client (exposes au navigateur, prefixe NEXT_PUBLIC) --- */
export const PLAUSIBLE_DOMAIN = (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '').trim();
export const PUBLIC_POSTHOG_KEY = (process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '').trim();
export const PUBLIC_POSTHOG_HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com').trim();
