/**
 * Cree une base SQLite vierge et applique les migrations Drizzle versionnees (drizzle/*.sql).
 * Reutilise par le globalSetup Vitest (DB unitaire) et par scripts/prepare-test-db.mjs (DB E2E).
 *
 * Zero drizzle-kit ici : on rejoue directement le SQL versionne (migrations rejouables, cf. checklist BDD).
 */
import Database from 'better-sqlite3';
import { readFileSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

/** Chemin de fichier a partir d'une DATABASE_URL (file:./x -> ./x). */
export function dbFileFromUrl(url) {
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}

/** Supprime un fichier SQLite et ses annexes WAL/SHM (teardown propre). */
export function removeDbFile(file) {
  for (const suffix of ['', '-wal', '-shm']) {
    try {
      rmSync(`${file}${suffix}`, { force: true });
    } catch {
      // absent : rien a faire
    }
  }
}

/** Cree la DB (from scratch) et applique toutes les migrations dans l'ordre lexicographique. */
export function createAndMigrate(file) {
  removeDbFile(file);
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const migrationsDir = join(ROOT, 'drizzle');
  const sqlFiles = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const f of sqlFiles) {
    const sql = readFileSync(join(migrationsDir, f), 'utf-8');
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim();
      if (trimmed) db.exec(trimmed);
    }
  }

  db.close();
  return file;
}
