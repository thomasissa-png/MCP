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
