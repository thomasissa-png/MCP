'use client';

/**
 * Bandeau cookies conforme CNIL (docs/legal/textes/04). Opt-in strict : aucun script de mesure n'est
 * chargé tant que le consentement positif n'est pas donné (en V1 aucun script tiers n'est injecté,
 * ce composant enregistre le choix et servira de garde pour PostHog/Plausible en vague 2b+).
 * Les 3 actions ont une visibilité équivalente (contrainte CNIL non négociable).
 * Consentement renouvelé au-delà de 6 mois.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_CHANGED_EVENT } from '@/lib/analytics-client';

const STORAGE_KEY = 'parrainly-consent';
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 182;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return setVisible(true);
      const saved = JSON.parse(raw) as { ts?: number };
      if (!saved.ts || Date.now() - saved.ts > SIX_MONTHS_MS) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(choice: 'accepted' | 'refused') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
    } catch {
      // stockage indisponible : on masque quand même le bandeau pour la session
    }
    // Notifie AnalyticsScripts (chargement/arret des sinks) du nouveau choix, sans rechargement.
    try {
      window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    } catch {
      // environnement sans window (ne devrait pas arriver ici, composant client)
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-card p-md shadow-modal"
    >
      <div className="mx-auto flex max-w-container flex-col gap-md px-md md:flex-row md:items-center md:justify-between lg:px-xl">
        <div className="text-sm text-content-secondary">
          <p className="font-bold text-content-primary">Nous utilisons des cookies</p>
          <p>
            Parrainly utilise des cookies de mesure d&apos;audience pour comprendre comment vous arrivez sur nos
            fiches et améliorer le service. Certains sont nécessaires au fonctionnement du site, d&apos;autres
            nécessitent votre accord.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-sm">
          <button type="button" onClick={() => decide('accepted')} className="min-h-11 rounded-md bg-accent px-lg py-sm text-sm font-medium text-content-inverse hover:bg-accent-hover">
            Tout accepter
          </button>
          <button type="button" onClick={() => decide('refused')} className="min-h-11 rounded-md border border-line-strong bg-surface-card px-lg py-sm text-sm font-medium text-content-primary hover:bg-surface-muted">
            Tout refuser
          </button>
          <Link href="/confidentialite" className="min-h-11 rounded-md border border-line-strong bg-surface-card px-lg py-sm text-sm font-medium text-content-primary hover:bg-surface-muted">
            Personnaliser mes choix
          </Link>
        </div>
      </div>
    </div>
  );
}
