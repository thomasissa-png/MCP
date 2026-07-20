/**
 * Page catégorie `/categories/{slug}` (wireframes.md écran 2). En-tête + grille filtrée.
 * Rendu : SSR dynamique (reflète les statuts/fraîcheur de la DB).
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOffresByCategorieSlug, CATEGORY_META } from '@/lib/offres';
import { slugify } from '@/lib/slug';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OfferCard } from '@/components/ui/OfferCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META.find((c) => slugify(c.nom) === slug);
  return meta ? { title: meta.nom, description: meta.description } : { title: 'Catégorie introuvable' };
}

export default async function CategoriePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getOffresByCategorieSlug(slug);
  if (!data) notFound();
  const meta = CATEGORY_META.find((c) => c.nom === data.categorie);

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <Breadcrumb trail={[{ href: '/', label: 'Accueil' }]} current={data.categorie} />
      <header className="animate-fade-up mt-lg mb-xl">
        <h1 className="text-2xl font-bold text-content-primary">{data.categorie}</h1>
        {meta ? <p className="mt-sm max-w-2xl text-content-secondary">{meta.description}</p> : null}
      </header>
      {data.offres.length === 0 ? (
        <p className="py-2xl text-content-secondary">Aucune offre vérifiée dans cette catégorie pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {data.offres.map((o) => (
            <OfferCard key={o.id} offre={o} />
          ))}
        </div>
      )}
    </main>
  );
}
