/**
 * Coeur du socle demandeur : generation de token, moteur d'arbitrage (US-03) et resolution de
 * redirection (US-01, /r/{token}).
 *
 * Regle self-fetch (cible Cloudflare) : cette logique est importee DIRECTEMENT par les route handlers,
 * jamais appelee via une URL publique. Aucun appel reseau interne.
 */
import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { getDb, runAtomic } from '@/db';
import { attribution, lienParrainage, offre, parrain } from '@/db/schema';
import { emitEvent } from '@/lib/analytics';
import { CONVERSION_WINDOW_DAYS, TOKEN_LENGTH } from '@/config/socle';

/** Erreur metier typee (code stable, mappe sur les reponses HTTP des routes). */
export class SocleError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'SocleError';
  }
}

// Alphabet url-safe sans caracteres ambigus (0/O, 1/l/I) pour la lisibilite d'un lien copie a la main.
const TOKEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** Genere un token base sur Web Crypto (compatible Node et Cloudflare D1/Workers). */
export function generateToken(length: number = TOKEN_LENGTH): string {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += TOKEN_ALPHABET[(bytes[i] ?? 0) % TOKEN_ALPHABET.length];
  }
  return out;
}

export type GenerateAttributionInput = {
  offreId: string;
  canalSource?: 'page_web' | 'api_json';
  origineDetectee?:
    | 'chatgpt'
    | 'perplexity'
    | 'gemini'
    | 'claude'
    | 'copilot'
    | 'ia_non_identifiee'
    | 'direct_autre';
  sessionId?: string;
};

export type GenerateAttributionResult = {
  attributionId: string;
  token: string;
  parrainId: string;
  lienId: string;
  urlParrainage: string;
};

/**
 * Moteur d'arbitrage US-03 : selectionne un parrain eligible et cree l'attribution, en transaction.
 *
 * Criteres (deterministes, auditables) :
 *   1. Pool eligible = liens de l'offre au statut `actif`, dont le parrain est `actif`, et dont le quota
 *      n'est pas atteint (quotaMax NULL = illimite, sinon quotaUtilise < quotaMax).
 *   2. Tri FIFO : `dateDernierTour` la plus ancienne d'abord (NULL = jamais servi = prioritaire).
 *   3. Departage deterministe si egalite de `dateDernierTour` : ordre d'inscription (`createdAt` puis `id`).
 *      Jamais de tirage aleatoire (US-03 crit.3, auditabilite).
 *   4. Verrouillage transactionnel : la selection, l'increment de quota et la creation de l'attribution
 *      sont atomiques (SQLite serialise les ecritures) -> pas de double depassement de plafond (crit.6).
 *
 * En cercle ferme V1, le pool contient les liens de Thomas et/ou Emmanuel : la rotation FIFO alterne
 * entre leurs deux jeux de liens tant que les deux ont du quota.
 */
export async function generateAttribution(
  input: GenerateAttributionInput,
): Promise<GenerateAttributionResult> {
  const startedAt = Date.now();
  const canalSource = input.canalSource ?? 'page_web';
  const origineDetectee = input.origineDetectee ?? 'direct_autre';
  const db = await getDb();

  try {
    // Architecture « lire -> decider -> ecrire atomiquement » : D1 n'a pas de transaction interactive,
    // on lit d'abord (hors batch), on decide en JS, puis on regroupe les ECRITURES dans un lot atomique
    // (runAtomic = batch D1 / transaction better-sqlite3). Voir limite semantique dans src/db/index.ts.

    // L'offre doit exister et etre diffusable (statut `actif`). `restreint`/`expire`/... -> indisponible.
    const offreRow = await db.select().from(offre).where(eq(offre.id, input.offreId)).get();
    if (!offreRow) throw new SocleError('offre_indisponible');
    if (offreRow.statut !== 'actif') throw new SocleError('offre_indisponible');

    // Pool eligible, deja trie (FIFO + departage deterministe).
    const pool = await db
      .select({
        lienId: lienParrainage.id,
        parrainId: lienParrainage.parrainId,
        url: lienParrainage.urlParrainage,
        quotaMax: lienParrainage.quotaMax,
        quotaUtilise: lienParrainage.quotaUtilise,
      })
      .from(lienParrainage)
      .innerJoin(parrain, eq(parrain.id, lienParrainage.parrainId))
      .where(
        and(
          eq(lienParrainage.offreId, input.offreId),
          eq(lienParrainage.statut, 'actif'),
          eq(parrain.statut, 'actif'),
          or(
            isNull(lienParrainage.quotaMax),
            lt(lienParrainage.quotaUtilise, lienParrainage.quotaMax),
          ),
        ),
      )
      .orderBy(
        asc(lienParrainage.dateDernierTour),
        asc(lienParrainage.createdAt),
        asc(lienParrainage.id),
      )
      .all();

    // Pool vide (US-03 crit.4 -> US-04) : aucune ecriture lancee, la bascule `en_attente_parrain` se
    // fait dans le catch. Plus de risque de « rollback perdu » : les lectures sont hors portee atomique.
    if (pool.length === 0) throw new SocleError('pool_vide');

    const chosen = pool[0];
    if (!chosen) throw new SocleError('pool_vide');

    const attributionId = crypto.randomUUID();
    const token = generateToken();
    const now = new Date();
    const dateExpiration = new Date(now.getTime() + CONVERSION_WINDOW_DAYS * 86_400_000);

    // Ecritures groupees atomiquement : increment de quota + marquage du tour (FIFO), puis creation de
    // l'attribution. Tout-ou-rien (crit.6 : pas de creation d'attribution sans decompte de quota).
    await runAtomic(db, [
      db
        .update(lienParrainage)
        .set({
          quotaUtilise: sql`${lienParrainage.quotaUtilise} + 1`,
          dateDernierTour: now,
        })
        .where(eq(lienParrainage.id, chosen.lienId)),
      db.insert(attribution).values({
        attributionId,
        offreId: input.offreId,
        parrainId: chosen.parrainId,
        lienId: chosen.lienId,
        token,
        canalSource,
        origineDetectee,
        statut: 'en_attente',
        sessionId: input.sessionId,
        dateGeneration: now,
        dateExpiration,
      }),
    ]);

    const result: GenerateAttributionResult = {
      attributionId,
      token,
      parrainId: chosen.parrainId,
      lienId: chosen.lienId,
      urlParrainage: chosen.url,
    };

    // Equite de rotation (US-03) : trace chaque parrain ayant un lien sur l'offre mais ecarte du pool
    // (quota atteint / parrain ou lien non actif). Best-effort, n'affecte jamais la selection deja faite.
    try {
      const candidats = await db
        .select({
          parrainId: lienParrainage.parrainId,
          lienStatut: lienParrainage.statut,
          parrainStatut: parrain.statut,
          quotaMax: lienParrainage.quotaMax,
          quotaUtilise: lienParrainage.quotaUtilise,
        })
        .from(lienParrainage)
        .innerJoin(parrain, eq(parrain.id, lienParrainage.parrainId))
        .where(eq(lienParrainage.offreId, input.offreId))
        .all();
      for (const c of candidats) {
        if (c.parrainId === result.parrainId) continue; // le parrain retenu n'est pas exclu
        let raison: string | null = null;
        if (c.parrainStatut !== 'actif') raison = 'parrain_non_actif';
        else if (c.lienStatut !== 'actif') raison = `lien_${c.lienStatut}`;
        else if (c.quotaMax != null && c.quotaUtilise >= c.quotaMax) raison = 'quota_atteint';
        if (raison) {
          emitEvent('attribution_parrain_exclu', { parrain_id: c.parrainId, offre_id: input.offreId, raison });
        }
      }
    } catch {
      // tracabilite best-effort : ne jamais casser l'attribution deja creee.
    }

    emitEvent('attribution_moteur_execute', {
      offre_id: input.offreId,
      resultat: 'succes',
      duree_ms: Date.now() - startedAt,
    });
    return result;
  } catch (err) {
    const code = err instanceof SocleError ? err.code : 'moteur_indisponible';
    // Pool vide : l'offre bascule "en attente de parrain". Les lectures ayant lieu hors de toute portee
    // atomique (architecture lire->decider->ecrire, cf. src/db/index.ts), cette ecriture est independante
    // et ne peut plus etre "perdue" par un rollback. Test: tests/unit/attribution.test.ts.
    if (code === 'pool_vide') {
      await db
        .update(offre)
        .set({ statut: 'en_attente_parrain', updatedAt: new Date() })
        .where(eq(offre.id, input.offreId))
        .run();
    }
    emitEvent('attribution_moteur_execute', {
      offre_id: input.offreId,
      resultat: code,
      duree_ms: Date.now() - startedAt,
    });
    throw err instanceof SocleError ? err : new SocleError('moteur_indisponible');
  }
}

export type RedirectResolution =
  | { ok: true; url: string; attributionId: string }
  | { ok: false; reason: 'token_invalide' | 'token_expire' | 'offre_indisponible' };

/**
 * Resout un token /r/{token} (US-01) :
 *   - token inconnu -> `token_invalide` (page generique, pas d'exposition de l'enseigne).
 *   - offre non `actif` (dont `restreint` = CGU interdisant la diffusion) -> `offre_indisponible`.
 *   - fenetre de conversion depassee -> attribution passee `expiree`, `token_expire`.
 *   - sinon : journalise la redirection (une seule fois) et renvoie l'URL du lien attribue.
 */
export async function resolveAndRecordRedirect(
  token: string,
  referrer: string | null,
): Promise<RedirectResolution> {
  const db = await getDb();
  const row = await db
    .select({
      attributionId: attribution.attributionId,
      statut: attribution.statut,
      dateGeneration: attribution.dateGeneration,
      dateExpiration: attribution.dateExpiration,
      dateRedirection: attribution.dateRedirection,
      origineDetectee: attribution.origineDetectee,
      lienUrl: lienParrainage.urlParrainage,
      lienStatut: lienParrainage.statut,
      offreStatut: offre.statut,
      offreUrl: offre.urlParrainage,
    })
    .from(attribution)
    .leftJoin(lienParrainage, eq(lienParrainage.id, attribution.lienId))
    .innerJoin(offre, eq(offre.id, attribution.offreId))
    .where(eq(attribution.token, token))
    .get();

  if (!row) {
    // Token inconnu : tentative de redirection sur un lien invalide (page generique servie par la route).
    emitEvent('lien_invalide_detecte', { token, raison: 'token_invalide' });
    return { ok: false, reason: 'token_invalide' };
  }

  // Restriction legale et retraits : seule une offre `actif` est servie.
  if (row.offreStatut !== 'actif') return { ok: false, reason: 'offre_indisponible' };
  if (row.lienStatut && (row.lienStatut === 'invalide' || row.lienStatut === 'suspendu')) {
    return { ok: false, reason: 'offre_indisponible' };
  }

  const now = Date.now();
  if (row.dateExpiration && now > row.dateExpiration.getTime()) {
    if (row.statut === 'en_attente') {
      await db
        .update(attribution)
        .set({ statut: 'expiree' })
        .where(eq(attribution.attributionId, row.attributionId))
        .run();
    }
    return { ok: false, reason: 'token_expire' };
  }

  // Journalise le premier clic reel (US-01 crit.3). Les clics ulterieurs redirigent sans reecrire.
  if (!row.dateRedirection) {
    await db
      .update(attribution)
      .set({ dateRedirection: new Date(now), referrerRedirection: referrer })
      .where(eq(attribution.attributionId, row.attributionId))
      .run();
  }

  emitEvent('lien_redirection_suivie', {
    token,
    attribution_id: row.attributionId,
    referrer_capture: referrer,
    origine_detectee: row.origineDetectee,
    delai_depuis_generation_s: Math.round((now - row.dateGeneration.getTime()) / 1000),
  });

  return { ok: true, url: row.lienUrl ?? row.offreUrl, attributionId: row.attributionId };
}
