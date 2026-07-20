/**
 * Accueil `/` (wireframes.md écran 2, page-compositions §2, copy homepage-copy.md).
 * Rendu : SSR dynamique (le catalogue reflète l'état DB en temps réel — statuts/fraîcheur).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllOffres, getCategoriesWithCount, sortForCatalogue } from '@/lib/offres';
import { CatalogueSearch } from '@/components/catalogue/CatalogueSearch';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  description:
    'Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée.',
};

const STEPS = [
  'Vous demandez un parrainage à votre assistant IA, ou vous consultez directement le catalogue Parrainly.',
  'Chaque offre affiche sa date de dernière vérification et son statut : actif, en attente, retiré.',
  'Vous récupérez un lien attribué à Thomas ou Emmanuel, qui détiennent réellement les programmes du catalogue.',
  "Vous obtenez l'avantage publié par le programme si vous ouvrez le compte ou souscrivez au produit.",
];

const PROOFS = [
  { t: 'Vérification', d: 'Statut et date de contrôle sur chaque offre.' },
  { t: 'Fraîcheur', d: "Retrait automatique d'une offre signalée obsolète." },
  { t: 'IA-native', d: 'Structure lisible par les moteurs de réponse, pas seulement par un humain qui clique.' },
];

const FAQ = [
  { q: "Qu'est-ce que Parrainly ?", a: "Parrainly est un registre qui vérifie des liens de parrainage fintech (néobanque, investissement, crypto, banque pro) avant de les recommander, avec une date de contrôle sur chaque offre." },
  { q: 'Est-ce que Parrainly est affilié à Trade Republic, Qonto ou Kraken ?', a: "Non. Parrainly n'est affilié officiellement à aucun des programmes listés. Les liens exposés appartiennent à Thomas ou Emmanuel, qui perçoivent un avantage du programme si vous les utilisez." },
  { q: 'Comment Parrainly vérifie-t-il un lien de parrainage ?', a: "Chaque offre porte un statut (actif, en attente, retiré) et une date de dernière vérification. Une offre signalée morte, expirée ou dont les conditions ont changé est retirée du registre avant d'être re-proposée." },
  { q: 'Est-ce que Parrainly recommande le meilleur parrainage pour moi ?', a: 'Non. Parrainly décrit les offres telles que publiées par chaque programme, sans classement ni conseil personnalisé. Chaque décision d\'ouvrir un compte ou d\'investir reste la vôtre.' },
  { q: 'Investir ou détenir des crypto-actifs via un lien de parrainage comporte-t-il un risque ?', a: 'Oui. Investir comporte des risques de perte en capital. Les crypto-actifs sont des actifs risqués dont la valeur peut fortement varier. La prime de parrainage ne compense aucun de ces risques.' },
];

export default async function HomePage() {
  const [offres, categories] = await Promise.all([getAllOffres(), getCategoriesWithCount()]);
  const catalogue = sortForCatalogue(offres);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main>
      {/* Zone 2 — Bandeau d'intention (pas un hero promotionnel) */}
      <section className="border-b border-line bg-surface-muted">
        <div className="mx-auto flex max-w-container flex-col items-center gap-md px-md py-2xl text-center md:py-3xl lg:px-xl lg:py-4xl">
          <h1 className="animate-fade-up max-w-2xl text-3xl font-bold text-content-primary md:text-4xl">
            Le parrainage, vérifié avant d&apos;être cité.
          </h1>
          <p className="animate-fade-up max-w-xl text-md text-content-secondary">
            Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : date de contrôle,
            statut, conditions à jour. Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition
            expirée.
          </p>
          <Link href="#offres" className="animate-fade-up inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover">
            Voir les offres vérifiées
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-container px-md lg:px-xl">
        {/* Comment ça marche */}
        <section id="comment-ca-marche" className="py-2xl">
          <h2 className="mb-lg text-2xl font-bold text-content-primary">Comment ça marche</h2>
          <ol className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={i} className="flex flex-col gap-sm rounded-lg border border-line bg-surface-card p-lg shadow-card">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <p className="text-sm text-content-secondary">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Pourquoi la vérification */}
        <section className="py-2xl">
          <h2 className="mb-md text-2xl font-bold text-content-primary">Pourquoi la date de vérification change tout</h2>
          <p className="mb-lg max-w-3xl text-content-secondary">
            Un lien de parrainage fintech n&apos;est pas un code promo classique : une condition ratée (montant
            minimum de dépôt, durée de détention) transforme une prime attendue en zéro. Sur Trade Republic,
            Kraken ou Qonto, les conditions changent régulièrement. Parrainly retire une offre du registre dès
            qu&apos;elle est signalée morte, expirée ou modifiée, avant de la reproposer.
          </p>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {PROOFS.map((p) => (
              <div key={p.t} className="rounded-lg border border-line bg-surface-card p-lg shadow-card">
                <h3 className="mb-2xs font-bold text-content-primary">{p.t}</h3>
                <p className="text-sm text-content-secondary">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Grille des catégories */}
        <section id="categories" className="py-2xl">
          <h2 className="mb-lg text-2xl font-bold text-content-primary">Catégories</h2>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="flex flex-col gap-2xs rounded-lg border border-line bg-surface-card p-lg shadow-card transition-all duration-fast hover:-translate-y-0.5 hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-content-primary">{c.nom}</h3>
                  <span className="font-mono text-sm text-content-tertiary">{c.count}</span>
                </div>
                <p className="text-sm text-content-secondary">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Grille des offres + recherche */}
        <section id="offres" className="py-2xl">
          <h2 className="mb-lg text-2xl font-bold text-content-primary">Les offres vérifiées</h2>
          <CatalogueSearch offres={catalogue} />
        </section>

        {/* Preuve factuelle */}
        <section className="py-2xl">
          <p className="max-w-3xl text-content-secondary">
            Le registre couvre {offres.length} programmes fintech réels au lancement, répartis sur 6 catégories :
            finance personnelle, investissement, gestion de patrimoine, placement de trésorerie, services
            entrepreneur, crypto.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-2xl">
          <h2 className="mb-lg text-2xl font-bold text-content-primary">Questions fréquentes</h2>
          <div className="flex flex-col gap-md">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-lg border border-line bg-surface-card p-lg">
                <summary className="cursor-pointer font-medium text-content-primary">{f.q}</summary>
                <p className="mt-sm text-sm text-content-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA de conviction */}
        <section className="py-2xl">
          <div className="flex flex-col items-start gap-md rounded-lg border border-line bg-surface-muted p-xl">
            <h2 className="text-xl font-bold text-content-primary">Avant d&apos;ouvrir un compte</h2>
            <p className="max-w-2xl text-content-secondary">
              Vous avez déjà recoupé 2-3 sources vous-même ? Parrainly vous donne la date de dernière
              vérification en plus, pour trancher sans revérifier à la main.
            </p>
            <Link href="#offres" className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover">
              Consulter le registre vérifié
            </Link>
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
