/**
 * Slugification déterministe (accents retirés) pour les URLs `/offres/{slug}` et `/categories/{slug}`.
 * Les offres n'ont pas de colonne slug : le slug est dérivé du `nom_programme` / de la `categorie`.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les diacritiques combinants
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
