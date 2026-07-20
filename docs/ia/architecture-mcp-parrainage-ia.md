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

[SECTION_2]

---

## 3. Vérification & fraîcheur des codes

[SECTION_3]

---

## 4. Effort technique réaliste : POC vs V1

[SECTION_4]

---

## 5. Verdict MCP : oui / non / quand

[SECTION_5]

---

## Sources (WebSearch, 2026-07-20)

[SOURCES]

---

**Handoff → @orchestrator**
[HANDOFF]
