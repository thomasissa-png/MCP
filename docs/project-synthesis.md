<!-- Version: 2026-07-20 — @orchestrator — Synthèse finale étude de faisabilité Parrainage-IA -->
# Synthèse — Étude de faisabilité « Parrainage-IA »

> Étude commandée par Thomas sur l'idée d'Emmanuel. 7 agents mobilisés (@elon, @creative-strategy, @geo, @growth, @legal, @ia, @reviewer). Stade Idée. Toutes les données chiffrées sont sourcées dans les livrables détaillés ou marquées `[HYPOTHÈSE]`.

## Verdict global

**GO POC — conditionnel à un test de distribution préalable, quasi gratuit.**
L'idée touche un angle mort réel des IA (donnée périssable et vérifiable). Mais tout repose sur une hypothèse (H1 : une IA restitue-t-elle un code d'une source tierce sans friction ?) que **personne n'a encore testée empiriquement**. Ce test coûte 0 € et se fait sans code. Tant qu'il n'est pas passé, le GO reste théorique.

## Les 4 questions de Thomas

### 1. L'idée est-elle bonne ?
Oui sur le fond, avec un recadrage. Le vrai job n'est ni le stockage ni le MCP : c'est **gagner la position de source citée par l'IA sur une donnée que l'IA ne peut pas produire seule** (codes frais, vérifiés, attribuables). Le moat des sites actuels (trafic SEO + pub) ne se transpose pas au monde des réponses IA → fenêtre réelle. Insight 10x = **l'oracle de fraîcheur**, à condition que la vérification soit réellement automatisée.

### 2. Y a-t-il un marché ?
Oui, en croissance, mais adjacent à un marché déjà consolidé. Le GEO/AEO croît à **34-43 % CAGR** ; ChatGPT ~900M utilisateurs hebdo (fév. 2026) ; le comportement « demander un code à une IA » existe déjà. MAIS le marché coupon/cashback est mûr et concentré (iGraal 12M membres, Dealabs, Rakuten) et aucune barrière technique ne protège durablement l'avantage.

### 3. Quelle concurrence ?
Trois cercles : (a) sites codes promo & cashback (RetailMeNot, Dealabs, iGraal, Honey), (b) agrégateurs de parrainage FR — **concurrents directs les plus proches** (ComparaBanques, Parrainage.co, Codes-Parrain.com), (c) **la menace structurante : OpenAI/Perplexity** qui construisent le commerce agentique avec commission directe (désintermédiation possible). Angle mort concurrentiel identifié : **personne n'est positionné spécifiquement sur les codes de _parrainage_ optimisés pour les IA**.

### 4. Comment procéder ?
Roadmap en 3 temps (détail §Roadmap).

## Le pivot stratégique à trancher (finding n°1)

**Code promo public ≠ lien de parrainage personnel.** Cette distinction, remontée indépendamment par @growth (éco), @legal (P0) et @elon (H3), est le point le plus important de l'étude :
- Un **code promo public** est émis par le marchand, réutilisable à l'infini, scalable, sans risque CGU.
- Un **lien de parrainage** est personnel (Thomas/Emmanuel), plafonné, et **sa diffusion publique/incitée est interdite par la plupart des CGU** (banques, VPN, apps) → résiliation + perte des gains. Pire : un succès de distribution IA pourrait **déclencher les contrôles anti-fraude** et faire perdre les primes.

→ Le POC actuel (Google Sheet de liens de parrainage T&E) mélange les deux. **Recommandation : construire l'actif et le trafic sur les codes promo publics (scalable, sûr), et traiter le parrainage comme une couche de monétisation encadrée et limitée, pas comme le cœur du modèle.**

## Faisabilité technique : le sort du MCP

Convergence @geo + @ia (indépendante) : **un serveur MCP tiers n'est jamais consommé par défaut par le grand public** (activation manuelle requise sur ChatGPT/Claude/Perplexity — vérifié doc OpenAI 2026). « Léa » qui tape « code promo VPN » dans ChatGPT.com ne verra jamais notre MCP.
- **Canal principal = contenu web structuré** (schema.org : ItemList/Offer/FAQPage) lu et cité par les IA (~2,3× plus cité que le non-structuré) + une **API JSON publique** comme actif pivot.
- **MCP = OUI mais en V1.5**, brique à coût marginal faible au-dessus de l'API, pour le segment pro/power-user + une App ChatGPT au directory.
- **Ne pas mettre le MCP sur le chemin critique du POC.** (Message direct à Emmanuel : la piste MCP est bonne comme infra/canal pro, pas comme moteur d'acquisition grand public.)

## Conformité (garde-fous @legal)

Modèle **licite dans son principe**. Garde-fous avant toute mise à l'échelle : (P0) ne pas diffuser publiquement des liens de parrainage tiers en violation de leurs CGU ; (P1) **divulgation d'affiliation** obligatoire (loi Influenceurs 2023 / directive Omnibus, DGCCRF jusqu'à 75 000 €) ; RGPD sur le tracking d'attribution ; usage nominatif des marques encadré.

## Roadmap recommandée

**Temps 0 — Test de distribution (cette semaine, 0 €, AVANT tout code).** 20-30 requêtes réelles de codes promo sur ChatGPT, Claude, Perplexity, Gemini. Mesurer : citent-ils une source tierce ? laquelle ? un contenu structuré serait-il repris ? → **kill criterion** : si aucune IA ne reprend de source tierce exploitable, NO-GO franc.
**Temps 1 — POC contenu (1-2 sem.).** Google Sheet → génération d'un site GEO/AEO-first (schema.org) + API JSON publique. Cible : codes promo publics vérifiés d'abord. Mesurer le taux de citation par les IA.
**Temps 2 — V1 (4-8 sem.).** Automatisation de la vérification de fraîcheur (KPI de survie), monitoring de citation, couche parrainage encadrée, puis MCP + App ChatGPT en V1.5.

## Prochaines étapes
- **Thomas/Emmanuel** : (1) lancer le test de distribution Temps 0 ; (2) trancher les 3 questions ouvertes de project-context.md (modèle de revenu exact, périmètre catalogue fermé vs marketplace, qui paie) ; (3) valider le pivot « codes promo publics d'abord ».
- **Agents à relancer ensuite** : @data-analyst (plan d'attribution/tracking, non couvert ce run), @product-manager (specs du POC contenu), @fullstack (génération site + API).

## Addendum — Cadrage confirmé par Thomas (2026-07-20)

`[CHOIX UTILISATEUR]` Après la vague 1, Thomas confirme la direction et écarte la reco de pivot :
- **Cœur du modèle = liens de parrainage** (pas de pivot vers les codes promo publics). Arbitrage fondateur assumé.
- **Verticales = primes élevées** : banques en ligne / néobanques / fintech (Boursorama, Fortuneo, BNP…), énergie (EDF…).
- **Pas de MCP** (confirmé).

**Ce que ce cadrage implique (révision du plan) :**
1. Le risque n°1 de @growth/@legal (fragilité du lien de parrainage : plafonné, CGU, anti-fraude) n'est plus évitable → il devient **la contrainte centrale à gérer**, pas à contourner. Le modèle viable connu pour ça = **place de marché / rotation de parrains** (comme ComparaBanques, Parrainage.co), pas un annuaire de 2 codes.
2. **Nouvel angle juridique P0 non couvert** : les verticales banque/finance/assurance sont **réglementées**. Promouvoir/orienter vers des produits financiers peut exiger un statut (apporteur d'affaires / IOBSP, immatriculation ORIAS) et respecter les règles ACPR/AMF de publicité financière, EN PLUS des CGU de parrainage. → @legal à relancer spécifiquement AVANT toute mise en ligne.
3. Distribution (Temps 0) inchangée mais concrète : tester « meilleur parrainage Boursorama / comment être parrainé chez Fortuneo » sur les IA — citent-elles les agrégateurs ? lesquels ?
4. Roadmap : le MCP (Temps 2) est retiré. Le reste tient (contenu structuré + API + vérification de fraîcheur), avec ajout d'un mécanisme de **rotation des parrains**.

---
**Handoff → utilisateur (Thomas)**
- Fichiers produits : `docs/project-synthesis.md` + 6 livrables agents + `docs/reviews/revue-coherence-parrainage-ia.md`
- Agents invoqués : @elon, @creative-strategy, @geo, @growth, @legal, @ia, @reviewer (7/7 OK)
- Décision structurante en attente de Thomas : pivot codes promo publics vs parrainage ; périmètre ; modèle de revenu
- Trou du run (signalé par @reviewer) : aucun test empirique de distribution (H1) — à exécuter en priorité
---
