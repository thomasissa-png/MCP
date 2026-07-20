/**
 * Bandeau de mention de risque (design-system §3.3 badge-risk étendu, wireframes.md zone 5).
 * Ne s'affiche QUE si `riskTextForCategory` retourne un texte. Ambre/argile sobre, jamais rouge.
 *
 * Identité visuelle nettement distincte du DisclosureBanner (design round 2b, item 8), pour que
 * l'œil les sépare juste avant le CTA : fond ambre + bordure gauche épaisse ambre + icône triangle
 * d'alerte + libellé « À savoir avant de vous inscrire » (le DisclosureBanner reste gris, bordure
 * accent, sans libellé ni icône triangle).
 */
export function RiskBanner({ text }: { text: string }) {
  return (
    <div
      role="note"
      className="flex items-start gap-sm rounded-md border border-attention-border border-l-4 border-l-attention-fg bg-attention-bg p-md text-sm text-attention-fg"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1.8 15 14H1L8 1.8Z" />
        <path d="M8 6.4v3.2" />
        <circle cx="8" cy="11.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      <p>
        <span className="mb-2xs block text-xs font-semibold uppercase tracking-wide">À savoir avant de vous inscrire</span>
        {text}
      </p>
    </div>
  );
}
