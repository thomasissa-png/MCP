/**
 * Apple touch icon (PNG 180x180) généré à la volée via next/og (seo round 2b, item 3).
 * Rend `<link rel="apple-touch-icon">` en 200 — le chemin par défaut ne renvoie plus 404.
 * Marque : monogramme « P » Parrainly sur cobalt.700 (#1F3A5F).
 */
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 700,
        }}
      >
        P
      </div>
    ),
    size,
  );
}
