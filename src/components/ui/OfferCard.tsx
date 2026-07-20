/**
 * Carte-offre catalogue (condensée) — design-system §3.1, wireframes.md écran 2 zone 4.
 * Carte entière cliquable (zone ≥ 44px), offres reléguées (non `actif`) à opacité réduite + badge stale,
 * jamais masquées (transparence de fraîcheur).
 *
 * Client-safe : n'importe PAS la couche DB (utilisable dans un composant client de recherche).
 */
import Link from 'next/link';
import type { Offre } from '@/db/schema';
import { slugify } from '@/lib/slug';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';

export function OfferCard({ offre }: { offre: Offre }) {
  const servable = offre.statut === 'actif';
  return (
    <Link
      href={`/offres/${slugify(offre.nomProgramme)}`}
      className={`group flex h-full flex-col gap-sm rounded-lg border border-line bg-surface-card p-lg shadow-card transition-all duration-fast hover:-translate-y-0.5 hover:border-line-strong ${
        servable ? '' : 'opacity-85'
      }`}
    >
      <h3 className="text-md font-bold text-content-primary">{offre.nomProgramme}</h3>
      <div className="flex flex-wrap items-center gap-xs">
        <CategoryBadge categorie={offre.categorie} asLink={false} />
        <FreshnessBadge variant={servable ? 'verified' : 'stale'} date={offre.dateVerification} compact />
      </div>
      {offre.avantageFilleul ? (
        <p className="mt-2xs line-clamp-2 text-sm text-content-secondary">{offre.avantageFilleul}</p>
      ) : null}
      <span className="mt-auto pt-sm text-sm font-medium text-accent">Voir la fiche vérifiée</span>
    </Link>
  );
}
