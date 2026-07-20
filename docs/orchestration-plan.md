<!-- Version: 2026-07-20 — @orchestrator — Plan vivant autopilot Parrainage-IA -->
# Plan d'orchestration — Parrainage-IA (autopilot 0→5)

**Mode** : AUTOPILOT · **Stade** : Idée → V1 complète · **Session** : 1
**Objectif** : livraison complète, 100 % gates PASS (9 gates de `_gates.md`), qualité niveau bibliothèque.

## Gate d'ouverture
- **Learnings P0/P1 non-propagés** : `docs/lessons-learned.md` ABSENT (nouveau projet) → **PASS à vide**. Rien à propager avant de lancer.

## Décisions de cadrage (hypothèses orchestrateur — à valider au checkpoint Phase 0)
| # | Décision | Valeur retenue | Statut |
|---|---|---|---|
| D1 | Modèle de revenu | Commission sur les primes | `[HYPOTHÈSE ORCHESTRATEUR]` |
| D2 | Périmètre | Marketplace à rotation, architecture ouverte, seedée T&E | `[HYPOTHÈSE ORCHESTRATEUR]` |
| D3 | Verticales de départ | Hors secteur régulé (énergie/apps/VPN/box/e-commerce) ; banque en V1 | `[HYPOTHÈSE ORCHESTRATEUR]` |
| D4 | KPI North Star | Parrainages confirmés attribués à une réponse IA / mois | `[HYPOTHÈSE ORCHESTRATEUR]` |
| D5 | Ton de marque | fiable / instantané / IA-natif (Option A) | `[HYPOTHÈSE ORCHESTRATEUR]` |

## Priorisation (stade × type × KPI)
- Type projet : **Marketplace deux faces** + dimension **API/contenu GEO**. Dominante : **Funnel** (conversion parrainage) avec un socle **contenu/SEO/GEO** fort (le contenu cité EST le canal d'acquisition).
- Phases retenues : 0 → 1 → 2 → 3 → 4 → 5 (complet). Phase 3 (contenu/SEO/GEO) est **critique** ici, pas secondaire.
- Inputs déjà produits (étude de faisabilité) réutilisés comme amont : `docs/strategy/positionnement-*`, `docs/growth/*`, `docs/geo/*`, `docs/legal/*`, `docs/ia/*`, `docs/reviews/*`, `docs/project-synthesis.md`.

## Suivi des phases
| Phase | Contenu | Statut |
|---|---|---|
| 0 — Fondations | creative-strategy → product-manager → data-analyst ; legal ‖ | **EN COURS — vague A lancée : @creative-strategy + @legal** |
| 0b — Agents custom | @agent-factory si specs le recommandent | à évaluer |
| 1 — Expérience | ux → design ; copywriter ‖ | à venir |
| 2 — Développement | infrastructure → fullstack + ia → ux review → qa → infra | à venir |
| 3 — Contenu | copywriter → seo + geo | à venir (critique) |
| 4 — Acquisition | growth + social ; sales-enablement | à venir |
| 5 — Conformité & dernier km | legal + revue finale chirurgicale (qa 21 dim → fullstack → qa) | à venir |

## Journal d'exécution
| Date | Phase | Agent | Livrable | Verdict | Décisions clés |
|---|---|---|---|---|---|
| 2026-07-20 | 0 | @orchestrator | project-context (cadrage autopilot) + ce plan | OK | D1-D5 posées en hypothèses |

## Reprise (multi-sessions)
Commande : « Lis project-context.md et docs/orchestration-plan.md, continue où on s'est arrêté. »
Phase en cours : **0 — EN COURS**, dernier agent lancé : @creative-strategy + @legal (vague A).
Prochaine action : à leur retour → @product-manager (Phase 0 vague B), puis @data-analyst (vague C), puis **checkpoint Phase 0**.
