/**
 * Badge de catégorie neutre (design-system §3.1, "kebab neutre", pas de couleur promo).
 * Un seul traitement visuel pour les 6 catégories (pas de code couleur par catégorie).
 */
import Link from 'next/link';
import { slugify } from '@/lib/slug';

export function CategoryBadge({ categorie, asLink = true }: { categorie: string; asLink?: boolean }) {
  const className =
    'inline-flex items-center rounded-sm bg-surface-muted px-sm py-2xs text-xs font-medium text-content-secondary';
  if (!asLink) return <span className={className}>{categorie}</span>;
  return (
    <Link
      href={`/categories/${slugify(categorie)}`}
      className={`${className} transition-colors duration-fast hover:text-content-primary hover:underline`}
    >
      {categorie}
    </Link>
  );
}
