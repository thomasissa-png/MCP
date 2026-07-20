/**
 * GET /api/v1/offres — miroir JSON du catalogue (machine-readable, consomme par les assistants IA/agents).
 *
 * N'expose que les offres servables (`actif`) et uniquement des champs publics (cf. lib/ai/public-offre :
 * jamais de lien d'affiliation brut, de source/notes internes, ni de donnee parrain).
 *
 * Filtre optionnel : ?categorie={slug} (slug de categorie, ex. crypto). Reponse 200, cache CDN court.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { listPublicOffres } from '@/lib/ai/public-offre';
import { slugify } from '@/lib/slug';
import { BASE_URL } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const categorieSlug = req.nextUrl.searchParams.get('categorie');
  let offres = await listPublicOffres();
  if (categorieSlug) {
    const key = categorieSlug.trim().toLowerCase();
    offres = offres.filter((o) => slugify(o.categorie) === key);
  }

  return NextResponse.json(
    {
      version: 'v1',
      generated_at: new Date().toISOString(),
      base_url: BASE_URL,
      count: offres.length,
      offres,
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    },
  );
}
