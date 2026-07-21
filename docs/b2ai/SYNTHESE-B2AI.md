<!-- Synthèse B2AI — 2026-07-20 — session principale (orchestration) -->
# Synthèse — B2AI : intérêt, briques, sujets rentables

> Consolidation des 4 lentilles (`elon-b2ai.md`, `ia-b2ai.md`, `growth-b2ai.md`, `geo-b2ai.md`).
> Question fondateur : à partir de Parrainly, développer le B2AI est-il intéressant ; quelles briques
> ajouter ; quels autres sujets rentables.

## Q1 — Est-ce intéressant ? Verdict consolidé : GO, mais recadré (pas un GO sur Parrainly tel quel)

**Ce qui converge (les 4 agents) :** la direction B2AI est réelle et défendable NON PAS comme
« publier du contenu structuré et espérer être cité » (fragile), mais comme **posséder une machine de
vérification + fraîcheur prouvable + attribution**, transport-agnostique. La valeur n'est pas dans la
donnée (gratuite, copiable) ni dans une surface (llms.txt, un crawler) : elle est dans **être la source
fraîche que l'IA ne peut pas produire elle-même, et se faire payer/attribuer indépendamment du clic**.

**Ce qui diverge (à te dire honnêtement) :**
- **@elon (le plus sévère)** : ~70% effet de mode. `/llms.txt` est quasi mort pour la citation en 2026
  (donnée sourcée : 97% des fichiers reçoivent 0 requête IA). L'insight réel existe mais est étroit
  (« oracle de fraîcheur vérifiée ») et **Parrainly l'incarne avec la mauvaise matière première** (le
  lien de parrainage : fragile, plafonné, CGU-hostile pour TR/Kraken).
- **@ia (le plus optimiste)** : couche durable si on se place sur découverte + attribution +
  vérifiabilité. Donnée sourcée : l'affiliation pèserait jusqu'à 91% des sources citées par ChatGPT, le
  trafic IA convertirait mieux. La durabilité vient de la NATURE de la donnée, pas de la surface.
- **@growth** : GO conditionnel. Parrainly seul = commodité copiable en semaines. Devient défendable via
  **paiement-au-crawl** (Cloudflare Pay Per Crawl, déjà activable sur notre stack) + **posséder la couche
  d'attribution comme produit**.
- **@geo** : solide sur le principe (zero-click concentre la valeur sur les rares sources citées),
  fragile tant que la **désintermédiation par l'agent transactionnel** n'est pas traitée en risque
  permanent.

**Le crux non résolu (tous le pointent) : G_PROOF distribution = 0/11.** On n'a JAMAIS prouvé qu'une IA
cite une source comme la nôtre sur ces requêtes. C'est le trou n°1 depuis le début.

## ⚠️ Divergence factuelle à vérifier (ne pas trancher à l'aveugle)

- @elon : l'Agentic Commerce Protocol (ACP, OpenAI/Stripe) est **LIVE** (fév. 2026), la désintermédiation
  est présente, pas future. Sources ACP/Stripe.
- @ia : **OpenAI aurait abandonné Instant Checkout en mars 2026** et réorienté sa stratégie. Sources
  digitalcommerce360.
- Lecture prudente : la brique « Instant Checkout » d'OpenAI a peut-être bougé, mais l'agentic commerce
  au sens large (Stripe, Perplexity Buy, agents shopping) continue. **À vérifier avant de parier gros
  dessus.** Ne pas construire l'enablement agentic-commerce sur une hypothèse non stabilisée.

## Q2 — Briques à ajouter APRÈS Parrainly (ordonnées par réduction d'incertitude, pas par confort)

**Étape 0 (0 €, 2 jours, AVANT toute ligne de code) — le kill-test de @elon :** 30 requêtes réelles ×
5 moteurs (ChatGPT, Perplexity, Claude, Gemini, Copilot) sur les 9 programmes + les incumbents déjà
indexés (ComparaBanques, Parrainage.co). Question : un agrégateur tiers de parrainage est-il JAMAIS
cité ? Si NON → la matière « parrainage » est le mauvais tuyau : garder la machine, changer la matière.
Si OUI (même partiellement) → la thèse tient, on construit les briques ci-dessous.

**Si signal positif, séquence technique (@ia) + revenu (@growth) :**
1. **B1 — Contrat API agent-grade** : OpenAPI 3.1 versionné + `/.well-known/` de découverte. Racine qui
   débloque tout. ~2-3 j. (Réallouer l'effort `/llms.txt` vers des feeds vivants que les agents lisent.)
2. **B2 — Fraîcheur PROUVABLE et signée** : attestation cryptographique `verified_at` par l'éditeur,
   vérifiable par un tiers via clé publique (transposition C2PA aux données). LE différenciateur. ~3-5 j.
3. **B4 — Webhook conversion + redirect signé** : attribution temps réel, rempart anti-désintermédiation
   (protège le NSM PCA-IA quand l'agent applique le code sans repasser par nous). ~3-5 j.
4. **Paiement-au-crawl** (@growth) : Cloudflare Pay Per Crawl → 1er flux de revenu indépendant du clic.
5. **Rempart de gouvernance** (@geo) : documenter « ne jamais exposer `url_parrainage` brut » comme
   protection anti-désintermédiation explicite, pas juste règle V2.

## Q3 — Autres sujets B2AI rentables (short-list dédupliquée + classée valeur × atteignabilité)

| # | Sujet | Qui paie / valeur | Défendabilité (moat) | Convergence |
|---|-------|-------------------|----------------------|-------------|
| 1 | **Oracle de fraîcheur vérifiée / Verified-Freshness-as-a-Feed** : la machine de vérif+signature généralisée à TOUTE donnée périssable à enjeu (prix, statuts, conditions) servie aux agents | plateformes IA, éditeurs, devs d'agents | la boucle de vérif + signature crypto, difficile à copier | elon#1, ia#1, growth#1 (TRÈS forte) |
| 2 | **Attribution d'origine-IA en SaaS** : le moteur token-in-path généralisé sur le trou de mesure AI→conversion que tout le secteur constate | éditeurs affiliation, comparateurs, petits programmes FR | on possède déjà le moteur ; problème pénible peu servi | growth#2, ia#2 |
| 3 | **Registres verticaux à forte responsabilité (l'IA hallucine cher)** : statuts réglementaires fintech/crypto (PSAN/CIF/ORIAS), CGU d'affiliation partageables, éligibilité par statut juridique | utilisateurs à risque, autres affiliés (B2B2C) | réutilise le travail @legal déjà fait ; vérif difficile à copier | geo#1/#2/#3, elon#3 |
| 4 | **Enablement agentic-commerce / picks & shovels** : adaptateur catalogue→feed agent-ready (AEO + ACP + fraîcheur signée) | marchands/PME | timing (SI ACP se stabilise — cf. divergence) | elon#2, ia#3 |
| 5 | **Agence GEO productisée pour PME FR** : réutilise le playbook @seo/@geo de Parrainly | PME/e-commerçants | cash-flow rapide, coût quasi nul ; mais c'est du SERVICE, pas un produit B2AI défendable | growth#3 |

**Fil rouge des 4 agents :** le vrai actif transférable de Parrainly n'est PAS le catalogue de
parrainage, c'est **la machine de vérification + fraîcheur signée + attribution**. Les sujets #1/#2/#3
sont cette machine appliquée à des matières moins fragiles que le lien de parrainage.

## Reco de la session (à valider par le fondateur)

1. **Faire le kill-test (Étape 0) cette semaine** avant d'investir une brique de plus. C'est 0 €/2 j et
   ça débloque tout le reste. Il transforme aussi le baseline 0/11 en donnée décisionnelle.
2. Selon le résultat : soit on double sur Parrainly avec B1→B4 (signal positif), soit on **garde la
   machine et on pivote la matière** vers les registres à forte responsabilité (#3) ou l'oracle de
   fraîcheur (#1), plus neutres et plus défendables que le lien de parrainage.
3. Ne pas parier gros sur l'enablement agentic-commerce (#4) tant que la divergence ACP n'est pas levée.
4. L'agence GEO (#5) reste une option de cash-flow à part, à ne pas confondre avec la thèse produit.
