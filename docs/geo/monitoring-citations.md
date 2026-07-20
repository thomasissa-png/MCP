<!-- Version: 2026-07-20 — @geo — Plan de monitoring des citations IA (post-déploiement) -->
# Monitoring des citations IA — Parrainly

> Ce plan prend le relais du baseline établi dans `docs/geo/test-citation-ia.md` (2026-07-20, site non déployé). Il ne peut mesurer la citation réelle de Parrainly qu'à partir de la mise en ligne effective et de l'indexation par les crawlers listés dans `robots.ts` (`AI_CRAWLERS`, 19 user-agents). Avant déploiement, ce document sert de check-list à exécuter jour 1.

---

## 1. Objectif

Vérifier, requête par requête, si Parrainly est cité par les moteurs de réponse sur les intentions qu'il cible, avec quelle exactitude (date, statut, divulgation), et transformer le baseline concurrentiel déjà établi en mesure de progression réelle dans le temps.

---

## 2. Requêtes-tests (reprises du test empirique, aucune requête réinventée)

### Intention parrainage (cœur de cible, 9 requêtes, 1 par programme actif du pilote)

| # | Requête | Baseline pré-déploiement (`test-citation-ia.md` §3) |
|---|---|---|
| 1 | parrainage Qonto | parraindeconfiance, moneyradar, 1parrainage, super-parrain, parrainage.co, detective-banque |
| 2 | code parrainage Trade Republic | lesavisdemilie, magicienimpots, codes-parrain, 1parrainage, parrainpro, parrainplus, parrainage.co, super-parrain, moneyradar |
| 3 | code parrainage Revolut Business | comparateurbanque, comparabanques, 1parrainage, parrainage.co, planparrainpromo, parraineo, parraindeconfiance, parrainplus |
| 4 | parrainage Ramify | parraindeconfiance, parrainage.co, 1parrainage, code-parrainage.net, super-parrain, leparrainage, topparrain |
| 5 | parrainage Finary | parrainage.co, 1parrainage, codesparrainages, super-parrain, parrainduweb, code-parrainage.net, planparrainpromo, parraineo |
| 6 | Dougs (compta) | parraindeconfiance, planparrainpromo, 1parrainage, parrainage.co, super-parrain, codamia, dealparrainage |
| 7 | code parrainage Kraken | 1parrainage, codes-parrain, parrainage-club, zone-parrainage, cryptoparrainage, parrainage.co, codesparrainages, super-parrain |
| 8 | parrainage Meria | parrainage.co, codes-parrain, 1parrainage |
| 9 | parrainage Spiko | parrainage.co, touslescashbacks, 1parrainage |

### Intention générique (amont, 2 requêtes, terrain difficile déjà signalé)

| # | Requête | Baseline pré-déploiement |
|---|---|---|
| 10 | meilleure néobanque jeune actif 2026 | meilleurtaux, top10banques, moneyvox, moneyradar, panorabanques, selectra, finance-heros, comparabanques (0 agrégateur parrainage) |
| 11 | meilleure banque pro entrepreneur 2026 | comparabanques, meilleurtaux, selectra, moneyvox, blog Qonto, finance-heros (0 agrégateur parrainage) |

### Requêtes additionnelles à activer une fois le catalogue étendu (Télécom & Énergie, Mobilité, cf. `project-context.md`)

Ne pas créer de requêtes-test pour des catégories « à venir » tant qu'aucune offre n'est publiée dans ces catégories : cela produirait un baseline sans donnée Parrainly à comparer, contraire à la règle zéro invention.

---

## 3. Cadence

**Hebdomadaire**, dès la première semaine suivant la mise en ligne publique et l'indexation initiale (les moteurs de réponse évoluent vite, un cycle mensuel serait trop lent pour détecter une exactitude erronée restituée par un modèle).

- Semaine 1-4 post-lancement : rejouer les 11 requêtes intégralement (détection d'indexation initiale).
- À partir du mois 2, si Parrainly est cité de façon stable sur au moins 3 des 9 requêtes de parrainage : passer les 2 requêtes génériques (10-11) à une cadence mensuelle (terrain identifié comme difficile, priorité basse) et garder les 9 requêtes de parrainage en hebdomadaire.
- Après tout changement de contenu majeur (nouvelle catégorie, refonte de page-offre, changement de `SITE_DESCRIPTION`) : rejouer le set complet sous 7 jours, indépendamment du calendrier normal.

---

## 4. Ce qu'on mesure (grille par requête)

Pour chacune des 11 requêtes, à chaque cycle :

| Champ | Valeurs possibles | Note |
|---|---|---|
| Parrainly cité | Oui / Non | Présence de `parrainly.fr` (ou domaine réel une fois défini) dans les sources citées |
| Position relative | 1ère source citée / parmi les sources / non citée mais indexée / non indexé | « Indexé » vérifiable par une requête `site:` séparée si besoin |
| Exactitude de la donnée restituée | Exacte / Partiellement exacte / Erronée / N/A (non cité) | Comparer le montant, la date de vérification et le statut restitués par le modèle à la fiche DB réelle au moment du test |
| Divulgation restituée | Oui / Non / N/A | Le modèle mentionne-t-il que le lien est un lien d'affiliation/parrainage personnel de Thomas ou Emmanuel |
| Fraîcheur perçue | Le modèle mentionne-t-il une date de vérification, ou reste-t-il vague (« récemment ») | Signal direct de l'efficacité du `priceValidUntil`/`FreshnessBadge` |

**Cas d'erreur détecté (donnée erronée restituée par un modèle)** : appliquer le protocole de correction du protocole d'agent GEO : documenter l'erreur (modèle, requête, réponse erronée, donnée correcte issue de la DB), produire le contenu contradictoire structuré (FAQ ciblée, `disambiguatingDescription` renforcée), signaler via les mécanismes de feedback du modèle concerné si disponibles, re-tester à 30 et 60 jours.

---

## 5. Vérification de l'hygiène de donnée en amont du test (pré-requis silencieux)

Avant chaque cycle, vérifier que `date_verification` est renseigné sur toute offre `actif` (condition posée en `geo-strategy.md` §6 action 3). Une offre sans date de vérification ne peut techniquement pas produire le signal de fraîcheur (`priceValidUntil` absent du JSON-LD, cf. `offreJsonLd`) : un échec de citation sur cette offre serait un faux signal de monitoring s'il n'est pas d'abord distingué d'un problème d'hygiène de donnée.

---

## 6. Outillage réaliste

- **WebSearch** (outil de session, déjà utilisé pour le baseline et pour ce plan) : proxy de la surface indexée que les moteurs de réponse consomment, gratuit, reproductible par n'importe quel agent GEO de la session. Limite déjà documentée (`test-citation-ia.md` §2) : n'est pas l'interface live de ChatGPT/Perplexity, l'approxime.
- **Test manuel direct dans les interfaces grand public** (ChatGPT, Perplexity, Gemini, Claude, avec recherche/navigation activée) : gratuit, exécutable par Thomas ou Emmanuel, nécessaire pour capter la formulation exacte et l'ordre de citation qu'un WebSearch ne restitue pas.
- **Alertes Google** (0€) sur le nom de domaine et « Parrainly » : détection passive de mentions tierces, complémentaire aux tests actifs.
- **Outils payants (à envisager seulement si le volume de requêtes-test dépasse la capacité manuelle, non requis au lancement)** : outils spécialisés de suivi de citations IA disponibles sur le marché à partir d'environ 25€/mois pour les offres d'entrée, au-delà de 100€/mois pour des suites SEO/GEO incluant le suivi AI Overviews. Décision d'achat à trancher par Thomas en fonction du volume réel observé après les 4 premières semaines, pas anticipée ici.

---

## 7. Lien avec le NSM et l'attribution

Le NSM de Parrainly est **Parrainages Confirmés d'origine IA (PCA-IA) / mois** (`docs/analytics/kpi-framework.md`, critère `origine_detectee`). Le monitoring de citations et le NSM mesurent deux étapes différentes du même entonnoir, ne pas les confondre :

- **Ce document (citations)** mesure l'étape amont : Parrainly est-il vu et cité par le modèle. Signal qualitatif, non attribué à une conversion individuelle.
- **Le NSM** mesure l'étape aval : un clic issu d'une citation IA a-t-il traversé la redirection trackée `/r/{token}` (event `lien_redirection_suivie`) jusqu'à une confirmation déclarative du parrain (event `attribution_confirmee`, cf. `docs/analytics/tracking-plan.md`).

**Point de vigilance déjà documenté par @data-analyst** : l'attribution actuelle repose sur le token dans le chemin de l'URL, pas sur un paramètre `utm_source` interrogeable après le fait, certains moteurs de réponse (Google AI Mode notamment) masquant le référent. Le monitoring de citations est donc le seul moyen direct de savoir QUEL modèle a cité Parrainly ; le NSM seul ne le dit pas. **Action de rapprochement recommandée** : quand un cycle de monitoring détecte une citation active sur une requête donnée, croiser manuellement la fenêtre temporelle avec un pic éventuel de `lien_redirection_suivie` sur l'offre concernée (pas d'automatisation à ce stade, volume trop faible en V1 cercle fermé pour justifier un outil dédié).

---

## 8. Procédure mensuelle (pour Thomas / Emmanuel, hors session agent)

1. Ouvrir ce document et le tableau de log (§9).
2. Rejouer les 9 requêtes de parrainage (et les 2 génériques si dans le cycle du mois) dans ChatGPT, Perplexity, Gemini et Claude, recherche/navigation activée.
3. Pour chaque requête et chaque modèle : noter cité (o/n), position, exactitude, divulgation, fraîcheur perçue (grille §4).
4. Si une donnée erronée est restituée : appliquer le protocole §4 (documenter, produire le contenu correctif, signaler, re-tester à 30/60 jours).
5. Comparer au cycle précédent : progression, régression, stagnation par requête.
6. Si un modèle cite Parrainly pour la première fois sur une requête : vérifier dans Plausible/PostHog un pic éventuel de `lien_redirection_suivie` sur l'offre concernée dans les jours suivants (rapprochement manuel, §7).
7. Archiver le tableau du mois dans ce fichier (append, ne jamais écraser l'historique).

---

## 9. Tableau de log (gabarit à dupliquer à chaque cycle, vide au lancement)

| Date du test | Requête # | Modèle | Cité (o/n) | Position | Exactitude | Divulgation restituée | Fraîcheur perçue | Action si erreur |
|---|---|---|---|---|---|---|---|---|
| [à remplir au 1er cycle post-déploiement] | | | | | | | | |

---

## Gates vérifiées

- **G1** : 9 sections traitées, aucune < 2 lignes.
- **G3** : bloc Handoff structuré en fin de document.
- **G5** : intentions A1/A2 reprises telles que testées en amont (`test-citation-ia.md`), aucun persona générique réintroduit.
- **G7** : 0 contradiction avec `test-citation-ia.md` (requêtes identiques, aucune reformulée), `kpi-framework.md` et `tracking-plan.md` (NSM et events cités sans redéfinition).
- **G12** : procédure §8 en 7 étapes verbe + objet + critère de done, exécutable par Thomas/Emmanuel sans agent.
- **G13** : 0 chiffre inventé pour Parrainly (aucune cible de citation chiffrée avancée, cohérent avec l'absence de trafic actuel déjà signalée par @data-analyst) ; les tarifs d'outils tiers sont des repères de marché génériques, non spécifiques à Parrainly.
- **G15** : 0 placeholder résiduel (le tableau §9 est un gabarit explicitement marqué comme tel, pas une donnée manquante déguisée).
- **G17** : les requêtes §2 et le rapprochement `/r/{token}` (§7) sont spécifiques au catalogue et à l'architecture d'attribution réels de Parrainly.

---

### Vérifié (G_PROOF)
- `Read /home/user/MCP/docs/geo/test-citation-ia.md` : les 11 requêtes et leurs résultats baseline (§2-9 de ce document) sont recopiés à l'identique depuis les tableaux §3-4 du test empirique, aucune requête reformulée ou inventée.
- `Read /home/user/MCP/project-context.md` (lignes 108-120, tableau Performance des agents et historique) : confirmé le NSM PCA-IA/mois et le mécanisme d'attribution `/r/{token}` + `attribution_confirmee` produits par @data-analyst, réutilisés sans redéfinition en §7.
- **Re-vérification correction 2026-07-20 (audit `docs/reviews/audit-phase3.md`)** : `Read /home/user/MCP/docs/geo/test-citation-ia.md` §3/§4 comparé ligne à ligne au tableau §2 de ce document : les 11 libellés de requête concordent verbatim (« Dougs (compta) » corrigé de « Dougs parrainage (compta) » pour requête #6, les 10 autres déjà identiques). Aucun autre écart détecté.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/geo/monitoring-citations.md` (avec `/home/user/MCP/docs/geo/geo-strategy.md`, livré dans le même run)
- Décisions prises : cadence hebdomadaire pour les 9 requêtes de parrainage (mensuelle pour les 2 requêtes génériques à partir du mois 2 si stabilité) ; monitoring citations et NSM PCA-IA traités comme deux mesures distinctes et complémentaires, pas fusionnées ; outillage payant explicitement différé (décision Thomas, pas anticipée)
- Points d'attention : ce plan ne peut produire aucune mesure réelle avant mise en ligne + indexation de Parrainly (le 1er cycle est à date `[à déterminer au déploiement]`) ; pré-requis d'hygiène de donnée (§5, `date_verification` non nul sur toute offre `actif`) à vérifier avant chaque cycle sous peine de faux signal ; procédure §8 conçue pour être exécutée par Thomas/Emmanuel sans agent, à réviser si le volume de requêtes-test augmente avec l'ouverture V2 (marketplace multi-parrains)
---
