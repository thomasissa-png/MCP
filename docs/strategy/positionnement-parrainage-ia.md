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

