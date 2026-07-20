/**
 * Logomark Parrainly (design-system §6) : sceau de vérification, un cercle contenant une coche.
 * Cercle en accent de marque, coche en couleur "vérifié" (rappel de la sémantique dès l'icône).
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Parrainly">
      <circle cx="16" cy="16" r="14" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2.5" />
      <path
        d="M9.5 16.5l4.2 4.2L23 11"
        fill="none"
        stroke="var(--color-verified-fg)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
