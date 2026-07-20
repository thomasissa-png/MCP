import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Tests unitaires de la logique pure du socle (US-03 arbitrage, US-04 fraicheur, auth, US-09 conversion).
 *
 * DB de test : un fichier SQLite dedie (drizzle/test-unit.db), cree et migre par le globalSetup, puis
 * reinitialise par fixture avant chaque test. Les tests sont serialises (singleFork + fileParallelism
 * false) : une seule connexion `@/db` dans un seul process -> etat DB deterministe, jamais de course
 * entre fichiers de test qui partageraient le meme fichier.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    globalSetup: ['tests/setup/unit-global-setup.ts'],
    env: {
      DATABASE_URL: 'file:./drizzle/test-unit.db',
      // Seuils par defaut explicites (les tests qui en dependent les surchargent au besoin via env deja lu).
      NODE_ENV: 'test',
    },
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    fileParallelism: false,
    reporters: ['default'],
  },
});
