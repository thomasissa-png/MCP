<!-- Version: 2026-07-20 (v2) — @qa — Phase 2 : + E2E US-02/05/07, a11y axe-core, screenshots etats CTA -->

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
| US-02 | Édition offre → persistance + re-vérification datée + event `offre_mise_a_jour` | `tests/e2e/us-02-catalogue.spec.ts:24` | E2E | [LIVE] PASS |
| US-02 | Garde-fou plafond : activation sans plafond → 400 `plafond_manquant` | `tests/e2e/us-02-catalogue.spec.ts:53` | E2E | [LIVE] PASS |
| US-02 | Réactivation suspendu→actif → event `offre_activee` + persistance | `tests/e2e/us-02-catalogue.spec.ts:62` | E2E | [LIVE] PASS |
| US-02 | Édition sans session → 401 | `tests/e2e/us-02-catalogue.spec.ts:87` | E2E | [LIVE] PASS |
| US-05 | Dashboard authentifié : carte prime + liste des liens | `tests/e2e/us-05-dashboard.spec.ts:11` | E2E | [LIVE] PASS |
| US-05 | Accès sans session → redirection connexion (returnTo préservé) | `tests/e2e/us-05-dashboard.spec.ts:34` | E2E | [LIVE] PASS |
| US-07 | Valider sans référence fiche → 400 `reference_fiche_manquante` | `tests/e2e/us-07-validation.spec.ts:29` | E2E | [LIVE] PASS |
| US-07 | Bloquer → `en_attente_verification` + event `offre_bloquee_conformite` | `tests/e2e/us-07-validation.spec.ts:38` | E2E | [LIVE] PASS |
| US-07 | Valider → `actif` + event `offre_validee_conformite` | `tests/e2e/us-07-validation.spec.ts:51` | E2E | [LIVE] PASS |
| US-07 | Décision inconnue → 400 ; offre inconnue → 404 ; sans session → 401 | `tests/e2e/us-07-validation.spec.ts:67` | E2E | [LIVE] PASS |
| A11y | Accueil / page-offre / dashboard : 0 violation serious/critical (axe-core) | `tests/e2e/a11y.spec.ts:33` | E2E | [LIVE] PASS |
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
| US-08 | Non couverte | Droits RGPD : formulaire public existant, parcours à tester. |

## Boucle visuelle — états du composant `OfferCta`

- `scripts/screenshots.mjs` : accueil + page-offre (états `default`), 3 devices → `tests/screenshots/`.
- `scripts/screenshots-cta.mjs` (nouveau) : états **`empty`** (attribution 404) et **`error`** (attribution 500)
  du composant `OfferCta`, forcés par interception réseau (`route.fulfill`), 3 devices, `reducedMotion` →
  `tests/screenshots/cta-{empty,error}-{mobile,tablet,desktop}.png`. Lus visuellement (critères Thomas) : PASS.

## Enrichissements recommandés (non bloquants pour cette vague)

- Test de concurrence réel du verrouillage transactionnel (US-03 crit.6) : SQLite sérialise les écritures,
  couvert indirectement par le plafond exact unitaire ; un test 2 requêtes simultanées reste à ajouter.
- Régression visuelle pixel-diff sur les baselines `tests/screenshots/` (produites par @fullstack).
- Étendre axe-core aux parcours clavier dédiés (ordre de focus, piège) par écran.
