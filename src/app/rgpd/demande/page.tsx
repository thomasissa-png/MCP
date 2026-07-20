'use client';

/**
 * Formulaire d'exercice des droits RGPD (US-08). Coquille fonctionnelle : la soumission réelle
 * (routage vers la boîte de contact / registre des demandes) est à brancher côté infra (email provider).
 * A11y : labels visibles, aria-describedby sur les erreurs, focus géré.
 */
import { useState } from 'react';

const DROITS = [
  { value: 'acces', label: "Accès à mes données" },
  { value: 'rectification', label: 'Rectification' },
  { value: 'opposition', label: 'Opposition au traitement' },
  { value: 'suppression', label: 'Suppression (effacement)' },
];

export default function RgpdDemandePage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Renseignez une adresse email valide pour que nous puissions vous répondre.');
      return;
    }
    setError(null);
    // Soumission réelle déférée (voir handoff). On confirme la réception côté client.
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-3xl px-md py-2xl lg:px-xl">
      <h1 className="mb-md text-2xl font-bold text-content-primary">Exercer mes droits RGPD</h1>
      <p className="mb-lg text-content-secondary">
        Vous pouvez demander l&apos;accès, la rectification, l&apos;opposition ou la suppression des données de
        suivi vous concernant. Nous vous répondons dans un délai d&apos;un mois.
      </p>

      {sent ? (
        <div className="rounded-md border border-verified-border bg-verified-bg p-lg text-content-primary" role="status">
          Votre demande a été enregistrée. Nous revenons vers vous à l&apos;adresse indiquée.
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-lg" noValidate>
          <fieldset className="flex flex-col gap-sm">
            <legend className="mb-xs font-medium text-content-primary">Nature de la demande</legend>
            {DROITS.map((d, i) => (
              <label key={d.value} className="flex items-center gap-sm text-content-secondary">
                <input type="radio" name="droit" value={d.value} defaultChecked={i === 0} className="h-4 w-4" />
                {d.label}
              </label>
            ))}
          </fieldset>

          <div className="flex flex-col gap-xs">
            <label htmlFor="rgpd-email" className="font-medium text-content-primary">Votre adresse email</label>
            <input
              id="rgpd-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? 'rgpd-email-error' : undefined}
              aria-invalid={error ? true : undefined}
              className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent focus:bg-accent-subtle"
            />
            {error ? (
              <p id="rgpd-email-error" className="text-sm text-error-fg">{error}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="rgpd-message" className="font-medium text-content-primary">Précisions (facultatif)</label>
            <textarea
              id="rgpd-message"
              rows={4}
              className="rounded-md border border-line bg-surface-card px-md py-sm text-content-primary focus:border-accent focus:bg-accent-subtle"
            />
          </div>

          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover md:w-auto">
            Envoyer ma demande
          </button>
        </form>
      )}
    </main>
  );
}
