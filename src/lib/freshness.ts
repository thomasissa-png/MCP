/**
 * Job de fraicheur US-04 : retire automatiquement les offres perimees ou dont le pool est vide.
 *
 * Principe FAIL-SAFE (US-04 crit.4) : le job ne casse JAMAIS le catalogue. Chaque offre est traitee
 * isolement (try/catch par offre) ; une erreur sur une offre n'affecte pas les autres et ne provoque
 * aucun retrait par defaut. A la limite exacte de fraicheur = expiree (crit.7, precaution).
 */
import { and, eq, isNull, lt, or } from 'drizzle-orm';
import { db } from '@/db';
import { lienParrainage, offre, parrain } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';
import { FRESHNESS_MAX_DAYS } from '@/config/socle';

export type FreshnessResult = {
  ok: boolean;
  offres_expirees: number;
  offres_en_attente_parrain: number;
  liens_invalides: number;
};

/** Age en jours (entier) depuis une date ISO YYYY-MM-DD. NaN si date absente/invalide. */
function ageInDays(isoDate: string | null): number {
  if (!isoDate) return Number.NaN;
  const parsed = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed)) return Number.NaN;
  return Math.floor((Date.now() - parsed) / 86_400_000);
}

/** Nombre de liens eligibles (parrain actif, lien actif, quota non atteint) pour une offre. */
function eligibleCount(offreId: string): number {
  return db
    .select({ id: lienParrainage.id })
    .from(lienParrainage)
    .innerJoin(parrain, eq(parrain.id, lienParrainage.parrainId))
    .where(
      and(
        eq(lienParrainage.offreId, offreId),
        eq(lienParrainage.statut, 'actif'),
        eq(parrain.statut, 'actif'),
        or(isNull(lienParrainage.quotaMax), lt(lienParrainage.quotaUtilise, lienParrainage.quotaMax)),
      ),
    )
    .all().length;
}

export function runFreshnessCheck(maxAgeDays: number = FRESHNESS_MAX_DAYS): FreshnessResult {
  let offresExpirees = 0;
  let offresEnAttente = 0;

  try {
    const actives = db.select().from(offre).where(eq(offre.statut, 'actif')).all();

    for (const row of actives) {
      try {
        // 1) Fraicheur : date_verification trop ancienne -> expire (a la limite exacte = expiree).
        const age = ageInDays(row.dateVerification);
        if (!Number.isNaN(age) && age >= maxAgeDays) {
          db.update(offre)
            .set({ statut: 'expire', updatedAt: new Date() })
            .where(eq(offre.id, row.id))
            .run();
          emitEvent('offre_expiree_auto', { offre_id: row.id, age_jours: age });
          offresExpirees += 1;
          continue; // deja retiree, inutile de tester le pool
        }

        // 2) Pool vide -> en attente de parrain (US-04 crit.3).
        if (eligibleCount(row.id) === 0) {
          db.update(offre)
            .set({ statut: 'en_attente_parrain', updatedAt: new Date() })
            .where(eq(offre.id, row.id))
            .run();
          emitEvent('offre_en_attente_parrain', { offre_id: row.id });
          offresEnAttente += 1;
        }
      } catch {
        // Fail-safe : on ignore l'offre en erreur, statut precedent conserve, aucune propagation.
      }
    }

    return {
      ok: true,
      offres_expirees: offresExpirees,
      offres_en_attente_parrain: offresEnAttente,
      // Detection automatique de lien mort par ping HTTP : hors perimetre vague 2a (deferee).
      liens_invalides: 0,
    };
  } catch {
    // Echec global : aucun retrait par erreur, statut precedent conserve (US-04 crit.4).
    return {
      ok: false,
      offres_expirees: offresExpirees,
      offres_en_attente_parrain: offresEnAttente,
      liens_invalides: 0,
    };
  }
}
