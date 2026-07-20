/**
 * US-03 — Moteur d'arbitrage T&E. Determinisme FIFO, exclusion sur plafond, verrouillage de quota,
 * departage stable, pool vide. Logique pure testee sur la meme connexion `@/db` que la prod.
 *
 * NB : le moteur est desormais async (compat Cloudflare D1). Les rejets metier se testent via
 * `await expect(promise).rejects.toThrow(...)`.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { attribution, lienParrainage, offre } from '@/db/schema';
import { generateAttribution, SocleError } from '@/lib/attribution';
import { EMMANUEL, THOMAS, resetDb, seedLien, seedOffre, seedParrains } from './fixtures';

const OFFRE = 'REF-T1';

beforeEach(async () => {
  await resetDb();
});

describe('generateAttribution — selection deterministe (US-03)', () => {
  it('sert en priorite le lien jamais servi (dateDernierTour NULL) — FIFO', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    // Thomas a deja ete servi hier, Emmanuel jamais (NULL) -> Emmanuel prioritaire.
    await seedLien('LP-T', THOMAS, OFFRE, { dateDernierTour: Date.now() - 86_400_000 });
    await seedLien('LP-E', EMMANUEL, OFFRE, { dateDernierTour: null });

    const res = await generateAttribution({ offreId: OFFRE });
    expect(res.parrainId).toBe(EMMANUEL);
    expect(res.token).toHaveLength(8);
    expect(res.lienId).toBe('LP-E');
  });

  it('sert le lien dont dateDernierTour est la plus ancienne quand aucun n est NULL', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    await seedLien('LP-T', THOMAS, OFFRE, { dateDernierTour: Date.now() - 10 * 86_400_000 }); // plus ancien
    await seedLien('LP-E', EMMANUEL, OFFRE, { dateDernierTour: Date.now() - 2 * 86_400_000 });

    expect((await generateAttribution({ offreId: OFFRE })).parrainId).toBe(THOMAS);
  });

  it('departage deterministe et stable en cas d egalite (createdAt puis id), jamais aleatoire', async () => {
    // Deux egalites parfaites de dateDernierTour (NULL) : le departage doit renvoyer TOUJOURS le meme.
    const chosen = new Set<string>();
    for (let i = 0; i < 5; i += 1) {
      await resetDb();
      await seedParrains();
      await seedOffre(OFFRE);
      const t0 = new Date('2026-01-01T00:00:00Z');
      await seedLien('LP-A', THOMAS, OFFRE, { dateDernierTour: null, createdAt: t0 });
      await seedLien('LP-B', EMMANUEL, OFFRE, { dateDernierTour: null, createdAt: new Date(t0.getTime() + 1000) });
      chosen.add((await generateAttribution({ offreId: OFFRE })).lienId);
    }
    // Un seul et meme lien choisi sur 5 executions identiques : le createdAt le plus ancien.
    expect([...chosen]).toEqual(['LP-A']);
  });
});

describe('generateAttribution — plafonds et exclusion (US-03 crit.2/7)', () => {
  it('incremente le quota et exclut le parrain une fois le plafond atteint', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    await seedLien('LP-E', EMMANUEL, OFFRE, { quotaMax: 1, quotaUtilise: 0 });

    const first = await generateAttribution({ offreId: OFFRE });
    expect(first.parrainId).toBe(EMMANUEL);

    const db = await getDb();
    const lien = await db.select().from(lienParrainage).where(eq(lienParrainage.id, 'LP-E')).get();
    expect(lien?.quotaUtilise).toBe(1); // plafond atteint

    // Plus aucun eligible -> pool_vide + offre bascule en_attente_parrain (US-03 crit.4 -> US-04).
    await expect(generateAttribution({ offreId: OFFRE })).rejects.toThrow(SocleError);
    const offreRow = await db.select().from(offre).where(eq(offre.id, OFFRE)).get();
    expect(offreRow?.statut).toBe('en_attente_parrain');
  });

  it('plafond atteint exactement (quotaUtilise = quotaMax - 1) : sert puis exclut immediatement (crit.7)', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    await seedLien('LP-E', EMMANUEL, OFFRE, { quotaMax: 3, quotaUtilise: 2 });

    await generateAttribution({ offreId: OFFRE });
    const db = await getDb();
    const lien = await db.select().from(lienParrainage).where(eq(lienParrainage.id, 'LP-E')).get();
    expect(lien?.quotaUtilise).toBe(3);
    // La requete suivante ne doit PAS depasser le plafond.
    await expect(generateAttribution({ offreId: OFFRE })).rejects.toThrow('pool_vide');
    const count = (await db.select().from(attribution).all()).length;
    expect(count).toBe(1); // une seule attribution, pas de surplus
  });

  it('exclut un parrain suspendu quel que soit son quota restant (crit.9)', async () => {
    await seedParrains({ emmanuelStatut: 'suspendu' });
    await seedOffre(OFFRE);
    await seedLien('LP-E', EMMANUEL, OFFRE, { quotaMax: null }); // illimite mais parrain suspendu
    await seedLien('LP-T', THOMAS, OFFRE, { quotaMax: null });

    expect((await generateAttribution({ offreId: OFFRE })).parrainId).toBe(THOMAS);
  });

  it('exclut un lien au statut invalide/suspendu (incoherence, crit.5)', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    await seedLien('LP-E', EMMANUEL, OFFRE, { statut: 'invalide' });
    await seedLien('LP-T', THOMAS, OFFRE, { statut: 'actif' });

    expect((await generateAttribution({ offreId: OFFRE })).parrainId).toBe(THOMAS);
  });
});

describe('generateAttribution — offre indisponible / pool vide (US-03 crit.4)', () => {
  it('offre inexistante -> SocleError(offre_indisponible)', async () => {
    await seedParrains();
    await expect(generateAttribution({ offreId: 'INEXISTANTE' })).rejects.toThrow('offre_indisponible');
  });

  it('offre non actif (restreint) -> offre_indisponible, aucune attribution creee', async () => {
    await seedParrains();
    await seedOffre(OFFRE, { statut: 'restreint' });
    await seedLien('LP-E', EMMANUEL, OFFRE);
    await expect(generateAttribution({ offreId: OFFRE })).rejects.toThrow('offre_indisponible');
    const db = await getDb();
    expect((await db.select().from(attribution).all()).length).toBe(0);
  });

  it('pool vide des le depart -> pool_vide + offre en_attente_parrain, aucune attribution', async () => {
    await seedParrains();
    await seedOffre(OFFRE); // aucune ligne lien_parrainage
    await expect(generateAttribution({ offreId: OFFRE })).rejects.toThrow('pool_vide');
    const db = await getDb();
    expect((await db.select().from(attribution).all()).length).toBe(0);
    const offreRow = await db.select().from(offre).where(eq(offre.id, OFFRE)).get();
    expect(offreRow?.statut).toBe('en_attente_parrain');
  });
});

describe('generateAttribution — rotation FIFO sur appels successifs', () => {
  it('alterne entre Thomas et Emmanuel (quota illimite, chacun sert a son tour)', async () => {
    await seedParrains();
    await seedOffre(OFFRE);
    await seedLien('LP-T', THOMAS, OFFRE, { dateDernierTour: null, createdAt: new Date('2026-01-01T00:00:00Z') });
    await seedLien('LP-E', EMMANUEL, OFFRE, { dateDernierTour: null, createdAt: new Date('2026-01-02T00:00:00Z') });

    const p1 = (await generateAttribution({ offreId: OFFRE })).parrainId; // T (createdAt plus ancien)
    const p2 = (await generateAttribution({ offreId: OFFRE })).parrainId; // E (T vient d etre servi)
    const p3 = (await generateAttribution({ offreId: OFFRE })).parrainId; // T de nouveau
    expect([p1, p2, p3]).toEqual([THOMAS, EMMANUEL, THOMAS]);
  });
});
