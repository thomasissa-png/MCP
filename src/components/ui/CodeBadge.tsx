'use client';

/**
 * CodeBadge (design-system, cohérent FreshnessBadge) — objectif n°1 T1.
 * Affiche le CODE DE PARRAINAGE en clair, lisible et copiable, rendu SSR (le code est
 * dans le HTML dès le chargement — pas d'appel API, pas de clic requis). Police mono
 * (marqueur de donnée système, comme la date du FreshnessBadge). Tokens : surface-card,
 * border-line, accent, content-*. Bouton copier = enrichissement client léger (cible ≥44px).
 * Si l'offre n'a pas de code (lien seul), le composant ne rend rien.
 */
import { useState } from 'react';

type Props = {
  code: string | null | undefined;
};

export function CodeBadge({ code }: Props) {
  const [copied, setCopied] = useState(false);

  if (!code || !code.trim()) return null;
  const value = code.trim();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponible : le code reste sélectionnable manuellement */
    }
  }

  return (
    <div className="inline-flex flex-col gap-2xs rounded-lg border border-line bg-accent-subtle p-md">
      <span className="text-xs font-medium uppercase tracking-wide text-content-tertiary">
        Code de parrainage
      </span>
      <div className="flex items-center gap-sm">
        <code className="select-all font-mono text-lg font-bold tracking-wider text-content-primary">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Code copié' : 'Copier le code de parrainage'}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2xs rounded-md border border-line bg-surface-card px-sm text-xs font-medium text-content-secondary transition-colors hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {copied ? (
            <>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copié
            </>
          ) : (
            <>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="5" y="5" width="8" height="8" rx="1.5" />
                <path d="M3 10.5V3.5A1.5 1.5 0 0 1 4.5 2h6" strokeLinecap="round" />
              </svg>
              Copier
            </>
          )}
        </button>
      </div>
    </div>
  );
}
