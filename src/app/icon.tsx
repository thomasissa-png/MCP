/**
 * Favicon raster (PNG 32x32) généré à la volée via next/og (seo round 2b, item 3).
 * Complète favicon.svg (modernes) + favicon.ico (fallback) pour qu'aucun chemin d'icône ne renvoie 404.
 * Marque : monogramme « P » Parrainly sur cobalt.700 (#1F3A5F, --color-accent-primary light).
 */
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1F3A5F',
          color: '#FFFFFF',
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        P
      </div>
    ),
    size,
  );
}
