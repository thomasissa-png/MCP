/**
 * Accès lecture aux données de l'espace parrain (US-05/US-09). Server-side, importé par les pages.
 */
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { attribution, lienParrainage, offre } from '@/db/schema';

export type LienRow = {
  offreId: string;
  nomProgramme: string;
  lienStatut: string;
  quotaUtilise: number;
  quotaMax: number | null;
  dateReinitialisation: string | null;
};

export function getLiensForParrain(parrainId: string): LienRow[] {
  return db
    .select({
      offreId: lienParrainage.offreId,
      nomProgramme: offre.nomProgramme,
      lienStatut: lienParrainage.statut,
      quotaUtilise: lienParrainage.quotaUtilise,
      quotaMax: lienParrainage.quotaMax,
      dateReinitialisation: lienParrainage.dateReinitialisation,
    })
    .from(lienParrainage)
    .innerJoin(offre, eq(offre.id, lienParrainage.offreId))
    .where(eq(lienParrainage.parrainId, parrainId))
    .orderBy(offre.nomProgramme)
    .all();
}

/** Prime estimée cumulée = somme des commissions des attributions confirmées du parrain. */
export function getPrimeEstimee(parrainId: string): number {
  const rows = db
    .select({ montant: attribution.montantCommission })
    .from(attribution)
    .where(and(eq(attribution.parrainId, parrainId), eq(attribution.statut, 'confirmee')))
    .all();
  return rows.reduce((sum, r) => sum + (r.montant ?? 0), 0);
}

export type AttributionEnAttente = {
  attributionId: string;
  nomProgramme: string;
  dateRedirection: Date | null;
  dateGeneration: Date;
};

/** Attributions confirmables : statut `en_attente` avec une redirection déjà suivie (US-09 défaut). */
export function getAttributionsAConfirmer(parrainId: string): AttributionEnAttente[] {
  return db
    .select({
      attributionId: attribution.attributionId,
      nomProgramme: offre.nomProgramme,
      dateRedirection: attribution.dateRedirection,
      dateGeneration: attribution.dateGeneration,
    })
    .from(attribution)
    .innerJoin(offre, eq(offre.id, attribution.offreId))
    .where(
      and(
        eq(attribution.parrainId, parrainId),
        eq(attribution.statut, 'en_attente'),
        isNotNull(attribution.dateRedirection),
      ),
    )
    .orderBy(desc(attribution.dateRedirection))
    .all();
}
