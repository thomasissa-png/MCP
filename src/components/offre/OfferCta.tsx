'use client';

/**
 * Zone CTA dynamique (5 états) — wireframes.md écran 1 zone 7 / design-system §3.1.1 / functional-specs US-01.
 * Appelle POST /api/v1/offres/{id}/attribution, récupère le token, propose la redirection /r/{token}.
 *
 * Déduplication double-clic (US-01 crit.6) : garde `inFlight` (ref) + bouton désactivé pendant le traitement
 * -> une seule Attribution créée. Timeout 3s (US-01 crit.7) : bascule automatique en état erreur, jamais de
 * chargement infini.
 */
import { useRef, useState } from 'react';
import { formatDateFr } from '@/lib/format';

type State = 'default' | 'loading' | 'success' | 'empty' | 'error';

type Props = {
  offreId: string;
  nomProgramme: string;
  dateVerification: string | null;
  servable: boolean;
  categorieSlug: string;
};

export function OfferCta({ offreId, nomProgramme, dateVerification, servable, categorieSlug }: Props) {
  const [state, setState] = useState<State>(servable ? 'default' : 'empty');
  const [lien, setLien] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function generate() {
    if (inFlight.current) return; // dédup double-clic
    inFlight.current = true;
    setState('loading');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`/api/v1/offres/${offreId}/attribution`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ canal_source: 'page_web' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 404 || res.status === 409) {
        setState('empty');
        return;
      }
      if (!res.ok) {
        setState('error');
        return;
      }
      const data = (await res.json()) as { lien_genere?: string };
      if (!data.lien_genere) {
        setState('error');
        return;
      }
      setLien(data.lien_genere);
      setState('success');
    } catch {
      clearTimeout(timeout);
      setState('error');
    } finally {
      inFlight.current = false;
    }
  }

  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center gap-md rounded-lg border border-line bg-surface-muted p-lg text-center">
        <p className="text-content-secondary">Cette offre n&apos;est plus disponible actuellement.</p>
        <a href={`/categories/${categorieSlug}`} className="rounded-md border border-line-strong bg-surface-card px-lg py-sm font-medium text-content-primary hover:bg-surface-muted">
          Voir les autres enseignes vérifiées
        </a>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center gap-md rounded-lg border border-error-border bg-error-bg p-lg text-center">
        <p className="text-error-fg">Impossible de générer votre lien pour le moment. Réessayez dans quelques instants.</p>
        <button type="button" onClick={generate} className="rounded-md border border-line-strong bg-surface-card px-lg py-sm font-medium text-content-primary hover:bg-surface-muted">
          Réessayer
        </button>
      </div>
    );
  }

  if (state === 'success' && lien) {
    return (
      <div className="flex flex-col gap-md rounded-lg border border-verified-border bg-verified-bg p-lg">
        <p className="text-sm text-content-secondary">
          Votre lien de parrainage vérifié le <span className="font-mono">{formatDateFr(dateVerification)}</span> est prêt.
        </p>
        <code className="block overflow-x-auto rounded-md border border-line bg-surface-card px-md py-sm font-mono text-sm text-content-primary">
          {lien}
        </code>
        <a href={lien} className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse transition-colors duration-fast hover:bg-accent-hover">
          Continuer vers {nomProgramme}
        </a>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={generate}
      disabled={state === 'loading'}
      className="inline-flex min-h-11 w-full items-center justify-center gap-sm rounded-md bg-accent px-lg py-sm font-medium text-content-inverse transition-colors duration-fast hover:bg-accent-hover disabled:opacity-60 md:w-auto md:min-w-[480px]"
    >
      {state === 'loading' ? (
        <>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 1.5a6.5 6.5 0 1 0 6.5 6.5" strokeLinecap="round" />
          </svg>
          Génération de votre lien...
        </>
      ) : (
        'Obtenir mon lien de parrainage'
      )}
    </button>
  );
}
