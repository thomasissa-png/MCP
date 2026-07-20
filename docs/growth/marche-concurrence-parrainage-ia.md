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
