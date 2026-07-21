<!-- Version: 2026-07-21 — @ia — Exploration B2AI, lentille archi LLM/IA, pipelines, exposition données agents -->

# B2AI — Lentille @ia (architecture LLM/IA, pipelines, exposition aux agents)

> Livrable @ia pour l'exploration stratégique B2AI post-Parrainly. Répond aux 3 questions du brief
> `docs/b2ai/BRIEF-B2AI.md` de la lentille technique : durabilité de la couche, briques ordonnées par
> dépendances, autres produits B2AI réutilisant notre socle (Cloudflare/D1/Next + AEO + attribution).
> Prolonge `docs/ia/architecture-mcp-parrainage-ia.md` (API JSON = actif pivot, MCP repoussé).

## Résumé exécutif

- **Verdict Q1** : le B2AI est une **vraie couche durable À CONDITION de se placer sur la découverte + attribution + vérifiabilité**, PAS sur un protocole ou un crawler unique. Preuve 2026 : le checkout intégré (OpenAI Instant Checkout) a été **abandonné en mars 2026**, mais les éditeurs d'affiliation pèsent **jusqu'à 91 % des sources citées par ChatGPT** et le trafic IA convertit **+42 %** vs non-IA. La couche « donnée structurée, fraîche, attribuable » monte ; la couche « une IA me cite par bonté » et « un protocole gagne » sont fragiles. Protocoles montants à surveiller (pas à parier tout de suite) : **AP2** (mandats signés, Google), **x402** (règlement stablecoin, ~130 M tx), **format de feed ACP** (OpenAI/Stripe, réutilisable même si leur checkout a échoué), **MCP côté PRO** (>10k serveurs, registry).
- **3 briques Q2 prioritaires** : (1) figer l'**API pivot en contrat agent-grade** (OpenAPI versionné + `/.well-known` de découverte) = racine qui débloque tout ; (2) **fraîcheur PROUVABLE et signée** (attestation cryptographique `verified_at` par l'éditeur) = le différenciateur « bad data is worse than no data » ; (3) **webhook de conversion + redirect signé** = rend l'attribution temps réel et actionnable, protège le revenu que l'agentic commerce menace.
- **3 meilleures idées Q3** : (1) **Verified-Freshness-as-a-Feed** (le moteur de fraîcheur signée généralisé à toute donnée périssable servie aux agents) ; (2) **Attribution d'origine-IA en SaaS** (le moteur d'attribution token-in-path généralisé, sur le trou de mesure AI→conversion que tout le secteur constate) ; (3) **Adaptateur de feed agent-ready** (transformer un catalogue SMB en feed ACP + pages AEO + fraîcheur signée).

---

## Q1 — Le B2AI est-il une vraie couche durable, techniquement ?

La bonne façon de trancher techniquement : ne pas juger « le B2AI » en bloc, mais **séparer la pile
en 2 couches** dont la durabilité est opposée.

- **Couche DÉCOUVERTE / CITATION** (ce que fait Parrainly) : durable et en croissance.
- **Couche TRANSACTION / PAIEMENT** (agentic commerce complet) : l'intégration « checkout dans le
  chat » s'est effondrée en 2026, mais l'**infrastructure de paiement agent-à-agent** (protocoles)
  monte réellement. Deux histoires à ne pas confondre.

### 1.1 Ce qui est fragile (dépend du bon vouloir crawlers/citations)

- **`llms.txt`** : ~10 % d'adoption après 18 mois, mais les crawlers IA (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended) **ne le récupèrent quasiment jamais** et lisent le HTML directement.
  Google a déclaré publiquement ne pas le supporter (Mueller le compare au `meta keywords`). Ce n'est
  PAS un standard IETF/W3C, c'est une convention communautaire. → Le garder comme signal dev-experience
  gratuit, NE JAMAIS en faire un pilier de distribution. C'est cohérent avec notre archi (le canal réel
  = HTML structuré cité, pas le fichier `.txt`).
- **La citation « par bonté »** : être cité n'est pas contractuel. Un moteur peut cesser de nous citer,
  changer d'algo, ou résumer sans lien. Fragile SI c'est le seul actif. Robuste dès qu'on y adosse une
  donnée que l'agent *préfère* consommer (fraîche, signée, structurée pour l'action).
- **Le checkout intégré dans le chat** : **OpenAI a arrêté Instant Checkout en mars 2026**, ~5 mois
  après lancement. < 15 marchands Shopify passés en prod, conversion intra-interface négligeable
  (Forrester : cas d'usage le MOINS adopté, même chez la Gen Z). Parier sur « vendre dans ChatGPT » en
  V1 serait une erreur.

### 1.2 Ce qui est durable (protocoles/surfaces montants à parier)

- **L'affiliation reste le carburant des réponses IA** : les éditeurs d'affiliation représentent
  **jusqu'à 91 % des sources citées par ChatGPT** sur les produits phares des grandes marques (CJ). Et
  le trafic IA convertit **+42 %** vs non-IA en mars 2026 (renversement de +80 points en 12 mois),
  parce que le parcours d'achat est déjà mûri conversationnellement. → **La thèse de Parrainly (être la
  source d'affiliation citée) est structurellement du bon côté.** La transaction se fait toujours sur le
  site marchand = là où l'attribution d'affiliation fonctionne. Le trou du secteur = attribuer la
  découverte IA qui précède (voir Q3).
- **Les protocoles de paiement agentique** (couche infra, pas UI) montent vraiment :
  - **AP2 (Agent Payments Protocol, Google, 60+ partenaires)** : couche d'autorisation/confiance par
    **mandats cryptographiquement signés** (l'utilisateur atteste une intention de transaction). Carte + crypto via extension x402.
  - **x402 (Coinbase)** : règlement stablecoin sur HTTP (ranime le code 402), micro-paiements
    machine-à-machine et **monétisation d'API**. ~130 M transactions cumulées (mai 2026), USDC sur Base/Solana.
  - **ACP (OpenAI + Stripe)** : le *checkout* a échoué, mais **le format de feed produit** (jsonl.gz/csv.gz
    poussé à un endpoint, MAJ quotidienne, champs titre/prix/dispo/éligibilité) reste un standard
    d'ingestion réutilisable (Etsy live, 1M+ marchands Shopify, PayPal en 2026). Adopter ce **format**
    ne coûte presque rien et nous rend ingestibles quand une surface agentique matûre arrive.
- **Signature/provenance de la donnée** : **C2PA** est passé grand public en 2026 (Pixel 10, Galaxy S25,
  6000+ membres). Le principe « manifeste signé qui prouve qui/quand/comment » va se diffuser aux DONNÉES,
  pas juste aux images. Un feed dont la fraîcheur est **cryptographiquement attestée** sera préféré par
  les agents (moins d'hallucination, vérifiable). C'est notre angle de différenciation, transposé en signature.

### 1.3 Le MCP abandonné grand public — que reste-t-il côté PRO/agents ?

Rappel de mon archi précédente : MCP tiers = jamais branché par le grand public → hors chemin critique.
**Ça n'a pas changé, et ça reste vrai.** MAIS côté PRO/agents il demeure un actif :

- MCP est massivement adopté côté outillage (>10k serveurs, MCP Registry, support first-party Claude/
  ChatGPT/Gemini/Copilot/Cursor). Les consommateurs sont des **développeurs, agents, comparateurs,
  gestionnaires de programme** qui branchent un MCP dans LEUR workflow. Petit volume, forte intention.
- Pour nous : un **MCP interne/PRO en façade sur l'API stable** (coût marginal 2-4 j une fois l'API figée)
  ouvre le canal B2B (un agent qui gère des programmes de parrainage, un comparateur qui interroge notre
  registre). C'est une brique de positionnement « IA-native » réelle, pas un canal grand public.
- **Le pari montant n'est plus MCP seul, c'est le trio AP2/x402/format-ACP** : la surface qui compte pour
  un actif de données comme le nôtre passe de « exposer des tools » à « exposer une donnée signée,
  fraîche, actionnable, et attribuable, ingestible par n'importe quelle surface agentique ». MCP en est
  UN transport parmi d'autres (feed, API, webhook).

### 1.4 Verdict technique Q1

**Oui, couche durable, mais uniquement sur le bon étage.** Parrainly est du côté durable (découverte +
attribution d'affiliation, que les IA consomment massivement). La durabilité vient de **la nature de la
donnée** (structurée, fraîche, signée, actionnable, attribuable), PAS d'un protocole ou d'un crawler
unique. Règle d'ingénierie : **rester transport-agnostique** (HTML structuré + API + feed + webhook +,
plus tard, MCP/ACP/AP2), ne jamais coupler le modèle de revenu à la bonne volonté d'une seule surface.
Le vrai risque n'est pas technologique, il est de **surindexer sur un standard qui n'a pas gagné**
(leçon Instant Checkout + llms.txt). On instrumente pour être ingestible partout, on parie sur la donnée.

---

## Q2 — Briques techniques à ajouter APRÈS Parrainly (ordonnées par dépendances)

Objectif de cette pile : faire passer notre donnée de « lisible par une IA en browsing » à
« **consommable, vérifiable et actionnable par un agent** ». Ordre = par dépendances, pas par envie.
La racine est le contrat d'API ; tout le reste s'y adosse. Effort en jours-équipe IA (2 humains T&E
qui valident, exécution agents). Coût token quasi nul : ces briques sont du transport/données, pas des
appels LLM en boucle (les seuls appels LLM restent la vérification/enrichissement de fiches, déjà cappés).

| # | Brique | Dépend de | Done si | Effort |
|---|--------|-----------|---------|--------|
| B1 | **Figer** l'API pivot en contrat agent-grade : OpenAPI 3.1 versionné (`/api/v1` gelé) + `/.well-known/` de découverte (`ai-plugin`/manifest pointant l'API, sitemap machine) + pagination/filtre stables | racine (API existe déjà) | Un agent tiers découvre l'API sans doc humaine ; schéma versionné, breaking change = v2 | 2-3 j |
| B2 | **Signer** la fraîcheur : attestation cryptographique par offre (`verified_at`, éditeur, hash) exposée dans l'API/JSON-LD, vérifiable par un tiers (clé publique `/.well-known/`) | B1 | Un tiers vérifie « vérifié le X par l'éditeur » sans nous faire confiance ; signature invalide = rejet | 3-5 j |
| B3 | **Rendre le schéma actionnable** : passer de « voici un code » à « voici l'action » via `PotentialAction`/JSON-LD + objet offre à champs exécutables (deep-link paramétré, params requis, contraintes) | B1 | Un agent construit l'appel/redirect à partir du seul objet, sans parser du HTML | 2-3 j |
| B4 | **Exposer** un webhook de conversion + redirect signé : `/r/{token}` signé (anti-forge) + webhook sortant `conversion.confirmed` vers un partenaire/agent | moteur d'attribution (existe) + B2 | Une conversion attribuée déclenche un événement signé consommable temps réel ; rejeu impossible | 3-5 j |
| B5 | **Publier** un export au format feed ACP (jsonl.gz) + endpoint delta : catalogue poussable/ingestible par une surface agentique, MAJ incrémentale « depuis timestamp » | B1 + B3 | Le catalogue est ingestible tel quel par un pipeline ACP ; delta cappé, pas de full-scan | 2-4 j |
| B6 | **Ouvrir** un MCP interne/PRO en façade sur l'API figée : `search_referrals`, `get_offer`, `list_categories` + publication MCP Registry | B1 (+ B3 pour l'action) | Un power-user/comparateur branche notre MCP et obtient offre signée + lien traçable | 2-4 j |

Chemin critique : **B1 → (B2 ∥ B3) → B4 → B5/B6**. B2 et B3 sont parallélisables une fois B1 figé.
B4 est prioritaire côté revenu (protège l'attribution) ; B5/B6 sont des surfaces d'exposition à activer
selon le signal (partenaire pro qui demande MCP, surface agentique qui demande un feed).

### Détail des briques et pourquoi elles rendent la donnée « agent-grade »

- **B1 (racine)** : sans contrat stable, tout consommateur agent casse à chaque déploiement. Un
  `/.well-known/` rend l'API **auto-découvrable** (un agent trouve nos capacités sans humain). C'est la
  condition de tout le reste ; le coder mal = recoder B4/B5/B6.
- **B2 (le différenciateur)** : c'est notre « bad AI is worse than no AI » appliqué à la donnée. Un
  agent qui doit choisir entre 2 sources préfèrera **celle dont la fraîcheur est prouvable** (moins de
  risque d'halluciner un code mort). On transpose le principe C2PA (manifeste signé) à un feed d'offres.
  C'est aussi un argument de citation (« données vérifiées et signées le X »).
- **B3 (actionnable)** : un agent ne veut pas « lire », il veut **agir**. `PotentialAction` + deep-link
  paramétré = l'agent exécute la redirection de parrainage sans scraper. Prépare l'ère où l'agent
  *déclenche* le parcours, pas juste le résume.
- **B4 (revenu)** : l'agentic commerce menace l'attribution (le clic disparaît dans une réponse). Un
  redirect signé + webhook rend la conversion **mesurable et temps réel**, y compris si un partenaire
  agent est dans la boucle. C'est la brique qui protège le NSM (PCA-IA) contre la désintermédiation.
- **B5 (option feed)** : coût faible, valeur d'option. Adopter le format ACP nous rend ingestibles le
  jour où une surface agentique mûre réapparaît, sans réécrire notre pipeline. On ne parie pas dessus,
  on s'y branche à moindre coût. Cap tokens/poids : delta incrémental, jamais de full-scan.
- **B6 (canal PRO)** : le MCP redevient pertinent **côté pro** (comparateurs, gestionnaires de
  programme, agents). Façade fine sur B1, coût marginal. NE PAS le mettre avant B1.

---

## Q3 — Autres produits B2AI réalistes (équipe 2 + agents, socle réutilisé)

Contrainte : équipe 2 + agents, réutiliser le socle **Cloudflare Workers/Pages + D1 + Next**, la
**couche AEO/GEO** (JSON-LD, contenu structuré, générateur statique) et le **moteur d'attribution**
(token-in-path `/r/{token}` + confirmation). Chaque idée doit réemployer au moins 2 de ces 3 actifs.

### Q3-A — Verified-Freshness-as-a-Feed (donnée périssable signée pour agents) ★ top

- **Brique data** : le moteur de vérification + signature (B2) généralisé à TOUTE donnée périssable
  (prix, disponibilité, conditions d'offre, horaires, stock) exposée en feed signé + `verified_at`.
- **Pourquoi une IA la consomme** : un agent qui répond « le prix/l'offre est X » a besoin de savoir
  que la donnée est fraîche et réelle, sinon il hallucine du périmé (le problème n°1 des réponses IA
  sur des données volatiles). Une source **signée + horodatée** est préférée et re-citée.
- **Monétisation** : SaaS par feed / par volume de vérifications ; upsell « badge de fraîcheur vérifiée ».
- **Faisabilité** : haute. C'est B2 productisé. Réutilise D1 + cron Worker + générateur. Le moteur
  existe déjà pour le parrainage, on l'ouvre à d'autres verticales. **Défendabilité** : la boucle de
  vérification + la signature + l'historique de fraîcheur sont le moat (dur à copier vite).

### Q3-B — Attribution d'origine-IA en SaaS (le trou de mesure AI→conversion) ★ top

- **Brique data** : le moteur d'attribution (token-in-path, `/r/{token}` traçant, confirmation
  déclarative) généralisé en produit de mesure « quelle part de mes conversions vient d'une réponse IA ».
- **Pourquoi une IA « la consomme »** : indirect, mais elle est **sur le chemin** AI→conversion que tout
  le secteur constate cassé (CJ, Forrester : le trafic IA convertit +42 % mais l'attribution de la
  découverte manque). On ne consomme pas l'IA, on **mesure son impact** pour marchands/affiliés.
- **Monétisation** : abonnement analytics / part de la conversion attribuée. Marché tiré par le fait
  que « AI traffic = meilleure conversion mais invisible en analytics classique ».
- **Faisabilité** : haute. Réutilise moteur d'attribution + Plausible/PostHog déjà cadrés
  (`docs/analytics/tracking-plan.md`). **Défendabilité** : moyenne-haute, c'est un problème pénible et
  peu servi ; le premier crédible et neutre gagne des logos. Compatible AP2/x402 plus tard (attribuer
  aussi des paiements agentiques signés).

### Q3-C — Adaptateur de feed agent-ready pour SMB (ACP + AEO + fraîcheur signée) ★ top

- **Brique data** : pipeline qui transforme un catalogue marchand brut (Sheet/CSV/API) en (a) pages
  AEO structurées, (b) feed format ACP (jsonl.gz), (c) fraîcheur signée B2. Notre générateur, ouvert.
- **Pourquoi une IA la consomme** : un SMB n'a ni les pages structurées ni le feed ingestible ; on le
  rend **citable ET ingestible** par les surfaces agentiques d'un coup, sans qu'il code.
- **Monétisation** : setup + abonnement par feed (récurrent, low-touch, scalable équipe 2).
- **Faisabilité** : haute. C'est exactement notre chaîne Parrainly, dé-spécialisée du parrainage.
  **Défendabilité** : moyenne (le format ACP est ouvert), le moat = fraîcheur signée + AEO + attribution
  packagés, pas le feed seul.

### Q3-D — Monitoring de citabilité IA + générateur de données structurées

- **Brique data** : le moteur de monitoring de citations (`docs/geo/monitoring-citations.md`) + le
  générateur JSON-LD, en outil « mesure combien l'IA te cite et génère la donnée pour t'améliorer ».
- **Pourquoi une IA la consomme** : la donnée générée (JSON-LD signé, feed) est faite pour être ingérée ;
  la mesure boucle sur l'amélioration.
- **Monétisation** : abonnement (audit + génération continue). **Faisabilité** : moyenne-haute, réutilise
  monitoring + générateur. **Défendabilité** : moyenne (marché AEO/GEO qui se peuple), différenciateur =
  on ne fait pas que mesurer, on **produit la donnée signée** qui corrige.

### Q3-E — Couche de divulgation embarquée machine-readable (tailwind réglementaire)

- **Brique data** : notre travail légal (divulgation d'affiliation embarquée en JSON, DGCCRF/Omnibus,
  transparence AI Act) packagé en brique qui **injecte une divulgation lisible par agent** dans un feed.
- **Pourquoi une IA la consomme** : les agents devront restituer la relation commerciale (transparence) ;
  une divulgation structurée est directement exploitable. **Monétisation** : add-on du produit feed
  (Q3-C). **Faisabilité** : haute mais valeur seule limitée → mieux comme **feature** de Q3-C que produit
  autonome. **Défendabilité** : faible en solo, forte en bundle réglementé.

**Sélection** : les 3 premiers (A, B, C) sont les meilleurs (réutilisation maximale du socle, marché
tiré par des faits 2026 vérifiés, défendabilité réelle sur A et B). D et E sont des extensions/features,
pas des paris autonomes prioritaires.

---

## Vérifié (G_PROOF)

_(reads réels + WebSearch réels)_

---

## Handoff
