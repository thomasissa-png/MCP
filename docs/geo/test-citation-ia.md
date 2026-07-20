<!-- Version: 2026-07-20 — session principale (autopilot Phase 3) — Test empirique de citation IA -->
# Test empirique de citation IA — Parrainly (baseline H1)

> **But** : combler le trou n°1 hérité de l'étude de faisabilité (G_PROOF empirique 0/6 : aucun test de distribution réel n'avait été exécuté). Ce document mesure, sur des requêtes réelles de persona A1 (jeune actif) et A2 (entrepreneur), **ce que la surface IA/recherche cite aujourd'hui** pour les intentions couvertes par le catalogue Parrainly.
> **Statut du site** : NON déployé. Parrainly ne peut donc pas encore être cité. Ce test est un **baseline + validation de thèse**, pas une mesure de citation de Parrainly (celle-ci viendra après déploiement + indexation).

---

## 1. Thèse testée

La raison d'être de Parrainly (site AI-first) repose sur une hypothèse : **les assistants IA et la surface de recherche citent des agrégateurs de parrainage structurés** quand un utilisateur cherche un code/lien de parrainage. Si c'est faux, le pilote n'a pas de canal. Si c'est vrai, la question devient « comment devenir l'agrégateur cité ». Ce test tranche.

Deux familles d'intention distinctes ont été mesurées :
- **Intention parrainage** (« parrainage Qonto », « code parrainage Trade Republic ») — cœur de cible Parrainly.
- **Intention évaluation générique** (« meilleure néobanque jeune actif », « meilleure banque pro ») — amont du parcours, terrain des comparateurs.

## 2. Méthode et limites (honnêteté sur le dispositif)

- **Outil** : `WebSearch` (moteur de recherche, proxy de la surface indexée que les moteurs de réponse IA consomment pour du contenu à jour) + **data-point Claude direct** (la session tourne sur Claude Opus, cf. §5).
- **Limites assumées** (zéro invention, commandement 2) :
  1. `WebSearch` n'est pas l'interface live de ChatGPT / Perplexity / Gemini. Il approxime la couche de sources que ces moteurs citent, il ne restitue pas leur formulation finale ni leur ordre de citation exact.
  2. L'outil est orienté résultats US ; les requêtes en français ramènent bien l'écosystème FR, mais un test depuis un compte FR grand public pourrait varier à la marge.
  3. Parrainly n'étant pas déployé, **aucune mesure de citation de Parrainly n'est possible** ici. Baseline concurrentiel uniquement.
- **Couverture** : les **9 programmes actifs** du pilote testés (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko) + 2 requêtes d'intention générique.
- **Date** : 2026-07-20.

## 3. Résultats — intention parrainage (cœur Parrainly)

Pour **chacun des 9 programmes**, la première page de résultats est dominée par des **agrégateurs de parrainage structurés dédiés** (une page = une enseigne), pas par le site officiel du programme.

| Requête (programme) | Agrégateurs structurés cités en tête | Site officiel présent ? |
|---|---|---|
| parrainage Qonto | parraindeconfiance, moneyradar, 1parrainage, super-parrain, parrainage.co, detective-banque | support Qonto (aide, pas promo) |
| code parrainage Trade Republic | lesavisdemilie, magicienimpots, codes-parrain, 1parrainage, parrainpro, parrainplus, parrainage.co, super-parrain, moneyradar | non en tête |
| code parrainage Revolut Business | comparateurbanque, comparabanques, 1parrainage, parrainage.co, planparrainpromo, parraineo, parraindeconfiance, parrainplus | help.revolut (aide) |
| parrainage Ramify | parraindeconfiance, parrainage.co, 1parrainage, code-parrainage.net, super-parrain, leparrainage, topparrain | non en tête |
| parrainage Finary | parrainage.co, 1parrainage, codesparrainages, super-parrain, parrainduweb, code-parrainage.net, planparrainpromo, parraineo | finary.com/referral (générique) |
| Dougs (compta) | parraindeconfiance, planparrainpromo, 1parrainage, parrainage.co, super-parrain, codamia, dealparrainage | blog Dougs |
| code parrainage Kraken | 1parrainage, codes-parrain, parrainage-club, zone-parrainage, cryptoparrainage, parrainage.co, codesparrainages, super-parrain | non |
| parrainage Meria | parrainage.co, codes-parrain, 1parrainage | meria.com (produit, pas parrainage) |
| parrainage Spiko | parrainage.co, touslescashbacks, 1parrainage | spiko.io (produit) |

**Constat n°1 (validant)** : sur **9/9** requêtes d'intention parrainage, la surface citée est **majoritairement composée d'agrégateurs de parrainage structurés**. La catégorie « registre de codes de parrainage cité par la couche de réponse » **existe déjà et capte la citation**. Le pari de Parrainly n'est pas de créer un comportement, il est de **prendre une place dans un comportement établi**.

**Constat n°2 (format)** : le format gagnant est **une page par enseigne** (`/site/qonto`, `/offres/ramify`, `/offre_parrainage_Kraken.php`), exactement le modèle **URL mono-offre + miroir JSON** déjà retenu par @ux/@ia en Phase 2. Cohérence architecturale confirmée par le terrain.

## 4. Résultats — intention évaluation générique (amont)

| Requête | Sources citées en tête | Agrégateur parrainage cité ? |
|---|---|---|
| meilleure néobanque jeune actif 2026 | meilleurtaux, top10banques, moneyvox, moneyradar, panorabanques, selectra, finance-heros, comparabanques | **Non** |
| meilleure banque pro entrepreneur 2026 | comparabanques, meilleurtaux, selectra, moneyvox, blog Qonto, finance-heros | **Non** |

**Constat n°3 (nuance stratégique)** : sur l'intention **générique/évaluation**, ce sont les **comparateurs bancaires** qui captent la citation, pas les agrégateurs de parrainage. Parrainly ne gagne pas frontalement « meilleure néobanque » (terrain saturé, incumbents SEO massifs). Le terrain défendable de Parrainly est **l'intention parrainage/code**, où il peut être la source la plus fraîche et la plus structurée. La bascule générique→parrainage se joue en maillage interne (cf. handoff SEO/GEO).

## 5. Data-point Claude direct

La session tourne sur Claude Opus. Sans outil (réponse paramétrique), à « parrainage Qonto » Claude décrit le mécanisme général du programme **sans citer d'agrégateur nommé** ni garantir un montant à jour (risque d'obsolescence assumé par le modèle). Avec recherche activée, Claude remonte exactement l'écosystème du §3. **Lecture** : la valeur de Parrainly se situe dans le **mode connecté/browsing** des assistants (là où ils vont chercher la donnée fraîche et vérifiée), pas dans leur mémoire paramétrique. Cela confirme que la stratégie doit viser **l'indexation + la structure machine-readable** (couche AEO déjà posée), pas l'espoir d'entrer dans les poids d'un modèle.

## 6. Set concurrentiel réel (agrégateurs incumbents à battre/rejoindre)

Récurrents sur ≥ 3 programmes : **1parrainage.com** (9/9) et **parrainage.co** (9/9) sont les deux incumbents dominants (présents sur les 9 lignes du tableau §3), suivis de **super-parrain.com**, **parraindeconfiance.com**, **codes-parrain.com**, **planparrainpromo.fr**, **moneyradar.org**, **parraineo.com**, **parrainplus.fr**. Verticalisés crypto : cryptoparrainage.fr, zone-parrainage.com, parrainage-club.fr. Ce sont les entités à analyser pour @seo (gap de contenu, autorité) et @geo (angle de différenciation : **vérification/fraîcheur datée + divulgation**, absents ou faibles chez la plupart).

## 7. Verdict

**THÈSE VALIDÉE (baseline).** Le comportement de citation d'agrégateurs de parrainage structurés est **réel, dense et généralisé** sur les 9 programmes du pilote. Le pilote a un canal. Réserves : (a) mesure de citation de **Parrainly** impossible avant déploiement + indexation (à re-tester alors) ; (b) l'avantage n'est pas donné : incumbents installés, la différenciation devra passer par **fraîcheur vérifiée + structure AEO + divulgation**, pas par la simple présence.

## 8. Handoff

- **@seo** : cibler l'intention **« parrainage {enseigne} » / « code parrainage {enseigne} »** (9 slots), pas « meilleure {catégorie} » en frontal. Analyser 1parrainage.com + parrainage.co (structure, maillage) comme références de gap. Maillage catégorie→offre pour capter l'amont générique et le rabattre vers les fiches.
- **@geo** : l'angle différenciant cité = **date de vérification visible + conditions exactes + divulgation d'affiliation**, exploités via la couche JSON-LD/miroir `/api/v1/offres`/llms.txt déjà en place. Le mode browsing des assistants est la cible (cf. §5).
- **Re-test post-déploiement** : rejouer ce protocole une fois le site indexé pour mesurer la citation réelle de Parrainly (transforme ce baseline en G_PROOF de distribution complet).

---

### Vérifié (G_PROOF empirique)
- **11 requêtes réelles exécutées** via WebSearch le 2026-07-20 : 9 d'intention parrainage (1 par programme actif) + 2 d'intention générique.
- **Résultat brut observé** : agrégateurs de parrainage structurés cités en tête sur 9/9 requêtes parrainage ; comparateurs (0 agrégateur parrainage) sur 2/2 requêtes génériques.
- **Reproductible** : rejouer les requêtes du §3/§4. Incumbents les plus constants = 1parrainage.com et parrainage.co (présents tous deux sur les 9 requêtes parrainage). Limite dispositif documentée au §2 (WebSearch ≠ UI live des moteurs de réponse).
