# Contexte Projet — Parrainage-IA (nom de code, nom de marque à définir)

> Ce fichier est lu par tous les agents avant toute action.
> **Stade Idée / étude de faisabilité.** Beaucoup de champs sont des hypothèses de cadrage
> posées par l'orchestrateur pour débloquer l'étude stratégique demandée par Thomas.
> Tout ce qui est marqué `[HYPOTHÈSE]` ou `[À VALIDER]` doit être confirmé par Thomas/Emmanuel avant exécution.
> Dernière mise à jour : 2026-07-20 — @orchestrator (cadrage étude de faisabilité)

---

## Identité
- **Nom du projet** : Parrainage-IA (nom de code interne — marque à définir) `[À VALIDER]`
- **URL (si existante)** : aucune
- **Secteur** : Affiliation / parrainage optimisé pour les moteurs de réponse IA (AEO/GEO) — annuaire de codes promo & liens de parrainage servi en priorité aux assistants IA
- **Stade** : [x] Idée  [ ] V1  [ ] Production  [ ] Croissance
- **Date de début** : 2026-07 (idée émise par Emmanuel)

---

## Cible
- **Persona principal** : `[HYPOTHÈSE]` "Léa, 29 ans, utilisatrice quotidienne de ChatGPT/Perplexity. Avant d'acheter (VPN, box repas, banque en ligne, e-commerce), elle demande à son assistant IA : 'trouve-moi un code promo / le meilleur deal pour X'. Elle veut le code valide, tout de suite, sans écumer 10 sites remplis de pubs et de codes morts."
- **Problème principal** : les codes promo trouvés via Google (RetailMeNot, etc.) sont souvent périmés, noyés dans la pub, ou faux. Quand l'IA répond, elle donne rarement un code utilisable et fiable.
- **Alternative actuelle** : demander à l'IA (qui hallucine ou refuse), ou aller sur les sites de codes promo classiques (Dealabs, RetailMeNot, iGraal), ou renoncer.
- **Persona secondaire** : "Le parrain" — Thomas & Emmanuel au départ, puis toute personne détenant des liens/codes de parrainage (banques, VPN, apps) qui veut les monétiser en étant la source citée par les IA. Modèle **deux faces** (demandeur de code ↔ parrain/fournisseur de code).
- **Verbatims persona** : `[À VALIDER — issus d'hypothèse, à confirmer par interviews/forums]`
  - "Je demande à ChatGPT un code promo et il me sort un truc qui marche jamais."
  - "J'en ai marre des sites de codes promo, c'est que de la pub et les codes sont morts."
  - "Si l'IA me donnait direct un code qui marche, je ne chercherais plus ailleurs."

---

## Positionnement
- **Promesse unique** : `[À VALIDER]` "La source de codes promo & parrainage que les IA citent parce qu'elle est structurée POUR elles : codes vérifiés, à jour, machine-readable."
- **Ton de marque** : `[À VALIDER]` — à trancher par @creative-strategy
- **3 mots qui DÉFINISSENT la marque** : `[À VALIDER]` (piste : fiable / instantané / IA-native)
- **3 mots qui ne DÉFINISSENT PAS la marque** : `[À VALIDER]` (piste : spammy / bannière-pub / codes-morts)
- **Concurrent principal** : à cartographier (Honey/PayPal, RetailMeNot, Dealabs, iGraal, Rakuten, Capital Koala, Poulpeo, ainsi que les IA elles-mêmes + extensions navigateur). À confirmer par @growth/@geo.
- **Notre différence clé vs lui** : `[HYPOTHÈSE]` être **AEO/GEO-first** (optimisé pour être la réponse de l'IA) plutôt que SEO-first (optimisé pour le clic humain), et exposer les données via **serveur MCP** consommable directement par les assistants.

---

## Objectifs
- **Objectif principal à 6 mois** : `[HYPOTHÈSE]` valider le POC — prouver qu'un assistant IA peut, sur une requête réelle de code promo, retourner un code du catalogue et générer ≥ 1 conversion de parrainage traçable.
- **KPI North Star** : `[HYPOTHÈSE]` nombre de parrainages confirmés (conversions) attribués à une réponse IA / mois.
- **Objectif secondaire** : constituer un catalogue initial de codes de parrainage vérifiés (Thomas + Emmanuel) et mesurer le taux de citation par les IA.
- **Ce que le succès ressemble à 12 mois** : `[À VALIDER]`

---

## Stack technique
- **Frontend** : [ ] Next.js  [ ] React  [ ] Expo  [x] Autre : POC sans front (Google Sheet), site vitrine léger ensuite `[À VALIDER]`
- **Backend** : [x] Autre : **serveur MCP** (piste privilégiée par Emmanuel comme couche d'interfaçage) + API de données
- **Base de données** : [x] Autre : **Google Sheet** pour le POC, migration DB ensuite (D1/Neon) `[À VALIDER]`
- **Authentification** : [ ] — non pertinent au POC
- **Hébergement** : [ ] Cloudflare  [ ] Replit  [x] Autre : à définir (le serveur MCP devra être hébergé/accessible) `[À VALIDER]`
- **Outils IA utilisés** : les assistants IA sont le **canal de distribution**, pas (encore) une brique interne. MCP = protocole d'exposition des données aux assistants.
- **Budget IA mensuel (tokens)** : à définir
- **Volume d'usage IA prévu** : inconnu (dépend de l'adoption)
- **Latence IA cible** : réponse MCP < 1s (une requête d'outil doit être quasi instantanée)
- **Outils d'analytics** : à recommander (attribution des conversions parrainage = enjeu central)

---

## Modèle économique et juridique
- **Modèle économique** : [ ] SaaS  [ ] E-commerce  [x] Marketplace (annuaire deux faces demandeurs/parrains)  [ ] API/produit technique (dimension MCP)  [x] Autre : affiliation / parrainage
- **Pays de commercialisation** : `[HYPOTHÈSE]` France d'abord, UE ensuite
- **Données sensibles collectées** : [x] Non (à confirmer selon le tracking d'attribution)
- **Utilisation d'IA générative** : [ ] Non  [x] Oui — usage prévu : distribution via assistants IA ; potentiellement génération/vérification de fiches codes
- **Enjeux juridiques à instruire (pour @legal)** : légalité de la revente/diffusion de codes de parrainage, conformité aux CGU des programmes d'affiliation et des plateformes IA, obligation de divulgation de la relation d'affiliation (DGCCRF / directive Omnibus), RGPD sur l'attribution.

---

## Contraintes
- **Budget mensuel infrastructure** : à définir (POC quasi nul : Google Sheet + petit serveur MCP)
- **Budget mensuel acquisition** : à définir — probablement organique/GEO au départ
- **Budget analytics** : à recommander
- **Timeline de lancement** : POC immédiat (Emmanuel démarre le Google Sheet)
- **Contraintes légales ou sectorielles** : voir @legal (affiliation, CGU plateformes IA, divulgation)
- **Ressources disponibles** : [ ] Solo  [x] Équipe : 2 (Thomas + Emmanuel), 100% IA pour l'exécution via cette équipe d'agents

---

## Existant (projets en place uniquement)
- Aucun — projet à l'état d'idée. POC = un Google Sheet en cours de création par Emmanuel (colonnes = codes de parrainage détenus par Thomas & Emmanuel).

---

## Historique des interventions agents

| Agent | Date | Livrable produit | Décisions clés | Pourquoi / Alternatives écartées |
|-------|------|-----------------|----------------|----------------------------------|
| @orchestrator | 2026-07-20 | project-context.md (cadrage) | Cadrer l'idée d'Emmanuel en contexte exploitable, stade Idée, marquer les hypothèses | Débloquer la gate project-context.md pour lancer l'étude de faisabilité demandée par Thomas |
| @geo | 2026-07-20 | docs/geo/faisabilite-geo-parrainage-ia.md | Verdict NO-GO sur "MCP grand public = canal d'acquisition B2C principal" ; GO sur contenu web structuré/cité comme canal principal ; MCP maintenu comme brique data interne + canal pro secondaire | Adoption MCP grand public quasi nulle en 2026 (sources WebSearch : digitalapplied.com, mcpmanager.ai) vs comportement IA déjà observé de citation d'agrégateurs de coupons structurés — canal (a) touche l'utilisateur passif, (b)/(c) exigent une action de configuration préalable qui n'a pas de raison de se produire pour une requête impulsive |
| @legal | 2026-07-20 | docs/legal/conformite-parrainage-ia.md | Modèle licite dans son principe (affiliation classique) ; 2 risques P0 (violation CGU parrainage tiers sur diffusion publique, divulgation non restituée par l'IA), 2 P1 (CGU plateformes IA, RGPD tracking), 2 P2 (marque, crypto/PSAN). Verdict GO POC, garde-fous avant V1 | WebSearch loi Influenceurs 2023/Omnibus/DGCCRF + CGU parrainage bancaire + App Developer Terms OpenAI ; pas de blocage conformément au protocole (signalement, pas arbitrage) |
| @creative-strategy | 2026-07-20 | docs/strategy/positionnement-parrainage-ia.md | Positionnement de lancement = Option A "registre de confiance des codes pour les IA" (Option B "protocole IA-natif" en trajectoire différée, Option C écartée) ; personas demandeur/parrain affinés avec verbatims ; why-now sourcé (AI Overviews, agentic commerce, affiliation Perplexity, primauté structure/citation) | Option B jugée non crédible au stade POC (pas encore de serveur MCP en prod) ; Option C écartée car non différenciante face à la concurrence (test G17) |

---

## Performance des agents

| Agent | Date | Livrable | Complétude | Cohérence | Actionnabilité | Messages | Spécificité | Notes |
|-------|------|----------|------------|-----------|----------------|----------|-------------|-------|
| | | | | | | | | |

**Légende (échelle 1-5 alignée avec CLAUDE.md) :** voir template.

---

## Notes libres

**Origine de l'idée (Emmanuel, verbatim transmis par Thomas) :**
1. "Je suis en train de creuser les caractéristiques pour le serveur MCP (sans doute la solution d'interfaçage). Je pense vraiment qu'on est dans la bonne trend. À voir ce que ça donnera. Pour le POC, je vais commencer un Google Sheet avec les colonnes pour les codes pour qu'on remplisse ce qu'on a déjà toi et moi comme parrainage et on verra ce qu'on apprendra à faire au fur et à mesure."
2. Reformulation de Thomas : "Son idée est de faire un site qui soit dédié avant tout aux IA, pour n'importe qui qui demanderait des codes promo, afin que les IA lui donnent le code promo, et qu'on gagne des avantages en tant que parrain."

**Note orchestrateur :** un message vocal d'Emmanuel accompagnait ces messages ; il n'a pas pu être transcrit dans cette session (pas d'outil de transcription audio). L'étude se base sur les 2 messages écrits ci-dessus. À compléter si le vocal apporte des éléments supplémentaires.

**Questions structurantes à trancher (posées à Thomas & Emmanuel) :** modèle de revenu exact (part des gains de parrainage ? abonnement parrains ? les deux ?) ; périmètre (codes de parrainage détenus par T&E uniquement, ou place de marché ouverte à tout parrain ?) ; qui est le client qui paie.

**Objet de l'étude demandée par Thomas :** (1) l'idée est-elle bonne, (2) y a-t-il un marché, (3) quelle concurrence, (4) comment procéder. + audit de la performance de l'équipe d'agents sur ce cas réel.
