<!-- Version: 2026-07-20 — @qa — Phase 2 : couverture de tests du socle + espace parrain -->

# Matrice de traçabilité des tests — Parrainly

Chaque user story critique de `docs/product/functional-specs.md` est reliée à au moins un test exécutable.
Statut `[LIVE]` = exécuté avec serveur/DB réels (E2E) ou logique réelle sur DB (unit), sortie observée.

## Commandes

- Unit (Vitest) : `npm run test:unit` — DB SQLite dédiée `drizzle/test-unit.db` (migrations rejouées, fixtures par test).
- E2E (Playwright) : `npm run test:e2e` — port dynamique, DB `drizzle/test-e2e.db` recréée+seedée avant `next start`, teardown auto.
- Chromium local pré-installé (`/opt/pw-browsers`) ; en CI `npx playwright install chromium` (build 1194, Playwright 1.56.1).

## Matrice US → tests

| US | Intitulé | Test (fichier:ligne) | Type | Statut |
|----|----------|----------------------|------|--------|
| US-01 | Consulter une offre + lien attribué + `/r/{token}` 301 | `tests/e2e/us-01-lien-attribue.spec.ts:11` | E2E | [LIVE] PASS |
| US-01 | Token inconnu → 307 `/lien-invalide` | `tests/e2e/us-01-lien-attribue.spec.ts:51` | E2E | [LIVE] PASS |
| US-03 | Moteur d'arbitrage : FIFO déterministe, départage stable | `tests/unit/attribution.test.ts:24` | Unit | [LIVE] PASS |
| US-03 | Plafond, exclusion, quota exact, suspendu, lien invalide | `tests/unit/attribution.test.ts:60` | Unit | [LIVE] PASS |
| US-03 | Offre indisponible / pool vide → `en_attente_parrain` | `tests/unit/attribution.test.ts:104` | Unit | [LIVE] PASS |
| US-04 | Fraîcheur : expiration, limite exacte, no faux positif | `tests/unit/freshness.test.ts:25` | Unit | [LIVE] PASS |
| US-04 | Pool vide → `en_attente_parrain` | `tests/unit/freshness.test.ts:65` | Unit | [LIVE] PASS |
| US-04 | Fail-safe / isolation par offre | `tests/unit/freshness.test.ts:83` | Unit | [LIVE] PASS |
| Auth | Allowlist T&E (base du 403) | `tests/unit/auth.test.ts:31` | Unit | [LIVE] PASS |
| Auth | Usage unique, expiration, invalidation, hash-only | `tests/unit/auth.test.ts:43` | Unit | [LIVE] PASS |
| Auth | Cooldown, plafond horaire, un seul lien valide | `tests/unit/auth.test.ts:92` | Unit | [LIVE] PASS |
| Auth | Email non autorisé → 403 | `tests/e2e/auth-magic-link.spec.ts:12` | E2E | [LIVE] PASS |
| Auth | Demande → verify → cookie → dashboard ; usage unique → consumed | `tests/e2e/auth-magic-link.spec.ts:18` | E2E | [LIVE] PASS |
| US-06 | Signalement lien mort (UI + ligne en base) | `tests/e2e/us-06-signalement.spec.ts:10` | E2E | [LIVE] PASS |
| US-06 | Offre inconnue → 404 | `tests/e2e/us-06-signalement.spec.ts:33` | E2E | [LIVE] PASS |
| US-09 | Confirmation : happy path, plausibilité, fenêtre, cross-parrain, idempotence | `tests/unit/conversion.test.ts:34` | Unit | [LIVE] PASS |
| US-09 | Confirmation suivie → confirmee ; cross-parrain → 403 | `tests/e2e/us-09-confirmation-conversion.spec.ts:10` | E2E | [LIVE] PASS |
| US-09 | Confirmation sans session → 401 | `tests/e2e/us-09-confirmation-conversion.spec.ts:47` | E2E | [LIVE] PASS |

## Écarts de couverture connus (hors mandat de cette vague, à traiter ensuite)

| US | État | Raison / recommandation |
|----|------|-------------------------|
| US-02 | Non couverte (E2E) | Gestion catalogue back-office : logique PATCH/garde-fou plafond à couvrir en E2E prochaine vague. |
| US-05 | Partielle | Accès dashboard authentifié validé via l'E2E auth ; contenu (prime, quotas, 403 cross-parrain UI) à étoffer. |
| US-07 | Non couverte | Validation de conformité (référence fiche obligatoire, 403 non-admin) : à ajouter. |
| US-08 | Non couverte | Droits RGPD : formulaire public existant, parcours à tester. |

## Enrichissements recommandés (non bloquants pour cette vague)

- axe-core dans chaque E2E (accessibilité WCAG 2.2 AA) — nécessite `@axe-core/playwright`.
- Test de concurrence réel du verrouillage transactionnel (US-03 crit.6) : SQLite sérialise les écritures,
  couvert indirectement par le plafond exact unitaire ; un test 2 requêtes simultanées reste à ajouter.
- Régression visuelle pixel-diff sur les baselines `tests/screenshots/` (produites par @fullstack).
