/**
 * GET /api/v1/categories — miroir JSON des categories actives + compte d'offres servables.
 * Consomme par les assistants IA pour naviguer le catalogue par theme (fintech : neobanque,
 * investissement, patrimoine, tresorerie, services entrepreneur, crypto).
 */
import { NextResponse } from 'next/server';
import { listPublicCategories } from '@/lib/ai/public-offre';
import { BASE_URL } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

export function GET() {
  const categories = listPublicCategories();
  return NextResponse.json(
    {
      version: 'v1',
      generated_at: new Date().toISOString(),
      base_url: BASE_URL,
      count: categories.length,
      categories,
    },
    { status: 200, headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } },
  );
}
