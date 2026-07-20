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
| 2 — Développement | infrastructure → fullstack + ia → ux review → qa → infra | **COMPLETE** (P1-b levé ; infra + socle demandeur backend/frontend + AEO + espace parrain US-02/05/07/09 + auth magic-link livrés ; @qa : 36 unit + 8 E2E verts + CI + 1 bug US-03 corrigé ; build vert) |
| 3 — Contenu | copywriter → seo + geo | **COMPLETE — 10/10 les 9 livrables** (test empirique citation IA = thèse validée 9/9 ; @geo strategie+monitoring ; @seo keyword-map+strategy+audit 3 gaps P0 Bing ; @copywriter 6 fiches catégories + FAQ 18 Q/R ; mots-clés intégrés homepage+6 H1). Audit scorecard @reviewer 8,7→10/10 après 7 actions correctives (4 P1 + 3 P2) toutes vérifiées Grep/Read. GO franc |
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
| 2026-07-20 | 2 | @fullstack (2c) | espace parrain US-02/05/07/09 + auth magic-link | build vert, smoke 13/13 | mailer pluggable (console pilote), 7 screenshots parrain |
| 2026-07-20 | 2 | @qa | 36 tests unit + 8 E2E + CI | VERT | fix bug US-03 (bascule en_attente_parrain rollback), anti-flaky port dynamique |
| 2026-07-20 | 2-audit | @reviewer | audit-phase2.md (scorecard /10) | 8/10 GO Phase 3 | 3 blockers mise en ligne (email placeholder, analytics stub, sécurité fail-open) |
| 2026-07-20 | 2-audit | @fullstack/@legal/@qa | itérations 10/10 (sécurité, analytics, légal, a11y, E2E US-02/05/07) | VERT | 36 unit + 27 E2E, /internal fail-closed, rate-limit, sink pluggable, a11y axe-core |
| 2026-07-20 | 2-audit | @reviewer | re-vérif finale audit-phase2.md | **9,7/10 GO Phase 3** | 7/8 points 10/10 puis résidus levés (screenshots TR, LegalShell) = tous 10/10 |
| 2026-07-20 | 3 | session principale | docs/geo/test-citation-ia.md | THÈSE VALIDÉE | 11 requêtes réelles A1/A2 ; agrégateurs parrainage cités 9/9 sur intention parrainage, comparateurs sur générique ; comble G_PROOF empirique hérité (baseline, re-test post-déploiement) |
| 2026-07-20 | 3 | @geo | geo-strategy.md + monitoring-citations.md | 9/9 PASS | Angle différenciant = date vérif JSON-LD + divulgation ; exploite couche AEO Phase 2 ; monitoring hebdo 11 requêtes lié NSM PCA-IA |
| 2026-07-20 | 3 | @seo | keyword-map + seo-strategy + audit-technique | 9/9 PASS | Cible « parrainage {enseigne} » (pas générique) ; 3 gaps P0 Bing (canonicals, lastModified sitemap, mot-clé H1) → @fullstack ; 0 volume chiffré (non branché) |
| 2026-07-20 | 3 | @copywriter | fiches-categories.md (6) + faq-enrichie.md (18 Q/R) | 9/9 PASS | Posture non-conseil stricte, 0 montant cité, mapping catégorie sourcé 00-index.md ; slots SEO intégrés par session principale |
| 2026-07-20 | 3 | @reviewer | checkpoint-phase3.md | GO CONDITIONNEL | 8/9 livrables PASS strict, G_PROOF empirique comblé ; unique P1 = mapping topical seo-strategy §4 (Qonto/Finary) ; contraintes marque toutes PASS |
| 2026-07-20 | 3 | session principale | correctif P1 seo-strategy §4 | G7 PASS | Topical map alignée 9/9 sur 00-index (Qonto→Services entrepreneur, Finary→Gestion patrimoine) ; condition unique de clôture levée. **PHASE 3 CLOSE** |
| 2026-07-20 | 3-audit | @reviewer | audit-phase3.md (scorecard /10) | 8,7/10 GO | 4 P1 + 3 P2 inédits (décompte parrainage.co 9/9, mot-clé crypto, 6/6 H1, règle title, libellé Dougs, faq handoff, E-E-A-T) |
| 2026-07-20 | 3-audit | session + @seo/@geo/@copywriter | 7 actions correctives → 10/10 | VERT | crypto=plateforme crypto, 6/6 H1 contigus, parrainage.co 9/9, title source unique, note Dougs, faq à jour, décision mainEntityOfPage/Person |
| 2026-07-20 | 3-audit | @reviewer | re-audit ciblé audit-phase3.md | **10/10 les 9 livrables, GO franc** | Corrections vérifiées Grep/Read réels ; 0 résidu bloquant ; sweep 10/10 mérité |
| 2026-07-20 | 3→2 | @fullstack | correctifs techniques SEO/AEO (canonicals, sitemap lastModified, mot-clé title/H1/desc, mainEntityOfPage, FAQPage /divulgation) | build vert + smoke curl | 3 P0 Bing levés ; url_parrainage=0 partout ; mapping DB conforme 00-index ; ISR/OG image différés (P1) |
| 2026-07-20 | 3 | @copywriter + session | 18e Q/R attribution + sync code faq-enrichie.ts | build vert | Écart 17/18 détecté par @fullstack corrigé (Option A, ajout Q authentique), doc=code=18 |

### Décision fondateur (Thomas, 2026-07-20 #3) : PILOTE EXHAUSTIF
Garder un maximum de codes/liens ACTIFS pour tester (9 offres, TR + Kraken inclus). Revue juridique reportée à la TOUTE FIN (avant mise en ligne réelle). Mécanisme `statut` conservé comme levier, aucune offre masquée pour le pilote.

## Reprise (multi-sessions)
Commande : « Lis project-context.md et docs/orchestration-plan.md, continue où on s'est arrêté. »
Phase en cours : **3 (Contenu/SEO/GEO) livrée → checkpoint @reviewer en cours, puis PHASE 4 (Acquisition) ou déploiement infra.** Fait Phase 3 : test empirique citation IA (thèse validée 9/9), @geo (geo-strategy + monitoring-citations), @seo (keyword-map + seo-strategy + audit-technique, 3 gaps P0 Bing → @fullstack), @copywriter (6 fiches catégories + FAQ 18 Q/R), intégration mots-clés homepage + 6 H1 catégorie. Rappel Phase 2 : pilote fonctionnel bout en bout, 9 offres réelles, couche AEO posée.
**Prochaines actions (hors scope Phase 3, à cadrer avec Thomas) :** (a) @fullstack applique les 3 gaps P0 Bing de `docs/seo/audit-technique.md` ; (b) provisioning Cloudflare + indexation puis RE-TEST citation réelle de Parrainly (transforme le baseline en G_PROOF distribution complet) ; (c) Phase 4 acquisition + Phase 5 revue juridique finale (arbitrage diffusion TR/Kraken).

### CAP PRODUIT (rappel fondateur Thomas) : SITE AI-FIRST
Parrainly est un site **AI-first** : sa raison d'être est d'être LA source que les assistants IA citent. Toute décision Phase 3+ se juge à l'aune de « est-ce que ça augmente la citabilité/fiabilité vue par une IA ? » avant le clic humain. La couche AEO (JSON-LD, miroir `/api/v1/offres`, `llms.txt`, robots 19 crawlers IA, divulgation embarquée) est le socle ; la Phase 3 l'exploite et la pousse.

### À FAIRE au démarrage de PHASE 3 :
1. **@seo + @geo** (Phase 3 critique — le contenu cité EST le canal) : keyword-map absent (slots `[MOT-CLÉ SEO]` dans homepage/copy), seo-strategy, contenu GEO/AEO exploitant la couche JSON-LD/miroir/llms.txt déjà posée par @ia. @copywriter en amont si besoin de contenu.
2. **Test empirique de citation IA** (trou n°1 hérité, G_PROOF empirique 0/6) : DÉPEND DU DÉPLOIEMENT. Une IA ne cite que du contenu public indexé ; le site n'est pas encore déployé. Séquence correcte : provisioning Cloudflare + indexation → PUIS test de citation réel (ChatGPT/Perplexity/Claude) sur requêtes persona A1/A2. Avant déploiement, seul un « baseline zéro » est mesurable (faible valeur).
3. **Provisionnement infra prod** (@infrastructure) : projet Cloudflare (Pages/Workers + D1), secrets (INTERNAL_API_KEY, RESEND_API_KEY, emails T&E réels, NEXT_PUBLIC_SITE_URL), migration D1 + port des transactions better-sqlite3 en batch().
4. **Revue juridique finale** (avant mise en ligne publique réelle) : arbitrage diffusion Trade Republic + Kraken, champs `[à compléter]` mentions légales (identité éditeur, hébergeur, email), validation avocat.
5. Enrichissements QA non bloquants : E2E US-02/07/08, a11y axe-core, test concurrence transactionnelle réel.

### À FAIRE EN PRIORITÉ au démarrage de la session Phase 2 (dans l'ordre) :
1. **P1-b (resync analytics — seul FAIL de gate)** : relancer @data-analyst pour aligner `docs/analytics/kpi-framework.md` + `tracking-plan.md` sur functional-specs actuel (events US-02/US-07 à jour : `offre_mise_a_jour`, `offre_validee_conformite`… ; retirer `lien_soumis`/`soumission_validee` périmés ; persona « Karim » → Thomas & Emmanuel cercle fermé). Puis re-vérif @reviewer ciblée C4/C7/G7.
2. **Phase 2 — @infrastructure** (setup : squelette Next.js, env, CI/CD, DB D1/Neon) → **@fullstack + @ia**. Ordre @fullstack donné par @reviewer (checkpoint-specs-phase1.md §d) : (a) modèle 3 objets + table `attribution` ; (b) import des 9 offres depuis `data/base-parrainage.json` (PAS le xlsx) ; (c) `GET /r/{token}` ; (d) moteur d'arbitrage US-03 + job fraîcheur US-04 ; (e) pages-offre `/offres/{slug}` + accueil/catégories ; (f) Tailwind depuis `design-tokens.json` ; (g) coquilles conformité.
3. **Boucle visuelle @fullstack OBLIGATOIRE** : screenshots Playwright 3 devices comparés à `docs/design/page-compositions.md`, sauvegarde `tests/screenshots/` AVANT @qa (gate G26).
4. **P1-a (auth parrain magic-link)** : à spécifier par @fullstack+@ux avant de coder l'espace parrain (US-02/05/09). Ne PAS coder l'espace parrain ni le câblage analytics des events parrain avant P1-a + P1-b.
5. **P1-c (@legal)** : produire les 11 textes juridiques + fiches de conformité CGU par programme + statut PSCA Kraken/Meria. Bloque la MISE EN LIGNE publique, pas le code.

Points Thomas (non bloquants dev) : plafonds de parrainage par programme (champ `conditions`), vérif CGU des 9 programmes avant mise en ligne réelle, opportunité du test de distribution H1 (gratuit).
Commande de reprise : « Lis project-context.md et docs/orchestration-plan.md, continue où on s'est arrêté. »
