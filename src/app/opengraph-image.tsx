/**
 * Image OpenGraph par défaut (SEO P0-2) — appliquée globalement (home + toute page sans OG propre).
 * Gabarit partagé : src/lib/og-render.tsx.
 */
import { renderBrandOg, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-render';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderBrandOg('Parrainages vérifiés à date', 'Statut et date de contrôle affichés sur chaque offre.');
}
