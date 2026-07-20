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
| 0 — Fondations | creative-strategy → product-manager → data-analyst ; legal ‖ | **COMPLETE** (refresh corrections Thomas intégré : Parrainly, banques/fintech incluses, V1 cercle fermé, personas A1/A2 fintech, schéma Emmanuel ; alignment C7 : 0 Léa/EDF actif ; 9/9 gates/livrable) |
| 0b — Agents custom | @agent-factory si specs le recommandent | à évaluer |
| 1 — Expérience | ux → design ; copywriter ‖ | **COMPLETE** (@ux, @copywriter, @design 9/9 gates) + checkpoint specs @reviewer = GO CONDITIONNEL (0 P0, 3 P1) |
| 2 — Développement | infrastructure → fullstack + ia → ux review → qa → infra | **EN COURS** (P1-b levé ; infra + socle demandeur backend/frontend + AEO livrés, build vert, smoke 6/6, 6 screenshots ; espace parrain + auth magic-link en cours ; @qa à venir) |
| 3 — Contenu | copywriter → seo + geo | à venir (critique) |
| 4 — Acquisition | growth + social ; sales-enablement | à venir |
| 5 — Conformité & dernier km | legal + revue finale chirurgicale (qa 21 dim → fullstack → qa) | à venir |

## Journal d'exécution
| Date | Phase | Agent | Livrable | Verdict | Décisions clés |
|---|---|---|---|---|---|
| 2026-07-20 | 0 | @orchestrator | project-context (cadrage autopilot) + ce plan | OK | D1-D5 posées en hypothèses |
| 2026-07-20 | 0 | @legal | docs/legal/legal-strategy.md | 9/9 PASS | POC hors-régulé lançable sans statut ; banque V1 = IOBSP/ORIAS |
| 2026-07-20 | 0 | @creative-strategy | docs/strategy/brand-platform.md | 9/9 PASS | Catégorie "registre de confiance" ; tagline "Le parrainage, vérifié avant d'être cité" ; persona Karim |
| 2026-07-20 | 0 | @product-manager | product-vision + roadmap + functional-specs | 9/9 PASS | 8 épics, mécanique rotation FIFO pondérée, hors V1 = banque/MCP |
| 2026-07-20 | 0 | @data-analyst | kpi-framework + tracking-plan | 9/9 PASS | NSM = PCA-IA/mois ; attribution via /r/{token} + confirmation déclarative |
| 2026-07-20 | 0 | @product-manager (corrective) | functional-specs US-09 + events | 9/9 PASS | Confirmation de conversion + /r/{token} ; cohérence n°4 bidirectionnelle PASS |
| 2026-07-20 | 0-refresh | @legal / @creative-strategy / @product-manager | legal-strategy, brand-platform, product×3 (corrections Thomas) | 9/9 PASS | Parrainly, banques incluses, V1 cercle fermé, personas A1/A2, schéma Emmanuel |
| 2026-07-20 | 0-align | @product-manager / @data-analyst | alignment C7 (Léa/EDF → A1/A2 fintech) | PASS | 0 résidu actif ; git history reset-author (committer noreply) |
| 2026-07-20 | 1 | @copywriter | docs/copy ×3 (voix, page-offre, homepage) | 9/9 PASS | Mots interdits classement/rendement ; fiche Trade Republic auto-auditée |
| 2026-07-20 | 1 | @orchestrator | data/base-parrainage.json + programmes.csv + lessons-learned.md | OK | Résout L1 (xlsx binaire illisible par agents) |
| 2026-07-20 | 1 | @ux | docs/ux ×3 (IA, flows, wireframes) | 9/9 PASS | URL mono-offre + JSON miroir ; 4 parcours ; page-offre 10 zones |
| 2026-07-20 | 1 | @design | design-tokens, design-system, page-compositions | 9/9 PASS | Palette anti-cliché (cobalt/vérifié-teal/risque-ambre), carte-offre 5 états, dark mode AA |
| 2026-07-20 | 1→2 | @reviewer | checkpoint-specs-phase1.md | GO CONDITIONNEL | 0 P0 ; 3 P1 (auth parrain, resync analytics=FAIL, textes légaux) ; socle demandeur codeable |
| 2026-07-20 | 2 | @data-analyst | resync analytics (P1-b) | PASS | 23 events 1:1 specs, Karim→T&E ; C4/C7/G7 corrigés |
| 2026-07-20 | 2 | @reviewer | re-vérif C4/C7/G7 | GO | seul FAIL de gate (G7) levé, itération 1/3 |
| 2026-07-20 | 2 | @legal | P1-c : 11 textes + 9 fiches conformité + statut PSCA | 9/9 | DÉCOUVERTE : TR + Kraken interdisent diffusion publique (reporté revue finale) |
| 2026-07-20 | 2 | @infrastructure | squelette Next.js 15.5 + Drizzle + Tailwind(tokens) + CI | build vert | dialecte SQLite (prod D1), schema.ts prêt pour 3 objets |
| 2026-07-20 | 2 | @fullstack (2a) | backend socle : 5 tables, import 9 offres, /r, arbitrage US-03, fraîcheur US-04 | build vert, smoke 6/6 | 9 offres actif (cap pilote TR/Kraken inclus), seuils configurables |
| 2026-07-20 | 2 | @ux | P1-a volet UX auth magic-link | 9/9 | token 15min, session 30j, 4 events proposés |
| 2026-07-20 | 2 | @data-analyst | +4 events auth P1-a | PASS | total 27 events, C4/C7/G7 préservés |
| 2026-07-20 | 2 | @fullstack (2b) | frontend socle : pages-offre/accueil/catégories/coquilles + boucle visuelle | build vert, smoke 6/6 | 6 screenshots conformes compositions, /r invalide→307 |
| 2026-07-20 | 2 | @ia | couche AEO : JSON-LD + miroir JSON + robots/sitemap/llms | build vert | url_parrainage jamais exposé, 19 crawlers IA, fuite=0 |
| 2026-07-20 | 2 | @fullstack (2c) | espace parrain US-02/05/07/09 + auth magic-link | EN COURS | mailer pluggable (console pilote) |

### Décision fondateur (Thomas, 2026-07-20 #3) : PILOTE EXHAUSTIF
Garder un maximum de codes/liens ACTIFS pour tester (9 offres, TR + Kraken inclus). Revue juridique reportée à la TOUTE FIN (avant mise en ligne réelle). Mécanisme `statut` conservé comme levier, aucune offre masquée pour le pilote.

## Reprise (multi-sessions)
Commande : « Lis project-context.md et docs/orchestration-plan.md, continue où on s'est arrêté. »
Phase en cours : **2 (Développement) EN COURS.** Fait : P1-b levé (analytics + re-vérif @reviewer PASS), P1-c légal, infra Next.js, socle demandeur backend+frontend+boucle visuelle, couche AEO @ia, P1-a volet UX + 4 events. EN COURS : espace parrain US-02/05/07/09 + auth magic-link (@fullstack). RESTE : @qa (tests E2E + audit 21 dim), puis Phase 3 (contenu/SEO/GEO). Revue juridique finale (TR/Kraken diffusion) avant mise en ligne réelle.

### À FAIRE EN PRIORITÉ au démarrage de la session Phase 2 (dans l'ordre) :
1. **P1-b (resync analytics — seul FAIL de gate)** : relancer @data-analyst pour aligner `docs/analytics/kpi-framework.md` + `tracking-plan.md` sur functional-specs actuel (events US-02/US-07 à jour : `offre_mise_a_jour`, `offre_validee_conformite`… ; retirer `lien_soumis`/`soumission_validee` périmés ; persona « Karim » → Thomas & Emmanuel cercle fermé). Puis re-vérif @reviewer ciblée C4/C7/G7.
2. **Phase 2 — @infrastructure** (setup : squelette Next.js, env, CI/CD, DB D1/Neon) → **@fullstack + @ia**. Ordre @fullstack donné par @reviewer (checkpoint-specs-phase1.md §d) : (a) modèle 3 objets + table `attribution` ; (b) import des 9 offres depuis `data/base-parrainage.json` (PAS le xlsx) ; (c) `GET /r/{token}` ; (d) moteur d'arbitrage US-03 + job fraîcheur US-04 ; (e) pages-offre `/offres/{slug}` + accueil/catégories ; (f) Tailwind depuis `design-tokens.json` ; (g) coquilles conformité.
3. **Boucle visuelle @fullstack OBLIGATOIRE** : screenshots Playwright 3 devices comparés à `docs/design/page-compositions.md`, sauvegarde `tests/screenshots/` AVANT @qa (gate G26).
4. **P1-a (auth parrain magic-link)** : à spécifier par @fullstack+@ux avant de coder l'espace parrain (US-02/05/09). Ne PAS coder l'espace parrain ni le câblage analytics des events parrain avant P1-a + P1-b.
5. **P1-c (@legal)** : produire les 11 textes juridiques + fiches de conformité CGU par programme + statut PSCA Kraken/Meria. Bloque la MISE EN LIGNE publique, pas le code.

Points Thomas (non bloquants dev) : plafonds de parrainage par programme (champ `conditions`), vérif CGU des 9 programmes avant mise en ligne réelle, opportunité du test de distribution H1 (gratuit).
Commande de reprise : « Lis project-context.md et docs/orchestration-plan.md, continue où on s'est arrêté. »
