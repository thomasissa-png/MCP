<!-- Version: 2026-07-20 — @fullstack — Vague 2a : backend du socle demandeur (public) -->

# Décisions techniques — Parrainly

## Vague 2a : socle demandeur (backend public)

### Modèle de données (`src/db/schema.ts`, dialecte SQLite / D1)

5 tables : `offre` (schéma Emmanuel 20 champs + 3 champs de divulgation legal), `parrain` (cercle fermé T&E), `lien_parrainage` (liaison parrain x offre avec quota propre = unité de rotation), `attribution` (tracking IA→conversion, aligné tracking-plan §2.4), `signalement` (US-06, table posée pour la vague 2b).

- **`lien_parrainage` (table de liaison ajoutée)** : les specs (US-02 crit.2, US-03) exigent que Thomas ET Emmanuel puissent détenir chacun un lien pour la même offre, avec un quota propre. Le quota et le `date_dernier_tour` (FIFO) vivent donc sur la liaison, pas sur l'offre ni le parrain. C'est l'unité que le moteur d'arbitrage fait tourner.
- **Statuts d'offre** : `actif` (diffusable + servable), `restreint` (non diffusable, levier legal générique), `en_attente_verification`, `suspendu`, `retire`, `expire` (US-04), `en_attente_parrain` (US-03 crit.4). Le catalogue public = uniquement `actif`.
- **Dates** : événements en `integer` timestamp_ms (précision + compat D1), dates métier héritées du JSON (`date_ajout`, `date_verification`) en texte ISO tel que fourni par la source.

### Import des 9 offres (`scripts/seed.mjs`, `npm run db:seed`)

- Source UNIQUE = `data/base-parrainage.json` (jamais le .xlsx). Idempotent : `INSERT ... ON CONFLICT(id) DO UPDATE` ; un re-seed PRÉSERVE `quota_utilise` et `date_dernier_tour` (jamais remis à zéro).
- **Zéro donnée inventée** : les 9 liens réels appartiennent à Emmanuel (source Linktree EmelGoez). Thomas est créé comme parrain du cercle fermé mais SANS lien (ses URLs ne sont pas dans la source). La rotation T&E s'activera quand ses liens seront saisis via US-02 (vague 2b).
- **Champs de divulgation calculés** (pas stockés à la main, docs/legal/textes/08) : `divulgation_affiliation` (gabarit systématique), `mention_risque` (crypto → mention crypto-actifs ; catégories d'investissement → perte en capital ; autres → aucune), `mention_non_affiliation`.
- **Plafonds (`quota_max`)** : NULL (illimité) à l'import. Non parsés du texte libre `conditions` (éviter d'inventer un nombre). À renseigner par T&E via US-02.

### Décision fondateur (pilote) : Trade Republic + Kraken NON exclus

Les 9 offres sont importées avec leur `statut` réel du JSON (toutes `actif`), aucune restriction artificielle. Le mécanisme générique piloté par `statut` reste en place (`restreint` = exclusion listing + page générique sur `/r`), configurable via `SOCLE_NON_PUBLIC_PROGRAMS` (défaut vide). La contrainte juridique Trade Republic/Kraken est reportée à une revue juridique finale. Aucun cas particulier par marque dans le code.

### Endpoints livrés

| Endpoint | Contrat |
|---|---|
| `GET /r/{token}` | 301 vers l'`url_parrainage` du lien attribué + event `lien_redirection_suivie` + écriture `date_redirection`. 404 + page générique (noindex, zéro tiret cadratin) si token inconnu / expiré / offre non `actif`. Token dans le CHEMIN (survit à la copie). |
| `POST /internal/attribution-engine/select` | US-03. Auth clé interne (`INTERNAL_API_KEY`, ouverte en dev). Body `{offre_id, canal_source?, origine_detectee?, session_id?}`. 200 `{parrain_id, attribution_id, token, lien_genere}` / 400 `canal_invalide`\|`offre_id_manquant` / 401 / 404 `offre_indisponible` / 409 `pool_vide` / 503 `moteur_indisponible`. |
| `POST /internal/freshness-check/run` | US-04. Auth clé interne. Body `{max_age_days?}`. 200 `{offres_expirees, liens_invalides, offres_en_attente_parrain}`. Fail-safe : toujours 200, jamais de retrait par erreur. |
| `GET /api/health` | `SELECT 1`, statut `degraded` si DB down, jamais de crash. |

### Moteur d'arbitrage (US-03) — critères déterministes

Pool éligible = liens de l'offre `actif`, parrain `actif`, quota non atteint. Tri **FIFO** par `date_dernier_tour` ASC (NULL = jamais servi = prioritaire), **départage déterministe** par `created_at` puis `id` (ordre d'inscription, jamais aléatoire, US-03 crit.3). Sélection + incrément quota + création attribution en **transaction** (SQLite sérialise les écritures → pas de double dépassement de plafond, crit.6). Pool vide → offre passe `en_attente_parrain` + erreur `pool_vide`.

- **`priorite_affichage`** : attribut de tri du CATALOGUE public (par catégorie), pas de la rotation parrain. En cercle fermé (≤2 parrains, 1 lien chacun par offre) la rotation entre parrains est pure FIFO ; `priorite_affichage` servira au listing (vague 2b). Documenté car l'énoncé parlait de « FIFO pondérée par priorite_affichage » : la pondération n'a de sens qu'au niveau catalogue, `priorite_affichage` étant porté par l'offre, pas par le lien.

### Contrainte self-fetch (cible Cloudflare)

Toute la logique métier est dans `src/lib/` (`attribution.ts`, `freshness.ts`, `analytics.ts`) et importée DIRECTEMENT par les route handlers. Aucun appel réseau interne. Prod D1 : `db/index.ts` documente le branchement du binding D1 (même schéma réutilisé). Note : la transaction synchrone better-sqlite3 devra être portée en `batch()` D1 côté @infrastructure.

### Points reportés / hors périmètre vague 2a

- Détection automatique de lien mort par ping HTTP (US-04) : `liens_invalides` reste 0, deferee.
- Espace parrain (US-02/05/07/09), endpoint `POST /api/v1/offres/{id}/attribution` (US-01 génération côté front), signalement (US-06 endpoint) : vague 2b.
- Auth magic-link parrain (P1-a) : non spécifiée, bloque l'espace parrain.

## Vague 2b : frontend du socle demandeur (public)

### Pages livrées
- `/` (accueil, SSR dynamique) : hero tagline, comment ça marche, pourquoi la vérification, grille catégories, grille 9 offres avec recherche live, preuve factuelle, FAQ (JSON-LD FAQPage pour GEO), CTA. Copy = homepage-copy.md verbatim.
- `/offres/{slug}` (page-offre, SSR) : 10 zones wireframes.md, Variante A (split 70/30 desktop). Ordre imposé identité → divulgation → risque → conditions → CTA. Slug dérivé du nom_programme (`lib/slug.ts`).
- `/categories/{slug}` (SSR) : en-tête + grille filtrée.
- `/lien-invalide` (SSG, noindex) : page stylée cible de la redirection de `/r`.
- Coquilles conformité (SSG) : `/cgu`, `/confidentialite`, `/mentions-legales`, `/divulgation`, `/rgpd/demande`. Textes = docs/legal/textes/ (drafts @legal, placeholders `[à compléter]` conservés = vraies décisions en attente, bannière provisoire).
- Bandeau cookies CNIL (`CookieBanner`, opt-in strict, 3 actions équivalentes, renouvellement 6 mois).
- Favicon SVG (sceau de vérification, dark mode intégré) + site.webmanifest + métadonnées OG/Twitter/icons dans le layout.

### Endpoints front
- `POST /api/v1/offres/{id}/attribution` (US-01) : appelle `generateAttribution`, retourne `{attribution_id, token, lien_genere, date_verification_offre}`. Dédup double-clic côté client (`inFlight` ref + bouton désactivé) + timeout 3s (AbortController → état erreur).
- `POST /api/v1/offres/{id}/signalement` (US-06) : signalement anonyme au niveau OFFRE (le lien contextuel de la page-offre n'a pas toujours d'attribution). Le signalement rattaché à une attribution précise relève de l'espace parrain (vague 2b+).

### Changement de contrat vs vague 2a
- `/r/{token}` invalide/expiré : renvoie désormais une **redirection 307 vers `/lien-invalide`** (page stylée) au lieu du 404 HTML inline. Smoke test 2a mis à jour en conséquence (assertion 307 + location `/lien-invalide`). Le cas token valide reste un 301 vers l'enseigne.

### Écarts assumés vs compositions (à traiter en polish/vague suivante)
- CTA mobile **non sticky** (implémenté inline) : simplification, fonctionnel.
- Animations : `fade-up` au chargement seulement (pas d'intersection observer / stagger au scroll). Respecte `prefers-reduced-motion`.
- Lien « donnée structurée (JSON) » de la zone 8 (wireframe) omis (endpoint JSON public non construit) : remplacé par le lien de signalement + « Comment ça marche ».
- Toggle dark mode manuel non câblé (les tokens supportent `prefers-color-scheme`, bascule auto OK).
- Bandeau risque Trade Republic (Finance personnelle) : absent par défaut (règle checkpoint), `[À VALIDER]` @product-manager/@legal (legal 06 recommande de l'activer vu les ETF).

### Boucle visuelle
6 baselines dans `tests/screenshots/` (accueil + page-offre Trade Republic × mobile 375 / tablette 768 / desktop 1280), consentement cookies pré-enregistré pour des captures propres. Comparées à page-compositions.md : conformes (Variante A, ordre des zones, grilles responsive, hiérarchie). Script rejouable : `node scripts/screenshots.mjs` (Chromium `/opt/pw-browsers`).
