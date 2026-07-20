/**
 * Miroir JSON machine-readable — contrat public consomme par les assistants IA et les agents.
 *
 * REGLE DE GOUVERNANCE (non negociable) : ce contrat n'expose JAMAIS de donnee parrain sensible.
 * Sont EXCLUS volontairement :
 *   - `url_parrainage` (lien d'affiliation personnel d'un parrain) : l'exposer court-circuiterait la
 *     redirection trackee /r/{token} + la rotation V2 => perte de l'attribution (KPI North Star PCA-IA)
 *     et fuite du lien personnel. L'unite actionnable exposee est `url_offre` (page canonique Parrainly)
 *     ou l'assistant/l'utilisateur obtient un lien suivi.
 *   - `source`, `notes` (donnees internes de curation).
 *   - toute donnee de parrain, quota, token d'attribution.
 *
 * Sont EXPOSES : les champs descriptifs publics + la divulgation d'affiliation et la mention de risque
 * EMBARQUEES dans la donnee (exigence @legal : l'IA doit pouvoir restituer la relation d'affiliation).
 */
import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { offre, type Offre } from '@/db/schema';
import { CATEGORY_META, isServable, offreSlug } from '@/lib/offres';
import { slugify } from '@/lib/slug';
import { absUrl } from '@/lib/ai/site';

/** Objet offre tel qu'expose par le miroir JSON (stable, versionne v1). */
export type PublicOffre = {
  id: string;
  nom_programme: string;
  slug: string;
  categorie: string;
  sous_categorie: string | null;
  cible: string[];
  pays: string | null;
  langue: string[];
  code_parrainage: string | null;
  description_courte: string | null;
  avantage_filleul: string | null;
  avantage_parrain: string | null;
  conditions: string | null;
  statut: string;
  priorite_affichage: number;
  tags: string[];
  date_ajout: string | null;
  date_verification: string | null;
  divulgation_affiliation: string | null;
  mention_risque: string | null;
  mention_non_affiliation: string | null;
  url_offre: string;
  url_api: string;
};

/** Decoupe une liste "a; b; c" en tableau nettoye (les champs source utilisent ; comme separateur). */
function splitList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Serialise une ligne DB en objet public (aucun champ sensible ne transite). */
export function toPublicOffre(o: Offre): PublicOffre {
  const slug = offreSlug(o);
  return {
    id: o.id,
    nom_programme: o.nomProgramme,
    slug,
    categorie: o.categorie,
    sous_categorie: o.sousCategorie ?? null,
    cible: splitList(o.cible),
    pays: o.pays ?? null,
    langue: splitList(o.langue),
    code_parrainage: o.codeParrainage ?? null,
    description_courte: o.descriptionCourte ?? null,
    avantage_filleul: o.avantageFilleul ?? null,
    avantage_parrain: o.avantageParrain ?? null,
    conditions: o.conditions ?? null,
    statut: o.statut,
    priorite_affichage: o.prioriteAffichage,
    tags: splitList(o.tagsMcp),
    date_ajout: o.dateAjout ?? null,
    date_verification: o.dateVerification ?? null,
    divulgation_affiliation: o.divulgationAffiliation ?? null,
    mention_risque: o.mentionRisque ?? null,
    mention_non_affiliation: o.mentionNonAffiliation ?? null,
    url_offre: absUrl(`/offres/${slug}`),
    url_api: absUrl(`/api/v1/offres/${o.id}`),
  };
}

/**
 * Offres exposables au miroir public : uniquement les `actif` (servables). Les statuts `restreint`,
 * `expire`, `en_attente_*`, `suspendu`, `retire` sont exclus du miroir comme du listing public
 * (levier de restriction generique pilote par `statut`, aucun cas particulier code par marque).
 */
export async function listPublicOffres(): Promise<PublicOffre[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(offre)
    .orderBy(asc(offre.prioriteAffichage), asc(offre.nomProgramme))
    .all();
  return rows.filter((o) => isServable(o.statut)).map(toPublicOffre);
}

/** Resout une offre publique par id (REF-001) OU slug (trade-republic). Non servable => undefined. */
export async function getPublicOffre(idOrSlug: string): Promise<PublicOffre | undefined> {
  const db = await getDb();
  const rows = await db.select().from(offre).all();
  const key = idOrSlug.trim().toLowerCase();
  const match = rows.find(
    (o) => o.id.toLowerCase() === key || slugify(o.nomProgramme) === key,
  );
  if (!match || !isServable(match.statut)) return undefined;
  return toPublicOffre(match);
}

/** Categorie publique du miroir : metadonnee + compte d'offres servables. */
export type PublicCategorie = {
  nom: string;
  slug: string;
  description: string;
  nombre_offres: number;
  url_categorie: string;
  url_api: string;
};

/**
 * Liste des categories actives (CATEGORY_META de lib/offres) avec le nombre d'offres servables.
 * Import dynamique de CATEGORY_META evite un cycle d'import (lib/offres importe deja lib/ai indirectement).
 */
export async function listPublicCategories(): Promise<PublicCategorie[]> {
  const publics = await listPublicOffres();
  return CATEGORY_META.map((c) => {
    const slug = slugify(c.nom);
    return {
      nom: c.nom,
      slug,
      description: c.description,
      nombre_offres: publics.filter((o) => o.categorie === c.nom).length,
      url_categorie: absUrl(`/categories/${slug}`),
      url_api: absUrl(`/api/v1/categories`),
    };
  });
}
