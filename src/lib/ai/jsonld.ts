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
import { BASE_URL, absUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/ai/site';

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
 * Product + Offer pour une page-offre. Le lien actionnable pointe vers la page canonique Parrainly
 * (url_offre), jamais vers le lien d'affiliation brut (gouvernance miroir + attribution).
 */
export function offreJsonLd(o: PublicOffre): Json {
  const disclosure = embeddedDisclosure(o);
  const description = [o.description_courte, disclosure].filter(Boolean).join(' ');
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
      description: [sentence('Avantage filleul', o.avantage_filleul), sentence('Conditions', o.conditions), disclosure]
        .filter(Boolean)
        .join(' '),
      url: o.url_offre,
      availability: 'https://schema.org/InStock',
      // date_verification = fraicheur, argument de citation ("donnee fraiche").
      ...(o.date_verification ? { priceValidUntil: o.date_verification } : {}),
      seller: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    },
    // Fraicheur exposee au niveau Product egalement.
    ...(o.date_verification ? { releaseDate: o.date_verification } : {}),
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
    slogan: "Le parrainage, verifie avant d'etre cite.",
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
