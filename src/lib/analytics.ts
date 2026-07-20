/**
 * Emission d'events analytics cote serveur (tracking-plan.md).
 *
 * V1 : journalisation structuree (stdout JSON), consommable par un collecteur de logs ou brancheable
 * sur PostHog cote serveur plus tard. Volontairement synchrone et sans dependance reseau pour ne
 * jamais bloquer une reponse HTTP ni introduire de fire-and-forget (contrainte autoscale).
 *
 * @fullstack vague 2b / @data-analyst : brancher l'envoi PostHog ici (capture server-side) le moment venu.
 */

/** Union des events du tracking-plan touchant le socle demandeur (vague 2a). */
export type SocleEvent =
  | 'lien_redirection_suivie'
  | 'attribution_moteur_execute'
  | 'attribution_parrain_exclu'
  | 'offre_expiree_auto'
  | 'offre_en_attente_parrain'
  | 'lien_invalide_detecte'
  | 'lien_signale'
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

export function emitEvent(event: SocleEvent, properties: Record<string, unknown> = {}): void {
  // Structure stable : { ts, event, ...props }. Le prefixe permet un filtrage cote log.
  const payload = JSON.stringify({ ts: new Date().toISOString(), event, ...properties });
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${payload}`);
}
