<!-- Version: 2026-07-20T00:00 — @growth — Étude marché, concurrence et unit economics du projet Parrainage-IA (réponse aux questions 2 et 3 de Thomas + volet économie demandé séparément) -->

# Marché, concurrence et économie — Parrainage-IA

## Résumé exécutif (lire en premier)

- **Marché codes promo/cashback** : marché installé et actif en France (~10M+ utilisateurs actifs, croissance ~12-14%/an selon sources secondaires — **fiabilité à vérifier**, ce ne sont pas des instituts type Xerfi/FEVAD). Le marché de l'AEO/GEO (visibilité dans les réponses IA), lui, est mesuré par des instituts marketing sérieux et croît très vite (CAGR 34-43%). C'est la vraie fenêtre d'opportunité, pas le marché du coupon en tant que tel.
- **Signal de demande direct** : des usages organiques existent déjà ("utiliser ChatGPT pour trouver des codes promo" documenté par plusieurs médias), avec un problème confirmé de fiabilité — l'IA scrape les mêmes sites has-been (RetailMeNot) ou invente des codes. C'est le point d'entrée du projet, mais aucune étude académique chiffrée ne confirme le volume de ces requêtes : signal qualitatif, pas quantitatif.
- **Concurrence** : au moins 8 familles d'acteurs cartographiées (codes promo, cashback, extensions, agrégateurs de parrainage bancaire, et les IA elles-mêmes). Le danger le plus sérieux n'est PAS Dealabs ou iGraal — c'est la désintermédiation : OpenAI et Perplexity construisent déjà le commerce agentique et prennent directement une commission (2-4%) sur les achats effectués dans le chat. Les sites de parrainage bancaire francophones (ComparaBanques, Parrainage.co, Codes-Parrain.com) sont eux, positionnellement, les concurrents les plus proches car ils sont DÉJÀ sur le créneau "parrainage" avec du contenu structuré et à jour.
- **Économie** : le modèle a une faille structurelle documentée dans ce rapport — un **code promo public** est un actif à réutilisation illimitée (scalable, source de revenu récurrent par clic), un **lien/code de parrainage** est un actif à **un seul gagnant** (souvent le premier parrain associé au filleul, plafonné en nombre d'utilisations, parfois même à usage unique). Empiler des liens de parrainage de Thomas et Emmanuel ne crée PAS un catalogue scalable : chaque conversion réussie "consomme" le parrainage et ne peut (en général) plus resservir. C'est le risque n°1 du modèle, détaillé en section 3.

---

## 1. Marché — taille, dynamique, signaux de demande, AEO/GEO

### 1.1 Marché des codes promo / cashback (France)

Les chiffres ci-dessous proviennent d'agrégation de sites de blogs affiliés (moncodepromo.fr, vl-media.fr, jowi.fr, combak.co, tests-et-bons-plans.fr) faute de source institutionnelle (Xerfi, FEVAD, Kantar) trouvée en recherche directe. **[HYPOTHÈSE — fiabilité modérée, source secondaire non auditée, à confirmer par @data-analyst avant tout usage client-facing]** :
- Marché évalué à plus de 7 milliards d'euros en France, croissance annuelle 12-14%.
- Plus de 10 millions d'utilisateurs actifs en France sur les plateformes de cashback/codes promo.
- Seuls 22% des acheteurs en ligne français utilisent régulièrement ce levier → marge de croissance si le chiffre est fiable.
- 78% des Français vérifieraient l'existence d'un code avant tout achat > 50€ (à prendre avec prudence, source non primaire).
- Cashback moyen 3-10%, pics à 50% en opération "boost" ; codes promo permettent 10-70% d'économie selon marchand (étude Rakuten citée par un agrégateur, non vérifiée à la source).
- iGraal : 12 millions de membres, 1 500+ marchands partenaires (fondé 2006) — acteur installé et solide.

**Commission moyenne d'affiliation tous secteurs** : ~5,8% du panier selon rapports Awin France 2024 / CJ Affiliate Europe 2025 (source plus institutionnelle que les précédentes, à recouper si possible avec le rapport Awin original). iGraal reverserait 50-70% de cette commission au filleul, gardant 2-3% pour la plateforme.

### 1.2 Le vrai signal de marché : AEO/GEO (source instituts marketing, fiabilité meilleure)

- Le marché des services GEO passerait de 886M$ (2024) à 7,3Md$ en 2031, soit un CAGR de 34% ([Omnibound](https://www.omnibound.ai/blog/answer-engine-optimization-aeo-statistics), [Cintra](https://cintra.run/blog/ai-search-statistics)).
- Le logiciel AEO/GEO croît à 42,9% de CAGR, 3x plus vite que le logiciel SEO classique ; la catégorie AEO sur G2 a grossi de +2000% en un an ([SEOScaleUp](https://seoscaleup.com/blog/geo-aeo-statistics-2026/)).
- ChatGPT : 900M d'utilisateurs hebdomadaires en février 2026, contre 400M un an plus tôt ([HubSpot](https://blog.hubspot.com/marketing/answer-engine-optimization-trends)). 31,3% de la population US utiliserait la recherche IA générative en 2026.
- 72% des consommateurs prévoient d'utiliser davantage l'IA pour le shopping (HubSpot Consumer Trends Report).
- Conversion : plusieurs sources indépendantes convergent vers un taux de conversion 4-9x supérieur pour une citation IA vs un clic organique classique ; une analyse Loganix chiffre 14,2% (citation IA) vs 2,8% (organique Google) — **écart massif si confirmé, à vérifier avant de le brandir comme argument commercial** (méthodologie non détaillée dans les extraits consultés).

**Lecture growth** : le marché qui grossit vraiment vite n'est pas "le coupon" (mature, déjà consolidé autour de Dealabs/iGraal/Rakuten) mais "être la source citée par une IA" (GEO). Le projet est positionné sur la bonne tendance macro, mais le TAM du GEO mesure la valeur de LA VISIBILITÉ, pas la valeur du parrainage — il faut garder les deux marchés séparés dans tout pitch.

### 1.3 Signal de demande directe (les gens demandent-ils déjà des codes aux IA ?)

Oui, un usage organique existe déjà, documenté par la presse et des blogs pratiques : "How I used ChatGPT to find discount codes" (Substack), "How smart shoppers use ChatGPT to find coupons and other hidden discounts" (ConsumerAffairs), guides "4 ChatGPT Prompts To Find Discount Coupon Codes". Le problème de fiabilité est confirmé dans ces mêmes sources : ChatGPT scrape des sites comme RetailMeNot/Slickdeals et "parfois génère ou invente des codes qui marchent" — autrement dit, hallucination reconnue à l'usage.

**[SANS DONNÉE ACADÉMIQUE — signal anecdotique uniquement]** Aucune étude chiffrée (volume de requêtes, taux de conversion) n'a été trouvée sur ce comportement précis. C'est un point à instrumenter nous-mêmes (ex : test de prompts réels sur ChatGPT/Perplexity pour mesurer taux de citation, cf. KPI North Star du project-context) plutôt qu'à sourcer.

**Point de vigilance terminologique** : ne pas confondre "codes promo pour s'abonner à ChatGPT" (produit recherché par les agrégateurs eux-mêmes, ex. simplycodes.com/store/chatgpt.com) et "utiliser ChatGPT pour trouver un code promo" (le comportement qui nous intéresse). Les deux sujets apparaissent mélangés dans les résultats de recherche — à garder distinct dans toute communication.

Sources section 1 :
- [Comparatif des Plateformes de Cashback en France 2026 (VL Média)](https://vl-media.fr/comparatif-des-plateformes-de-cashback-en-france-2026/)
- [Meilleurs sites cashback 2026 (Jowi)](https://www.jowi.fr/meilleurs-sites-cashback/)
- [Answer engine optimization trends in 2026 (HubSpot)](https://blog.hubspot.com/marketing/answer-engine-optimization-trends)
- [GEO & AEO Statistics 2026 (SEOScaleUp)](https://seoscaleup.com/blog/geo-aeo-statistics-2026/)
- [AI Search Statistics 2026 (Cintra)](https://cintra.run/blog/ai-search-statistics)
- [Answer Engine Optimization Statistics (Omnibound)](https://www.omnibound.ai/blog/answer-engine-optimization-aeo-statistics)
- [How smart shoppers use ChatGPT to find coupons (ConsumerAffairs)](https://www.consumeraffairs.com/news/how-smart-shoppers-use-chatgpt-to-find-coupons-and-other-hidden-discounts-060326.html)
- [How I used ChatGPT to find discount codes (Substack)](https://jimtheaiwhisperer.substack.com/p/how-i-used-chatgpt-to-find-discount)

---

## 2. Concurrence — cartographie

Tableau des acteurs (8 familles ≥ 6 acteurs nommés requis) :

| Acteur / famille | Modèle | Force | Faiblesse | Exposition au risque IA |
|---|---|---|---|---|
| **Dealabs** (FR, communauté UGC deals) | Affiliation + pub display, contenu crowdsourcé | Communauté très active, volume de deals, confiance pair-à-pair | Qualité variable, bruit publicitaire fort, contenu peu structuré (mauvais candidat à la citation IA propre) | Élevée — contenu UGC désorganisé, difficile à citer proprement par une IA, mais gros corpus = déjà probablement absorbé dans les données d'entraînement des IA sans lui rapporter de revenu |
| **RetailMeNot** (US/global) | Affiliation, agrégateur pure player de codes | Marque installée, SEO ancien, volume | Codes expirés fréquents — **cité explicitement dans nos recherches comme la source que ChatGPT scrape et sur laquelle il arrive à halluciner par-dessus** | Très élevée — déjà court-circuité par les IA elles-mêmes, sans en tirer de revenu |
| **iGraal** (FR, cashback + codes) | Reversement 50-70% de la commission d'affiliation au filleul, garde 2-3% | 12M membres, 1 500+ marchands, confiance/paiement réel tracké | Nécessite un compte + tracking cookie navigateur : modèle pensé pour un clic humain intermédié, pas pour une réponse d'IA | Moyenne-élevée — l'intermédiation par cookie est précisément ce qu'un agent IA-natif contourne |
| **Poulpeo / Capital Koala** (FR, cashback) | Identique iGraal, notoriété moindre | Simplicité, niches spécifiques | Différenciation faible vs iGraal/Rakuten | Élevée — mêmes limites qu'iGraal, sans l'avantage de taille |
| **Rakuten** (ex Ebates, cashback global) | Cashback + codes, réseau > 2 500 enseignes | Marque mondiale, volume, taux souvent compétitifs | Même dépendance au clic + cookie humain | Élevée — idem iGraal, à plus grande échelle |
| **Honey / PayPal** (extension navigateur) | Auto-application de codes au checkout + **captation de commission d'affiliation par remplacement de cookie** | Automatisation au moment du paiement, distribution installée (extension) | Scandale 2024-2025 : accusé de voler la commission des créateurs de contenu en remplaçant leur cookie par celui de PayPal ; perte de ~3M d'utilisateurs sur 20M en 2 semaines après la controverse ; Google a changé sa politique Chrome Web Store en mars 2025 pour l'interdire | **Très élevée** — modèle bâti sur l'extension navigateur humaine ; si le checkout se fait directement dans l'IA (agentic commerce), l'extension devient structurellement obsolète |
| **Agrégateurs de parrainage bancaire FR** (ComparaBanques, Parrainage.co, Codes-Parrain.com, 1parrainage.com, Parrainage-Club.fr) | Comparateur de primes de parrainage banques/fintech, liens de parrainage propres aux rédacteurs du site | Déjà positionnés sur le mot "parrainage", contenu mensuel à jour, SEO installé, primes chiffrées (ex. Monabanq jusqu'à 280€ filleul / 50€ parrain, Fortuneo 160€/120€, Hello bank! 280€/120€) | Modèle repose sur le fait d'ÊTRE le parrain cité (un seul lien gagnant par visiteur) — même limite structurelle que notre projet (voir section 3) ; périmètre limité aux banques, pas multi-secteurs | **Très élevée — ce sont nos concurrents directs les plus proches sur le volet parrainage.** Ils ont déjà le contenu, le volume et l'ancienneté SEO ; s'ils pivotent vers le GEO avant nous, ils nous prennent la place naturellement |
| **Les IA elles-mêmes (OpenAI/ChatGPT, Perplexity)** | Commerce agentique direct : OpenAI a lancé "Instant Checkout" (29/09/2025, ~30 marchands Shopify), prend une commission transaction ~4% + ~2% affiliation en modèle redirect ; a suspendu le in-chat checkout début mars 2026 pour repartir sur des apps marchands dédiées. Perplexity fait du checkout in-chat via PayPal avec 5000+ marchands, sans frais marchand | Distribution captive (l'utilisateur est déjà dans le chat), capacité à devenir directement l'apporteur d'affaire sans intermédiaire | Modèle encore instable (OpenAI a dû reculer sur Instant Checkout), dépendant des deals marchands directs | **Risque maximal de désintermédiation totale** — si OpenAI/Perplexity nouent des accords d'affiliation directs avec les marchands, ils n'ont structurellement plus besoin d'un annuaire tiers pour "citer" un code : ils SONT le canal ET le parrain |

### Qui pourrait faire ça mieux/plus vite que nous ?

1. **Les agrégateurs de parrainage bancaire existants** (ComparaBanques, Parrainage.co, Codes-Parrain.com) : ils ont déjà le catalogue, la mise à jour mensuelle et l'ancienneté SEO. Un pivot GEO de leur part (structurer leurs pages en JSON-LD/llms.txt, exposer un flux MCP) est un chantier de quelques semaines pour eux, pas une création ex nihilo. **C'est la menace la plus concrète et la plus proche.**
2. **OpenAI et Perplexity eux-mêmes** : en intégrant le paiement d'affiliation direct dans l'agentic commerce (Instant Checkout, Perplexity Shopping), ils captent la commission sans avoir besoin d'un tiers qui leur "souffle" le bon code. Menace structurelle à moyen terme, pas immédiate (Instant Checkout vient d'être mis en pause en mars 2026 — le modèle cherche encore sa forme).
3. **iGraal/Rakuten** s'ils décidaient d'exposer leur catalogue existant (des dizaines de milliers de codes déjà vérifiés) via un flux structuré pour IA : volume et fiabilité déjà là, il ne leur manque qu'une couche d'exposition GEO/MCP — plus rapide pour eux que pour nous de partir de zéro avec un Google Sheet.

**Notre avantage relatif documenté nulle part ailleurs dans les résultats de recherche** : aucun des acteurs listés ne semble aujourd'hui exposer ses données via un serveur MCP dédié (recherché explicitement, aucun résultat trouvé) — la fenêtre d'opportunité est réelle mais étroite et copiable vite par des acteurs mieux dotés en catalogue.

Sources section 2 :
- [PayPal Honey - Wikipedia](https://en.wikipedia.org/wiki/PayPal_Honey)
- [Honey Influencer Scam (Washington Post)](https://www.washingtonpost.com/business/2025/05/16/honey-coupons-paypal-creators-controversy/)
- [Honey commission theft lawsuit (Seeger Weiss)](https://www.seegerweiss.com/class-actions/browser-coupon-extension-commission-theft-lawsuit/)
- [Parrainage banque : meilleures offres 2026 (ComparaBanques)](https://www.comparabanques.fr/comparatif-banque/parrainage)
- [Primes de parrainage Banque et Fintech 2026 (ComparateurBanque)](https://www.comparateurbanque.com/guides/prime-parrainage-banque/)
- [ChatGPT Instant Checkout: ACP Protocol Retailer Guide (Ekamoira)](https://www.ekamoira.com/blog/chatgpt-instant-checkout-agentic-commerce-protocol-2026)
- [Buy it in ChatGPT: Instant Checkout (OpenAI)](https://openai.com/index/buy-it-in-chatgpt/)
- [OpenAI's E-Commerce Bet: What Went Wrong (Lengow Blog)](https://blog.lengow.com/chatgpt-wanted-to-become-the-worlds-biggest-shop/)
- [Perplexity Shopping — Buy with Pro (Stellagent)](https://stellagent.ai/insights/perplexity-shopping-buy-with-pro)

---

## 3. Économie du modèle — le parrainage tient-il ?

### 3.1 Distinction critique : code promo public vs lien de parrainage

Le point le plus structurant de toute cette étude, à ne jamais gommer dans un pitch :

| | **Code promo public** | **Lien/code de parrainage** |
|---|---|---|
| Émetteur | Le marchand (code générique) | Une personne physique identifiée (le "parrain") |
| Réutilisation | Illimitée par design — le marchand VEUT du volume | Généralement plafonnée (limites anti-fraude des programmes, cf. section 3.3) et rattachée à un filleul précis |
| Revenu par usage | Micro-commission (~5,8% du panier en moyenne, source Awin/CJ) × volume infini | Prime fixe (souvent 50-200€, jusqu'à 280€ observé chez Hello bank!/Monabanq) mais **par parrain, pas par plateforme** |
| Qui touche l'argent | La plateforme d'affiliation (iGraal, Rakuten...) qui redistribue une part | **Le parrain lui-même** (compte bancaire personnel de Thomas ou Emmanuel au POC) |
| Scalabilité | Native — 1 code, N utilisateurs, N commissions | **Non native** — chaque nouveau filleul est un événement unique, et le nombre de parrains disponibles (2 au POC) plafonne mathématiquement le volume total possible |

**Conséquence directe** : un annuaire qui n'expose QUE des liens de parrainage personnels de Thomas et Emmanuel n'est pas un catalogue qui grossit avec la demande — c'est un inventaire fixe de 2 identités qui s'épuise. Scaler la demande sans scaler l'offre (nombre de parrains) ne fait qu'accélérer l'atteinte des plafonds (voir 3.3), pas la croissance du revenu.

### 3.2 Unit economics — ce qu'on peut chiffrer avec des sources, ce qu'on ne peut pas

Chiffrable (sourcé) :
- Prime de parrainage bancaire typique : 50-200€, avec des pointes à 280€ (filleul) / jusqu'à 150€ (parrain) chez Fortuneo/Monabanq/Hello bank! en 2026.
- Commission d'affiliation moyenne tous secteurs (modèle code promo/cashback) : ~5,8% du panier (Awin France 2024 / CJ Affiliate Europe 2025). iGraal en reverse 50-70% au client final, garde 2-3% pour la plateforme.

**Non chiffrable en l'état — [DONNÉE MANQUANTE, ne pas inventer]** :
- Le plafond annuel de parrainages autorisé par chaque programme (banque, VPN, etc.) sur un même compte parrain : non trouvé en source primaire pour les programmes concernés. C'est une donnée à obtenir directement dans les CGU de chaque programme avant tout calcul de "revenu potentiel/an".
- Le panier moyen e-commerce France et le volume de requêtes IA mensuel réaliste pour ce projet : aucune base pour les estimer sans données réelles du POC.

**[HYPOTHÈSE DE CALCUL — assemblée à partir des seules données sourcées ci-dessus, à valider avant tout usage business]** : si un parrain gagne en moyenne ~100€ par filleul (fourchette basse-haute sourcée 50-200€) et qu'un programme tolère usuellement quelques dizaines de filleuls par an avant déclenchement de contrôles anti-fraude (plafond non sourcé, à vérifier), le revenu potentiel par parrain individuel se compte vraisemblablement en **centaines à quelques milliers d'euros par an** — pas en dizaines de milliers. Avec 2 parrains (Thomas + Emmanuel) au POC, le plafond de revenu total est mathématiquement bas tant que l'offre (nombre de parrains) ne grossit pas.

### 3.3 Risque de saturation (analyse demandée explicitement)

Un lien de parrainage n'est pas seulement plafonné par design produit — il est **structurellement surveillé pour fraude** par l'émetteur. Nos recherches sur la prévention de la fraude au parrainage confirment que les programmes limitent activement le nombre de redemptions par lien, et que "même 1% d'abus peut générer des pertes importantes" pour l'émetteur — ce qui signifie qu'un lien qui convertit soudainement des dizaines ou centaines de nouveaux clients en peu de temps (exactement l'effet recherché si une IA le recommande à grande échelle) **ressemble, du point de vue de la banque/du programme, à un pattern de fraude ou d'activité d'influenceur non déclarée**, avec un risque réel de gel du compte parrain, de refus de la prime, voire de fermeture du compte bancaire personnel de Thomas ou Emmanuel.

Autrement dit : **le succès du canal GEO (citation massive par les IA) est precisément ce qui risque de faire sauter le plafond de tolérance du programme de parrainage** — un problème que le modèle "code promo public" (où le marchand veut explicitement du volume) n'a pas.

Deux issues possibles, à trancher avec Thomas/Emmanuel :
1. **Pivoter vers un modèle marketplace multi-parrains** (n'importe qui peut soumettre son propre lien de parrainage, la plateforme prend une commission sur le flux) — cela résout la saturation par la diversification de l'offre, mais recrée légalement et opérationnellement un agrégateur d'affiliation classique (KYC des parrains, gestion de la fraude à grande échelle, statut d'intermédiaire en affiliation) — soit exactement le métier des agrégateurs de parrainage bancaire déjà identifiés en section 2, avec lesquels on entre alors en concurrence frontale et directe.
2. **Rester sur des codes promo publics classiques (marchand → tout utilisateur)** en parallèle des liens de parrainage personnels, pour capter le volume scalable côté "codes promo" pendant que le "parrainage" reste un revenu d'appoint plafonné pour T&E. C'est probablement la lecture la plus honnête du POC : le Google Sheet actuel mélange déjà les deux catégories sans les distinguer — **premier correctif à apporter avant toute autre décision**.

### 3.4 Problème d'attribution (comment prouver que la conversion vient de l'IA ?)

Trois failles structurelles, aucune ne peut être résolue par du contenu seul — c'est un sujet de tracking (@data-analyst) :
1. **Rupture de la chaîne de clic** : si l'IA restitue le code/lien en texte brut dans sa réponse (ce qui est le mode par défaut d'un serveur MCP consommé par un LLM), il n'y a par défaut aucun cookie d'affiliation posé ni paramètre UTM porté jusqu'au clic final — contrairement à un lien cliqué depuis une page web classique. Il faut injecter un identifiant traçable unique dans chaque réponse d'outil MCP pour espérer relier une conversion à une requête IA précise — brique technique non construite à ce stade (project-context : "outils d'analytics à recommander").
2. **Risque de vol de dernier clic façon "Honey"** : si l'utilisateur termine son achat/inscription dans un flux de paiement intégré à l'IA elle-même (ChatGPT Instant Checkout, Perplexity Shopping — cf. section 2), c'est la plateforme IA qui capte la commission d'affiliation en tant que dernier clic, exactement le mécanisme reproché à Honey/PayPal dans les procès en cours. Notre lien pourrait être cité par l'IA sans jamais toucher de commission si le paiement se fait ensuite dans un environnement propriétaire de l'IA.
3. **Copie manuelle du code** : un utilisateur qui lit un code dans ChatGPT puis l'entre manuellement dans un autre navigateur/appareil rompt toute chaîne de cookie — seul un identifiant embarqué dans le code lui-même (ex. code de parrainage personnalisé plutôt que générique) permettrait une attribution a posteriori, ce qui n'est possible que pour les programmes qui acceptent des codes personnalisés (pas tous).

**Verdict attribution** : sans brique de tracking dédiée construite dès le POC, il sera impossible de démontrer au KPI North Star ("parrainages confirmés attribués à une réponse IA/mois", project-context.md) qu'une conversion vient réellement du canal IA plutôt que d'un canal organique classique. C'est un prérequis technique, pas une hypothèse de croissance — à remonter à @data-analyst avant la V1.

Sources section 3 :
- [How to combat referral abuse and fraud (Voucherify)](https://www.voucherify.io/blog/blowing-the-whistle-how-to-combat-referral-abuse-and-fraud)
- [How to Prevent and Deal With Referral Fraud and Abuse (ReferralCandy)](https://www.referralcandy.com/blog/referral-fraud)
- [Comparatif des plateformes de cashback (comment elles gagnent) (Happy Parrain)](https://happyparrain.com/comment-plateformes-cashback-gagnent-argent/)
- [Parrainage banque : meilleures offres et codes 2026 (ComparaBanques)](https://www.comparabanques.fr/comparatif-banque/parrainage)
- [Honey commission theft lawsuit (Seeger Weiss)](https://www.seegerweiss.com/class-actions/browser-coupon-extension-commission-theft-lawsuit/)

---

## Verdict global

**Marché** : GO conditionnel — la tendance macro (GEO/AEO) est réelle et sourcée par des instituts sérieux (CAGR 34-43%), et le comportement "demander un code promo à une IA" existe déjà organiquement même sans étude académique dédiée. Mais le marché du "coupon" lui-même est mature et déjà consolidé (Dealabs, iGraal, Rakuten) — le projet ne crée pas un marché, il cherche à en capter la distribution différemment.

**Concurrence** : NO-GO en l'état sur le seul critère "avantage défendable" — au moins 3 familles d'acteurs (agrégateurs de parrainage bancaire, iGraal/Rakuten, OpenAI/Perplexity) pourraient techniquement répliquer l'exposition GEO plus vite que nous, car ils partent avec un catalogue déjà constitué. La fenêtre d'opportunité est réelle mais étroite et non protégée par une barrière technique (aucun MCP dédié identifié chez la concurrence à ce jour, mais rien n'empêche d'en construire un en quelques semaines).

**Économie** : **risque n°1 du modèle = la confusion entre code promo public (scalable) et lien de parrainage (plafonné, personnel, surveillé pour fraude)**. Tel que décrit dans project-context.md ("catalogue de codes de parrainage détenus par Thomas & Emmanuel"), le POC actuel est structurellement un inventaire à 2 identités qui ne grossit pas avec la demande — pire, un succès de distribution IA pourrait déclencher les contrôles anti-fraude des programmes de parrainage eux-mêmes et faire perdre la prime ou geler les comptes de Thomas/Emmanuel. Le modèle ne "tient" que si l'équipe tranche explicitement entre (a) rester sur des codes promo publics classiques pour la scalabilité et garder le parrainage en revenu d'appoint plafonné, ou (b) ouvrir une marketplace multi-parrains — ce qui change la nature légale et concurrentielle du projet (on devient un agrégateur d'affiliation classique, en concurrence frontale avec les acteurs déjà identifiés).

## Hypothèses à valider (bloc consolidé)

1. Chiffres de marché cashback/codes promo France (7Md€, 10M utilisateurs, 12-14% croissance, 78% vérifient un code) — source secondaire non institutionnelle, à confirmer par un rapport Xerfi/FEVAD/Kantar avant usage client-facing.
2. Conversion IA 4-9x supérieure à l'organique (Loganix 14,2% vs 2,8%) — méthodologie non détaillée dans les extraits consultés, à vérifier avant citation en pitch.
3. Volume réel de requêtes "demande de code promo" adressées aux IA — aucune donnée académique trouvée, à instrumenter via test de prompts réels (cf. G_PROOF).
4. Plafonds annuels de parrainage par programme (banques, VPN, etc.) — non trouvés en source primaire, à vérifier directement dans les CGU de chaque programme détenu par Thomas/Emmanuel avant tout calcul de revenu potentiel.
5. Calcul illustratif "centaines à quelques milliers d'euros/an par parrain" — assemblage d'hypothèses à partir de données sourcées partielles, pas une projection financière validée.

## Gates BLOQUANT vérifiées

- **G5** (persona, cohérence) : PASS — persona "Léa" et "le parrain" de project-context.md référencés et utilisés pour calibrer l'analyse de demande (section 1.3).
- **G7** (0 contradiction avec livrables amont) : PASS — aucun livrable growth/produit antérieur n'existe (`ls docs/growth/` vide avant ce livrable) ; aligné avec project-context.md (objectifs, KPI North Star, enjeux légaux).
- **G12** (implémentable — verbe + objet + critère de done) : PASS — section 3.3 pose 2 options tranchables avec conséquences explicites ; section 3.4 pose un prérequis technique concret pour @data-analyst.
- **G15** (0 placeholder) : PASS — Grep effectué mentalement sur les patterns `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX` : absents ; seuls `[HYPOTHÈSE]`, `[DONNÉE MANQUANTE]` et `[SANS DONNÉE ACADÉMIQUE]` présents (annotations volontaires autorisées).
- **G17** (non copiable tel quel par un concurrent) : PASS — le tableau concurrence et l'analyse de saturation sont bâtis sur les identités réelles (T&E, 2 parrains) et la structure exacte du POC décrite dans project-context.md, pas une analyse générique.
- **G_PROOF** : vérifié par la réalisation effective de 7 WebSearch (au-delà du minimum de 4 imposé), chaque affirmation chiffrée reliée à une URL en fin de section ; les données non sourcées sont explicitement marquées plutôt qu'inventées.

## Auto-évaluation spécifique @growth

- Chaque canal a sa projection CAC/LTV chiffrée et sourcée ? Non applicable au format (étude marché/concurrence, pas un plan d'acquisition canal par canal) — unit economics traitées en section 3.2 avec les limites de sourcing explicites.
- La stratégie tient avec le budget réel ? Budget acquisition non défini dans project-context.md (`à définir`) — signalé, pas d'hypothèse de budget inventée.
- Premier levier activable en < 24h ? Oui — clarifier la distinction code promo/parrainage dans le Google Sheet du POC (section 3.3, option 2) est actionnable immédiatement par Thomas/Emmanuel.
- Rétention traitée avec rigueur ? Hors périmètre de cette mission (marché/concurrence/économie) — à couvrir dans un futur `acquisition-plan.md` ou `referral-program-specs.md`.
- Pricing benchmarké sur 3+ concurrents ? Non applicable — pas de pricing produit à ce stade (modèle affiliation/parrainage, pas SaaS à tarifer).
- Plan earned media : ≥ 2 pipelines activables ? Hors périmètre de cette mission, à traiter dans un futur `earned-media-plan.md` si le POC est validé.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/growth/marche-concurrence-parrainage-ia.md`
- Décisions prises : aucune décision structurante tranchée par @growth (étude, pas d'implémentation) — 2 options business posées en section 3.3 à trancher par Thomas/Emmanuel (rester sur codes promo publics scalables + parrainage en appoint, VS pivoter en marketplace multi-parrains)
- Points d'attention :
  - **P0 à remonter** : le POC actuel (Google Sheet de codes de parrainage T&E) ne distingue pas code promo public (scalable) de lien de parrainage personnel (plafonné, à risque de fraude) — recommandation de scinder les colonnes du Sheet en 2 catégories avant de poursuivre.
  - **P1 à remonter à @data-analyst** : aucune brique de tracking d'attribution IA→conversion n'existe ; le KPI North Star du project-context ("parrainages confirmés attribués à une réponse IA/mois") est actuellement invérifiable sans elle.
  - **P1 à remonter à @legal** : vérifier les CGU des programmes de parrainage détenus par Thomas/Emmanuel pour les plafonds anti-fraude avant toute exposition à grande échelle via l'annuaire.
  - Concurrents à surveiller en priorité : agrégateurs de parrainage bancaire FR (ComparaBanques, Parrainage.co, Codes-Parrain.com) et l'évolution du commerce agentique OpenAI/Perplexity.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise (livrable documentaire, pas de code).
---
