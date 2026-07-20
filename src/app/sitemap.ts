/**
 * sitemap.xml genere dynamiquement (route Next.js MetadataRoute.Sitemap).
 *
 * Liste les pages a valeur de citation : accueil, pages legales de reference, toutes les categories
 * actives et toutes les pages-offre SERVABLES (statut `actif`). Les offres non servables (restreint,
 * expire, en_attente...) sont exclues, comme du miroir et du listing public. `lastModified` reprend la
 * date de verification reelle de chaque offre (signal de fraicheur pour les moteurs).
 */
import type { MetadataRoute } from 'next';
import { listPublicOffres, listPublicCategories } from '@/lib/ai/public-offre';
import { absUrl } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: absUrl('/divulgation'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: absUrl('/mentions-legales'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absUrl('/cgu'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absUrl('/confidentialite'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = listPublicCategories()
    .filter((c) => c.nombre_offres > 0)
    .map((c) => ({
      url: c.url_categorie,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const offrePages: MetadataRoute.Sitemap = listPublicOffres().map((o) => ({
    url: o.url_offre,
    lastModified: o.date_verification ? new Date(`${o.date_verification}T00:00:00Z`) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...offrePages];
}
