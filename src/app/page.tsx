/**
 * Page-sonde du squelette (Phase 2).
 * Verifie visuellement que Tailwind + les tokens semantiques (light/dark) sont bien cables.
 * @fullstack remplace cette page par l'accueil reel (wireframes ecran 2 / page-compositions §2).
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-container flex-col items-center justify-center gap-lg p-xl">
      <span className="inline-flex items-center gap-xs rounded-full border border-verified-border bg-verified-bg px-sm py-2xs text-xs font-medium text-verified-fg">
        Squelette technique operationnel
      </span>
      <h1 className="text-4xl font-bold text-content-primary">Parrainly</h1>
      <p className="max-w-xl text-center text-md text-content-secondary">
        Socle Next.js + Tailwind cable sur les design tokens. Pret pour le socle demandeur.
      </p>
      <button
        type="button"
        className="rounded-md bg-accent px-lg py-sm font-medium text-content-inverse transition-colors duration-fast hover:bg-accent-hover"
      >
        Bouton de reference (accent)
      </button>
    </main>
  );
}
