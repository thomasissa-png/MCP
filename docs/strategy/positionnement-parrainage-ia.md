<!-- Version: 2026-07-20T00:00 — @creative-strategy — Cadrage initial positionnement, personas, why-now, territoires de marque -->

# Positionnement — Parrainage-IA

**Stade : Idée.** Ce document ne couvre PAS le sizing marché chiffré (→ @data-analyst/@growth) ni le juridique (→ @legal). Il traite : personas (deux faces), why-now, positionnement différenciant, territoires de marque.

## Résumé exécutif

Le projet parie que les assistants IA deviennent un canal de réponse à part entière pour "trouve-moi un code promo", et qu'aucun acteur n'est aujourd'hui structuré pour être LA source que l'IA cite sur ce sujet précis. Les sites de codes promo classiques (RetailMeNot, Dealabs, iGraal) sont SEO-first (optimisés pour le clic humain sur une page pleine de pub) : ils sont mal adaptés à une consommation par un agent IA qui a besoin d'une donnée structurée, vérifiée, unique, sans ambiguïté. Deux pistes de positionnement se dégagent : (1) "le registre de confiance des codes pour les IA" (angle fiabilité/vérification), (2) "le protocole du parrainage IA-natif" (angle infrastructure/catégorie). Recommandation : commencer sur l'angle (1), plus crédible au stade POC, en gardant (2) comme trajectoire d'ambition à 12-18 mois une fois le catalogue et le volume de citations établis.

---

## 1. Personas affinés (modèle deux faces)

### 1.1 Persona A — Le demandeur de code (utilisateur final de l'IA)

**Nom de travail** : Léa, 29 ans, utilise ChatGPT/Perplexity quotidiennement pour ses achats et arbitrages du quotidien (VPN, box repas, banque en ligne, abonnements, e-commerce).

**Frustrations concrètes (verbatims)** :
- "Je demande à ChatGPT un code promo et il me sort un truc qui marche jamais." → frustration = l'IA hallucine ou recrache un vieux code sans vérification, ce qui casse la confiance dans la réponse elle-même, pas seulement dans le code.
- "J'en ai marre des sites de codes promo, c'est que de la pub et les codes sont morts." → frustration = le détour par un site tiers est perçu comme une taxe en temps et en irritation (pop-ups, extensions douteuses, faux comparateurs), pour un taux de réussite perçu comme faible.
- "Si l'IA me donnait direct un code qui marche, je ne chercherais plus ailleurs." → le point de bascule : la promesse n'est pas "plus de choix", c'est "zéro friction, un seul essai qui marche".

**Objection anticipée** : "Comment je sais que ce code n'est pas juste un lien d'affiliation planqué qui profite à quelqu'un d'autre que moi ?" → nécessite transparence sur la nature du lien (cf. enjeu @legal divulgation Omnibus/DGCCRF, hors périmètre ici mais impact direct sur le ton de marque : la confiance doit être visible, pas juste réelle).

**Vocabulaire propre** : "ça marche / ça marche pas", "code valide", "arnaque", "y'a un truc qui cloche", "je fais confiance à [assistant IA]" (la confiance se reporte sur l'assistant, pas sur le site source — point structurant pour le positionnement, voir section 3).

**Client du persona A** — N/A. B2C direct sans client professionnel intermédiaire (le "client" de Léa n'existe pas au sens où l'entend le framework — elle est utilisatrice finale directe de l'assistant IA, qui est un tiers technique, pas un intermédiaire humain qu'elle mandate).

### 1.2 Persona B — Le parrain (fournisseur de code, côté offre)

**Nom de travail** : au démarrage, Thomas & Emmanuel eux-mêmes, détenteurs de liens de parrainage (banques, VPN, apps, box). À terme, toute personne ou petite structure détenant des codes de parrainage qu'elle veut monétiser mieux.

**Frustrations concrètes (à valider par interview — hypothèses de cadrage)** :
- `[HYPOTHÈSE]` "Mon lien de parrainage dort dans un post Instagram ou un vieux tweet, personne ne le retrouve." → frustration = un actif de valeur (le lien) est mal distribué, sa portée dépend du hasard de la découverte humaine.
- `[HYPOTHÈSE]` "Je n'ai aucune idée de si mon code est encore listé quelque part, ni s'il est à jour." → frustration = absence de contrôle et de visibilité sur la diffusion de son propre code.
- `[HYPOTHÈSE]` "Les sites de codes promo grand public ne prennent que les codes des grandes marques, pas les parrainages individuels." → frustration = les plateformes existantes (RetailMeNot, Dealabs) sont structurées pour des marques avec budget affiliation, pas pour un parrainage pair-à-pair.

**Objection anticipée** : "Si je mets mon code sur leur Google Sheet / leur service, est-ce que je perds le contrôle dessus, est-ce que n'importe qui peut l'épuiser ou le détourner ?" → nécessite une réponse produit (traçabilité, attribution) au-delà du positionnement — signalé pour @product-manager.

**Vocabulaire propre** : "mon lien", "mes avantages parrain", "faire vivre mon code", "être visible", "toucher ma prime".

**Client du persona B** — N/A au stade Idée (B2C direct, pas de client professionnel mandaté). Si le modèle évolue vers une marketplace ouverte à des parrains professionnels (créateurs de contenu, affiliés pro), ce champ serait à rouvrir — signalé, pas traité ici car hors du cadrage actuel.

**Note de méthode** : les verbatims du Persona A reprennent ceux déjà validés dans `project-context.md` (section Cible). Les verbatims du Persona B sont marqués `[HYPOTHÈSE]` car aucune interview de parrain potentiel n'a été menée — à confirmer avant tout brief de conversion/onboarding parrain (@ux, @copywriter).

---

## 2. Why now — pourquoi ce moment est unique

Trois faits, documentés par recherche web, qui changent la donne par rapport à il y a 2-3 ans :

**a) Le volume de requêtes traitées par des moteurs de réponse IA a franchi un seuil critique.** ChatGPT compte 883 millions d'utilisateurs mensuels et les AI Overviews de Google apparaissent dans près de 55% des recherches Google ; Gartner anticipe une baisse de 25% du volume de recherche traditionnelle d'ici 2026 du fait des chatbots et agents IA (source : emarketer.com/content/faq-on-geo-aeo--where-ai-search-seo-overlap-2026). Concrètement : la requête "code promo pour X" part de plus en plus vers un assistant plutôt que vers une barre de recherche Google — le terrain de jeu SEO classique (RetailMeNot et consorts) perd en pertinence à la marge, sans qu'un nouvel acteur GEO-first ait encore occupé la place.

**b) Les assistants IA sont devenus eux-mêmes un canal d'achat, pas seulement de renseignement.** ChatGPT propose l'Instant Checkout depuis septembre 2025 (900 millions d'utilisateurs hebdomadaires) ; Perplexity a fait du shopping un cas d'usage phare en 2025-2026, avec des marchands comme Wayfair, Abercrombie & Fitch, Ashley Furniture, Fabletics, Adorama, Newegg et plus de 5000 marchands via BigCommerce/Shopify (source : opascope.com/insights/ai-shopping-assistant-guide-2026-agentic-commerce-protocols). Le trafic shopping en provenance des assistants IA a bondi d'environ 693% sur la période des fêtes 2025 (Adobe Analytics), avec un taux de conversion 31% supérieur pour les visiteurs référés par une IA. Les plateformes IA sont désormais la 2e source de leads qualifiés, devant le SEO organique. Autrement dit : l'IA n'est plus juste un canal de découverte à optimiser, c'est un canal de transaction — ce qui rend un service pensé pour être *lu et cité par une IA au moment de la décision d'achat* directement monétisable, pas seulement en image de marque.

**c) Perplexity a lancé un programme d'affiliation début 2026** ($10 fixe par inscription Pro payante + 10% récurrent), preuve que les moteurs IA eux-mêmes commencent à construire une économie du parrainage/affiliation dans leur propre interface. Cela valide qu'un modèle "parrainage cité par une IA" n'est pas une lubie : l'écosystème IA lui-même s'organise dans cette direction. À l'inverse, l'accès aux catalogues produits reste un point de friction politique (Amazon a bloqué les crawlers d'OpenAI, retirant 600 millions de produits des résultats shopping de ChatGPT — source : la même recherche opascope) : la bataille de l'accès aux données structurées entre plateformes est ouverte, ce qui laisse un espace pour un acteur tiers neutre qui fournit une donnée propre (codes vérifiés) que ni le retailer ni la plateforme IA ne bloquera, car elle sert les deux.

**d) Les moteurs de réponse récompensent la structure, pas le volume de contenu.** L'étude Princeton citée par plusieurs sources GEO montre que citations, statistiques vérifiables et données factuelles augmentent la probabilité de citation de 30 à 41% (source : jasper.ai/blog/geo-aeo et frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai) ; les moteurs à récupération temps réel (Perplexity, AI Overviews) évaluent la pertinence sur les 200 premiers mots du contenu. Un Google Sheet de codes vérifiés, exposé via un protocole structuré (MCP) plutôt qu'une page web noyée de bannières, est exactement le type de format qu'un moteur de réponse privilégie — c'est un alignement natif entre le POC choisi par Emmanuel et ce que les moteurs IA recherchent, pas un hasard à documenter comme un simple choix technique.

**Sources consultées** :
- https://www.emarketer.com/content/faq-on-geo-aeo--where-ai-search-seo-overlap-2026
- https://opascope.com/insights/ai-shopping-assistant-guide-2026-agentic-commerce-protocols/
- https://www.jasper.ai/blog/geo-aeo
- https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai
- https://simplycodes.com/blog/best-coupon-app-extension
- https://nordvpn.com/blog/coupon-fraud/

---

## 3. Ce que font TOUS les sites de codes promo classiques (constat de calibration)

D'après la recherche web sur RetailMeNot, Honey, SimplyCodes, Wethrift (sources ci-dessus) :
- Génération automatisée de listes de codes, souvent expirés ou faux, sans vérification humaine systématique — le modèle économique récompense le volume de pages/clics, pas le taux de réussite du code.
- Monétisation par redirection/remplacement de liens d'affiliation, parfois de façon opaque pour l'utilisateur (cas Honey 2024 : remplacement de liens créateurs même sans code appliqué) — la confiance de l'utilisateur n'est pas l'actif protégé, le clic l'est.
- Conçus pour un humain qui clique sur une page web (SEO-first) : mise en page, pub display, comparateurs — aucun n'expose une donnée structurée consommable nativement par un agent IA.
- Le signal de qualité le plus crédible identifié (plateformes communautaires à vérification "temps réel" par les utilisateurs) reste secondaire dans leur modèle, pas le cœur de la proposition de valeur.

**Espace libre identifié** : aucun acteur ne se positionne comme *fournisseur de données de confiance pensé pour être consommé par une IA au moment de la réponse*, avec la vérification comme produit central (pas un argument marketing secondaire) et une distribution qui court-circuite la page web publicitaire au profit d'un protocole d'échange direct (MCP). C'est l'espace que le positionnement doit occuper.

---

## 4. Options de positionnement (2-3 pistes)

### Option A — "Le registre de confiance des codes pour les IA"
**Angle** : fiabilité et vérification comme promesse centrale. Le service se positionne comme la source que l'IA peut citer sans risque de halluciner ou de donner un code mort, parce que chaque entrée est vérifiée et datée.
**Promesse en 1 phrase** : "Le seul catalogue de codes de parrainage conçu pour qu'une IA ne se trompe jamais quand elle répond."
**Pour qui ça marche** : crédible dès le POC (Google Sheet + vérification manuelle T&E), facile à défendre sans données de marché chiffrées, aligné sur la frustration n°1 du Persona A ("un truc qui marche jamais").
**Risque** : promesse modeste, ne capture pas encore la dimension "catégorie nouvelle" (AEO/GEO) qui fait la force du why-now.

### Option B — "Le protocole du parrainage IA-natif"
**Angle** : positionnement d'infrastructure/catégorie. Le service ne se présente pas comme un site de plus, mais comme le standard d'échange (via MCP) entre détenteurs de codes et assistants IA — une couche technique, pas un annuaire.
**Promesse en 1 phrase** : "L'interface entre les codes de parrainage et les assistants IA, comme MCP l'est entre les données et les modèles."
**Pour qui ça marche** : capture pleinement le why-now (agentic commerce, MCP comme choix technique différenciant), positionne le projet en créateur de catégorie plutôt qu'en concurrent d'un marché encombré.
**Risque** : `[HYPOTHÈSE]` promesse aspirationnelle au stade POC (un Google Sheet n'est pas un "protocole"), demande une crédibilité technique et un volume d'intégrations que le projet n'a pas encore — à ne pas revendiquer avant que le serveur MCP et plusieurs parrains/assistants soient effectivement connectés.

### Option C — "Le bon plan qui reste bon" (angle utilisateur, ton grand public)
**Angle** : promesse orientée résultat perçu par Léa, sans jargon technique ni vocabulaire IA — la garantie que le code fonctionne, point.
**Promesse en 1 phrase** : "Le code promo qui marche, celui que ton assistant IA te donne sans te faire perdre de temps."
**Pour qui ça marche** : très lisible pour un persona B2C non technique, bon pour le ton de marque grand public.
**Risque** : renonce à la différenciation AEO/GEO qui est pourtant l'atout concurrentiel réel (n'importe quel site de codes promo peut revendiquer "le code qui marche") — ne résiste pas au test "un concurrent pourrait-il dire la même chose ?".

### Recommandation

**Option A en positionnement de lancement, trajectoire vers Option B à 12-18 mois.**

Justification : au stade Idée/POC (Google Sheet, pas encore de serveur MCP en production, pas de volume d'intégrations), revendiquer un "protocole" (Option B) serait une promesse aspirationnelle non crédible — contraire au principe "promesse différenciante ET crédible" du framework. L'Option A est directement vérifiable dès le POC (chaque code du Sheet est vérifié par T&E) et répond à la frustration n°1 documentée du Persona A. Elle n'interdit pas de préparer le terrain sémantique pour l'Option B : le champ lexical (MCP, IA-natif, structuré) peut apparaître dans le discours technique/investisseur dès maintenant, sans être la promesse consommateur. L'Option C est écartée comme positionnement principal (ne résiste pas au test concurrentiel G17) mais reste utile comme *registre de ton* pour les messages grand public de l'Option A — la promesse est "confiance/vérification", le ton peut rester simple et direct plutôt que technique.

**3 mots qui DÉFINISSENT la marque (proposition, à valider par Thomas/Emmanuel)** : vérifié / instantané / IA-natif.
**3 mots qui NE définissent PAS la marque** : spammy / pub-intrusive / code-mort.

---

## 5. Points d'attention transverses (hors périmètre de cet agent, signalés)

- **Divulgation de la relation d'affiliation/parrainage** : le ton de marque doit intégrer la transparence comme partie de la promesse (pas juste une mention légale en petit) — objection anticipée du Persona A ("lien planqué"). Décision finale de conformité → @legal.
- **Modèle économique non tranché** (part des gains vs abonnement parrain, périmètre catalogue fermé T&E vs marketplace ouverte) : le positionnement Option A fonctionne dans les deux cas ; l'Option B suppose une marketplace ouverte pour être crédible à terme — à trancher avant d'investir sur B.
- **Sizing marché et taille de la demande réelle "code promo via IA"** : non traité ici, nécessaire pour arbitrer l'ambition de l'Option B → @data-analyst/@growth.

---

## 6. Recommandation d'agents spécialisés

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| @data-analyst | Sizing/KPI | Quantifier la demande réelle "code promo via assistant IA" et définir le KPI North Star (parrainages confirmés/mois) | Le why-now s'appuie sur des données macro (ChatGPT, GEO) mais aucune donnée n'existe encore sur le volume réel de requêtes "code promo" adressées aux IA — angle mort du positionnement si non chiffré | Haute |
| @growth | Acquisition/canaux | Cartographier les canaux d'entrée dans le catalogue des assistants IA (citation organique GEO vs intégration directe type plugin/MCP) | Le positionnement suppose d'être "cité" par les IA — sans stratégie d'acquisition de cette citation, la promesse reste théorique | Haute |
| @legal | Conformité | Divulgation affiliation (DGCCRF/Omnibus), légalité de la revente de codes de parrainage, CGU des plateformes IA | Risque P0 identifié dans project-context.md, impacte directement le ton de la promesse (transparence) | Haute |
| @geo | Visibilité IA | Traduire le positionnement Option A en stratégie concrète de citation par les moteurs de réponse (structuration des données, format MCP) | Le why-now repose entièrement sur l'AEO/GEO — nécessite une expertise dédiée pour transformer le positionnement en tactique de citation | Haute |
| testeur-persona (Léa) | Test/validation | Valider les verbatims du Persona A et challenger la promesse Option A sur un cas réel | Persona rigoureux mais construit sur des hypothèses de cadrage — vérification recommandée par @agent-factory avant d'investir en copy/UX | Moyenne |
| testeur-persona (Le parrain) | Test/validation | Valider les frustrations `[HYPOTHÈSE]` du Persona B, non confirmées par interview | Persona B entièrement construit sur hypothèses — risque d'angle mort si le vrai frein des parrains diffère (ex : confiance dans l'attribution plutôt que visibilité) | Haute |

---

## 7. Auto-évaluation

□ Le positionnement occupe un espace libre identifié dans le benchmark → OUI, section 3 (aucun acteur combinant vérification-produit + distribution structurée IA-native).
□ Chaque persona a objections documentées + vocabulaire propre → OUI pour les deux ; Persona B marqué `[HYPOTHÈSE]` faute d'interview.
□ Clients-de-personas documentés ou N/A justifié → N/A justifié pour les deux (B2C direct, pas de client professionnel intermédiaire au stade actuel).
□ Brief créatif complet (positionnement 1 phrase, promesse 1 phrase, ton 3 adjectifs, territoire sémantique, exclusions) → positionnement et promesse tranchés (Option A) ; ton de marque et territoire sémantique complet restent `[À VALIDER]` par Thomas/Emmanuel — proposition de 3 mots faite, à confirmer.
□ Promesse différenciante ET crédible → OUI, Option A crédible dès le POC ; Option B explicitement écartée du lancement pour ce motif.
□ Le benchmark identifie ce que TOUS les concurrents font → OUI, section 3.
□ Résiste à "pourquoi pas l'inverse ?" → Option C (ton grand public sans mention IA) explicitement testée et écartée comme positionnement principal, argumentée.
□ Un concurrent direct serait-il préoccupé en lisant ça ? → Oui pour un acteur SEO-first classique : il ne peut pas revendiquer "IA-natif" sans refondre son modèle de distribution.

**Gates BLOQUANT vérifiées** : G5 (persona nommé, Grep "Léa"/"parrain" cohérent avec project-context.md) PASS · G7 (0 contradiction avec project-context.md, relu avant rédaction) PASS · G12 (chaque recommandation = verbe + objet + critère, ex. tableau section 6) PASS · G15 (0 placeholder résiduel, seuls `[HYPOTHÈSE]`/`[À VALIDER]` volontaires subsistent) PASS · G17 (positionnement non copiable tel quel par RetailMeNot/Dealabs sans refondre leur modèle) PASS.

**Vérifié (G_PROOF)** : projection de la promesse Option A sur le persona réel — Léa demande "code promo Nordvpn" à son assistant ; si le service est intégré (MCP) et que le code est daté/vérifié, la réponse de l'IA cite une source unique et fiable au lieu d'un choix entre 5 sites contradictoires. Le test de bascule ("si l'IA me donnait direct un code qui marche, je ne chercherais plus ailleurs") est satisfait par construction de l'Option A, pas seulement par affirmation marketing.

---

## Hypothèses à valider (bloc récapitulatif)

- `[HYPOTHÈSE]` Frustrations et vocabulaire du Persona B (parrain) — non confirmés par interview, à valider avant brief onboarding parrain.
- `[HYPOTHÈSE]` 3 mots de définition de marque (vérifié/instantané/IA-natif) et 3 mots d'exclusion — proposés par calibration marché, à trancher par Thomas/Emmanuel.
- `[À VALIDER]` Ton de marque complet (3 adjectifs + territoire sémantique 10 mots) — non tranché dans ce document, dépend de la validation du positionnement Option A par Thomas/Emmanuel.
- `[HYPOTHÈSE]` Trajectoire Option B à 12-18 mois — conditionnée à la mise en production effective du serveur MCP et à un volume d'intégrations réel, non garantie.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/strategy/positionnement-parrainage-ia.md`
- Décisions prises : positionnement de lancement = Option A ("registre de confiance des codes pour les IA"), Option B en trajectoire différée, Option C écartée comme positionnement principal ; personas A (demandeur) et B (parrain) affinés avec verbatims, N/A justifié pour clients-de-personas ; why-now argumenté sur 4 faits sourcés (volume AI Overviews/ChatGPT, agentic commerce shopping, affiliation native Perplexity, primauté de la structure sur le volume pour la citation IA).
- Points d'attention : Persona B repose sur hypothèses non interviewées (risque d'angle mort) ; ton de marque et territoire sémantique complets restent à trancher par Thomas/Emmanuel ; divulgation affiliation à instruire par @legal avant tout copy public ; sizing/KPI à instruire par @data-analyst avant d'arbitrer l'ambition Option B.
- Agents spécialisés recommandés : @data-analyst, @growth, @legal, @geo (priorité haute), testeurs-persona (Léa + parrain).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise.
---

