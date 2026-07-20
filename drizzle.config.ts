import type { Config } from 'drizzle-kit';

/**
 * Config drizzle-kit — dialecte SQLite (dev better-sqlite3 / prod Cloudflare D1).
 * Migrations generees dans ./drizzle. Scripts : npm run db:generate | db:migrate | db:push | db:studio.
 * DATABASE_URL peut etre "file:./drizzle/local.db" ou un chemin brut.
 */
const url = process.env.DATABASE_URL ?? 'file:./drizzle/local.db';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: url.startsWith('file:') ? url.slice('file:'.length) : url,
  },
  strict: true,
  verbose: true,
} satisfies Config;
