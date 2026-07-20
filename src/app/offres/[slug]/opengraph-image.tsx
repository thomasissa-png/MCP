/**
 * Image OpenGraph de la page offre (SEO P0-2) — « Parrainage {programme} vérifié ».
 * Le nom d'affichage est dérivé du slug (sans lecture DB : self-contained, sûr au build).
 */
import { renderBrandOg, titleFromSlug, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og-render';

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderBrandOg(
    `Parrainage ${titleFromSlug(slug)} vérifié`,
    'Code, statut et date de contrôle vérifiés par Parrainly.',
  );
}
