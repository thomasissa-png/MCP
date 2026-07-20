/**
 * Bandeau de mention de risque (design-system §3.3 badge-risk étendu, wireframes.md zone 5).
 * Ne s'affiche QUE si `riskTextForCategory` retourne un texte. Ambre/argile sobre, jamais rouge.
 * Icône info + texte complet (jamais couleur seule, jamais réductible ni en accordéon).
 */
export function RiskBanner({ text }: { text: string }) {
  return (
    <div
      role="note"
      className="flex items-start gap-sm rounded-md border border-attention-border bg-attention-bg p-md text-sm text-attention-fg"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.2v3.4" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      <p>{text}</p>
    </div>
  );
}
