'use client';

/**
 * Analytics CLIENT (tracking-plan.md) — strictement conditionne au consentement cookies (CookieBanner).
 *
 * Aucun event n'est envoye tant que l'utilisateur n'a pas accepte (opt-in CNIL). Les sinks (Plausible,
 * PostHog client) ne sont charges qu'apres consentement (voir components/analytics/AnalyticsScripts).
 * Si aucun sink n'est configure (pilote), `trackClient` est un no-op silencieux : le build et les tests
 * ne dependent d'aucun compte externe.
 */

const CONSENT_STORAGE_KEY = 'parrainly-consent';

/** Nom de l'event window emis quand le choix de consentement change (ecoute par AnalyticsScripts). */
export const CONSENT_CHANGED_EVENT = 'parrainly:consent-changed';

/** Events CLIENT du tracking-plan (distincts des events serveur de lib/analytics.ts). */
export type ClientEvent =
  | 'page_offre_vue'
  | 'lien_parrainage_demande'
  | 'lien_parrainage_genere'
  | 'lien_parrainage_echec'
  | 'offre_indisponible_affichee'
  | 'dashboard_parrain_vu'
  | 'dashboard_parrain_erreur'
  | 'demande_rgpd_soumise'
  | 'demande_rgpd_traitee';

/** Vrai si l'utilisateur a explicitement accepte la mesure d'audience (opt-in). */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw) as { choice?: string };
    return saved.choice === 'accepted';
  } catch {
    return false;
  }
}

type PlausibleFn = (event: string, options?: { props?: Record<string, unknown> }) => void;
type PosthogClient = { capture: (event: string, props?: Record<string, unknown>) => void };

/**
 * Emet un event client si (et seulement si) le consentement est donne. Route vers les sinks presents
 * (Plausible et/ou PostHog client). Best-effort, jamais bloquant, jamais throw.
 */
export function trackClient(event: ClientEvent, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  try {
    const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
    if (plausible) plausible(event, Object.keys(props).length ? { props } : undefined);
  } catch {
    // best-effort
  }
  try {
    const posthog = (window as unknown as { posthog?: PosthogClient }).posthog;
    if (posthog) posthog.capture(event, props);
  } catch {
    // best-effort
  }
}
