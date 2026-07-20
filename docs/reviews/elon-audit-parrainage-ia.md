<!-- Version: 2026-07-20T00:00 — @elon — Audit stratégique first-principles idée Parrainage-IA -->

# AVIS CONSULTATIF — validation requise avant exécution

# @elon — Audit stratégique : Parrainage-IA (annuaire de codes servi aux IA via MCP)

> First-principles. Périmètre : vision / stratégie / valeur. PAS marché/concurrence/juridique en détail (→ @growth, @geo, @legal).
> Toute donnée non sourcée est marquée `[HYPOTHÈSE]`. Zéro chiffre inventé.

---

## Verdict en une ligne

**GO POC — mais pas le POC qu'Emmanuel a commencé.** L'idée touche une vraie bascule (les IA deviennent la couche d'achat), mais le POC "Google Sheet + MCP" teste la mauvaise hypothèse. Le POC doit tester la DISTRIBUTION (une IA cite-t-elle notre code ?), pas le stockage.

---

## 1. Décomposition first-principles

### Quel est le VRAI job à faire ?
Deux jobs distincts, souvent confondus dans le cadrage :

- **Job du demandeur (Léa)** : "je m'apprête à acheter X, donne-moi le meilleur deal valide, maintenant, sans effort." Job réel = **confiance + immédiateté**, pas "avoir un code". Un code qui ne marche pas est pire que pas de code (elle perd du temps à la caisse).
- **Job du parrain (Thomas/Emmanuel)** : "monétiser mes liens de parrainage en étant la source que l'IA cite." Job réel = **être choisi par la machine au moment de la réponse.**

Le job qui porte toute la valeur n'est ni le stockage ni le MCP. C'est : **gagner la position de "source citée" dans la réponse d'une IA.** Tout le reste est plomberie.

### Qu'est-ce qui change réellement avec les IA ?
Avant : l'achat passe par un humain qui google, compare, clique. Le SEO et les sites de codes promo captent l'intention. La friction (10 sites, pubs, codes morts) est le business model de RetailMeNot & co — le bruit EST leur monétisation.

Maintenant : l'IA s'insère entre l'intention et l'achat. Elle absorbe la comparaison. La question n'est plus "quel site rankera sur Google" mais **"quelle donnée l'IA jugera assez fiable pour la restituer et la recommander."** C'est un changement de nature, pas de degré : on passe d'un jeu d'attention humaine (SEO, pub) à un jeu de confiance machine (structuré, vérifiable, faible hallucination).

C'est un vrai first-principle : la friction que les incumbents monétisent devient un handicap face à une IA qui optimise pour l'utilisateur. Leur moat (trafic SEO + inventaire pub) ne se transpose pas. Analogie : c'est le moteur thermique vs électrique — on ne rend pas un carburateur plus efficace, on change le principe de propulsion.

### Pourquoi maintenant ?
`[HYPOTHÈSE]` Fenêtre ouverte par : (a) usage de masse des assistants pour des décisions d'achat pré-transaction ; (b) MCP comme standard émergent d'exposition de données aux assistants ; (c) les IA cherchent activement des sources structurées et fiables pour réduire leurs hallucinations sur les données périssables (un code promo est la donnée la plus périssable qui soit). Le "pourquoi maintenant" est crédible mais **non prouvé** — c'est l'hypothèse #1 à tester (voir §5).

---

## 2. L'insight 10x (existe-t-il ?)

**Oui, un candidat sérieux — mais conditionnel.**

**Insight : la péremption est le point faible structurel des IA, et un code de parrainage est de la donnée fraîche + vérifiable + attribuable.** Une IA ne PEUT pas connaître un code valide aujourd'hui (données d'entraînement figées, hallucination sur les codes). Une source qui garantit "ce code est vérifié valide à l'instant T, et voici comment le vérifier" résout un problème que l'IA ne peut pas résoudre seule. Ce n'est pas "un annuaire de plus", c'est **combler un angle mort intrinsèque du modèle.**

Le 10x n'est PAS le MCP (interface, commodité). Le 10x n'est PAS le catalogue (2 personnes = inventaire dérisoire). Le 10x est : **devenir l'oracle de fraîcheur/validité que l'IA appelle parce qu'elle sait qu'elle ne peut pas se fier à sa propre mémoire.**

Condition de survie du 10x : la vérification doit être RÉELLE et automatisée (le code est-il encore valide ?). Un annuaire non vérifié = RetailMeNot avec un habillage MCP = zéro 10x, mort. La barrière défendable n'est pas la techno, c'est **le processus de vérification continue + la réputation de fiabilité qui en découle.**

---

## 3. Le point de rupture qui tue l'idée

**LE risque #1, celui qui rend tout le reste inutile : le canal de distribution ne vous appartient pas, et il peut se fermer d'en haut.**

Les IA sont à la fois votre canal ET votre concurrent potentiel. Trois scénarios de mort :

1. **Désintermédiation par la plateforme.** Le jour où OpenAI/Google signe en direct avec les marchands (ou lance son propre système de deals/checkout — la trajectoire "commerce dans le chat" est déjà amorcée `[HYPOTHÈSE]`), l'assistant n'a plus besoin de votre annuaire. Vous êtes un intermédiaire dans un monde qui désintermédie. C'est la loi de la physique du business : **on ne veut pas être le maillon qu'un géant intégré peut absorber d'un trait de plume.**

2. **Non-adoption du canal MCP grand public.** Aujourd'hui, un utilisateur lambda de ChatGPT n'installe pas de serveur MCP tiers. Si Léa doit configurer quoi que ce soit, le funnel meurt à l'étape zéro. Le MCP est fantastique pour un développeur, quasi inexistant pour le persona décrit. **Le pari implicite est que les IA grand public consommeront des sources tierces de manière transparente — ce n'est pas le cas par défaut aujourd'hui.**

3. **Conflit CGU / divulgation.** (→ @legal, hors périmètre ici, mais signalé comme kill-switch) : si diffuser des codes de parrainage viole les CGU des programmes d'affiliation ou les règles des plateformes IA, le modèle est illégal avant d'être un business.

**Traduction brutale :** l'idée est bonne mais elle est bâtie sur un terrain qui appartient à quelqu'un d'autre. Ça ne la tue pas d'office — mais ça impose de construire un actif qui survit à la fermeture du canal (l'actif = la base de fiabilité vérifiée + la relation aux parrains-fournisseurs, pas le connecteur MCP).

---

## 4. Application de l'algorithme SpaceX au POC

Emmanuel commence par (5) la solution technique (MCP) et par le stockage (Google Sheet). Ordre inversé. L'algorithme dit : d'abord **questionner l'exigence.**

1. **Questionner l'exigence** : a-t-on besoin d'un serveur MCP pour tester l'idée ? NON. L'exigence à valider n'est pas "exposer des données à une IA", c'est "une IA cite-t-elle notre code plutôt qu'un autre / plutôt que d'halluciner". Le MCP est une réponse à une question qu'on ne s'est pas encore prouvée.
2. **Supprimer** : supprimer le serveur MCP du POC. Supprimer le "site". Garder 5-10 codes RÉELS ultra-vérifiés.
3. **Simplifier** : le POC = poser à ChatGPT/Claude/Perplexity/Gemini de vraies requêtes ("meilleur code parrainage [banque X]") et mesurer : l'IA donne-t-elle un code ? le nôtre ? un valide ? Puis tester si, exposé simplement (page web structurée, schema.org, ou un GPT/connecteur simple), le nôtre est repris.
4. **Accélérer** : cette boucle se fait en jours, sans code, avec l'équipe d'agents (@geo pour la stratégie de citation IA).
5. **Automatiser** (la vérification, le MCP) : SEULEMENT après que la distribution est prouvée.

Le Google Sheet est très bien — comme base de données du POC. Le MCP est prématuré. **On ne construit pas le Raptor avant d'avoir prouvé qu'il y a une atmosphère à traverser.**

---

## 5. Top 3 hypothèses les plus fragiles (à tester en premier, dans l'ordre)

| # | Hypothèse fragile | Pourquoi fatale | Test le moins cher | Kill criterion |
|---|---|---|---|---|
| **H1 — Distribution** | Une IA grand public restituera/recommandera un code issu d'une source tierce fiable, sans friction pour l'utilisateur | Si non, il n'y a pas de canal → pas de business, quel que soit le catalogue | `[HYPOTHÈSE]` 20-30 requêtes réelles sur ChatGPT/Claude/Perplexity/Gemini sur des cas où on a un code vérifié ; mesurer citation/reprise. @geo pilote | Aucune IA ne reprend/cite la source dans un format exploitable après optimisation raisonnable |
| **H2 — Fraîcheur = 10x réel** | La valeur défendable est la vérification continue de validité, pas l'inventaire | Si la vérif n'est pas faisable/automatisable, on n'est qu'un annuaire de plus → pas de moat | Vérifier manuellement 10 codes, mesurer le taux de péremption sur 2-3 semaines et le coût de re-vérification | Impossible de vérifier la validité de façon fiable/scalable → pas de différenciation |
| **H3 — Offre parrains** | Assez de parrains apporteront des codes attractifs pour dépasser l'inventaire trivial de 2 personnes (côté offre de la marketplace) | Marketplace deux faces : sans masse critique de codes désirables, l'IA n'a aucune raison de citer vs l'existant | `[HYPOTHÈSE]` Lister les 20 codes de parrainage les plus demandés `[À VALIDER par @growth]` ; combien Thomas+Emmanuel couvrent réellement ? | Couverture dérisoire ET pas de mécanisme d'acquisition de parrains → offre non viable |

Ordre imposé par la dépendance : **H1 avant tout.** Si H1 échoue, H2 et H3 sont sans objet. On ne remplit pas un entrepôt avant de savoir s'il y a une route pour livrer.

---

## 6. Vision 10x — ce que je changerais fondamentalement

Si c'était mon projet, je ne construirais pas "un annuaire de codes pour IA". Je construirais **la couche de confiance sur les données périssables que les IA ne peuvent pas garantir** — en commençant par les codes promo/parrainage (wedge étroit, douleur aiguë, vérifiable), mais en visant le principe : *"la source que les IA appellent quand elles ont besoin d'une donnée fraîche + vérifiée + attribuable qu'elles ne peuvent pas produire seules."*

Le code de parrainage est le **cheval de Troie**, pas la destination. Le vrai actif = un protocole/réputation de fraîcheur vérifiée. Ça, ça survit même si OpenAI fait du checkout natif : ils auront toujours besoin de sources de vérité fraîches et attribuées.

Deuxième changement : **arrêter de penser "site dédié aux IA".** Un site n'est pas dédié aux IA — une DONNÉE structurée et un flux le sont. Le livrable n'est pas une page, c'est un flux machine-readable + une preuve de fiabilité. Le MCP est une des interfaces, pas le produit.

---

## 7. Ce qui fonctionne (ne pas toucher)

- **L'intuition de la trend est juste** : les IA s'insèrent dans le pré-achat, le SEO/pub des incumbents ne s'y transpose pas. Emmanuel a senti quelque chose de réel.
- **Le POC quasi-gratuit** : commencer petit avec les codes qu'on a déjà, apprendre en marchant — bon réflexe lean.
- **Le modèle deux faces** est le bon cadre mental (demandeur ↔ parrain), même si le côté offre est aujourd'hui trivial.

## 8. Dimensions NON auditées (données manquantes / autres agents)

- Taille de marché, TAM/SAM/SOM, concurrence détaillée → @growth / @geo (WebSearch non lancé ici, hors périmètre assigné).
- Légalité diffusion codes de parrainage, CGU affiliation & plateformes IA, divulgation DGCCRF/Omnibus, RGPD attribution → @legal (signalé comme kill-switch potentiel §3.3).
- Modèle de revenu exact (part des gains ? abonnement parrains ?) → non tranché dans project-context, à confirmer par Thomas & Emmanuel. `[HYPOTHÈSE]` mon intuition : commission sur parrainages attribués, PAS d'abonnement au départ.
- Le message vocal d'Emmanuel non transcrit peut contenir des éléments qui déplacent le curseur — à intégrer avant décision finale.

---

## Synthèse du verdict

**GO POC**, sur la base de la VALEUR (angle mort réel des IA sur la donnée périssable = insight 10x défendable), PAS sur un ROI court terme qui serait négatif et non pertinent à ce stade (commandement 5). Mais **redéfinir le POC** : tester la distribution (H1) avant de construire le MCP. Deux garde-fous conditionnent le passage POC → build : (1) prouver qu'une IA reprend la source sans friction utilisateur ; (2) prouver que la vérification de fraîcheur est automatisable. Si H1 échoue après test sérieux → NO-GO franc, l'idée n'a pas de canal.

Ce n'est pas un two-way door partout : investir dans le MCP maintenant serait un coût largement réversible SI on a validé H1 — mais l'investir AVANT H1 est le piège classique du "j'ai construit la fusée avant de vérifier la destination".

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/MCP/docs/reviews/elon-audit-parrainage-ia.md`
- Avis donné : GO POC conditionnel ; insight 10x = couche de confiance sur donnée périssable ; kill point = dépendance/désintermédiation du canal IA ; redéfinir le POC (distribution avant MCP).
- Agents à ré-invoquer : @geo (test H1 citation IA — prioritaire), @growth (marché + offre parrains H3), @legal (kill-switch juridique §3.3), @product-manager (cadrer le POC redéfini en plan de test d'hypothèses).
- Points d'attention : le POC d'Emmanuel (Sheet+MCP) teste le stockage, pas la distribution — réorienter avant de coder le MCP. Transcrire le vocal d'Emmanuel avant décision finale.
- Rappel : AVIS, pas directive. Thomas & Emmanuel décident.
---
