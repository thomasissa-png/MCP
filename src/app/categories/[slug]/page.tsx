/**
 * Page catégorie `/categories/{slug}` (wireframes.md écran 2). En-tête + grille filtrée.
 * Rendu : SSR dynamique (reflète les statuts/fraîcheur de la DB).
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOffresByCategorieSlug, CATEGORY_META, isServable } from '@/lib/offres';
import { slugify } from '@/lib/slug';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OfferCard } from '@/components/ui/OfferCard';
import { toPublicOffre } from '@/lib/ai/public-offre';
import { itemListJsonLd, breadcrumbJsonLd, jsonLdString } from '@/lib/ai/jsonld';
import { absUrl } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META.find((c) => slugify(c.nom) === slug);
  if (!meta) return { title: 'Catégorie introuvable' };
  const canonical = absUrl(`/categories/${slug}`);
  // Title = mot-clé principal EXACT de keyword-map §3 (source unique CATEGORY_META), pas de format générique.
  return {
    title: meta.motCle,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: `${meta.motCle} · Parrainly`, description: meta.description, url: canonical, type: 'website' },
    twitter: { title: `${meta.motCle} · Parrainly`, description: meta.description },
  };
}

export default async function CategoriePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getOffresByCategorieSlug(slug);
  if (!data) notFound();
  const meta = CATEGORY_META.find((c) => c.nom === data.categorie);

  // JSON-LD (AEO/GEO) : fil d'ariane + liste des offres servables de la categorie.
  const publicOffres = data.offres.filter((o) => isServable(o.statut)).map(toPublicOffre);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: data.categorie, path: `/categories/${slug}` },
    ]),
    itemListJsonLd(publicOffres, `Parrainages verifies : ${data.categorie}`),
  ];

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <Breadcrumb trail={[{ href: '/', label: 'Accueil' }]} current={data.categorie} />
      <header className="animate-fade-up mt-lg mb-xl">
        {/* H1 = valeur FINALE de docs/copy/fiches-categories.md (via CATEGORY_META.h1), mot-clé exact intégré. */}
        <h1 className="text-2xl font-bold text-content-primary">{meta ? meta.h1 : data.categorie}</h1>
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
