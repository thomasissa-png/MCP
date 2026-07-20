<!-- Audit @ia — couche machine-readable Parrainly LIVE — 2026-07-20 — phase 1 -->
# Audit IA / extractabilité LLM — Parrainly (pilote live)

> Site audité EN RÉEL : **https://parrainly.thomas-issa.workers.dev** (Cloudflare Workers, D1, 9 offres).
> Angle : ce qu'un assistant (ChatGPT / Perplexity / Claude / Gemini) **extrait réellement** quand il crawle le site pour répondre à « code parrainage {programme} ».

## Note : **6 / 10**

Justification en une phrase : l'infrastructure machine-readable est solide (API v1 propre et versionnée, `/llms.txt` qui oriente vers le miroir JSON, divulgation + mention de risque embarquées dans le JSON-LD), **mais l'objectif n°1 du projet échoue sur 9/9 offres : le code de parrainage est totalement absent du HTML de la page-offre ET du JSON-LD**. Une IA qui indexe la page rendue (le chemin de crawl le plus courant en GEO) ne récupère pas le code. Il n'est récupérable que par l'IA qui suit `/llms.txt` jusqu'à l'API. Tant que le code n'est pas dans la page + le JSON-LD, T1 n'est pas atteint.

Décomposition :
- API v1 (extraction directe du code) : 10/10 — code présent, structuré, adressable par id ET slug.
- `/llms.txt` (orientation de l'agent) : 7/10 — pointe bien vers le miroir, mais n'annonce jamais le champ `code_parrainage`.
- HTML page-offre (extraction du code) : 0/10 — 0 occurrence du code sur 9/9.
- JSON-LD Offer (extraction du code) : 0/10 — aucun champ ne porte le code.
- Divulgation + risque embarqués machine : 9/10 — présents et restituables (réserve T2 : noms propres, hors périmètre note).

---

## Findings bloquants (P0)

**P0-1 — Exposer `code_parrainage` dans le JSON-LD Offer de chaque page-offre.**
Critère de done : `curl .../offres/{slug}` → le bloc `<script type="application/ld+json">` contient le code (ex. `7KGZAX`) dans un champ dédié `offers.additionalProperty[]` de type `PropertyValue` (`name: "code_parrainage"`, `value: <code>`) ET en tête de `offers.description` (« Code de parrainage : 7KGZAX. »). Vérifié sur les 9 offres, 0 exception. Aujourd'hui : `offreJsonLd()` (`src/lib/ai/jsonld.ts`) ne lit jamais `o.code_parrainage` → 0/9 dans le JSON-LD live.

**P0-2 — Rendre le code visible et extractible dans le HTML de la page-offre.**
Critère de done : `curl .../offres/{slug}` → au moins 1 occurrence en clair du code dans le DOM SSR (bloc identité, texte brut, pas seulement un attribut JS), avec un libellé explicite « Code de parrainage ». Vérifié sur les 9 offres : ≥ 1 occurrence chacune. Aujourd'hui : `src/app/offres/[slug]/page.tsx` n'affiche jamais `code_parrainage` (le champ existe pourtant dans `PublicOffre` et la DB) → 0/9 dans le HTML live.

**P0-3 — Propager la correction du builder à TOUTES les offres, sans cas particulier.**
Critère de done : Grep de `code_parrainage` dans `src/lib/ai/` et `src/app/offres/` → le champ est lu dans le builder JSON-LD ET dans la page ; re-test des 9 slugs après build montre 9/9 avec code dans HTML + JSON-LD (le code doit rester conditionnel : `code_parrainage: null` → pas de bloc code, pas de « Code de parrainage : null »).

## Findings importants (P1)

**P1-1 — Annoncer le champ `code_parrainage` dans `/llms.txt`.**
Critère de done : `curl .../llms.txt` → la section « À savoir » liste une ligne « Code de parrainage embarqué dans chaque objet JSON (champ `code_parrainage`) », au même titre que `divulgation_affiliation` et `mention_risque` qui y sont déjà. Aujourd'hui `src/app/llms.txt/route.ts` cite `code` une seule fois (dans une phrase générique) et n'oriente jamais l'agent vers le champ exact → l'IA ne sait pas que le code est extractible.

**P1-2 — Corriger le mauvais mapping sémantique de la date de vérification dans le JSON-LD.**
Critère de done : `date_verification` n'est plus injecté dans `offers.priceValidUntil` (schema.org : date de validité d'un PRIX, contresens ici puisqu'il n'y a pas de prix) mais exposé via `offers.additionalProperty[]` `PropertyValue` (`name: "date_verification"`) et/ou conservé en `releaseDate` sur le Product. Aujourd'hui `priceValidUntil` porte une date qui n'a rien d'un prix → risque de restitution erronée par un moteur.

**P1-3 — Rendre la divulgation restituable comme champ structuré, pas seulement noyée en `description`.**
Critère de done : la divulgation d'affiliation reste présente dans `disambiguatingDescription` (déjà OK) ET est doublée d'un `PropertyValue` (`name: "divulgation_affiliation"`) dans `offers.additionalProperty[]` pour qu'un moteur puisse l'extraire atomiquement à côté du code. (Réserve T2 hors périmètre note : le texte embarqué contient « Thomas ou Emmanuel » — à neutraliser sans supprimer la relation d'affiliation, cf. brief §T2.)

---

## Ce qui manque précisément pour 10/10 (checklist actionnable)

- [ ] `src/lib/ai/jsonld.ts` — `offreJsonLd()` : ajouter `offers.additionalProperty: PropertyValue[]` avec `code_parrainage`, `date_verification`, `divulgation_affiliation` (chacun conditionnel non-null).
- [ ] `src/lib/ai/jsonld.ts` — préfixer `offers.description` par `sentence('Code de parrainage', o.code_parrainage)` (réutilise le helper `sentence()` existant, pas de double point).
- [ ] `src/lib/ai/jsonld.ts` — remplacer `priceValidUntil` (contresens prix) par un `PropertyValue` date_verification ; garder `releaseDate` Product.
- [ ] `src/app/offres/[slug]/page.tsx` — afficher un bloc « Code de parrainage : {code} » en texte SSR dans la zone identité (conditionnel `publicOffre?.code_parrainage`), au-dessus du CTA, après la divulgation dans l'ordre de lecture.
- [ ] `src/app/llms.txt/route.ts` — ajouter la ligne « Code de parrainage embarqué (champ `code_parrainage`) » dans « À savoir » ; option recommandée : ajouter le code inline dans `offresBlock` (`| code : {code}`) pour extraction directe depuis le llms.txt.
- [ ] Regression : re-run `curl` sur les 9 slugs → 9/9 avec code en HTML + JSON-LD ; offre `code_parrainage=null` (aucune aujourd'hui) → pas de bloc vide.
- [ ] Coordination : ces 3 fichiers sont dans `src/lib/ai/` (propriété @ia) SAUF `src/app/offres/[slug]/page.tsx` (rendu = @fullstack) → spécifier le bloc HTML dans le handoff @fullstack.
- [ ] (T2, tracé pour cohérence) neutraliser « Thomas / Emmanuel » dans `site.ts` (`SITE_DESCRIPTION`) et `llms.txt` tout en conservant la divulgation d'affiliation — pilotage @copywriter/@legal, hors note de cet audit.

---

## Vérifié (G_PROOF) — curl réels du 2026-07-20

Endpoints live testés :
- `curl .../api/v1/offres` → 9 offres, `code_parrainage` présent pour **9/9** (7KGZAX, ozgnzx2r, ux2pft, JHOHSV, 9751F5C9BC, 1dw9h6jf, OWNQ93kmgD, iOTwY6Zs, B2B-JUL1-26-AR-H3).
- `curl .../api/v1/offres/REF-003` → objet Finary complet, `code_parrainage: "7KGZAX"` présent.
- `curl .../api/v1/categories` → 6 catégories, `version: v1`, compteurs d'offres OK.
- `curl .../offres/finary` → **0 occurrence** de `7KGZAX` dans tout le HTML ; 1 seul bloc `ld+json` (Product/Offer) **sans** champ code.
- Quantification HTML sur les 9 slugs → **0 occurrence du code sur 9/9** (finary, kraken, qonto, ramify, spiko, trade-republic, dougs, meria, revolut-business).
- `curl .../llms.txt` → oriente bien vers le miroir JSON ; `code_parrainage` **jamais mentionné comme champ** ; contient « Thomas » et « Emmanuel » (réserve T2).

Fichiers source lus :
- `src/lib/ai/jsonld.ts` (builder `offreJsonLd` — ne lit pas `code_parrainage`, `priceValidUntil` = mauvais mapping).
- `src/lib/ai/public-offre.ts` (`PublicOffre.code_parrainage` existe et est peuplé — la donnée est disponible, elle n'est simplement pas rendue).
- `src/lib/ai/site.ts` (`SITE_DESCRIPTION` contient les noms propres — T2).
- `src/app/llms.txt/route.ts` (section « À savoir » liste divulgation + risque, pas le code).
- `src/app/offres/[slug]/page.tsx` (aucun rendu du code ; JSON-LD = `offreJsonLd` + breadcrumb).

---

## Résumé final

**Note : 6/10.**

**« Les codes ressortent-ils pour l'IA ? » → NON par le chemin principal.**
Le code est extractible via l'API v1 et via une IA qui suit `/llms.txt` jusqu'au miroir JSON, mais il est **absent à 100% (9/9) du HTML de la page-offre et du JSON-LD**, qui sont les artefacts que la plupart des crawlers GEO indexent. Objectif T1 non atteint.

**Où corriger (3 fichiers) :**
1. `src/lib/ai/jsonld.ts` — injecter `code_parrainage` dans `offers` (`additionalProperty` PropertyValue + tête de description) ; corriger `priceValidUntil`.
2. `src/app/offres/[slug]/page.tsx` — afficher le code en texte SSR (bloc « Code de parrainage »).
3. `src/app/llms.txt/route.ts` — annoncer le champ `code_parrainage`.

---
**Handoff → @orchestrator (puis @fullstack pour le rendu HTML)**
- Fichier produit : `docs/audit/ia-audit-2.md`.
- Décisions : note 6/10 ; P0 = exposer le code dans HTML + JSON-LD sur 9/9 ; correction JSON-LD (`code_parrainage` + `date_verification` en `additionalProperty`, abandon `priceValidUntil`).
- @ia touchera `src/lib/ai/jsonld.ts` et `src/app/llms.txt/route.ts` (phase 2). Le bloc HTML de `src/app/offres/[slug]/page.tsx` est hors `src/lib/ai/` → à implémenter par @fullstack sur spec @ia.
- Points d'attention : conditionner sur `code_parrainage` non-null (pas de bloc vide) ; propager à TOUS les builders (Grep `code_parrainage`) ; re-tester les 9 slugs après build ; réserve T2 (noms propres dans divulgation embarquée) à traiter en parallèle sans casser la divulgation.
