/**
 * robots.txt genere dynamiquement (route Next.js MetadataRoute.Robots).
 *
 * Strategie AEO/GEO-first : on AUTORISE explicitement les crawlers d'assistants IA (etre lu et cite
 * est l'objectif d'acquisition, cf. faisabilite-geo). Tous les user-agents ont acces au contenu de
 * catalogue et au miroir /api/v1 ; seuls la redirection trackee /r/*, le back-office /internal/* et
 * quelques pages sans valeur de citation sont interdits a l'indexation.
 */
import type { MetadataRoute } from 'next';
import { AI_CRAWLERS, DISALLOWED_PATHS, absUrl } from '@/lib/ai/site';

// Dynamique : l'URL de base (sitemap) doit refleter NEXT_PUBLIC_SITE_URL au runtime, jamais l'URL
// par defaut figee au build.
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const disallow = [...DISALLOWED_PATHS];
  // Crawlers IA : allow explicite de la racine, meme disallow cible que le reste.
  const aiRules = AI_CRAWLERS.map((ua) => ({
    userAgent: ua,
    allow: '/',
    disallow,
  }));

  return {
    rules: [
      // Regle generale (tout autre robot) : autorise, memes exclusions.
      { userAgent: '*', allow: '/', disallow },
      ...aiRules,
    ],
    sitemap: absUrl('/sitemap.xml'),
  };
}
