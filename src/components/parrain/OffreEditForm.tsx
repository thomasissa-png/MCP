'use client';

/**
 * Formulaire d'édition d'une offre (US-02, wireframes.md écran back-office, design §3.6).
 * PATCH /api/v1/admin/offres/{id}. Dédup double-soumission (bouton désactivé). 5 états.
 */
import { useRef, useState } from 'react';

type Props = {
  offreId: string;
  nomProgramme: string;
  urlParrainage: string;
  codeParrainage: string;
  conditions: string;
  statut: string;
};

const STATUTS = [
  { value: 'actif', label: 'Actif' },
  { value: 'en_attente_verification', label: 'En attente de vérification' },
  { value: 'suspendu', label: 'Suspendu' },
  { value: 'retire', label: 'Retiré' },
];

export function OffreEditForm(props: Props) {
  const [url, setUrl] = useState(props.urlParrainage);
  const [code, setCode] = useState(props.codeParrainage);
  const [conditions, setConditions] = useState(props.conditions);
  const [statut, setStatut] = useState(props.statut);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/offres/${props.offreId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url_parrainage: url, code_parrainage: code, conditions, statut }),
      });
      const data = (await res.json().catch(() => ({}))) as { statut?: string; error?: string };
      if (res.ok) {
        setFeedback({ type: 'ok', msg: `Offre enregistrée. Statut : ${data.statut}.` });
      } else if (data.error === 'plafond_manquant') {
        setFeedback({ type: 'error', msg: 'Le plafond doit être renseigné avant activation.' });
      } else if (data.error === 'statut_invalide') {
        setFeedback({ type: 'error', msg: 'Ce statut ne peut pas être appliqué.' });
      } else {
        setFeedback({ type: 'error', msg: "L'action n'a pas pu être enregistrée. Réessayez." });
      }
    } catch {
      setFeedback({ type: 'error', msg: "L'action n'a pas pu être enregistrée. Réessayez." });
    } finally {
      setSaving(false);
      inFlight.current = false;
    }
  }

  return (
    <form onSubmit={save} className="flex max-w-2xl flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <label htmlFor="edit-url" className="text-sm font-medium text-content-primary">Lien de parrainage</label>
        <input id="edit-url" value={url} onChange={(e) => setUrl(e.target.value)} className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent focus:bg-accent-subtle" />
      </div>
      <div className="flex flex-col gap-xs">
        <label htmlFor="edit-code" className="text-sm font-medium text-content-primary">Code de parrainage</label>
        <input id="edit-code" value={code} onChange={(e) => setCode(e.target.value)} className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm font-mono text-content-primary focus:border-accent focus:bg-accent-subtle" />
      </div>
      <div className="flex flex-col gap-xs">
        <label htmlFor="edit-conditions" className="text-sm font-medium text-content-primary">Conditions (plafond)</label>
        <textarea id="edit-conditions" rows={3} value={conditions} onChange={(e) => setConditions(e.target.value)} className="rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent focus:bg-accent-subtle" />
      </div>
      <div className="flex flex-col gap-xs">
        <label htmlFor="edit-statut" className="text-sm font-medium text-content-primary">Statut</label>
        <select id="edit-statut" value={statut} onChange={(e) => setStatut(e.target.value)} className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent">
          {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {feedback ? (
        <p role="alert" className={`rounded-md border p-sm text-sm ${feedback.type === 'ok' ? 'border-verified-border bg-verified-bg text-content-primary' : 'border-error-border bg-error-bg text-error-fg'}`}>
          {feedback.msg}
        </p>
      ) : null}

      <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover disabled:opacity-60 md:w-auto md:self-start">
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
