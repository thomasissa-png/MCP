/**
 * Rendu partagé des images OpenGraph (SEO P0-2), 1200×630, marque Parrainly.
 * Une seule source de gabarit pour l'image par défaut (home + pages sans OG propre), la page offre
 * (« Parrainage {programme} vérifié ») et la page catégorie. next/og ImageResponse, zéro asset externe
 * (police système), zéro dépendance runtime. Utilisé par les fichiers `opengraph-image.tsx` de chaque
 * segment — un OG par segment évite que le `openGraph` custom d'une page écrase l'image héritée du root.
 */
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';
export const OG_ALT = 'Parrainly, registre de liens de parrainage vérifiés à date';

/** Reconstruit un nom d'affichage lisible depuis un slug (« trade-republic » -> « Trade Republic »). */
export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function renderBrandOg(title: string, subtitle: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0F1B2D',
          color: '#F5F7FA',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#1F3A5F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8FB4E3',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>Parrainly</span>
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginTop: 48, letterSpacing: '-0.03em', maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#A9B7C6', marginTop: 28, maxWidth: 940 }}>
          {subtitle}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
