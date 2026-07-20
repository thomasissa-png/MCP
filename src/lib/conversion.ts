/**
 * Confirmation de conversion par le parrain (US-09). Alimente le NSM (PCA-IA).
 *
 * Garde-fou de plausibilité (tracking §2.7) : sur une fenêtre glissante configurable, le nombre de
 * confirmations déclarées ne doit pas dépasser le nombre de redirections suivies. Au-delà, l'attribution
 * passe `en_verification_manuelle` (pas `confirmee`) et un signalement est créé pour revue back-office.
 */
import { and, eq, gte, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { attribution, signalement } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';
import { PLAUSIBILITY_WINDOW_DAYS } from '@/config/socle';

export type ConfirmResult =
  | { ok: true; statut: 'confirmee' | 'en_verification_manuelle' }
  | { ok: false; error: 'acces_refuse' | 'redirection_absente' | 'fenetre_expiree' };

export function confirmAttribution(
  parrainId: string,
  attributionId: string,
  montantCommission: number | null,
): ConfirmResult {
  return db.transaction((tx): ConfirmResult => {
    const row = tx.select().from(attribution).where(eq(attribution.attributionId, attributionId)).get();
    if (!row || row.parrainId !== parrainId) return { ok: false, error: 'acces_refuse' };

    // Idempotence (US-09 crit.6) : déjà confirmée -> on renvoie le statut sans re-traiter.
    if (row.statut === 'confirmee') return { ok: true, statut: 'confirmee' };
    if (row.statut === 'en_verification_manuelle') return { ok: true, statut: 'en_verification_manuelle' };

    if (!row.dateRedirection) return { ok: false, error: 'redirection_absente' };

    const now = Date.now();
    if (row.statut === 'expiree' || (row.dateExpiration && now > row.dateExpiration.getTime())) {
      tx.update(attribution).set({ statut: 'expiree' }).where(eq(attribution.attributionId, attributionId)).run();
      return { ok: false, error: 'fenetre_expiree' };
    }

    const windowStart = new Date(now - PLAUSIBILITY_WINDOW_DAYS * 86_400_000);

    // Redirections suivies par ce parrain sur la fenêtre.
    const redirections = tx
      .select({ id: attribution.attributionId })
      .from(attribution)
      .where(and(eq(attribution.parrainId, parrainId), isNotNull(attribution.dateRedirection), gte(attribution.dateRedirection, windowStart)))
      .all().length;

    // Confirmations déjà enregistrées par ce parrain sur la fenêtre.
    const confirmations = tx
      .select({ id: attribution.attributionId })
      .from(attribution)
      .where(and(eq(attribution.parrainId, parrainId), eq(attribution.statut, 'confirmee'), isNotNull(attribution.dateConfirmation), gte(attribution.dateConfirmation, windowStart)))
      .all().length;

    const depasse = confirmations + 1 > redirections;
    const statut: 'confirmee' | 'en_verification_manuelle' = depasse ? 'en_verification_manuelle' : 'confirmee';

    const delaiJ = Math.max(0, Math.round((now - row.dateGeneration.getTime()) / 86_400_000));

    tx.update(attribution)
      .set({
        statut,
        dateConfirmation: new Date(now),
        delaiConfirmationJ: delaiJ,
        montantCommission: montantCommission ?? undefined,
        modeConfirmation: 'declaratif_parrain',
      })
      .where(eq(attribution.attributionId, attributionId))
      .run();

    if (depasse) {
      // Signalement pour revue back-office (US-09 crit.7), sans exposer le motif au parrain.
      tx.insert(signalement)
        .values({ id: crypto.randomUUID(), attributionId, offreId: row.offreId, statut: 'ouvert' })
        .run();
    }

    emitEvent('attribution_confirmee', {
      attribution_id: attributionId,
      parrain_id: parrainId,
      offre_id: row.offreId,
      delai_confirmation_jours: delaiJ,
      montant_commission: montantCommission,
      mode_confirmation: 'declaratif_parrain',
      resultat: depasse ? 'en_verification_manuelle' : 'confirme_direct',
    });

    return { ok: true, statut };
  });
}
