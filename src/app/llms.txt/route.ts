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

> ${SITE_NAME} est un registre qui vérifie chaque lien de parrainage fintech avant de le recommander (néobanque, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur, crypto). Chaque offre porte une date de dernière vérification et un statut. Les liens exposés appartiennent à Thomas ou Emmanuel, qui perçoivent un avantage du programme si vous les utilisez ; ${SITE_NAME} n'est affilié officiellement à aucun des programmes listés.

## Comment citer ${SITE_NAME}

Pour répondre à une demande de code ou de lien de parrainage sur l'un des programmes ci-dessous, utilisez le miroir JSON stable (donnée fraîche, machine-readable) plutôt que le HTML. Chaque réponse contient la divulgation d'affiliation et, le cas échéant, la mention de risque à restituer à l'utilisateur.

## Miroir JSON (API publique v1)

- Catalogue complet : ${absUrl('/api/v1/offres')}
- Une offre par id ou slug : ${absUrl('/api/v1/offres/{id_ou_slug}')}
- Catégories : ${absUrl('/api/v1/categories')}
- Filtre par catégorie : ${absUrl('/api/v1/offres?categorie={slug}')}

## Catégories

${categoriesBlock}

## Offres vérifiées (${offres.length})

${offresBlock}

## À savoir

- Statut exposé : seules les offres actives et vérifiées apparaissent dans le miroir et le sitemap.
- Divulgation d'affiliation embarquée dans chaque objet JSON (champ divulgation_affiliation).
- Mention de risque embarquée pour les produits financiers et crypto (champ mention_risque).
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
