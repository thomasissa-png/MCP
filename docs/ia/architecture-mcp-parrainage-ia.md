<!-- Version: 2026-07-20T00:00 — @ia — Faisabilité MCP + architecture POC→V1 parrainage-IA -->

# Architecture d'interfaçage IA — Parrainage-IA (POC → V1)

> Livrable @ia. Évalue la faisabilité et la pertinence d'un **serveur MCP** comme couche
> d'exposition du catalogue de codes aux assistants IA, et recommande l'architecture qui
> **maximise la probabilité qu'une IA serve nos codes**. Stade : Idée / POC (Google Sheet).
> Sources web citées en fin de document (état MCP au T3 2026).

## Résumé exécutif (≤ 20 lignes)

- **Verdict MCP grand public : NON (pas comme interface grand public), OUI plus tard comme brique pour un segment pro/avancé.** Un serveur MCP tiers n'est utilisable QUE si l'utilisateur l'a explicitement branché dans SON client IA. Or, sur ChatGPT.com, Claude.ai, Perplexity, les apps/connecteurs MCP tiers **exigent une activation manuelle** (Settings > Apps, autorisation explicite). Le grand public qui tape "code promo X" ne passe donc JAMAIS par notre MCP. [sources §Sources]
- **Ce qui touche réellement le grand public, c'est le canal "browsing/recherche" des IA** : ChatGPT with Browse, Perplexity, Google AI Mode, Claude lisent le **web indexé** et citent les pages **structurées** (schema.org, ItemList, FAQPage). C'est là que se joue 90 % de notre visibilité au POC. [sources §Sources]
- **Architecture recommandée** : Google Sheet (source de vérité) → export automatisé vers (a) **un site web statique GEO/AEO-first** avec schema.org (canal principal grand public) + (b) **un flux/API JSON public** (machine-readable, réutilisable). MCP arrive en **V1.5**, en réutilisant la MÊME API, pour le segment "power users" et une éventuelle **App/Plugin ChatGPT** listée au directory.
- **Fraîcheur des codes = enjeu de survie** (un code mort tue la confiance et le référencement IA). Automatiser : vérification programmée (cron), statut `verified_at` par code, dégradation/retrait automatique, et signalement humain. Détail §3.
- **Effort POC** ≈ 1 à 2 semaines (Sheet + site statique généré + schema + flux JSON). **Effort V1** ≈ 4 à 8 semaines (DB, attribution des conversions, dashboard fraîcheur, MCP + App ChatGPT). Détail §4.
- **Piège à éviter** : construire d'abord le MCP par effet de mode. Le MCP ne crée pas de distribution ; il sert une audience qu'il faut d'abord capter via le web structuré.

---

## 1. Ce qu'un serveur MCP permet réellement ici — et ses limites

### 1.1 Ce que MCP EST vraiment

MCP (Model Context Protocol, Anthropic fin 2024) est un protocole qui permet à un client IA d'appeler des **outils** exposés par un serveur (ex : `search_promo_codes(marchand)`, `get_referral_link(service)`). Au T3 2026 il est massivement adopté côté outillage : > 10 000 serveurs publics actifs, support first-party de Claude, ChatGPT, Gemini, Copilot, Cursor, VS Code, Perplexity, Mistral, et un **MCP Registry** central (~2 000 entrées "officielles", ~20 000 serveurs recensés tous annuaires confondus). [sources §Sources]

Pour NOTRE cas, un MCP apporterait :
- un accès **structuré et temps réel** au catalogue (l'IA reçoit le code exact + le lien de parrainage traçable, sans hallucination),
- une **intégration native** dans le flux conversationnel du client (l'assistant appelle l'outil, insère notre code, on garde l'attribution),
- une donnée **machine-first** (pas de scraping HTML, pas d'ambiguïté).

### 1.2 La limite structurante : un MCP tiers n'est JAMAIS consommé par défaut

C'est le point à dire franchement à Emmanuel. Sur toutes les plateformes grand public, un serveur MCP tiers **doit être ajouté et autorisé manuellement par l'utilisateur** :
- **ChatGPT** : les apps/connecteurs se branchent dans `Settings > Apps`, "enabled only after explicit authorization" ; les connecteurs MCP tiers complets passent même par un "Developer mode" en beta. [sources]
- **Claude.ai** : ajout manuel d'un connecteur MCP dans les paramètres.
- **Perplexity / Gemini / Copilot** : idem, activation à l'initiative de l'utilisateur.

Conséquence directe sur le persona "Léa" du project-context : **une personne qui tape "trouve-moi un code promo VPN" dans ChatGPT.com n'a, dans 99 % des cas, aucun MCP tiers branché.** Elle ne verra JAMAIS notre serveur MCP. Le MCP ne crée aucune distribution ; il ne fait que servir mieux une audience **déjà captée et déjà techniquement équipée**.

### 1.3 Où MCP a de la valeur pour nous

- **Segment power-user / pro** : développeurs, créateurs d'agents, comparateurs, qui branchent notre MCP dans leur propre outil ou workflow. Petit volume, forte intention.
- **Distribution via un annuaire** : publier au MCP Registry et sur les directories (top-mcps, mcp.directory) donne une visibilité de niche, pas grand public.
- **Brique interne réutilisable** : le MCP peut n'être qu'une **façade fine au-dessus de notre API** (voir §2). Coût marginal faible si l'API existe déjà.

**Verdict de section : MCP = brique pour un segment avancé et un actif de "positionnement IA-native", PAS l'interface qui touche le grand public.** Le construire en premier serait surindexer sur le hype.

---

## 2. Architecture recommandée POC → V1

### 2.1 Principe directeur

**La source de vérité est unique (le Sheet, puis une DB), et on en dérive PLUSIEURS interfaces de consommation.** On ne mise pas sur un seul canal. On priorise le canal qui touche réellement le grand public (web structuré lu par les IA en browsing), et on ajoute le MCP quand l'API existe déjà.

### 2.2 Comment une IA sert réellement nos codes au grand public

Les assistants grand public répondent en majorité via **browsing / answer engine** : ils lisent des pages web indexées et **citent les contenus structurés**. Un site avec schema.org est ~2,3× plus cité dans les réponses IA qu'un site sans données structurées ; les types `ItemList`, `FAQPage`, `Offer` ont les meilleurs taux de citation. [sources §Sources] **C'est notre canal principal.**

### 2.3 Schéma d'architecture (POC → V1)

```
             SOURCE DE VÉRITÉ
        POC : Google Sheet (T&E)
        V1  : DB (Cloudflare D1 ou Neon Postgres)
                     │
        ┌────────────┴─── build / sync automatisé (cron) ───────────┐
        │                        │                                   │
   [CANAL 1 — GRAND PUBLIC]  [CANAL 2 — MACHINE]              [CANAL 3 — AVANCÉ]
   Site statique GEO/AEO      Flux / API JSON public          Serveur MCP
   - 1 page / marchand        /api/codes.json                 (façade sur CANAL 2)
   - schema.org : ItemList,   /api/codes/{marchand}           - search_promo_codes()
     Offer, FAQPage           machine-readable, cache CDN      - get_referral_link()
   - contenu factuel citable  réutilisable par agents/tiers    + App/Plugin ChatGPT
   → lu par ChatGPT Browse,   → réutilisation, sitemap IA        listée au directory
     Perplexity, Google AI                                     → power users / pro
```

- **POC (immédiat)** : Sheet publié → petit script de génération (GitHub Action / Cloudflare Worker) qui produit **le site statique + schema.org + le `codes.json`**. Zéro backend lourd. Hébergement Cloudflare Pages (gratuit).
- **V1** : migration Sheet → **D1** (aligné écosystème Cloudflare du contexte projet) ou Neon si besoin relationnel avancé ; ajout de l'**attribution des conversions** (liens de parrainage traçés, `utm` + redirecteur `/go/{code}` qui logge le clic) ; puis **MCP** en façade sur l'API + soumission d'une **App ChatGPT** au directory.

### 2.4 Pourquoi cet ordre (et pas MCP d'abord)

1. Le web structuré est le SEUL canal qui atteint "Léa" dès le POC, sans qu'elle installe quoi que ce soit.
2. L'API JSON est l'**actif pivot** : le site ET le MCP ET l'App ChatGPT la consomment. La construire une fois sert tout le reste.
3. Le MCP se greffe en quelques jours une fois l'API stable (façade fine). Le faire avant l'API, c'est coder deux fois.
4. Cet ordre est **réversible et mesurable** : on saura via l'attribution quel canal convertit avant d'investir dans le suivant.

---

## 3. Vérification & fraîcheur des codes

Un code mort tue deux choses : la confiance de l'utilisateur ET la citabilité par l'IA (une IA qui a servi un code faux nous "dé-cite" ensuite). La fraîcheur est donc le KPI qualité central, pas une option.

### 3.1 Modèle de donnée minimal (dès le Sheet)

Chaque code porte des champs de fraîcheur : `code`, `marchand`, `type` (promo / parrainage), `lien`, `date_ajout`, `date_expiration` (si connue), `verified_at` (dernière vérif), `statut` (`actif` / `à_vérifier` / `expiré` / `retiré`), `source_verif` (auto / humain / signalement).

### 3.2 Niveaux de vérification (du moins au plus coûteux)

1. **Règles / dates (gratuit, immédiat)** : tout code dont `date_expiration` est passée → `expiré` automatiquement. Tout code non vérifié depuis N jours (ex : 14) → `à_vérifier`.
2. **Heuristique semi-automatique** : cron (GitHub Action quotidienne) qui, par marchand, vérifie que la page/programme de parrainage existe encore (HTTP 200, lien non cassé) et journalise. Ne prouve pas que le code marche, mais détecte les liens morts.
3. **Vérification effective du code** : difficile à 100 % sans passer commande. Approches réalistes :
   - **codes de parrainage** (notre cœur au POC) : ils n'expirent quasi pas ; vérif mensuelle que le programme existe suffit.
   - **codes promo marchands** : signalement communautaire (bouton "ça marche / ça marche pas") + re-test humain priorisé sur les plus consultés. Un LLM peut aider à parser une page marchand pour repérer une mention d'offre, mais **ne jamais affirmer "valide" sans preuve** (règle anti-invention).
4. **Boucle de confiance** : n'exposer au public/à l'IA QUE les codes `actif`. Un code `à_vérifier` est masqué du flux, pas supprimé. Politique affichée : "codes vérifiés le {verified_at}".

### 3.3 Automatisation recommandée

- POC : **1 GitHub Action quotidienne** lit le Sheet, applique les règles 1 et 2, réécrit les statuts, régénère site + `codes.json`. Coût ~0.
- V1 : même logique en Worker Cron + table de signalements + dashboard fraîcheur (taux de codes actifs, âge médian de vérification, top codes signalés morts). Alerte si taux de codes `actif` < seuil.
- **Le `verified_at` est exposé dans le schema.org et l'API** : c'est un argument de citation ("données fraîches") ET de confiance.

---

## 4. Effort technique réaliste : POC vs V1

Calibration équipe 100 % IA (2 humains T&E pour valider) : la "complexité" n'est pas la contrainte, c'est l'**enchaînement des dépendances** qui structure l'effort. Estimations en jours-équipe IA.

| Brique | POC | V1 | Note |
|---|---|---|---|
| Source de vérité | Google Sheet (fait par Emmanuel) | Migration → D1/Neon + schéma fraîcheur | POC = 0 dev |
| Génération site GEO/AEO | Générateur statique + schema.org (ItemList/Offer/FAQPage) — **2-3 j** | Templates par marchand, sitemap IA, contenu enrichi — **1 sem** | Canal grand public prioritaire |
| Flux/API JSON public | Export `codes.json` via Action — **1 j** | API cache CDN + endpoints par marchand — **2-3 j** | Actif pivot |
| Vérification fraîcheur | Règles dates + check liens (cron) — **1-2 j** | Dashboard + signalements + alertes — **3-5 j** | §3 |
| Attribution conversions | (hors POC ou minimal `/go/{code}` + log) — **0-1 j** | Redirecteur traçant + analytics + réconciliation parrainage — **1 sem** | KPI North Star du contexte |
| Serveur MCP | **Non** (repoussé) | Façade sur l'API + publication Registry — **2-4 j** | Faible coût car API existe |
| App/Plugin ChatGPT | Non | Build + soumission directory — **3-5 j** | Segment "install volontaire" |
| **Total** | **~1 à 2 semaines** | **~4 à 8 semaines** | dépend de l'attribution |

**Chemin critique POC** : Sheet rempli → générateur → schema.org en ligne → 1er test réel "une IA en browsing cite-t-elle notre page ?". C'est le seul test qui valide l'hypothèse de distribution. Le MCP ne fait pas partie du chemin critique du POC.

---

## 5. Verdict MCP : oui / non / quand

**MCP : NON comme interface grand public, OUI comme brique de V1.5 pour un segment avancé.**

- **NON, maintenant, comme canal grand public** : personne ne branche un MCP tiers par défaut ; "Léa" ne nous atteindra jamais par ce biais. En faire le pilier du POC serait une erreur de priorisation dictée par le hype.
- **OUI, plus tard, à coût marginal** : une fois l'API JSON stable, exposer un MCP est rapide (2-4 j), donne un actif de positionnement "IA-native" réel, touche les power users et permet une App ChatGPT listée au directory (canal d'install volontaire).
- **QUAND** : après que le canal web structuré (schema.org) ait prouvé qu'une IA en browsing cite nos codes, et que l'attribution des conversions fonctionne. Déclencheur = API publique en place + premiers signaux de citation.

**À dire à Emmanuel en une phrase** : le MCP est un bon pari de fond, mais il ne remplace pas la distribution ; on gagne d'abord en étant la page **structurée et fraîche** que les IA lisent et citent, puis on ajoute le MCP par-dessus la même API, sans le mettre sur le chemin critique du POC.

---

## Sources (WebSearch, 2026-07-20)

[SOURCES]

---

**Handoff → @orchestrator**
[HANDOFF]
