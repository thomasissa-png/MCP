/**
 * Connexion Drizzle ORM — Parrainly. Compatible dev/test Node ET Cloudflare D1 (Workers).
 *
 * ── Pourquoi `getDb()` et plus un singleton `db` ────────────────────────────────────────────────
 * Sur Cloudflare Workers, le binding D1 n'existe QUE par requete (via `getCloudflareContext().env.DB`),
 * jamais au niveau module. Un singleton cree a l'import (better-sqlite3, module natif) ne peut donc pas
 * exister cote Worker. `getDb()` resout le driver a la demande, par requete.
 *
 * ── Choix du driver (runtime) ───────────────────────────────────────────────────────────────────
 *   - Workers  : `drizzle-orm/d1` sur le binding D1 (async).
 *   - Node     : `drizzle-orm/better-sqlite3` sur un fichier local (sync). Singleton mis en cache.
 * Le discriminant `navigator.userAgent === 'Cloudflare-Workers'` n'exige AUCUN import : il evite de
 * charger `@opennextjs/cloudflare`/`drizzle-orm/d1` cote Node et `better-sqlite3` cote Worker.
 *
 * ── PIEGE CRITIQUE (bundle Worker) ──────────────────────────────────────────────────────────────
 * `better-sqlite3` est un module natif : il ne doit JAMAIS entrer dans le bundle Worker. Il est donc
 * charge par IMPORT DYNAMIQUE, uniquement dans la branche Node (jamais d'`import` statique au top). Le
 * type `BetterSQLite3Database` est importe en `import type` (efface a la compilation, zero runtime).
 *
 * ── Typage unifie ───────────────────────────────────────────────────────────────────────────────
 * `getDb()` est type `BetterSQLite3Database` (les deux drivers etendent `BaseSQLiteDatabase`). Le code
 * appelant doit `await` CHAQUE terminal de requete (`.get()/.all()/.run()`) : no-op en Node (valeur
 * synchrone), resolution de Promise sous D1. Les ecritures atomiques passent par `runAtomic()`.
 *
 * @see docs/dev-decisions.md — port des transactions vers batch() et limites semantiques D1.
 */
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { BatchItem } from 'drizzle-orm/batch';
import * as schema from './schema';

/** Type de base partage par les deux drivers. On expose la surface better-sqlite3 (voir en-tete). */
export type AppDatabase = BetterSQLite3Database<typeof schema>;

/** Vrai dans l'isolate Cloudflare Workers (aucun import requis). */
function isCloudflareWorkers(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';
}

function resolveDbFile(): string {
  const url = process.env.DATABASE_URL ?? 'file:./drizzle/local.db';
  // better-sqlite3 attend un chemin de fichier, pas une URL : on retire le prefixe file:.
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}

// Singleton Node uniquement (dev/test). Cote Workers, l'instance est reconstruite par requete car le
// binding D1 n'est disponible que dans le contexte de la requete courante.
let nodeDb: AppDatabase | null = null;

/**
 * Renvoie l'instance Drizzle adaptee au runtime courant. A appeler PAR REQUETE (ne pas mettre en
 * cache le resultat au niveau module cote Worker).
 */
export async function getDb(): Promise<AppDatabase> {
  if (isCloudflareWorkers()) {
    // Imports dynamiques : jamais charges cote Node/tests, jamais dans le bundle si branche morte.
    const [{ getCloudflareContext }, { drizzle }] = await Promise.all([
      import('@opennextjs/cloudflare'),
      import('drizzle-orm/d1'),
    ]);
    // Le binding D1 `DB` est injecte par Cloudflare (declare cote wrangler en Phase B @infrastructure).
    // On y accede via cast (pas encore dans le type CloudflareEnv) ; drizzle infere le reste.
    const { env } = getCloudflareContext();
    const binding = (env as unknown as { DB: unknown }).DB;
    // On type le retour comme la surface better-sqlite3 (cf. en-tete) : les terminaux sont awaited
    // partout, donc le comportement async D1 est transparent pour les appelants.
    return drizzle(binding as Parameters<typeof drizzle>[0], { schema }) as unknown as AppDatabase;
  }

  if (!nodeDb) {
    // Import dynamique du module natif : le chemin better-sqlite3 n'est charge qu'en Node.
    const [{ drizzle }, { default: Database }] = await Promise.all([
      import('drizzle-orm/better-sqlite3'),
      import('better-sqlite3'),
    ]);
    const sqlite = new Database(resolveDbFile());
    sqlite.pragma('journal_mode = WAL');
    nodeDb = drizzle(sqlite, { schema });
  }
  return nodeDb;
}

/**
 * Execute un lot d'ecritures de facon ATOMIQUE, quel que soit le driver.
 *   - D1 (Workers)       : `db.batch([...])` natif (tout-ou-rien, un seul aller-retour).
 *   - better-sqlite3 (Node) : `db.transaction(...)` synchrone equivalente (BEGIN/COMMIT, rollback sur throw).
 *
 * LIMITE SEMANTIQUE (irreductible, documentee) : D1 n'a PAS de transaction INTERACTIVE. Les lectures qui
 * decident du contenu du lot s'executent AVANT le batch, hors de la portee atomique. Un « lire -> decider
 * -> ecrire » n'est donc pas serialise contre un ecrivain concurrent sous D1 (fenetre de course possible,
 * ex. double increment de quota US-03 sous forte concurrence). En cercle ferme V1 (trafic faible), le
 * risque est negligeable ; durcissement Phase B : UPDATE conditionnel garde (`WHERE quota < max`) + verif
 * `rowsAffected()`, ou verrou applicatif (Durable Object). Le chemin Node conserve l'atomicite complete.
 */
export async function runAtomic(
  db: AppDatabase,
  statements: readonly [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]],
): Promise<void> {
  const withBatch = db as unknown as {
    batch?: (s: readonly BatchItem<'sqlite'>[]) => Promise<unknown>;
  };
  if (typeof withBatch.batch === 'function') {
    await withBatch.batch(statements);
    return;
  }
  // better-sqlite3 : connexion unique -> les builders (crees depuis `db`) executes dans le callback
  // tombent dans la meme transaction BEGIN/COMMIT. `.run()` applique l'ecriture en dialecte synchrone.
  db.transaction(() => {
    for (const stmt of statements) {
      (stmt as unknown as { run: () => void }).run();
    }
  });
}

/**
 * Nombre de lignes affectees par un resultat `.run()`, quel que soit le driver.
 * better-sqlite3 : `RunResult.changes`. D1 : `D1Result.meta.changes`. Indispensable aux ecritures
 * conditionnelles atomiques (ex. consommation anti-rejeu d'un lien magique).
 */
export function rowsAffected(res: unknown): number {
  const r = res as { changes?: number; meta?: { changes?: number } };
  return r.changes ?? r.meta?.changes ?? 0;
}

export { schema };
