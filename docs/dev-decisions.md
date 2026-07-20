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

Toute la logique métier est dans `src/lib/` (`attribution.ts`, `freshness.ts`, `analytics.ts`) et importée DIRECTEMENT par les route handlers. Aucun appel réseau interne. Prod D1 : `db/index.ts` documente le branchement du binding D1 (même schéma réutilisé).

### Compatibilité Cloudflare D1 — couche DB (Phase A, 2026-07-20)

`src/db/index.ts` : le singleton `db` (better-sqlite3 à l'import) est remplacé par `getDb()` **par requête**. Discriminant `navigator.userAgent === 'Cloudflare-Workers'` (zéro import), imports dynamiques (better-sqlite3 jamais dans le bundle Worker ; `@opennextjs/cloudflare` + `drizzle-orm/d1` jamais chargés en Node). Toute la logique DB est passée **async** : chaque terminal `.get()/.all()/.run()` est `await` (no-op en Node sync, résout la Promise sous D1). `better-sqlite3` déplacé en `devDependencies`.

**Port des transactions → `runAtomic()`** : better-sqlite3 est synchrone avec transaction interactive ; D1 n'a **pas** de transaction interactive, seulement `db.batch([...])`. Architecture uniforme adoptée : `lire → décider (JS) → écrire atomiquement`. `runAtomic(db, [statements])` discrimine au runtime (batch D1 / `transaction()` synchrone better-sqlite3). Concerne l'arbitrage US-03 (quota + insert attribution) et la confirmation US-09 (update + signalement). Le shim `rowsAffected()` normalise le décompte `.run()` (better-sqlite3 `.changes` vs D1 `.meta.changes`).

**Limite sémantique irréductible (documentée)** : sous D1, les lectures qui décident du lot s'exécutent HORS de la portée atomique → un `lire→décider→écrire` n'est pas sérialisé contre un écrivain concurrent (fenêtre de course possible, ex. double incrément de quota sous forte concurrence). Négligeable en cercle fermé V1. Durcissement Phase B : UPDATE conditionnel gardé (`WHERE quota < max`) + vérif `rowsAffected()`, ou verrou Durable Object. Le chemin Node conserve l'atomicité complète (reads+writes dans la même transaction de connexion unique).

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

## Vague 3 : espace parrain (US-02/05/07/09) + auth magic-link

### Auth magic-link (cercle fermé T&E)
- **Tables** : `magic_link_token` (hash SHA-256 du token, jamais le brut, TTL 15 min config, usage unique) et `session` (hash du token de session, durée glissante 30 j). Migration `drizzle/0001_*.sql`.
- **`src/lib/auth.ts`** : token opaque Web Crypto (compatible D1), `hashToken` SHA-256, `createMagicLinkToken` (cooldown 60 s + plafond 5/h, invalide les tokens antérieurs), `consumeMagicLinkToken` (usage unique), `createSession`/`getSessionUser` (glissante, mappe email → compte T&E via config)/`destroySession`.
- **Allowlist** : `PARRAIN_ACCOUNTS` dans `config/socle.ts`, emails via `AUTH_THOMAS_EMAIL`/`AUTH_EMMANUEL_EMAIL` (défauts `.test`, jamais de vrai email inventé). Le seed renseigne `parrain.email` depuis ces mêmes variables.
- **Mailer pluggable** (`src/lib/mailer.ts`) : transport `console` par défaut (log le lien magique, pilote sans SMTP) ou `resend` (prod, `RESEND_API_KEY`/`MAILER_FROM`, garde-fou placeholder). Jamais bloquant sur un provider externe.
- **`middleware.ts`** : protège `/parrain/*` (présence cookie uniquement, Edge-safe), exempte `/parrain/connexion` et `/parrain/verifier`. Validation DB réelle dans `requireUser()` (`lib/session-server.ts`) côté Server Component. `/internal/*` restent protégés par `INTERNAL_API_KEY` (non matchés par le middleware).
- **Endpoints** : `POST /api/v1/auth/magic-link` (403 non_autorise neutre, 429 cooldown/rate + retry_after), `GET /api/v1/auth/verify` (consomme, pose cookie httpOnly/secure/sameSite=strict, redirige), `POST /api/v1/auth/logout`.
- **Cookie** : `parrainly_session`, httpOnly, secure en prod, sameSite=strict, maxAge = SESSION_TTL_DAYS.

### Pages parrain
`/parrain/connexion` (12 états, copy exact spec, cooldown timer), `/parrain/verifier` (3 erreurs), `/parrain/tableau-de-bord` (US-05 : prime mono, coaching, table liens), `/parrain/catalogue` + `/parrain/catalogue/[id]` (US-02, PATCH, garde-fou plafond avant activation) + `/parrain/catalogue/[id]/validation` (US-07, référence fiche obligatoire), `/parrain/attributions` (US-09, modal fermable X/clic dehors/Escape, focus initial).

### US-09 garde-fou plausibilité
`src/lib/conversion.ts` : transaction, idempotence (déjà confirmée → renvoi statut), fenêtre 60 j (`SOCLE_CONVERSION_WINDOW_DAYS`), plausibilité (`SOCLE_PLAUSIBILITY_WINDOW_DAYS`, défaut 30 j) : si confirmations+1 > redirections sur la fenêtre → statut `en_verification_manuelle` + signalement créé (sans exposer le motif). Nouveau statut `en_verification_manuelle` ajouté à l'enum `ATTRIBUTION_STATUTS` (colonne text, pas de migration SQL).

### Events câblés (`lib/analytics.ts`)
`connexion_lien_demande` (résultat envoye/non_autorise/frequence_depassee), `connexion_lien_ouvert` (succes/expired/consumed/invalid), `session_parrain_ouverte`, `offre_mise_a_jour(_echec)`, `offre_activee`, `offre_validee_conformite`, `offre_bloquee_conformite`, `attribution_confirmee` (resultat confirme_direct/en_verification_manuelle). `session_parrain_expiree` : type prêt, émission à câbler sur un job de purge (non déclenché en flux nominal).

### Écarts assumés
- Modal de connexion rendu comme page centrée `/parrain/connexion` (pas overlay sur la page courante) : simplification via middleware redirect, fonctionnellement équivalent.
- Focus-trap du modal US-09 : Escape + clic dehors + focus initial implémentés ; boucle Tab complète non piégée (amélioration a11y à finaliser).
- US-08 RGPD parrain (accès/rectification via dashboard) : hors périmètre de cette vague (le formulaire public `/rgpd/demande` existe déjà).

### Boucle visuelle parrain
7 baselines : `parrain-dashboard-{mobile,tablet,desktop}.png`, `parrain-attributions-{mobile,tablet,desktop}.png`, `parrain-attributions-modal-desktop.png`. Script `scripts/screenshots-parrain.mjs` (injecte session + attribution de démo en base, pose le cookie). Conformes compositions §3 (carte prime mono, coaching, table montants à droite, modal centré §3.7).
