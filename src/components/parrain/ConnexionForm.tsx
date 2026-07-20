'use client';

/**
 * Formulaire de connexion magic-link (spec auth §2 ecran A, §3 matrice d'etats). Carte centree
 * (equivalent modal) reutilisant la famille de composant de US-09. Copy exact de la spec.
 */
import { useEffect, useRef, useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConnexionForm({ returnTo }: { returnTo?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [formatError, setFormatError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const emailValid = EMAIL_RE.test(email);

  async function submit() {
    if (inFlight.current || !emailValid) return;
    inFlight.current = true;
    setState('sending');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/magic-link', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, returnTo }),
      });
      if (res.status === 200) {
        setState('sent');
        setCooldown(60);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; retry_after?: number };
      if (res.status === 403) setErrorMsg("Cette adresse n'est pas autorisée à accéder à l'espace parrain.");
      else if (res.status === 429) {
        const mins = Math.max(1, Math.ceil((data.retry_after ?? 60) / 60));
        setErrorMsg(`Trop de demandes de connexion. Réessayez dans ${mins} minute${mins > 1 ? 's' : ''}.`);
      } else if (res.status === 400) setErrorMsg("Format d'email invalide.");
      else setErrorMsg('Impossible d\'envoyer votre lien de connexion pour le moment. Réessayez.');
      setState('error');
    } catch {
      setErrorMsg('Impossible d\'envoyer votre lien de connexion pour le moment. Réessayez.');
      setState('error');
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-line bg-surface-card p-xl shadow-modal">
      <h1 className="text-xl font-bold text-content-primary">Se connecter à l&apos;espace parrain</h1>
      <p className="mt-xs text-sm text-content-secondary">
        Recevez un lien de connexion par email, aucun mot de passe n&apos;est nécessaire.
      </p>

      {state === 'sent' ? (
        <div className="mt-lg flex flex-col gap-md text-center">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M4 7l8 6 8-6" strokeLinecap="round" />
          </svg>
          <p className="font-bold text-content-primary">Vérifiez votre boîte mail</p>
          <p className="text-sm text-content-secondary">
            Nous avons envoyé un lien de connexion à <span className="font-medium text-content-primary">{email}</span>.
            Cliquez dessus pour accéder à votre espace.
          </p>
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={submit}
            className="text-sm text-accent underline disabled:text-content-tertiary disabled:no-underline"
          >
            {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Je n'ai rien reçu, renvoyer le lien"}
          </button>
          <button type="button" onClick={() => { setState('idle'); setEmail(''); }} className="text-sm text-content-secondary underline hover:text-content-primary">
            Utiliser une autre adresse
          </button>
        </div>
      ) : (
        <div className="mt-lg flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="parrain-email" className="text-sm font-medium text-content-primary">Adresse email</label>
            <input
              id="parrain-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormatError(false); }}
              onBlur={() => setFormatError(email.length > 0 && !emailValid)}
              placeholder="vous@exemple.com"
              aria-invalid={formatError || undefined}
              aria-describedby={formatError ? 'email-format-error' : undefined}
              className="min-h-11 rounded-md border border-line bg-surface-card px-md py-sm text-content-primary placeholder:text-content-tertiary focus:border-accent focus:bg-accent-subtle"
            />
            {formatError ? <p id="email-format-error" className="text-sm text-error-fg">Format d&apos;email invalide.</p> : null}
          </div>

          {state === 'error' && errorMsg ? (
            <p role="alert" className="rounded-md border border-error-border bg-error-bg p-sm text-sm text-error-fg">{errorMsg}</p>
          ) : null}

          <button
            type="button"
            onClick={submit}
            disabled={!emailValid || state === 'sending'}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
          >
            {state === 'sending' ? 'Envoi en cours...' : 'Recevoir mon lien de connexion'}
          </button>
        </div>
      )}
    </div>
  );
}
