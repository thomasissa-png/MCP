/**
 * US-09 — Confirmation de conversion par le parrain. Garde-fou de plausibilite (confirmations <=
 * redirections sur fenetre glissante), fenetre de conversion, cross-parrain (403), idempotence.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { attribution, signalement } from '@/db/schema';
import { confirmAttribution } from '@/lib/conversion';
import { EMMANUEL, THOMAS, resetDb, seedOffre, seedParrains } from './fixtures';

const OFFRE = 'REF-C1';

beforeEach(() => {
  resetDb();
  seedParrains();
  seedOffre(OFFRE);
});

/** Insere une attribution controlee et renvoie son id. */
function insertAttribution(over: Partial<typeof attribution.$inferInsert> = {}): string {
  const id = over.attributionId ?? crypto.randomUUID();
  db.insert(attribution)
    .values({
      attributionId: id,
      offreId: OFFRE,
      parrainId: over.parrainId ?? EMMANUEL,
      token: over.token ?? crypto.randomUUID().replace(/-/g, '').slice(0, 8),
      statut: over.statut ?? 'en_attente',
      dateGeneration: over.dateGeneration ?? new Date(Date.now() - 10 * 86_400_000),
      dateRedirection: over.dateRedirection === undefined ? new Date(Date.now() - 9 * 86_400_000) : over.dateRedirection,
      dateExpiration: over.dateExpiration === undefined ? new Date(Date.now() + 40 * 86_400_000) : over.dateExpiration,
      dateConfirmation: over.dateConfirmation,
      ...over,
    })
    .run();
  return id;
}

describe('confirmAttribution — happy path (US-09 crit.1/2)', () => {
  it('confirme une attribution suivie -> statut confirmee, mode declaratif, montant enregistre', () => {
    const id = insertAttribution();
    const res = confirmAttribution(EMMANUEL, id, 35);
    expect(res).toEqual({ ok: true, statut: 'confirmee' });

    const row = db.select().from(attribution).where(eq(attribution.attributionId, id)).get();
    expect(row?.statut).toBe('confirmee');
    expect(row?.modeConfirmation).toBe('declaratif_parrain');
    expect(row?.montantCommission).toBe(35);
    expect(row?.dateConfirmation).not.toBeNull();
  });
});

describe('confirmAttribution — garde-fou de plausibilite (US-09 crit.7)', () => {
  it('bascule en_verification_manuelle + cree un signalement quand confirmations+1 > redirections', () => {
    // Une confirmation deja enregistree SANS redirection (gonfle les confirmations, pas les redirections).
    insertAttribution({ statut: 'confirmee', dateRedirection: null, dateConfirmation: new Date(Date.now() - 86_400_000) });
    // L attribution a confirmer : la seule avec une redirection -> redirections = 1, confirmations = 1.
    const id = insertAttribution();

    const res = confirmAttribution(EMMANUEL, id, null);
    expect(res).toEqual({ ok: true, statut: 'en_verification_manuelle' });

    const row = db.select().from(attribution).where(eq(attribution.attributionId, id)).get();
    expect(row?.statut).toBe('en_verification_manuelle');
    const sign = db.select().from(signalement).where(eq(signalement.attributionId, id)).all();
    expect(sign).toHaveLength(1);
    expect(sign[0]?.statut).toBe('ouvert');
  });

  it('accepte directement tant que confirmations restent <= redirections', () => {
    // Deux redirections suivies (2 attributions cliquees), aucune confirmation prealable.
    insertAttribution();
    const id = insertAttribution();
    const res = confirmAttribution(EMMANUEL, id, null);
    expect(res).toEqual({ ok: true, statut: 'confirmee' });
  });
});

describe('confirmAttribution — garde-fous d acces et de fenetre', () => {
  it('cross-parrain : une attribution d Emmanuel confirmee par Thomas -> acces_refuse (403)', () => {
    const id = insertAttribution({ parrainId: EMMANUEL });
    expect(confirmAttribution(THOMAS, id, null)).toEqual({ ok: false, error: 'acces_refuse' });
  });

  it('attribution jamais cliquee (date_redirection nulle) -> redirection_absente', () => {
    const id = insertAttribution({ dateRedirection: null });
    expect(confirmAttribution(EMMANUEL, id, null)).toEqual({ ok: false, error: 'redirection_absente' });
  });

  it('fenetre de conversion depassee -> fenetre_expiree + statut expiree', () => {
    const id = insertAttribution({ dateExpiration: new Date(Date.now() - 86_400_000) });
    expect(confirmAttribution(EMMANUEL, id, null)).toEqual({ ok: false, error: 'fenetre_expiree' });
    const row = db.select().from(attribution).where(eq(attribution.attributionId, id)).get();
    expect(row?.statut).toBe('expiree');
  });
});

describe('confirmAttribution — idempotence (US-09 crit.6)', () => {
  it('deja confirmee : renvoie le statut sans re-traiter ni creer de doublon', () => {
    const id = insertAttribution();
    confirmAttribution(EMMANUEL, id, 35);
    const again = confirmAttribution(EMMANUEL, id, 99);
    expect(again).toEqual({ ok: true, statut: 'confirmee' });

    const row = db.select().from(attribution).where(eq(attribution.attributionId, id)).get();
    expect(row?.montantCommission).toBe(35); // pas ecrase par le 2e appel
  });
});
