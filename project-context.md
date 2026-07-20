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
- **Notre différence clé vs lui** : `[HYPOTHÈSE]` être **AEO/GEO-first** (optimisé pour être la réponse de l'IA) plutôt que SEO-first (optimisé pour le clic humain). `[CHOIX UTILISATEUR 2026-07-20]` : la différence ne passe PAS par un MCP (abandonné).

---

## Objectifs
- **Objectif principal à 6 mois** : `[HYPOTHÈSE]` valider le POC — prouver qu'un assistant IA peut, sur une requête réelle de code promo, retourner un code du catalogue et générer ≥ 1 conversion de parrainage traçable.
- **KPI North Star** : `[HYPOTHÈSE]` nombre de parrainages confirmés (conversions) attribués à une réponse IA / mois.
- **Objectif secondaire** : constituer un catalogue initial de codes de parrainage vérifiés (Thomas + Emmanuel) et mesurer le taux de citation par les IA.
- **Ce que le succès ressemble à 12 mois** : `[À VALIDER]`

---

## Stack technique
- **Frontend** : [ ] Next.js  [ ] React  [ ] Expo  [x] Autre : POC sans front (Google Sheet), site vitrine léger ensuite `[À VALIDER]`
- **Backend** : [x] Autre : API de données + génération de contenu web structuré. `[CHOIX UTILISATEUR 2026-07-20 : PAS de serveur MCP]` — abandonné (confirmé par @geo/@ia : non consommé par le grand public)
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
- **Modèle économique** : [ ] SaaS  [ ] E-commerce  [x] Marketplace (deux faces demandeurs/parrains, **rotation de parrains**)  [x] Autre : affiliation / parrainage. **Revenu = commission sur les primes de parrainage générées** `[HYPOTHÈSE ORCHESTRATEUR 2026-07-20 — à valider au checkpoint Phase 0]`
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
| @growth | 2026-07-20 | docs/growth/marche-concurrence-parrainage-ia.md | Marché GO conditionnel (tendance GEO/AEO réelle, marché coupon mature) ; concurrence NO-GO sur avantage défendable (agrégateurs parrainage bancaire FR + OpenAI/Perplexity répliquent plus vite) ; économie = risque n°1 identifié : confusion code promo public (scalable) vs lien de parrainage personnel (plafonné, 2 identités T&E, exposé à la fraude anti-abus) | 7 WebSearch réalisées ; chiffres non institutionnels marqués [HYPOTHÈSE] ; recommandation de scinder le Google Sheet POC en 2 catégories avant de poursuivre |
| @geo | 2026-07-20 | docs/geo/faisabilite-geo-parrainage-ia.md | Verdict NO-GO sur "MCP grand public = canal d'acquisition B2C principal" ; GO sur contenu web structuré/cité comme canal principal ; MCP maintenu comme brique data interne + canal pro secondaire | Adoption MCP grand public quasi nulle en 2026 (sources WebSearch : digitalapplied.com, mcpmanager.ai) vs comportement IA déjà observé de citation d'agrégateurs de coupons structurés — canal (a) touche l'utilisateur passif, (b)/(c) exigent une action de configuration préalable qui n'a pas de raison de se produire pour une requête impulsive |
| @legal | 2026-07-20 | docs/legal/conformite-parrainage-ia.md | Modèle licite dans son principe (affiliation classique) ; 2 risques P0 (violation CGU parrainage tiers sur diffusion publique, divulgation non restituée par l'IA), 2 P1 (CGU plateformes IA, RGPD tracking), 2 P2 (marque, crypto/PSAN). Verdict GO POC, garde-fous avant V1 | WebSearch loi Influenceurs 2023/Omnibus/DGCCRF + CGU parrainage bancaire + App Developer Terms OpenAI ; pas de blocage conformément au protocole (signalement, pas arbitrage) |
| @creative-strategy | 2026-07-20 | docs/strategy/positionnement-parrainage-ia.md | Positionnement de lancement = Option A "registre de confiance des codes pour les IA" (Option B "protocole IA-natif" en trajectoire différée, Option C écartée) ; personas demandeur/parrain affinés avec verbatims ; why-now sourcé (AI Overviews, agentic commerce, affiliation Perplexity, primauté structure/citation) | Option B jugée non crédible au stade POC (pas encore de serveur MCP en prod) ; Option C écartée car non différenciante face à la concurrence (test G17) |
| @reviewer | 2026-07-20 | docs/reviews/revue-coherence-parrainage-ia.md + Performance des agents | Cohérence CONVERGENTE (7 convergences, 0 contradiction bloquante) ; trou n°1 = test empirique de distribution H1 non exécuté (G_PROOF empirique absent 6/6) ; classement équipe (growth/ia 4,8 → creative-strategy 4,0) | WebSearch de recoupement non fait (respect anti-timeout) — signalé comme limite ; n'a édité que la section Performance |
| @orchestrator | 2026-07-20 | docs/project-synthesis.md | Verdict GO POC conditionnel au test de distribution ; pivot recommandé codes promo publics (scalable/sûr) plutôt que liens de parrainage (fragiles) au cœur du modèle ; MCP recalibré en V1.5 hors chemin critique | Synthèse des 7 livrables ; test H1 posé comme action Temps 0 (0 €) avant tout code |
| @creative-strategy | 2026-07-20 | docs/strategy/brand-platform.md | Livrable canonique Phase 0 : positionnement définitif ("registre de confiance du parrainage pour les IA"), promesse transformative + 3 preuves, persona Parrain reconstruit en Karim (modèle marketplace/rotation) avec client-du-persona ajouté (gestionnaire de programme), ton fiable/direct/sobre, archétype Sage, tagline "Le parrainage, vérifié avant d'être cité.", 5 pistes de nom `[À VALIDER]` | Consolide l'exploratoire positionnement-parrainage-ia.md sans le répéter ; calibration WebSearch (Stripe, Nubank, littérature AEO "entité canonique") pour viser au-dessus du standard fintech/affiliation |
| @legal | 2026-07-20 | docs/legal/legal-strategy.md | POC hors-régulé (énergie/apps/VPN/box/e-commerce) lançable SANS statut réglementé (motivé) ; V1 banque/fintech nécessite immatriculation ORIAS (IOBSP) + veille ACPR/AMF/ARPP avant tout ajout de programme bancaire ; checklist conformité pré-lancement 10 items ; classification AI Act = risque limité/transparence | Approfondissement de conformite-parrainage-ia.md suite au cadrage marketplace à rotation + commission + verticales POC/V1 confirmé par Thomas ; WebSearch ORIAS/IOBSP + ACPR/AMF/ARPP pour ancrer le nouveau risque P0 n°3 (V1 banque) |
| @product-manager | 2026-07-20 | docs/product/product-vision.md, docs/product/roadmap.md, docs/product/functional-specs.md | Mécanique de rotation posée en règles fonctionnelles (pool d'éligibilité, sélection FIFO pondérée, exclusion auto, traçabilité) avec plafond par enseigne marqué `[À VALIDER]` (non sourcé) ; scope V1 en 8 épics MoSCoW/RICE séquencés par dépendances (pages de conformité + objets métier en socle bloquant) ; 8 user stories Given/When/Then (4 critiques + 4 de couverture, triage backend allégé US-03/US-04) ; DoR/DoD posant la fiche de conformité CGU par enseigne comme bloquant | Aligné brand-platform.md (personas Léa/Karim, promesse) et legal-strategy.md (hors-régulé, divulgation embarquée comme exigence produit non option) ; aucune valeur de plafond anti-fraude inventée, laissée configurable jusqu'à documentation par la fiche de conformité légale |
| @data-analyst | 2026-07-20 | docs/analytics/kpi-framework.md, docs/analytics/tracking-plan.md | NSM définitif = "Parrainages Confirmés d'origine IA (PCA-IA) / mois" (précision du provisoire par ajout du critère `origine_detectee`, absent du modèle de données actuel) ; 21 events consolidés depuis functional-specs.md sans redéfinition ; modèle d'attribution IA→conversion = token dans le chemin de l'URL + endpoint de redirection tracké + confirmation déclarative du parrain (pas de webhook enseigne) ; stack Plausible + PostHog + table SQL propriétaire d'attribution ; 0 cible interne chiffrée (trafic actuel nul, benchmarks externes sourcés utilisés en repère seulement) | Gap critique signalé à @product-manager : aucun event de confirmation de conversion (`attribution_confirmee`) dans functional-specs.md alors qu'il alimente directement le NSM ; 2 events proposés (`lien_redirection_suivie`, `attribution_confirmee`) à valider avant implémentation ; WebSearch ReferralCandy (conversion parrainage) + SparkToro/Foundry CRO (taux de clic depuis citation IA, comportement ChatGPT utm_source) pour ancrer le mécanisme d'attribution sans invention de chiffre |
| @product-manager | 2026-07-20 | docs/product/functional-specs.md (corrective) | Corrective ciblée sur retour @data-analyst : ajout US-09 (confirmation de conversion par le parrain + garde-fou anti-fraude de plausibilité) et intégration de l'endpoint `/r/{token}` + event `lien_redirection_suivie` dans US-01 ; les 2 events du tracking-plan.md ont désormais leur équivalent exact dans les specs, cohérence n°4 PASS dans les deux sens | Édition additive et chirurgicale (aucune réécriture), gates re-vérifiées dans le fichier |

---

## Performance des agents

| Agent | Date | Livrable | Complétude | Cohérence | Actionnabilité | Messages | Spécificité | Notes |
|-------|------|----------|------------|-----------|----------------|----------|-------------|-------|
| @growth | 2026-07-20 | marche-concurrence-parrainage-ia.md | 5 | 5 | 5 | 5 | 5 | **4,8/5 — meilleur livrable du run.** Distinction code promo public/lien de parrainage (§3) = insight structurant repris par toute l'équipe. 8 familles de concurrence, saturation anti-fraude, attribution : très spécifique. Chiffres marché rigoureusement marqués `[HYPOTHÈSE]`/source secondaire. G_PROOF OK (7 WebSearch). |
| @ia | 2026-07-20 | architecture-mcp-parrainage-ia.md | 5 | 5 | 5 | 5 | 5 | **4,8/5.** Seul livrable 9/9 gates strict. Architecture multi-canaux avec API JSON = actif pivot, effort chiffré POC/V1, chemin critique clair. Parfaitement aligné @geo. Bloc G_PROOF reproductible (requête NordVPN). "À dire à Emmanuel en une phrase" = pédagogie utile. |
| @geo | 2026-07-20 | faisabilite-geo-parrainage-ia.md | 5 | 5 | 5 | 5 | 5 | **4,7/5.** Verdict tranché MCP grand public NO-GO / web cité GO, sources concordantes. Angle mort "parrainage vs coupon générique" bien identifié. Stratégie GEO en 7 points actionnables. **Réserve : G_PROOF empirique reconnu non fait** (test Claude reporté à la prochaine itération) — le run entier hérite de ce trou. |
| @elon | 2026-07-20 | elon-audit-parrainage-ia.md | 5 | 5 | 4 | 5 | 5 | **4,5/5.** First-principles net : insight 10x (couche de confiance sur donnée périssable), kill point (désintermédiation du canal), POC redéfini (distribution avant MCP). Tableau H1/H2/H3 avec kill criteria testables. **Pénalité : G_PROOF FAIL** (pas de bloc `Vérifié :`) et H1 posé mais non exécuté. |
| @legal | 2026-07-20 | conformite-parrainage-ia.md | 5 | 5 | 4 | 5 | 5 | **4,4/5.** 2 P0 (CGU parrainage tiers, divulgation non restituée par l'IA) cohérents avec @growth. Très spécifique (art. L.222-16-2, Binance, loi 2023-451, décret 11/2025). Actionnabilité un cran sous à cause du volume de `[À VÉRIFIER PAR UN JURISTE]`. **G_PROOF absent** (normal en droit, gate non satisfait). Accent divulgation trop MCP-centré. |
| @creative-strategy | 2026-07-20 | positionnement-parrainage-ia.md | 5 | 3 | 4 | 5 | 4 | **4,0/5.** Personas deux faces solides, why-now 4 faits sourcés, 3 options testées (G17). **Point faible = cohérence :** traite implicitement le MCP comme vecteur de citation (why-now §d + G_PROOF) alors que @geo/@ia prouvent l'inverse ; incohérence interne 883M mensuel vs 900M hebdo. À réaligner (produit le même jour, non imputable, mais à réconcilier). |
| @data-analyst | 2026-07-20 | kpi-framework.md, tracking-plan.md | 5 | 5 | 5 | 5 | 5 | **4,8/5.** NSM provisoire challengé et corrigé (ajout `origine_detectee`, sans quoi il était non calculable) ; gap critique détecté et signalé à @product-manager (event `attribution_confirmee` absent alors qu'il alimente le NSM) ; mécanisme d'attribution token-dans-le-chemin + confirmation déclarative concret et implémentable, limites honnêtement documentées (SparkToro 12-18 % clic/citation, Google AI Mode noreferrer). 21/21 events de functional-specs.md consolidés sans redéfinition. Aucune cible interne inventée (trafic nul, benchmarks externes clairement distingués). |

**Légende (échelle 1-5 alignée avec CLAUDE.md) :** 1 = insuffisant / 3 = correct / 5 = excellent. **Complétude** (toutes sections traitées) · **Cohérence** (0 contradiction interne + avec les autres livrables) · **Actionnabilité** (verbe+objet+critère de done, décisions tranchées) · **Messages** (résumé exécutif, verdict, handoff clairs) · **Spécificité** (taillé pour CE projet, non copiable — test G17). Note globale = synthèse pondérée par la cohérence et le G_PROOF. Classement du run : @growth ≈ @ia > @geo > @elon > @legal > @creative-strategy. Faiblesse commune : **G_PROOF empirique** (0/6 test de distribution réel exécuté). Détail : `docs/reviews/revue-coherence-parrainage-ia.md`.

---

## Notes libres

**Origine de l'idée (Emmanuel, verbatim transmis par Thomas) :**
1. "Je suis en train de creuser les caractéristiques pour le serveur MCP (sans doute la solution d'interfaçage). Je pense vraiment qu'on est dans la bonne trend. À voir ce que ça donnera. Pour le POC, je vais commencer un Google Sheet avec les colonnes pour les codes pour qu'on remplisse ce qu'on a déjà toi et moi comme parrainage et on verra ce qu'on apprendra à faire au fur et à mesure."
2. Reformulation de Thomas : "Son idée est de faire un site qui soit dédié avant tout aux IA, pour n'importe qui qui demanderait des codes promo, afin que les IA lui donnent le code promo, et qu'on gagne des avantages en tant que parrain."

**Note orchestrateur :** un message vocal d'Emmanuel accompagnait ces messages ; il n'a pas pu être transcrit dans cette session (pas d'outil de transcription audio). L'étude se base sur les 2 messages écrits ci-dessus. À compléter si le vocal apporte des éléments supplémentaires.

**Questions structurantes à trancher (posées à Thomas & Emmanuel) :** modèle de revenu exact (part des gains de parrainage ? abonnement parrains ? les deux ?) ; périmètre (codes de parrainage détenus par T&E uniquement, ou place de marché ouverte à tout parrain ?) ; qui est le client qui paie.

**Objet de l'étude demandée par Thomas :** (1) l'idée est-elle bonne, (2) y a-t-il un marché, (3) quelle concurrence, (4) comment procéder. + audit de la performance de l'équipe d'agents sur ce cas réel.

**[CHOIX UTILISATEUR — 2026-07-20] Cadrage confirmé par Thomas après la vague 1 :**
- Le cœur du modèle est bien **les liens de parrainage** (PAS un pivot vers les codes promo publics). Recommandation initiale @growth de pivoter vers les codes publics = **écartée par le fondateur** — arbitrage assumé.
- Verticales cibles = **primes élevées** : banques en ligne / néobanques / fintech (Boursorama, Fortuneo, BNP, etc.), énergie (EDF, etc.), et assimilés. Ce sont les parrainages les plus rémunérateurs.
- **Pas de MCP** (confirmé, aligné avec @geo/@ia).
- **Conséquence directe à instruire** : ces verticales (banque/finance/assurance) sont **réglementées** — la promotion de produits financiers peut relever d'un statut (apporteur d'affaires / IOBSP, ORIAS, règles ACPR/AMF sur la publicité financière) EN PLUS des CGU de parrainage. Angle NON couvert par la vague 1 → @legal à relancer spécifiquement.
- **Conséquence modèle** : un lien de parrainage bancaire est **plafonné par personne** (ex : nombre de filleuls/an limité) → pour scaler au-delà de T&E, le modèle DOIT être une **place de marché / rotation** de parrains (comme les agrégateurs existants), pas un simple annuaire de 2 codes.

**[HYPOTHÈSE ORCHESTRATEUR — 2026-07-20] Décisions de cadrage pour lancer l'autopilot (AskUserQuestion non délivrable, session non-interactive) — À VALIDER AU CHECKPOINT PHASE 0 :**
1. **Modèle de revenu = commission sur les primes** de parrainage générées (aligné valeur, zéro friction, modèle des agrégateurs viables). Alternatives écartées provisoirement : abonnement parrains, mix.
2. **Périmètre = marketplace à rotation de parrains**, architecture ouverte dès le départ, **amorcée** par les codes de Thomas & Emmanuel (résout le plafond = risque n°1 de l'étude). Le POC peut être seedé T&E mais le système est construit ouvert (soumission + rotation).
3. **Verticales de départ = HORS secteur régulé** (énergie type EDF, apps, VPN, box, e-commerce). La **banque/fintech est ajoutée en V1** une fois le statut d'intermédiaire (IOBSP/ORIAS/ACPR) instruit par @legal en parallèle. Objectif : livrer un POC propre et rapide sans friction réglementaire bloquante.
4. **KPI North Star provisoire** : nombre de parrainages confirmés attribués à une réponse IA / mois (à confirmer/formuler précisément par @data-analyst avec formule de calcul).
5. **Ton de marque** : direction "fiable, instantané, IA-natif" (Option A creative-strategy) — à finaliser par @creative-strategy dans brand-platform.md.

**Mode d'exécution** : AUTOPILOT (phases 0→5), checkpoint OBLIGATOIRE après Phase 0 pour validation des fondations + de ces 5 hypothèses. Dégradation gracieuse si un agent échoue. Multi-sessions : état vivant dans docs/orchestration-plan.md.

**[CHOIX UTILISATEUR — 2026-07-20 #2] CORRECTIONS de Thomas au checkpoint Phase 0 (AUTORITÉ, remplacent les hypothèses correspondantes) :**
1. **Nom de marque = Parrainly** (tranché). Remplace "Parrainage-IA" comme nom commercial (Parrainage-IA reste nom de code interne).
2. **Les banques/fintech NE sont PAS écartées** — elles sont AU CŒUR. Correction de D3 : le catalogue de départ EST fintech/finance/crypto/services entrepreneur (cf. base réelle d'Emmanuel ci-dessous). La contrainte réglementaire se gère, elle ne fait pas exclure les verticales.
3. **V1 = cercle FERMÉ (Thomas + Emmanuel uniquement), AVANT d'ouvrir.** Correction de D2 : la marketplace ouverte multi-parrains devient **V2**. En V1, seuls les liens de T&E sont exposés (rotation entre leurs 2 jeux de liens pour respecter les plafonds). L'architecture reste pensée pour ouvrir ensuite.
4. **Persona recalibré** (conséquence de la base réelle) : PAS "Léa achète un VPN/box repas" mais **jeune actif ET entrepreneur** évaluant néobanques, courtage, investissement, crypto régulé, banque pro, compta. Léa (shopper générique) est OBSOLÈTE → @creative-strategy produit les personas définitifs sur cette cible.
5. **Pas de MCP** (inchangé), MAIS le **schéma de données** d'Emmanuel (onglet Schema_MCP) est adopté tel quel comme modèle de données de l'API JSON + du contenu structuré. Les "tools MCP" envisagés (search_referrals, get_referral_by_id, list_categories) deviennent des endpoints d'API.

**BASE RÉELLE D'EMMANUEL** (`data/base-parrainage-emmanuel-v3.xlsx`, v3, nettoyée le 15/07/2026) :
- **9 programmes** : Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko.
- **Catégories actives** : Finance personnelle (néobanque/courtage), Investissement, Gestion de patrimoine, Placement trésorerie, Services entrepreneur (banque pro/compta), Crypto. **À venir** : Télécom & Énergie, Mobilité.
- **Personas cibles de la base** : "Jeune actif" et "Entrepreneur".
- **Schéma (Schema_MCP, 20 champs)** : id, nom_programme, categorie(enum), sous_categorie, cible, pays, langue, url_parrainage, code_parrainage, description_courte, avantage_filleul, avantage_parrain, conditions, statut, priorite_affichage, tags_mcp, date_ajout, date_verification, source, notes.
- **Canaux de contact** : LinkedIn @EmelGoez, WhatsApp, Email.
- **IMPACT JURIDIQUE MAJEUR** : crypto (Kraken/Meria → PSAN/MiCA), investissement (Ramify/Finary/Spiko → CIF/AMF), néobanque/courtage (Trade Republic → agrément), banque pro (Qonto/Revolut Business). @legal DOIT réévaluer en configuration "cercle fermé, liens personnels de T&E" (profil de risque différent d'une marketplace à commission tierce).
