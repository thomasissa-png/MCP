/**
 * Connexion Drizzle ORM — Parrainly.
 *
 * Dev (Node) : better-sqlite3 sur un fichier local (DATABASE_URL, defaut ./drizzle/local.db).
 * Prod Cloudflare D1 : instancier drizzle avec le binding D1 dans le Worker/route
 *   (`import { drizzle } from 'drizzle-orm/d1'; drizzle(env.DB, { schema })`) — meme dialecte SQLite,
 *   donc le meme src/db/schema.ts est reutilise sans modification.
 *
 * @fullstack : importer les tables depuis ./schema une fois definies ; l'objet `schema` est deja
 * passe a drizzle() ci-dessous, les requetes relationnelles fonctionneront automatiquement.
 */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

function resolveDbFile(): string {
  const url = process.env.DATABASE_URL ?? 'file:./drizzle/local.db';
  // better-sqlite3 attend un chemin de fichier, pas une URL : on retire le prefixe file:.
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}

const sqlite = new Database(resolveDbFile());
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export { schema };
