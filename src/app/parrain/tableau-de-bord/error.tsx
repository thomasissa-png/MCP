'use client';

/**
 * Error boundary du tableau de bord parrain (US-05). Emet `dashboard_parrain_erreur` (gate consentement)
 * pour mesurer le frein technique cote parrain, sans jamais exposer de detail technique a l'utilisateur.
 */
import { useEffect } from 'react';
import { trackClient } from '@/lib/analytics-client';

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    trackClient('dashboard_parrain_erreur', {});
  }, []);

  return (
    <main className="mx-auto flex max-w-container flex-col items-center gap-lg px-md py-4xl text-center lg:px-xl">
      <h1 className="text-2xl font-bold text-content-primary">Tableau de bord indisponible</h1>
      <p className="max-w-xl text-content-secondary">
        Impossible d&apos;afficher votre tableau de bord pour le moment. Réessayez dans quelques instants.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover"
      >
        Réessayer
      </button>
    </main>
  );
}
