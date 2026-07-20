/**
 * Accès lecture au catalogue (server-side, importé directement par les Server Components).
 * Aucune donnée inventée : tout vient de la table `offre` seedée depuis data/base-parrainage.json.
 */
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { offre, type Offre } from '@/db/schema';
import { slugify } from '@/lib/slug';

/** Une offre est diffusable/servable publiquement uniquement au statut `actif`. */
export function isServable(statut: string): boolean {
  return statut === 'actif';
}

export function offreSlug(o: Pick<Offre, 'nomProgramme'>): string {
  return slugify(o.nomProgramme);
}

/**
 * Métadonnées des catégories actives (descriptions réelles reprises du Referentiel_Categories de
 * data/base-parrainage.json). Ordre d'affichage de la grille accueil.
 */
export const CATEGORY_META: { nom: string; description: string }[] = [
  { nom: 'Finance personnelle', description: 'Comptes bancaires, néobanques, courtage grand public.' },
  { nom: 'Investissement', description: "Plateformes d'investissement long terme (assurance-vie, PER, SCPI, private equity)." },
  { nom: 'Gestion de patrimoine', description: 'Agrégation, suivi et pilotage du patrimoine global.' },
  { nom: 'Placement trésorerie', description: "Rémunération de la trésorerie (perso ou d'entreprise) : fonds monétaires, comptes rémunérés." },
  { nom: 'Services entrepreneur', description: "Outils de gestion d'entreprise : banque pro, comptabilité, juridique." },
  { nom: 'Crypto', description: 'Exchanges, staking, produits Web3.' },
];

/** Catégories déclenchant le bandeau de risque (règle exacte wireframes.md zone 5 / design-system §3.3). */
const RISK_CATEGORIES = new Set([
  'Investissement',
  'Gestion de patrimoine',
  'Placement trésorerie',
  'Crypto',
]);

/**
 * Texte de risque légal VERBATIM par catégorie (docs/legal/textes/06). Retourne null si la catégorie
 * ne déclenche pas de bandeau. Trade Republic (Finance personnelle) : pas de bandeau par défaut
 * (checkpoint Phase 1 point 7), `[À VALIDER]` par @product-manager/@legal avant mise en ligne.
 */
export function riskTextForCategory(categorie: string): string | null {
  if (!RISK_CATEGORIES.has(categorie)) return null;
  if (categorie === 'Crypto') {
    return 'Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier, y compris à la baisse. Investir dans un crypto-actif comporte un risque de perte totale du capital. La prime de parrainage ne compense ni ne couvre ce risque.';
  }
  if (categorie === 'Placement trésorerie') {
    return "Investir comporte des risques de perte en capital. Les fonds monétaires ne sont pas garantis en capital malgré leur faible volatilité habituelle. Le rendement affiché dépend de la campagne en cours et peut évoluer.";
  }
  // Investissement + Gestion de patrimoine
  return "Investir comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. La prime de parrainage est un avantage de bienvenue, distinct de la performance du produit financier souscrit.";
}

export async function getAllOffres(): Promise<Offre[]> {
  return db.select().from(offre).orderBy(asc(offre.prioriteAffichage), asc(offre.nomProgramme)).all();
}

/** Tri pour la grille catalogue : offres `actif` d'abord, puis reléguées (expiré / en attente). */
export function sortForCatalogue(offres: Offre[]): Offre[] {
  return [...offres].sort((a, b) => {
    const sa = isServable(a.statut) ? 0 : 1;
    const sb = isServable(b.statut) ? 0 : 1;
    if (sa !== sb) return sa - sb;
    if (a.prioriteAffichage !== b.prioriteAffichage) return a.prioriteAffichage - b.prioriteAffichage;
    return a.nomProgramme.localeCompare(b.nomProgramme);
  });
}

export async function getOffreBySlug(slug: string): Promise<Offre | undefined> {
  const all = await getAllOffres();
  return all.find((o) => offreSlug(o) === slug);
}

export async function getOffresByCategorieSlug(slug: string): Promise<{ categorie: string; offres: Offre[] } | undefined> {
  const meta = CATEGORY_META.find((c) => slugify(c.nom) === slug);
  if (!meta) return undefined;
  const rows = db.select().from(offre).where(eq(offre.categorie, meta.nom as Offre['categorie'])).all();
  return { categorie: meta.nom, offres: sortForCatalogue(rows) };
}

export async function getCategoriesWithCount(): Promise<{ nom: string; description: string; slug: string; count: number }[]> {
  const all = await getAllOffres();
  return CATEGORY_META.map((c) => ({
    nom: c.nom,
    description: c.description,
    slug: slugify(c.nom),
    count: all.filter((o) => o.categorie === c.nom && isServable(o.statut)).length,
  }));
}
