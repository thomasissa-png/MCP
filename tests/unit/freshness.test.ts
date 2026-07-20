/**
 * US-04 — Job de fraicheur. Retrait des offres perimees / pool vide, principe fail-safe (jamais de
 * retrait par erreur), traitement isole par offre, seuil a la limite exacte = expiree (crit.7).
 *
 * NB : runFreshnessCheck est async (compat Cloudflare D1) -> tous les appels sont awaited.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { offre } from '@/db/schema';
import { runFreshnessCheck } from '@/lib/freshness';
import { EMMANUEL, isoDaysAgo, resetDb, seedLien, seedOffre, seedParrains } from './fixtures';

beforeEach(async () => {
  await resetDb();
  await seedParrains();
});

async function statutOf(id: string): Promise<string | undefined> {
  const db = await getDb();
  return (await db.select({ s: offre.statut }).from(offre).where(eq(offre.id, id)).get())?.s;
}

describe('runFreshnessCheck — expiration de fraicheur (US-04 crit.1/7)', () => {
  it('expire une offre dont la date de verification depasse le seuil', async () => {
    await seedOffre('REF-STALE', { dateVerification: isoDaysAgo(45) });
    await seedLien('LP-E', EMMANUEL, 'REF-STALE');

    const res = await runFreshnessCheck(30);
    expect(res.ok).toBe(true);
    expect(res.offres_expirees).toBe(1);
    expect(await statutOf('REF-STALE')).toBe('expire');
  });

  it('a la limite EXACTE du seuil : traite comme expiree (principe de precaution, crit.7)', async () => {
    await seedOffre('REF-LIMIT', { dateVerification: isoDaysAgo(30) });
    await seedLien('LP-E', EMMANUEL, 'REF-LIMIT');

    await runFreshnessCheck(30);
    expect(await statutOf('REF-LIMIT')).toBe('expire');
  });

  it('ne touche pas une offre fraiche avec un pool eligible (aucun faux positif)', async () => {
    await seedOffre('REF-FRESH', { dateVerification: isoDaysAgo(2) });
    await seedLien('LP-E', EMMANUEL, 'REF-FRESH');

    const res = await runFreshnessCheck(30);
    expect(res.offres_expirees).toBe(0);
    expect(res.offres_en_attente_parrain).toBe(0);
    expect(await statutOf('REF-FRESH')).toBe('actif');
  });

  it('date_verification absente (NaN) : ne declenche PAS l expiration de fraicheur', async () => {
    await seedOffre('REF-NODATE', { dateVerification: null });
    await seedLien('LP-E', EMMANUEL, 'REF-NODATE');

    await runFreshnessCheck(30);
    expect(await statutOf('REF-NODATE')).toBe('actif');
  });
});

describe('runFreshnessCheck — pool vide (US-04 crit.3)', () => {
  it('bascule une offre fraiche mais sans lien eligible en en_attente_parrain', async () => {
    await seedOffre('REF-EMPTY', { dateVerification: isoDaysAgo(1) }); // aucun lien

    const res = await runFreshnessCheck(30);
    expect(res.offres_en_attente_parrain).toBe(1);
    expect(await statutOf('REF-EMPTY')).toBe('en_attente_parrain');
  });

  it('offre fraiche dont l unique lien est au plafond -> en_attente_parrain', async () => {
    await seedOffre('REF-CAP', { dateVerification: isoDaysAgo(1) });
    await seedLien('LP-E', EMMANUEL, 'REF-CAP', { quotaMax: 5, quotaUtilise: 5 });

    await runFreshnessCheck(30);
    expect(await statutOf('REF-CAP')).toBe('en_attente_parrain');
  });
});

describe('runFreshnessCheck — fail-safe et isolation (US-04 crit.4)', () => {
  it('traite chaque offre isolement : une offre expiree n empeche pas une autre de rester saine', async () => {
    await seedOffre('REF-STALE', { dateVerification: isoDaysAgo(90) });
    await seedLien('LP-E1', EMMANUEL, 'REF-STALE');
    await seedOffre('REF-OK', { dateVerification: isoDaysAgo(1) });
    await seedLien('LP-E2', EMMANUEL, 'REF-OK');

    const res = await runFreshnessCheck(30);
    expect(res.ok).toBe(true);
    expect(res.offres_expirees).toBe(1);
    expect(await statutOf('REF-STALE')).toBe('expire');
    expect(await statutOf('REF-OK')).toBe('actif'); // preservee
  });

  it('n examine que les offres actif (les statuts non-actif sont ignores)', async () => {
    await seedOffre('REF-SUSP', { statut: 'suspendu', dateVerification: isoDaysAgo(90) });
    const res = await runFreshnessCheck(30);
    expect(res.offres_expirees).toBe(0);
    expect(await statutOf('REF-SUSP')).toBe('suspendu'); // inchangee
  });

  it('liens_invalides reste 0 (detection HTTP deferee, contrat vague 2a)', async () => {
    await seedOffre('REF-OK', { dateVerification: isoDaysAgo(1) });
    await seedLien('LP-E', EMMANUEL, 'REF-OK');
    expect((await runFreshnessCheck(30)).liens_invalides).toBe(0);
  });
});
