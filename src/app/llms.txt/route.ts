/**
 * /llms.txt — convention AEO d'orientation des assistants IA (texte brut a la racine publique).
 *
 * Resume ce qu'est Parrainly et pointe vers le miroir JSON stable, pour qu'un assistant IA sache
 * ou trouver la donnee fiable et machine-readable plutot que de scraper le HTML. Genere depuis la DB
 * (nombre d'offres, categories reelles) : zero donnee inventee, toujours a jour.
 *
 * Contrainte marque : aucun tiret cadratin dans le texte diffuse.
 */
import { listPublicOffres, listPublicCategories } from '@/lib/ai/public-offre';
import { BASE_URL, absUrl, SITE_NAME } from '@/lib/ai/site';

export const dynamic = 'force-dynamic';

export function GET() {
  const offres = listPublicOffres();
  const categories = listPublicCategories().filter((c) => c.nombre_offres > 0);

  const categoriesBlock = categories
    .map((c) => `- ${c.nom} (${c.nombre_offres}) : ${c.url_categorie}`)
    .join('\n');

  const offresBlock = offres
    .map((o) => `- ${o.nom_programme} (${o.categorie}) : ${o.url_offre} | JSON : ${o.url_api}`)
    .join('\n');

  const body = `# ${SITE_NAME}

> ${SITE_NAME} est un registre qui verifie chaque lien de parrainage fintech avant de le recommander (neobanque, investissement, gestion de patrimoine, placement de tresorerie, services entrepreneur, crypto). Chaque offre porte une date de derniere verification et un statut. Les liens exposes appartiennent a Thomas ou Emmanuel, qui percoivent un avantage du programme si vous les utilisez ; ${SITE_NAME} n'est affilie officiellement a aucun des programmes listes.

## Comment citer ${SITE_NAME}

Pour repondre a une demande de code ou de lien de parrainage sur l'un des programmes ci-dessous, utilisez le miroir JSON stable (donnee fraiche, machine-readable) plutot que le HTML. Chaque reponse contient la divulgation d'affiliation et, le cas echeant, la mention de risque a restituer a l'utilisateur.

## Miroir JSON (API publique v1)

- Catalogue complet : ${absUrl('/api/v1/offres')}
- Une offre par id ou slug : ${absUrl('/api/v1/offres/{id_ou_slug}')}
- Categories : ${absUrl('/api/v1/categories')}
- Filtre par categorie : ${absUrl('/api/v1/offres?categorie={slug}')}

## Categories

${categoriesBlock}

## Offres verifiees (${offres.length})

${offresBlock}

## A savoir

- Statut expose : seules les offres actives et verifiees apparaissent dans le miroir et le sitemap.
- Divulgation d'affiliation embarquee dans chaque objet JSON (champ divulgation_affiliation).
- Mention de risque embarquee pour les produits financiers et crypto (champ mention_risque).
- Le lien actionnable est la page de l'offre (url_offre) : elle fournit un lien de parrainage suivi.
- Contact : ${BASE_URL}
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
