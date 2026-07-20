'use client';

/**
 * Liste des attributions à confirmer + modal de confirmation (US-09, wireframes.md écran 4, design §3.7).
 * Modal : bottom sheet mobile / centré desktop, fermable X / clic dehors / Escape, focus initial sur le champ.
 * Retour inline post-confirmation (pas de redirection). Dédup double-clic (bouton désactivé).
 */
import { useEffect, useRef, useState } from 'react';

type Item = {
  attributionId: string;
  nomProgramme: string;
  dateRedirection: string | null;
};

type Props = { parrainId: string; items: Item[] };

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AttributionsList({ parrainId, items }: Props) {
  const [open, setOpen] = useState<Item | null>(null);
  const [results, setResults] = useState<Record<string, 'confirmee' | 'en_verification_manuelle'>>({});

  if (items.length === 0) {
    return <p className="rounded-lg border border-line bg-surface-card p-lg text-content-secondary">Aucune conversion à confirmer pour le moment.</p>;
  }

  return (
    <div className="flex flex-col gap-md">
      {items.map((it) => {
        const done = results[it.attributionId];
        return (
          <div key={it.attributionId} className={`rounded-lg border p-lg ${done ? 'border-verified-border bg-verified-bg' : 'border-line bg-surface-card'}`}>
            <div className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-content-primary">{it.nomProgramme}</p>
                <p className="text-sm text-content-secondary">
                  Redirection suivie le <span className="font-mono">{it.dateRedirection ?? '-'}</span>
                </p>
              </div>
              {done ? (
                <p className="text-sm text-content-primary">
                  {done === 'confirmee'
                    ? 'Confirmation enregistrée. Votre prime estimée a été mise à jour.'
                    : 'Confirmation reçue, en cours de vérification.'}
                </p>
              ) : (
                <button type="button" onClick={() => setOpen(it)} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover md:w-auto">
                  Confirmer la conversion
                </button>
              )}
            </div>
          </div>
        );
      })}

      {open ? (
        <ConfirmModal
          parrainId={parrainId}
          item={open}
          onClose={() => setOpen(null)}
          onDone={(statut) => {
            setResults((r) => ({ ...r, [open.attributionId]: statut }));
            setOpen(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ConfirmModal({
  parrainId,
  item,
  onClose,
  onDone,
}: {
  parrainId: string;
  item: Item;
  onClose: () => void;
  onDone: (statut: 'confirmee' | 'en_verification_manuelle') => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [montant, setMontant] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function confirm() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/parrains/${parrainId}/attributions/${item.attributionId}/confirmation`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date_conversion_declaree: date,
          montant_commission_declare: montant ? Number(montant) : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { statut?: string };
      if (res.ok && (data.statut === 'confirmee' || data.statut === 'en_verification_manuelle')) {
        onDone(data.statut);
        return;
      }
      setError('Votre confirmation n\'a pas pu être enregistrée. Réessayez.');
    } catch {
      setError('Votre confirmation n\'a pas pu être enregistrée. Réessayez.');
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Confirmer la conversion ${item.nomProgramme}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-content-primary/40 p-0 md:items-center md:p-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full rounded-t-xl border border-line bg-surface-card p-lg shadow-modal md:max-w-md md:rounded-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="text-lg font-bold text-content-primary">Confirmer la conversion</h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="flex h-11 w-11 items-center justify-center rounded-md text-content-secondary hover:bg-surface-muted">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <p className="mb-md text-sm text-content-secondary">{item.nomProgramme}</p>

        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="conv-date" className="text-sm font-medium text-content-primary">Date de conversion déclarée</label>
            <input
              id="conv-date"
              ref={firstField}
              type="date"
              value={date}
              max={todayIso()}
              min={item.dateRedirection ?? undefined}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent focus:bg-accent-subtle"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label htmlFor="conv-montant" className="text-sm font-medium text-content-primary">Montant de commission (si connu)</label>
            <input
              id="conv-montant"
              type="number"
              min="0"
              step="0.01"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-right font-mono text-content-primary focus:border-accent focus:bg-accent-subtle"
            />
          </div>

          {error ? <p role="alert" className="rounded-md border border-error-border bg-error-bg p-sm text-sm text-error-fg">{error}</p> : null}

          <div className="flex flex-wrap justify-end gap-md">
            <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong bg-surface-card px-lg py-sm font-medium text-content-primary hover:bg-surface-muted">Annuler</button>
            <button type="button" onClick={confirm} disabled={busy} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover disabled:opacity-60">
              {busy ? 'Confirmation...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
