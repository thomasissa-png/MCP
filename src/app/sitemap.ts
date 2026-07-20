/**
 * sitemap.xml genere dynamiquement (route Next.js MetadataRoute.Sitemap).
 *
 * Liste les pages a valeur de citation : accueil, pages legales de reference, toutes les categories
 * actives et toutes les pages-offre SERVABLES (statut `actif`). Les offres non servables (restreint,
 * expire, en_attente...) sont exclues, comme du miroir et du listing public.
 *
 * `lastModified` (P0-2 audit-technique §3) : JAMAIS `now` (un horodatage recalcule a chaque crawl sans
 * changement de contenu reel est un signal de spam pour Bing). On derive des dates STABLES et REELLES :
 *   - pages-offre        : `date_verification` reelle de l'offre (fraicheur fiable) ;
 *   - pages-categorie    : max des `date_verification` des offres servables de la categorie ;
 *   - accueil            : max global des `date_verification` (fraicheur du catalogue) ;
 *   - pages legales      : `CONTENT_LAST_MODIFIED` (date de contenu figee, surchargeable par env de build).
 */
import type { MetadataRoute } from 'next';
import { listPublicOffres, listPublicCategories } from '@/lib/ai/public-offre';
import { absUrl } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

/**
 * Date de derniere modification du contenu editorial/legal statique. Figee (pas `now`) pour ne pas
 * emettre de signal de fraicheur factice. Surchargeable au build via SITE_CONTENT_DATE (ISO AAAA-MM-JJ)
 * lors d'une refonte de contenu reelle.
 */
const CONTENT_LAST_MODIFIED = new Date(
  `${(process.env.SITE_CONTENT_DATE ?? '2026-07-20').slice(0, 10)}T00:00:00Z`,
);

/** Parse une date ISO (AAAA-MM-JJ) en Date UTC stable, ou null si absente/invalide. */
function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date la plus recente d'une liste (fallback CONTENT_LAST_MODIFIED si aucune date exploitable). */
function maxDate(dates: (Date | null)[]): Date {
  const valid = dates.filter((d): d is Date => d !== null);
  if (valid.length === 0) return CONTENT_LAST_MODIFIED;
  return valid.reduce((a, b) => (b.getTime() > a.getTime() ? b : a));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const offres = await listPublicOffres();
  const offreDates = offres.map((o) => parseDate(o.date_verification));
  const catalogueLastModified = maxDate(offreDates);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absUrl('/'), lastModified: catalogueLastModified, changeFrequency: 'daily', priority: 1 },
    { url: absUrl('/divulgation'), lastModified: CONTENT_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: absUrl('/mentions-legales'), lastModified: CONTENT_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: absUrl('/cgu'), lastModified: CONTENT_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: absUrl('/confidentialite'), lastModified: CONTENT_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (await listPublicCategories())
    .filter((c) => c.nombre_offres > 0)
    .map((c) => ({
      url: c.url_categorie,
      // Fraicheur = max des date_verification des offres de la categorie (donnee reelle, stable entre crawls).
      lastModified: maxDate(
        offres.filter((o) => o.categorie === c.nom).map((o) => parseDate(o.date_verification)),
      ),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const offrePages: MetadataRoute.Sitemap = offres.map((o) => ({
    url: o.url_offre,
    lastModified: parseDate(o.date_verification) ?? CONTENT_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...offrePages];
}
