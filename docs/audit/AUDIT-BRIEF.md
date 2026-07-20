<!-- Brief d'audit partagé — 2026-07-20 — session principale (autopilot) -->
# Brief d'audit post-déploiement — Parrainly (pilote live)

> Site LIVE audité : **https://parrainly.thomas-issa.workers.dev** (Cloudflare Workers, D1, 9 offres réelles).
> Chaque agent produit son audit scoré /10 puis, en phase 2, itère jusqu'à **10/10**.

## Cible à intégrer dans CHAQUE audit (double lecture obligatoire)

1. **Persona (humain)** : jeune actif ET entrepreneur qui évalue néobanques, courtage, investissement,
   gestion de patrimoine, placement de trésorerie, crypto régulé, banque pro, compta. Il veut un
   **code/lien de parrainage fiable, à jour, tout de suite**. (Léa « shopper VPN/box » est OBSOLÈTE.)
2. **IA visiteuse (machine)** : un assistant (ChatGPT / Perplexity / Claude / Gemini) qui crawle le site
   pour répondre à « code parrainage {programme} ». Il doit pouvoir **extraire le CODE, le lien, la
   divulgation et la date de vérification** directement, sans deviner.

## Exigences transverses fondateur (bloquantes, valent pour tous)

- **T1 — LES CODES DOIVENT RESSORTIR EN GEO (objectif n°1).** Constat actuel : `code_parrainage`
  est présent dans `/api/v1/offres` et pointé par `/llms.txt`, mais **ABSENT du HTML de la page offre
  ET du JSON-LD** (vérifié : 0 occurrence de `7KGZAX` dans `/offres/finary`). Une IA qui lit la page
  rendue ou le JSON-LD ne récupère pas le code. À corriger : le code doit être visible/extractible
  dans le HTML de la page offre + exposé dans le JSON-LD (Offer). C'est LE but du projet.
- **T2 — ZÉRO nom propre "Thomas" / "Emmanuel" en client-facing.** Décision fondateur. Les remplacer
  partout (pages, FAQ, footer, divulgation, mentions, confidentialité, `DisclosureBanner`, `llms.txt`,
  `lib/ai/site.ts`, `faq-enrichie.ts`) par une formulation neutre SANS noms propres (« les opérateurs
  du registre », « l'éditeur du site », « Parrainly »), **tout en conservant une divulgation
  d'affiliation valide juridiquement** (on ne masque pas la relation d'affiliation, on retire juste
  les prénoms). Emplacements repérés : voir §Emplacements ci-dessous.
- **T3 — Copy nettoyée.** Supprimer les formulations bancales relevées par le fondateur, ex. meta
  description « Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : Trade
  Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée » (« parrainage fintech »
  peu clair ; assimiler TR/Qonto/Kraken à « fintech » est approximatif ; « sans lien mort » sonne
  gadget). Reformuler juste, précis, sans tiret cadratin client-facing.

## Snapshots live (ce que voit réellement une IA), à Read pour l'audit

- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/home.html`
- `.../scratchpad/audit/offre-finary.html`
- `.../scratchpad/audit/cat-crypto.html`
- `.../scratchpad/audit/api-offres.json`
- `.../scratchpad/audit/llms.txt`
- `.../scratchpad/audit/divulgation.html`
- `.../scratchpad/audit/mentions.html`

## Emplacements des noms propres (repérés par la session)

`src/app/page.tsx` (hero disclosure L25 + FAQ L37), `src/app/offres/[slug]/page.tsx` (L134),
`src/app/confidentialite/page.tsx` (L19), `src/app/mentions-legales/page.tsx` (L21),
`src/app/divulgation/page.tsx` (L21, L25), `src/components/layout/Footer.tsx` (L54),
`src/components/ui/DisclosureBanner.tsx` (L12), `src/lib/content/faq-enrichie.ts` (L17,21,30,38,47,51,64,77),
`src/lib/ai/site.ts` (L25), `src/app/llms.txt/route.ts` (L29).
(Les défauts `.test` de `src/config/socle.ts` sont internes/env, PAS client-facing : ne pas toucher.)

## Livrable par agent (phase 1 — audit)

Fichier : `docs/audit/<agent>-audit-2.md`. Contenu :
1. **Note /10** (justifiée) sous l'angle des DEUX cibles (persona + IA).
2. **Findings bloquants** priorisés P0/P1, format verbe + objet + critère de done.
3. **Ce qui manque précisément pour 10/10** (checklist actionnable).
4. Bloc « Vérifié (G_PROOF) » : fichiers/snapshots réellement lus.
ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.
