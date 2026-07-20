/**
 * Footer (wireframes.md zone 10). 3 colonnes desktop / stack mobile. Divulgation d'affiliation répétée ici
 * (pas la seule occurrence). Liens vers les pages de conformité.
 */
import Link from 'next/link';

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Catalogue',
    links: [
      { href: '/', label: 'Accueil' },
      { href: '/#categories', label: 'Catégories' },
      { href: '/#comment-ca-marche', label: 'Comment ça marche' },
    ],
  },
  {
    title: 'Conformité',
    links: [
      { href: '/divulgation', label: 'Divulgation d\'affiliation' },
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/confidentialite', label: 'Confidentialité' },
      { href: '/cgu', label: 'Conditions d\'utilisation' },
    ],
  },
  {
    title: 'Vos droits',
    links: [
      { href: '/rgpd/demande', label: 'Exercer mes droits RGPD' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-3xl border-t border-line bg-surface-muted">
      <div className="mx-auto max-w-container px-md py-2xl lg:px-xl">
        <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-sm text-sm font-bold text-content-primary">{col.title}</h2>
              <ul className="flex flex-col gap-xs">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-content-secondary hover:text-content-primary hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-xl border-t border-line pt-lg text-xs text-content-tertiary">
          Parrainly référence des liens de parrainage réels appartenant à Thomas ou Emmanuel, qui perçoivent
          un avantage si vous les utilisez. Parrainly n&apos;est affilié officiellement à aucun des programmes
          listés. Investir comporte des risques de perte en capital.
        </p>
      </div>
    </footer>
  );
}
