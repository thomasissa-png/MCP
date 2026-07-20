/**
 * Configuration de l'adaptateur OpenNext -> Cloudflare Workers (Parrainly).
 *
 * `@opennextjs/cloudflare` transforme la sortie `next build` (App Router, Next 15) en un Worker
 * (`.open-next/worker.js`) + les assets statiques, servis par le binding `ASSETS` declare dans
 * `wrangler.jsonc`. La config par defaut suffit pour Parrainly :
 *   - pas de cache incrementiel externe (ISR minimal : pages majoritairement dynamiques/serveur) ;
 *   - le binding D1 `DB` et les vars sont declares cote wrangler, pas ici ;
 *   - `nodejs_compat` (wrangler.jsonc) fournit les polyfills Node requis par Next.
 *
 * @see docs/infra/deploy-cloudflare-runbook.md — deploiement clef-en-main (compte Thomas requis).
 */
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({});
