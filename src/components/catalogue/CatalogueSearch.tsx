'use client';

/**
 * Grille des offres avec recherche live (wireframes.md écran 2 zone 2/4).
 * Le champ filtre en direct sur nom_programme / catégorie / tags. État vide géré (aucun résultat).
 * Reçoit les offres déjà triées côté serveur (offres `actif` d'abord).
 */
import { useMemo, useState } from 'react';
import type { Offre } from '@/db/schema';
import { OfferCard } from '@/components/ui/OfferCard';

export function CatalogueSearch({ offres }: { offres: Offre[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offres;
    return offres.filter((o) =>
      [o.nomProgramme, o.categorie, o.sousCategorie ?? '', o.tagsMcp ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [offres, query]);

  return (
    <div className="flex flex-col gap-xl">
      <div className="mx-auto w-full max-w-xl">
        <label htmlFor="catalogue-search" className="sr-only">
          Chercher un programme
        </label>
        <input
          id="catalogue-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher un programme (Trade Republic, Qonto...)"
          className="min-h-11 w-full rounded-md border border-line bg-surface-card px-md py-sm text-content-primary placeholder:text-content-tertiary focus:border-accent focus:bg-accent-subtle"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-2xl text-center text-content-secondary">
          Aucun programme ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((o) => (
            <OfferCard key={o.id} offre={o} />
          ))}
        </div>
      )}
    </div>
  );
}
