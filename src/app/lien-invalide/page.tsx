/**
 * Page générique « lien plus valide » (US-01). Rendu SSG (contenu statique), noindex.
 * Cible de la redirection 307 de /r/{token} quand le token est inconnu, expiré ou l'offre non active.
 * Zéro exposition de l'enseigne d'origine (anti-fingerprinting du catalogue).
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lien plus valide',
  robots: { index: false, follow: false },
};

export default function LienInvalidePage() {
  return (
    <main className="mx-auto flex max-w-container flex-col items-center gap-lg px-md py-4xl text-center lg:px-xl">
      <span className="inline-flex items-center gap-xs rounded-full border border-stale-border bg-stale-bg px-sm py-2xs text-xs font-medium text-stale-fg">
        Lien expiré ou indisponible
      </span>
      <h1 className="max-w-xl text-2xl font-bold text-content-primary">
        Ce lien de parrainage n&apos;est plus valide
      </h1>
      <p className="max-w-xl text-md text-content-secondary">
        Le lien que vous avez suivi a expiré ou n&apos;est plus disponible. C&apos;est justement le rôle de
        Parrainly : retirer une offre du registre dès qu&apos;elle n&apos;est plus fiable.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse transition-colors duration-fast hover:bg-accent-hover"
      >
        Voir les offres vérifiées
      </Link>
    </main>
  );
}
