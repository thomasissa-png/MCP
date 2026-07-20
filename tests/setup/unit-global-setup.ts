/**
 * GlobalSetup Vitest : cree la DB unitaire vierge et migree AVANT que les workers n'importent `@/db`
 * (qui ouvre le fichier a l'import). Teardown : supprime le fichier de test (etat propre).
 */
import { createAndMigrate, removeDbFile, dbFileFromUrl } from './apply-migrations.mjs';

const DB_URL = process.env.DATABASE_URL ?? 'file:./drizzle/test-unit.db';
const DB_FILE = dbFileFromUrl(DB_URL);

export default function setup() {
  createAndMigrate(DB_FILE);
  return () => {
    removeDbFile(DB_FILE);
  };
}
