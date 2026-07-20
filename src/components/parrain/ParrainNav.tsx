'use client';

/**
 * Barre de navigation de l'espace parrain (wireframes.md écran 3 zone 1) : salutation + liens + déconnexion.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { href: '/parrain/tableau-de-bord', label: 'Tableau de bord' },
  { href: '/parrain/catalogue', label: 'Catalogue' },
  { href: '/parrain/attributions', label: 'Attributions' },
];

export function ParrainNav({ nom }: { nom: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      /* best-effort */
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="mb-xl flex flex-col gap-md border-b border-line pb-md md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-lg">
        <span className="font-bold text-content-primary">Bonjour {nom}</span>
        <nav className="flex flex-wrap gap-md" aria-label="Navigation espace parrain">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-content-secondary hover:text-content-primary hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <button type="button" onClick={logout} disabled={loading} className="self-start text-sm text-content-secondary underline hover:text-content-primary disabled:opacity-60 md:self-auto">
        Se déconnecter
      </button>
    </div>
  );
}
