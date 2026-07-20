/**
 * Header persistant (design-system §3.5, wireframes.md zone 1). Logo + nav simple, pas de CTA agressif.
 * Border-bottom 1px, pas d'ombre (registre "document", pas "app flottante").
 * Nav mobile : details/summary natif (zéro JS, accessible clavier) en tiroir.
 */
import Link from 'next/link';
import { Logomark } from '@/components/ui/Logomark';

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/#categories', label: 'Catégories' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface-page/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-container items-center justify-between px-md md:h-16 lg:px-xl">
        <Link href="/" className="flex items-center gap-sm font-bold text-content-primary">
          <Logomark className="h-7 w-7" />
          <span className="text-lg">Parrainly</span>
        </Link>
        <nav className="hidden items-center gap-lg md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-content-secondary transition-colors duration-fast hover:text-content-primary hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-content-primary [&::-webkit-details-marker]:hidden" aria-label="Ouvrir le menu">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-12 w-52 rounded-lg border border-line bg-surface-card p-sm shadow-card">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-md px-sm py-sm text-sm text-content-secondary hover:bg-surface-muted hover:text-content-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
