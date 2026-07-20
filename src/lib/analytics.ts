/**
 * Emission d'events analytics cote serveur (tracking-plan.md).
 *
 * Sink PLUGGABLE :
 *   - `POSTHOG_KEY` present -> capture server-side via posthog-node (batché, best-effort, jamais bloquant).
 *   - sinon -> repli journalisation structuree (stdout JSON), consommable par un collecteur de logs.
 *
 * Le PILOTE tourne SANS cle : le build et les tests ne dependent d'aucun compte externe. Aucune
 * exception n'est jamais propagee a l'appelant (l'analytics ne doit jamais casser une reponse HTTP).
 *
 * @data-analyst : Plausible (audience) est branche cote CLIENT (lib/analytics-client.ts), conditionne
 * au consentement du CookieBanner. Ici on ne traite que les events serveur (moteur, redirection, auth).
 */
import { PostHog } from 'posthog-node';
import { POSTHOG_KEY, POSTHOG_HOST } from '@/config/analytics';

/** Union des events du tracking-plan emis cote SERVEUR (vague 2a + auth). */
export type SocleEvent =
  | 'lien_redirection_suivie'
  | 'attribution_moteur_execute'
  | 'attribution_parrain_exclu'
  | 'offre_expiree_auto'
  | 'offre_en_attente_parrain'
  | 'lien_invalide_detecte'
  | 'lien_signale'
  | 'lien_priorite_reverification'
  // Espace parrain (US-02/05/07/09 + auth magic-link)
  | 'connexion_lien_demande'
  | 'connexion_lien_ouvert'
  | 'session_parrain_ouverte'
  | 'session_parrain_expiree'
  | 'offre_mise_a_jour'
  | 'offre_mise_a_jour_echec'
  | 'offre_activee'
  | 'offre_validee_conformite'
  | 'offre_bloquee_conformite'
  | 'attribution_confirmee';

/* -------------------------------------------------------------------------- */
/* Sink PostHog (lazy singleton, actif seulement si POSTHOG_KEY present)         */
/* -------------------------------------------------------------------------- */

let posthog: PostHog | null | undefined;

function getPosthog(): PostHog | null {
  if (posthog !== undefined) return posthog;
  if (!POSTHOG_KEY) {
    posthog = null;
    return null;
  }
  try {
    // Instancie uniquement si une cle est configuree (flushAt: 1 => envoi immediat, adapte au serverless).
    posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST, flushAt: 1, flushInterval: 0 });
  } catch {
    posthog = null;
  }
  return posthog;
}

/** Choisit un identifiant de distinction stable et NON civil (RGPD) : session anonyme sinon 'server'. */
function distinctIdFrom(properties: Record<string, unknown>): string {
  const candidate = properties.session_id ?? properties.attribution_id ?? properties.offre_id;
  return typeof candidate === 'string' && candidate ? candidate : 'server';
}

export function emitEvent(event: SocleEvent, properties: Record<string, unknown> = {}): void {
  const client = getPosthog();
  if (client) {
    try {
      client.capture({ distinctId: distinctIdFrom(properties), event, properties });
      return;
    } catch {
      // bascule sur le repli console ci-dessous, ne jamais throw.
    }
  }
  // Repli : structure stable { ts, event, ...props }, prefixe filtrable cote log.
  const payload = JSON.stringify({ ts: new Date().toISOString(), event, ...properties });
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${payload}`);
}

/** Vide le buffer PostHog (a appeler avant l'arret d'un worker serverless si delivrance garantie requise). */
export async function flushAnalytics(): Promise<void> {
  const client = posthog;
  if (client) {
    try {
      await client.shutdown();
    } catch {
      // best-effort
    }
    posthog = undefined;
  }
}
