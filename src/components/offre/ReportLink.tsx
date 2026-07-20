'use client';

/**
 * Lien contextuel « Ce lien ne fonctionne pas ? » (US-06, wireframes.md écran 1 lien contextuel).
 * Signalement anonyme au niveau de l'offre (POST /api/v1/offres/{id}/signalement). Aucun identifiant civil.
 * Dédup double-clic (US-06 crit.6) : bouton désactivé pendant l'envoi.
 */
import { useState } from 'react';

type State = 'idle' | 'sending' | 'done' | 'error';

export function ReportLink({ offreId }: { offreId: string }) {
  const [state, setState] = useState<State>('idle');

  async function report() {
    if (state === 'sending' || state === 'done') return;
    setState('sending');
    try {
      const res = await fetch(`/api/v1/offres/${offreId}/signalement`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-content-secondary">Merci, votre signalement a été transmis pour vérification.</p>;
  }
  if (state === 'error') {
    return (
      <button type="button" onClick={report} className="text-sm text-content-secondary underline hover:text-content-primary">
        Votre signalement n&apos;a pas pu être enregistré. Réessayez.
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={report}
      disabled={state === 'sending'}
      className="text-sm text-content-secondary underline hover:text-content-primary disabled:opacity-60"
    >
      Ce lien ne fonctionne pas ?
    </button>
  );
}
