/**
 * Badge de fraîcheur (design-system §3.2). Deux variantes jamais confondues :
 *  - verified : offre `actif`, "Vérifié le JJ/MM/AAAA" (icône check, couleurs verified-*).
 *  - stale    : offre `expiré`/`en attente`, "En attente de mise à jour" (couleurs stale-*).
 * Icône + texte TOUJOURS (jamais l'icône seule, contrainte a11y wireframes.md).
 * La date est en police mono (marqueur de donnée système).
 */
import { formatDateFr } from '@/lib/format';

type Props = {
  variant: 'verified' | 'stale';
  date?: string | null;
  compact?: boolean;
};

export function FreshnessBadge({ variant, date, compact = false }: Props) {
  if (variant === 'stale') {
    return (
      <span className="inline-flex items-center gap-xs rounded-full border border-stale-border bg-stale-bg px-sm py-2xs text-xs font-medium text-stale-fg">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 4.8v3.4l2 1.4" strokeLinecap="round" />
        </svg>
        En attente de mise à jour
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-xs rounded-full border border-verified-border bg-verified-bg px-sm py-2xs text-xs font-medium text-verified-fg">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {compact ? (
        <span className="font-mono">{formatDateFr(date ?? null)}</span>
      ) : (
        <>
          Vérifié le <span className="font-mono">{formatDateFr(date ?? null)}</span>
        </>
      )}
    </span>
  );
}
