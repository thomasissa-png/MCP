/**
 * Page-offre `/offres/{slug}` (US-01, écran stratégique). 10 zones wireframes.md / composition Variante A.
 * Rendu : SSR dynamique (statut + fraîcheur reflètent la DB). Ordre de lecture imposé :
 * identité -> divulgation -> risque -> conditions -> CTA (divulgation TOUJOURS au-dessus du CTA).
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllOffres, getOffreBySlug, isServable, riskTextForOffre } from '@/lib/offres';
import { slugify } from '@/lib/slug';
import { toPublicOffre } from '@/lib/ai/public-offre';
import { offreJsonLd, breadcrumbJsonLd, jsonLdString } from '@/lib/ai/jsonld';
import { absUrl } from '@/lib/ai/site';
import { formatDateFr } from '@/lib/format';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { CodeBadge } from '@/components/ui/CodeBadge';
import { DisclosureBanner } from '@/components/ui/DisclosureBanner';
import { RiskBanner } from '@/components/ui/RiskBanner';
import { OfferCard } from '@/components/ui/OfferCard';
import { OfferCta } from '@/components/offre/OfferCta';
import { ReportLink } from '@/components/offre/ReportLink';
import { TrackOnMount } from '@/components/analytics/TrackOnMount';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const offre = await getOffreBySlug(slug);
  // Soft-404 (seo P0-3) : notFound() ici, dans generateMetadata, S'EXÉCUTE AVANT le streaming du
  // Suspense (loading.tsx global) — le statut HTTP 404 est donc fixé avant l'envoi des en-têtes.
  // Appelé dans le composant page (après streaming), notFound() ne renvoyait qu'un 200 « soft 404 ».
  if (!offre) notFound();
  const canonical = absUrl(`/offres/${slug}`);
  // Title porte le mot-clé EXACT « parrainage {enseigne} » de keyword-map §2 (contigu, cohérent avec le H1).
  const title = `Parrainage ${offre.nomProgramme} vérifié`;
  const description = offre.descriptionCourte ?? undefined;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: `${title} · Parrainly`, description, url: canonical, type: 'website' },
    twitter: { title: `${title} · Parrainly`, description },
  };
}

export default async function OffrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offre = await getOffreBySlug(slug);
  if (!offre) notFound();

  const servable = isServable(offre.statut);
  const riskText = riskTextForOffre(offre);
  const tags = (offre.tagsMcp ?? '').split(';').map((t) => t.trim()).filter(Boolean).slice(0, 6);
  const all = await getAllOffres();
  const proches = all
    .filter((o) => o.id !== offre.id && o.categorie === offre.categorie)
    .slice(0, 3);

  // JSON-LD (AEO/GEO) : Product/Offer avec divulgation + risque embarques, et fil d'ariane structure.
  // Injecte uniquement pour une offre servable (donnee citable = offre reellement diffusable).
  const publicOffre = servable ? toPublicOffre(offre) : null;
  const jsonLd = publicOffre
    ? [
        offreJsonLd(publicOffre),
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: offre.categorie, path: `/categories/${slugify(offre.categorie)}` },
          { name: offre.nomProgramme, path: `/offres/${slug}` },
        ]),
      ]
    : null;

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      {/* Zone 1 — tracking chargement fiche (US-01, gate consentement cote client) */}
      <TrackOnMount event="page_offre_vue" props={{ enseigne_id: offre.id, canal_source: 'page_web' }} />
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      ) : null}
      {/* Zone 2 — Fil d'Ariane */}
      <Breadcrumb
        trail={[
          { href: '/', label: 'Accueil' },
          { href: `/categories/${slugify(offre.categorie)}`, label: offre.categorie },
        ]}
        current={offre.nomProgramme}
      />

      {/* Zone 3 — Bloc identité (split 70/30 desktop) */}
      <section className="animate-fade-up mt-lg grid grid-cols-1 gap-lg lg:grid-cols-[7fr_3fr]">
        <div className="flex flex-col gap-sm">
          {/* H1 porte le mot-clé exact « parrainage {enseigne} » (keyword-map §2, audit §2.4). */}
          <h1 className="text-xl font-bold text-content-primary md:text-2xl">Parrainage {offre.nomProgramme} vérifié</h1>
          <div className="flex flex-wrap items-center gap-xs">
            <CategoryBadge categorie={offre.categorie} />
            <FreshnessBadge variant={servable ? 'verified' : 'stale'} date={offre.dateVerification} />
          </div>
          {/* Code de parrainage en clair, SSR, au-dessus du pli (T1 — objectif n°1). Conditionnel : rien si absent. */}
          <CodeBadge code={offre.codeParrainage} />
          {offre.sousCategorie ? <p className="text-sm text-content-secondary">{offre.sousCategorie}</p> : null}
          {tags.length > 0 ? (
            <ul className="mt-2xs flex flex-wrap gap-xs">
              {tags.map((t) => (
                <li key={t} className="rounded-full bg-surface-muted px-sm py-2xs text-xs text-content-tertiary">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {offre.avantageFilleul ? (
          <aside className="rounded-lg border border-line bg-surface-card p-lg shadow-card">
            <p className="mb-xs text-xs font-medium uppercase tracking-wide text-content-tertiary">Ce que reçoit le filleul</p>
            <p className="text-content-primary">{offre.avantageFilleul}</p>
          </aside>
        ) : null}
      </section>

      {/* Zone 4 — Divulgation (TOUJOURS au-dessus du CTA) */}
      <div className="animate-fade-up mt-lg">
        <DisclosureBanner nomProgramme={offre.nomProgramme} />
      </div>

      {/* Zone 5 — Mention de risque (conditionnelle par catégorie) */}
      {riskText ? (
        <div className="animate-fade-up mt-md">
          <RiskBanner text={riskText} />
        </div>
      ) : null}

      {/* Zone 6 — CTA dynamique (5 états). Action primaire dominante, remontée juste après la
          divulgation + le risque (ordre légal conservé : divulgation TOUJOURS au-dessus du CTA),
          avant le bloc conditions pour ne plus être diluée en 5e position (design P0-2). */}
      <section className="animate-fade-up mt-lg flex justify-center">
        <div className="w-full max-w-xl">
          <OfferCta
            offreId={offre.id}
            nomProgramme={offre.nomProgramme}
            dateVerification={offre.dateVerification}
            servable={servable}
            categorieSlug={slugify(offre.categorie)}
          />
        </div>
      </section>

      {/* Zone 7 — Conditions (détail complémentaire, sous le CTA) */}
      <section className="animate-fade-up mt-xl max-w-3xl">
        <h2 className="mb-sm text-lg font-bold text-content-primary">Conditions et avantages</h2>
        {offre.descriptionCourte ? <p className="mb-md text-content-secondary">{offre.descriptionCourte}</p> : null}
        <ul className="flex flex-col gap-sm text-sm text-content-secondary">
          {offre.avantageParrain ? (
            <li>
              <span className="font-medium text-content-primary">Ce que reçoit l&apos;éditeur du site : </span>
              {offre.avantageParrain}
            </li>
          ) : null}
          {offre.conditions ? (
            <li>
              <span className="font-medium text-content-primary">Conditions d&apos;éligibilité : </span>
              {offre.conditions}
            </li>
          ) : null}
          <li>
            <span className="font-medium text-content-primary">Fraîcheur : </span>
            Vérifié le <span className="font-mono">{formatDateFr(offre.dateVerification)}</span> par Parrainly.
            Statut actuel : {offre.statut}.
          </li>
        </ul>
      </section>

      {/* Zone 8 — Aide contextuelle */}
      <div className="mt-md flex flex-wrap items-center justify-center gap-lg">
        <Link href="/divulgation" className="text-sm text-content-secondary underline hover:text-content-primary">
          Comment vérifions-nous cette offre ?
        </Link>
        <ReportLink offreId={offre.id} />
      </div>

      {/* Zone 9 — Offres proches */}
      {proches.length > 0 ? (
        <section className="mt-3xl">
          <h2 className="mb-lg text-lg font-bold text-content-primary">Offres proches</h2>
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {proches.map((o) => (
              <OfferCard key={o.id} offre={o} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
