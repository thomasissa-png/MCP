/**
 * Fixtures deterministes pour les tests unitaires. Reinitialise TOUTES les tables puis insere un jeu
 * minimal et controle (independant des 9 offres reelles) via la meme connexion `@/db` que la logique
 * testee. Appele en beforeEach : chaque test part d'un etat connu.
 */
import { db } from '@/db';
import {
  attribution,
  lienParrainage,
  magicLinkToken,
  offre,
  parrain,
  session,
  signalement,
} from '@/db/schema';

/** Vide toutes les tables (ordre respectant les FK : enfants avant parents). */
export function resetDb(): void {
  db.delete(signalement).run();
  db.delete(attribution).run();
  db.delete(lienParrainage).run();
  db.delete(offre).run();
  db.delete(parrain).run();
  db.delete(magicLinkToken).run();
  db.delete(session).run();
}

/** ISO YYYY-MM-DD a N jours dans le passe (dates metier de fraicheur). */
export function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

export const THOMAS = 'PAR-THOMAS';
export const EMMANUEL = 'PAR-EMMANUEL';

/**
 * Seed les 2 parrains T&E. `statut` surchargeable pour tester l'exclusion (US-03 crit.9).
 */
export function seedParrains(opts: { thomasStatut?: 'actif' | 'suspendu'; emmanuelStatut?: 'actif' | 'suspendu' } = {}): void {
  db.insert(parrain)
    .values([
      { id: THOMAS, nom: 'Thomas', email: 'thomas@parrainly.test', statut: opts.thomasStatut ?? 'actif' },
      { id: EMMANUEL, nom: 'Emmanuel', email: 'emmanuel@parrainly.test', statut: opts.emmanuelStatut ?? 'actif' },
    ])
    .run();
}

/** Cree une offre `actif` par defaut (dateVerification fraiche). */
export function seedOffre(
  id: string,
  over: Partial<{
    nomProgramme: string;
    categorie: (typeof offre.$inferInsert)['categorie'];
    statut: (typeof offre.$inferInsert)['statut'];
    dateVerification: string | null;
    urlParrainage: string;
  }> = {},
): void {
  db.insert(offre)
    .values({
      id,
      nomProgramme: over.nomProgramme ?? `Programme ${id}`,
      categorie: over.categorie ?? 'Finance personnelle',
      urlParrainage: over.urlParrainage ?? `https://exemple.test/${id}`,
      statut: over.statut ?? 'actif',
      dateVerification: over.dateVerification === undefined ? isoDaysAgo(1) : over.dateVerification,
    })
    .run();
}

/**
 * Cree un lien (unite de rotation). `dateDernierTour` en ms (FIFO), quotaMax null = illimite.
 */
export function seedLien(
  id: string,
  parrainId: string,
  offreId: string,
  over: Partial<{
    quotaMax: number | null;
    quotaUtilise: number;
    dateDernierTour: number | null;
    statut: (typeof lienParrainage.$inferInsert)['statut'];
    url: string;
    createdAt: Date;
  }> = {},
): void {
  db.insert(lienParrainage)
    .values({
      id,
      parrainId,
      offreId,
      urlParrainage: over.url ?? `https://exemple.test/${parrainId}/${offreId}`,
      quotaMax: over.quotaMax === undefined ? null : over.quotaMax,
      quotaUtilise: over.quotaUtilise ?? 0,
      dateDernierTour: over.dateDernierTour === undefined ? null : (over.dateDernierTour === null ? null : new Date(over.dateDernierTour)),
      statut: over.statut ?? 'actif',
      createdAt: over.createdAt ?? new Date(),
    })
    .run();
}
