/**
 * Fil d'Ariane (design-system §3.5, wireframes.md zone 2). Chaîne complète desktop,
 * "< Retour à ..." sur mobile (dernier parent seulement).
 */
import Link from 'next/link';

type Crumb = { href: string; label: string };

export function Breadcrumb({ trail, current }: { trail: Crumb[]; current: string }) {
  const parent = trail[trail.length - 1];
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-content-secondary">
      {/* Mobile : retour au parent direct */}
      {parent ? (
        <Link href={parent.href} className="inline-flex items-center gap-2xs hover:text-content-primary hover:underline md:hidden">
          <span aria-hidden="true">&lt;</span> Retour à {parent.label}
        </Link>
      ) : null}
      {/* Desktop : chaîne complète */}
      <ol className="hidden items-center gap-xs md:flex">
        {trail.map((c) => (
          <li key={c.href} className="flex items-center gap-xs">
            <Link href={c.href} className="hover:text-content-primary hover:underline">
              {c.label}
            </Link>
            <span aria-hidden="true" className="text-content-tertiary">&gt;</span>
          </li>
        ))}
        <li aria-current="page" className="text-content-primary">{current}</li>
      </ol>
    </nav>
  );
}
