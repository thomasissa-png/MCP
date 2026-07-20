'use client';

/**
 * Validation de conformité d'une offre (US-07). POST /api/v1/admin/offres/{id}/validation.
 * "Valider" exige une référence de fiche de conformité (bouton bloqué sinon).
 */
import { useRef, useState } from 'react';

export function OffreValidationForm({ offreId, statut }: { offreId: string; statut: string }) {
  const [reference, setReference] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  async function decide(decision: 'valider' | 'bloquer') {
    if (inFlight.current) return;
    if (decision === 'valider' && reference.trim().length === 0) {
      setFeedback({ type: 'error', msg: 'La référence de la fiche de conformité est obligatoire.' });
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/offres/${offreId}/validation`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ decision, reference_fiche_conformite: reference }),
      });
      const data = (await res.json().catch(() => ({}))) as { statut?: string; error?: string };
      if (res.ok) {
        setFeedback({
          type: 'ok',
          msg: data.statut === 'actif' ? 'Offre validée, elle est désormais active.' : 'Offre bloquée, fiche de conformité manquante ou insuffisante.',
        });
      } else if (data.error === 'reference_fiche_manquante') {
        setFeedback({ type: 'error', msg: 'La référence de la fiche de conformité est obligatoire.' });
      } else if (data.error === 'plafond_manquant') {
        setFeedback({ type: 'error', msg: 'Le plafond doit être renseigné avant activation.' });
      } else {
        setFeedback({ type: 'error', msg: "L'action n'a pas pu être enregistrée. Réessayez." });
      }
    } catch {
      setFeedback({ type: 'error', msg: "L'action n'a pas pu être enregistrée. Réessayez." });
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-lg">
      <p className="text-sm text-content-secondary">Statut actuel : {statut}</p>
      <div className="flex flex-col gap-xs">
        <label htmlFor="ref-fiche" className="text-sm font-medium text-content-primary">Référence de la fiche de conformité</label>
        <input
          id="ref-fiche"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="ex. fiche-conformite-trade-republic-v1"
          className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary placeholder:text-content-tertiary focus:border-accent focus:bg-accent-subtle"
        />
      </div>

      {feedback ? (
        <p role="alert" className={`rounded-md border p-sm text-sm ${feedback.type === 'ok' ? 'border-verified-border bg-verified-bg text-content-primary' : 'border-error-border bg-error-bg text-error-fg'}`}>
          {feedback.msg}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-md">
        <button type="button" onClick={() => decide('valider')} disabled={busy || reference.trim().length === 0} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover disabled:opacity-50">
          Valider
        </button>
        <button type="button" onClick={() => decide('bloquer')} disabled={busy} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-surface-card px-lg py-sm font-medium text-content-primary hover:bg-surface-muted disabled:opacity-50">
          Bloquer
        </button>
      </div>
    </div>
  );
}
