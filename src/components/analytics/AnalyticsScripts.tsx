'use client';

/**
 * Chargement CONDITIONNEL des scripts de mesure d'audience, apres consentement (CookieBanner).
 *
 * Aucun script tiers n'est injecte tant que l'utilisateur n'a pas accepte (opt-in CNIL strict). Le
 * script Plausible n'est ajoute qu'une fois, si un domaine est configure ET si le consentement est
 * donne. Reagit en direct au changement de choix (event window `parrainly:consent-changed`).
 *
 * Pilote sans domaine Plausible configure : le composant ne rend rien (no-op), aucune dependance externe.
 */
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { PLAUSIBLE_DOMAIN } from '@/config/analytics';
import { CONSENT_CHANGED_EVENT, hasAnalyticsConsent } from '@/lib/analytics-client';

export function AnalyticsScripts() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const sync = () => setConsent(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!consent || !PLAUSIBLE_DOMAIN) return null;

  // Le script Plausible expose window.plausible(event, { props }) une fois charge. trackClient
  // (lib/analytics-client) garde sur l'existence de cette fonction : aucun event n'est perdu par erreur.
  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.manual.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
