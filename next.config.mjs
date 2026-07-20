/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `better-sqlite3` est un module NATIF (.node) : il ne doit JAMAIS entrer dans le bundle serveur
  // (echec esbuild cote Worker). Il n'est charge que par import dynamique dans la branche Node de
  // getDb() (src/db/index.ts), branche morte sous Workers. `serverExternalPackages` garantit qu'il
  // reste un require externe non resolu au build. Cote Worker, drizzle-orm/d1 + @opennextjs/cloudflare
  // sont, eux, bien bundles (JS pur).
  serverExternalPackages: ['better-sqlite3'],
  // En-tetes de securite de base (durcis ensuite dans monitoring-setup.md : CSP, HSTS complets).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

// Injecte le contexte Cloudflare (bindings D1, vars) pendant `next dev` uniquement (no-op en build/prod).
// Permet a getCloudflareContext() de fonctionner en local via miniflare si besoin. Sans effet en CI.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
