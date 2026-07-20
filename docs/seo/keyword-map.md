<!-- Version: 2026-07-20 — @seo — Phase 3 (keyword-map + slot homepage-copy.md) -->
# Keyword map — Parrainly

> Base : `docs/geo/test-citation-ia.md` (test empirique 2026-07-20, 11 requêtes WebSearch). Constat n°1 : sur 9/9 requêtes « parrainage {enseigne} », la surface citée est dominée par des agrégateurs structurés, pas par les sites officiels. Constat n°3 : sur l'intention générique (« meilleure néobanque »), ce sont les comparateurs qui captent, terrain à ne pas attaquer en frontal. Ce mapping en tire la conséquence directe : **1 mot-clé principal = 1 page = 1 intention**, zéro cannibalisation, l'intention « parrainage {enseigne} » comme cœur de cible.

## Méthodologie et limite assumée

Aucun outil de volume/difficulté (Ahrefs, Semrush, GSC) n'est branché sur ce projet non déployé : **`[HYPOTHÈSE]` aucune donnée de volume de recherche chiffrée n'est utilisée dans ce document**, conformément à la règle zéro-invention. Le classement des mots-clés (principal/variantes) et les intentions s'appuient sur (a) le test empirique `test-citation-ia.md` (WebSearch réel, 2026-07-20), (b) la structure des URLs des agrégateurs incumbents observés dans ce test (format `/parrainage-{enseigne}` ou `/code-parrainage-{enseigne}`), (c) le vocabulaire des personas A1/A2 (`brand-platform.md`). Recommandation : brancher Google Search Console dès l'indexation pour remplacer ces intentions qualitatives par des données de volume réelles (action `@growth`/`@data-analyst` post-lancement).

## Règle de non-cannibalisation

Chaque URL de destination ne porte qu'un seul mot-clé principal. Les pages catégorie captent l'intention amont (comparaison/découverte d'une verticale) et **maillent vers** les pages offre plutôt que de dupliquer leur mot-clé « parrainage {enseigne} ». Aucun recoupement mot-clé principal entre deux URLs dans ce document (vérifié en §5).

---

## 1. Homepage (`/`)

| Champ | Valeur |
|---|---|
| Mot-clé de marque | `Parrainly` |
| Requête chapeau (intention informationnelle/marque) | `parrainage fintech vérifié` |
| Variantes | `registre de parrainage vérifié`, `parrainage néobanque et crypto vérifié`, `code parrainage fintech` |
| Intention | Informationnelle / navigationnelle (marque) |
| SERP feature visée | Sitelinks, FAQPage (schema déjà en place), citation directe par assistant IA |
| Rôle dans le maillage | Point d'entrée + hub vers les 6 catégories et les 9 offres. Ne concurrence aucune page enfant sur « parrainage {enseigne} ». |

---

## 2. Mots-clés par offre (`/offres/{slug}`) — cœur de cible

Format calé sur le constat n°2 du test empirique (une page = une enseigne, format déjà retenu en Phase 2).

| Programme | Slug | Mot-clé principal | Variantes | Intention | URL cible |
|---|---|---|---|---|---|
| Trade Republic | `trade-republic` | `parrainage Trade Republic` | `code parrainage Trade Republic`, `lien de parrainage Trade Republic`, `invitation Trade Republic` | Transactionnelle | `/offres/trade-republic` |
| Qonto | `qonto` | `parrainage Qonto` | `code parrainage Qonto`, `lien de parrainage Qonto compte pro`, `invitation Qonto` | Transactionnelle | `/offres/qonto` |
| Revolut Business | `revolut-business` | `parrainage Revolut Business` | `code parrainage Revolut Business`, `parrainage Revolut entreprise` | Transactionnelle | `/offres/revolut-business` |
| Ramify | `ramify` | `parrainage Ramify` | `code parrainage Ramify`, `lien de parrainage Ramify` | Transactionnelle | `/offres/ramify` |
| Finary | `finary` | `parrainage Finary` | `code parrainage Finary`, `invitation Finary` | Transactionnelle | `/offres/finary` |
| Dougs | `dougs` | `parrainage Dougs` | `code parrainage Dougs`, `parrainage Dougs comptable en ligne` | Transactionnelle | `/offres/dougs` |
| Meria | `meria` | `parrainage Meria` | `code parrainage Meria`, `invitation Meria crypto` | Transactionnelle | `/offres/meria` |
| Kraken | `kraken` | `parrainage Kraken` | `code parrainage Kraken`, `code promo Kraken parrainage` | Transactionnelle | `/offres/kraken` |
| Spiko | `spiko` | `parrainage Spiko` | `code parrainage Spiko`, `invitation Spiko trésorerie` | Transactionnelle | `/offres/spiko` |

**Règle title/H1/P1 (obligatoire, cf. exigence Bing)** : chaque page doit porter le mot-clé exact `parrainage {nom_programme}` dans son `<title>`, son `<h1>` et son premier paragraphe. État actuel vérifié dans `docs/seo/audit-technique.md` §2 (titre déjà conforme, H1 et premier paragraphe à corriger).

---

## 3. Mots-clés par catégorie (`/categories/{slug}`)

Rôle : capter l'intention de découverte/comparaison d'une verticale et **rabattre** vers les pages offre (maillage descendant), sans dupliquer leur mot-clé.

| Catégorie | Slug | Mot-clé principal | Variantes | Intention | URL cible |
|---|---|---|---|---|---|
| Finance personnelle | `finance-personnelle` | `parrainage néobanque vérifié` | `code parrainage banque en ligne`, `parrainage compte bancaire` | Informationnelle → transactionnelle | `/categories/finance-personnelle` |
| Investissement | `investissement` | `parrainage plateforme d'investissement` | `code parrainage assurance-vie`, `parrainage PER` | Informationnelle → transactionnelle | `/categories/investissement` |
| Gestion de patrimoine | `gestion-de-patrimoine` | `parrainage agrégateur de patrimoine` | `code parrainage gestion de patrimoine` | Informationnelle → transactionnelle | `/categories/gestion-de-patrimoine` |
| Placement trésorerie | `placement-tresorerie` | `parrainage placement de trésorerie` | `code parrainage trésorerie entreprise`, `parrainage compte rémunéré pro` | Informationnelle → transactionnelle | `/categories/placement-tresorerie` |
| Services entrepreneur | `services-entrepreneur` | `parrainage banque pro` | `code parrainage compta en ligne`, `parrainage outil entrepreneur` | Informationnelle → transactionnelle | `/categories/services-entrepreneur` |
| Crypto | `crypto` | `parrainage plateforme crypto` | `code parrainage crypto`, `parrainage plateforme crypto vérifié` | Informationnelle → transactionnelle | `/categories/crypto` |

**Important** : ces mots-clés catégorie ne visent PAS « meilleure néobanque » / « meilleure banque pro » (terrain des comparateurs généralistes, constat n°3 du test empirique, saturé et hors stratégie posture non-conseil de la marque). Ils restent sur l'intention « parrainage » où Parrainly a un droit d'entrée démontré.

**[CORRECTION 2026-07-20, décision fondateur]** : mot-clé principal Crypto initialement fixé à `parrainage exchange crypto` (anglicisme, jamais testé dans les 11 requêtes de `test-citation-ia.md`) corrigé en `parrainage plateforme crypto`, registre francophone cohérent avec le reste de la marque et aligné sur le H1 déployé côté copy (`docs/copy/fiches-categories.md` §6, même valeur). Aucune autre ligne de ce document n'est affectée.

---

## 4. Pages hors cocon mot-clé (légales)

`/mentions-legales`, `/cgu`, `/confidentialite`, `/divulgation`, `/rgpd/demande` : aucun mot-clé ciblé (pages de conformité, `noindex` recommandé pour `/rgpd/demande` uniquement, cf. `audit-technique.md`). `/divulgation` reste indexable car elle sert l'E-E-A-T (transparence citée en preuve par le persona, cf. `test-citation-ia.md` §8).

---

## 5. Vérification de non-cannibalisation

Grep manuel des mots-clés principaux du §2 et §3 : chaque chaîne `parrainage {X}` n'apparaît comme mot-clé PRINCIPAL que sur une seule ligne de ce document. Aucun doublon entre une catégorie et une offre (les catégories portent un mot-clé de verticale, jamais un nom d'enseigne). Le mot-clé Crypto corrigé (`parrainage plateforme crypto`) a été re-testé après correction : aucune collision avec un mot-clé principal offre (aucune des 9 enseignes ne s'appelle « plateforme crypto ») ni avec une autre catégorie. PASS.

---

## Gates BLOQUANT vérifiées

- **G1** : 5 sections + tableaux complets, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : intentions calées sur persona A1/A2 (transactionnel = passage à l'action de parrainage, cf. `project-context.md`). PASS.
- **G7** : aligné `brand-platform.md` (mot-clé de marque), `test-citation-ia.md` (priorisation « parrainage {enseigne} »), zéro superlatif dans les libellés de mots-clés. Correction 2026-07-20 : mot-clé Crypto anglicisant (`parrainage exchange crypto`, jamais présent dans les 11 requêtes du test empirique) remplacé par `parrainage plateforme crypto` (registre francophone, aligné H1 déployé côté copy). PASS.
- **G12** : chaque ligne = mot-clé + URL cible directement exploitable par `@fullstack` en `generateMetadata`. PASS.
- **G13** : 0 donnée de volume/difficulté inventée, limite signalée en méthodologie. PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence. PASS.
- **G17** : mapping taillé sur les 9 programmes réels + 6 catégories réelles, non générique. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** Re-grep du 2026-07-20 (post-correction) : `awk -F'|' '/^\| / && NF>5 {print $4}' docs/seo/keyword-map.md` retourne 15 valeurs de colonne « Mot-clé principal » (9 offres + 6 catégories), aucun doublon, `parrainage plateforme crypto` présent une seule fois. `grep "exchange" docs/seo/keyword-map.md` (hors bloc `[CORRECTION]` explicatif) : 0 occurrence résiduelle en mot-clé actif, confirme le retrait complet de l'anglicisme. Slugs recalculés depuis `src/lib/slug.ts` (fonction `slugify`, déterministe) et confirmés cohérents avec `src/app/offres/[slug]/page.tsx` / `src/app/categories/[slug]/page.tsx` (résolution par `slugify(nom)`).

---
**Handoff → @seo (auto, suite du run) puis @fullstack**
- Fichiers produits : `/home/user/MCP/docs/seo/keyword-map.md`, édition de `/home/user/MCP/docs/copy/homepage-copy.md` (slot rempli)
- Décisions prises : mot-clé principal = `parrainage {enseigne}` pour les 9 pages offre (aligné test empirique) ; mots-clés catégorie orientés verticale + parrainage (pas « meilleure X ») pour éviter le terrain saturé des comparateurs ; zéro donnée de volume inventée, signalé comme limite à lever par GSC post-lancement.
- Points d'attention : title/H1/P1 des pages catégorie ne contiennent actuellement PAS le mot-clé exact (nom de catégorie seul, ex. « Crypto »), correction attendue par `@fullstack` détaillée dans `audit-technique.md` §2.
---
