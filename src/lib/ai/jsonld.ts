/**
 * Builders JSON-LD (schema.org) — donnee structuree injectee cote serveur dans les pages.
 *
 * Objectif AEO/GEO : maximiser la citabilite par les assistants IA. Les types privilegies
 * (Product/Offer, ItemList, FAQPage, BreadcrumbList, Organization/WebSite) sont ceux au meilleur
 * taux de citation (cf. architecture-mcp-parrainage-ia.md §2.2).
 *
 * Toutes les valeurs viennent de la DB (via PublicOffre) : zero donnee inventee. La divulgation
 * d'affiliation et la mention de risque sont EMBARQUEES dans le graphe (champ `disambiguatingDescription`
 * + `description`) pour que le modele puisse les restituer (exigence @legal).
 *
 * Ces fonctions retournent des objets JS serialisables ; les pages les injectent via
 * <script type="application/ld+json">. Rien n'est rendu ici (pas de JSX) : reutilisable partout.
 */
import type { PublicOffre } from '@/lib/ai/public-offre';
import { BASE_URL, absUrl, SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/ai/site';

type Json = Record<string, unknown>;

/** Concatene la divulgation + la non-affiliation + le risque en un texte embarque unique. */
function embeddedDisclosure(o: PublicOffre): string {
  return [o.divulgation_affiliation, o.mention_non_affiliation, o.mention_risque]
    .filter(Boolean)
    .join(' ');
}

/** Termine une phrase par un point unique (evite le double point quand la source en contient deja un). */
function sentence(label: string, value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/[.\s]+$/, '');
  return `${label} : ${trimmed}.`;
}

/**
 * Construit un tableau de PropertyValue schema.org a partir de paires nom/valeur. Chaque champ non-nul
 * devient un attribut atomique extractible par un moteur (le code de parrainage, la fraicheur, la
 * divulgation) a cote de la description en texte libre. Les valeurs nulles sont ignorees (pas de bloc vide).
 */
function propertyValues(pairs: { name: string; value: string | null }[]): Json[] {
  return pairs
    .filter((p): p is { name: string; value: string } => Boolean(p.value))
    .map((p) => ({ '@type': 'PropertyValue', name: p.name, value: p.value }));
}

/**
 * Product + Offer pour une page-offre. Le lien actionnable pointe vers la page canonique Parrainly
 * (url_offre), jamais vers le lien d'affiliation brut (gouvernance miroir + attribution).
 */
export function offreJsonLd(o: PublicOffre): Json {
  const disclosure = embeddedDisclosure(o);
  const description = [o.description_courte, disclosure].filter(Boolean).join(' ');
  // Attributs atomiques extractibles par un moteur (chacun conditionnel non-null, aucun bloc vide) :
  // le code de parrainage (objectif n°1), la fraicheur (date de verification) et la divulgation.
  const offerProperties = propertyValues([
    { name: 'code_parrainage', value: o.code_parrainage },
    { name: 'date_verification', value: o.date_verification },
    { name: 'divulgation_affiliation', value: o.divulgation_affiliation },
  ]);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${o.url_offre}#product`,
    name: o.nom_programme,
    category: o.categorie,
    description,
    // Entite principale de la page (geo-strategy §5, decision E-E-A-T : mainEntityOfPage = FAIT).
    // Pointe vers la page canonique Parrainly, aucune donnee personnelle exposee.
    mainEntityOfPage: { '@type': 'WebPage', '@id': o.url_offre },
    // Divulgation d'affiliation embarquee, restituable telle quelle par le modele.
    disambiguatingDescription: disclosure,
    url: o.url_offre,
    keywords: o.tags.join(', '),
    brand: { '@type': 'Brand', name: o.nom_programme },
    offers: {
      '@type': 'Offer',
      '@id': `${o.url_offre}#offer`,
      name: `Parrainage ${o.nom_programme}`,
      category: 'Parrainage / affiliation',
      // Le code de parrainage est mis en tete de la description (objectif n°1 : une IA qui lit le
      // JSON-LD rendu recupere le code sans suivre le miroir JSON), suivi de l'avantage et des conditions.
      description: [
        sentence('Code de parrainage', o.code_parrainage),
        sentence('Avantage filleul', o.avantage_filleul),
        sentence('Conditions', o.conditions),
        disclosure,
      ]
        .filter(Boolean)
        .join(' '),
      url: o.url_offre,
      availability: 'https://schema.org/InStock',
      // Attributs atomiques : code_parrainage, date_verification (fraicheur), divulgation_affiliation.
      // NB : priceValidUntil retire volontairement (contresens schema.org : date de validite d'un PRIX,
      // alors qu'il n'y a pas de prix ; la fraicheur est portee par date_verification + dateModified/releaseDate).
      ...(offerProperties.length ? { additionalProperty: offerProperties } : {}),
      seller: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    },
    // Fraicheur exposee au niveau Product : releaseDate (date de publication de reference) + dateModified
    // (derniere verification), mapping schema.org correct pour signaler une donnee fraiche.
    ...(o.date_verification ? { releaseDate: o.date_verification, dateModified: o.date_verification } : {}),
    isFamilyFriendly: true,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
  };
}

/** Organization Parrainly (identite de marque, site-wide / accueil). */
export function organizationJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    logo: absUrl('/favicon.svg'),
  };
}

/** WebSite (accueil), avec pointeur vers le miroir JSON pour orienter les agents. */
export function webSiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${BASE_URL}#organization` },
  };
}

/** ItemList du catalogue (accueil) ou d'une categorie. Chaque item pointe vers sa page-offre. */
export function itemListJsonLd(offres: PublicOffre[], name: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: offres.length,
    itemListElement: offres.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: o.url_offre,
      name: o.nom_programme,
    })),
  };
}

/** FAQPage generique a partir de paires question/reponse. */
export function faqPageJsonLd(faq: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** BreadcrumbList a partir du fil d'ariane (chemins relatifs -> URLs absolues). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absUrl(t.path),
    })),
  };
}

/** Serialise un ou plusieurs graphes en chaine prete pour <script type="application/ld+json">. */
export function jsonLdString(graph: Json | Json[]): string {
  return JSON.stringify(graph);
}
