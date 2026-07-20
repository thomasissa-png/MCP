<!-- Version: 2026-07-20 — @reviewer — CHECKPOINT SPECS (gate obligatoire Phase 1 → Phase 2) -->

# Checkpoint specs Phase 1 → Phase 2 — Parrainly

## Verdict en 1 ligne

**GO CONDITIONNEL Phase 2** : @fullstack peut démarrer IMMÉDIATEMENT et sans question le socle « demandeur » (schéma DB, import `data/base-parrainage.json`, endpoint `/r/{token}`, pages-offre, accueil/catégories, coquilles des pages de conformité). 3 blockers P1 à lever EN PARALLÈLE avant de coder l'espace parrain (US-02/05/07/09). Aucun blocker P0 dur n'empêche de commencer.

## Résumé exécutif (non-technique)

La chaîne Phase 0→1 est solide et cohérente sur le cœur du produit (le parcours par lequel un utilisateur arrive d'une IA, lit une fiche vérifiée et récupère un lien). Ce parcours est spécifié de bout en bout (specs + parcours + wireframe + composition visuelle + tokens + copy + données réelles) : un développeur peut le construire sans deviner. Trois trous restent à combler pendant le dev, aucun ne bloque le démarrage : (1) la manière exacte dont Thomas et Emmanuel se connectent à leur espace (lien par email) n'est pas encore décrite techniquement ; (2) le plan analytics n'a pas été remis à jour après la refonte des specs (il liste encore d'anciens événements et un persona obsolète « Karim ») ; (3) les textes juridiques des pages légales et les fiches de conformité par programme restent à produire avant toute mise en ligne publique réelle.

## Résumé technique (3 lignes)

Cohérence : forte sur specs↔ux↔design↔copy↔data (personas A1/A2/T&E alignés, events inline dans chaque US, tokens 3 tiers, données réelles présentes dans `base-parrainage.json`). Blocage : G7 FAIL sur la couche analytics (tracking-plan.md + kpi-framework.md figés en T00:00, events et persona parrain périmés vs functional-specs T03:00). GO/NO-GO : GO pour démarrer le socle demandeur, NO-GO temporaire sur l'espace parrain tant que auth + resync analytics ne sont pas tranchés.

---

## 1. Codeable sans question ? (par écran de la V1)

Légende : SOCLE = codeable maintenant sans question · P1 = trou à lever pendant le dev (non bloquant pour démarrer) · DUR = empêche de coder l'écran.

| Écran / endpoint | Specs (US) | UX (flow+wireframe) | Design | Copy | Données | Verdict | Trou éventuel |
|---|---|---|---|---|---|---|---|
| Page-offre `/offres/{slug}` | US-01 complet (9 GWT, 5 états, payload, events, scénarios) | Parcours 1 + wireframe écran 1 (10 zones) + compo §1 (variante A) | card-offer + 5 états CTA + tokens | page-offre-template + gabarits divulgation/risque | `base-parrainage.json` (9 offres réelles) | **SOCLE** | Classification risque Trade Republic (Finance perso vs Investissement) `[À VALIDER]` → défaut clair = pas de bandeau risque (règle catégorie explicite). Non bloquant. |
| Accueil `/` + `/categories/{slug}` | Support US-01 (nav) | Wireframe écran 2 + compo §2 | grille cartes catalogue + états relégués | homepage-copy (hero, FAQ, sections) | `base-parrainage.json` + Referentiel_Categories | **SOCLE** | `[MOT-CLÉ SEO]` homepage §2 (keyword-map absent) : cosmétique, non bloquant. |
| Endpoint redirection `GET /r/{token}` | US-01 (payload dédié, 301, 404) | Parcours 1 (fin) + IA arbo (noindex) | N/A (technique) | page générique « lien plus valide » | table `attribution` (tracking §2.4) | **SOCLE** | Priorité HAUTE : socle de tout le tracking d'attribution. Codeable tel quel. |
| Back-office catalogue `/parrain/catalogue` | US-02 (9 GWT, 5 états, payload PATCH) | Parcours 2 + wireframe (via dashboard) | formulaires §3.6 | brand-voice (libellés) | `base-parrainage.json` (import initial) | **P1** | Auth lien email non spécifiée (cf. blocker P1-a). Import : specs citent le `.xlsx` binaire, utiliser `base-parrainage.json`. |
| Validation conformité `/parrain/catalogue/{id}/validation` | US-07 (9 GWT, 5 états, payload) | Parcours 2 (fin) | idem back-office | libellés | référence fiche conformité | **P1** | Auth (P1-a) + fiches CGU par programme non produites (P1-c, bloquant activation réelle, pas le code). |
| Dashboard parrain `/parrain/tableau-de-bord` | US-05 (9 GWT, 4 états justifiés, payload GET) | Parcours implicite + wireframe écran 3 + compo §3 | carte prime + liste liens + skeleton | libellés | table Attribution/Parrain | **P1** | Auth (P1-a). UI codeable avec session mockée. |
| Confirmation conversion `/parrain/attributions` | US-09 complet (9 GWT, 5 états, payload, scénarios) | Parcours 3 + wireframe écran 4 (modal) + compo §4 | modal §3.7 (focus trap) | feedback inline + lien /confiance | table Attribution | **P1** | Auth (P1-a) + seuil plausibilité/fenêtre 60j `[HYPOTHÈSE]` → configurables, jamais en dur. Codeable. |
| Pages de conformité (CGU, confidentialité, mentions, divulgation, `/rgpd/demande` US-08) | US-08 + legal §7 checklist (11 items) | IA arbo (6 pages) | disclosure-banner + typographie | gabarit divulgation (copy) | N/A | **P1** | Coquilles codeables maintenant ; TEXTES juridiques « à produire » par @legal (P1-c). Bloquant mise en ligne, pas le code. |
| Moteur d'arbitrage `POST /internal/attribution-engine/select` | US-03 (9 GWT, verrouillage transactionnel) | N/A (sans UI, template allégé justifié) | N/A | N/A | table Attribution/Parrain | **SOCLE** | Critère départage déterministe documenté. Codeable. |
| Job fraîcheur `POST /internal/freshness-check/run` | US-04 (9 GWT, fail-safe) | Parcours 4 (impact demandeur) | états vide/expiré (design §3.8) | états | statut/date_verification | **SOCLE** | Seuils re-tentatives/fenêtre `[À VALIDER]` → configurables. Codeable. |
| Signalement lien mort `POST /.../signalement` | US-06 (9 GWT, 3 états justifiés) | Écran 1 (lien contextuel) | badge-stale | « Ce lien ne fonctionne pas ? » | table signalement | **SOCLE** | Seuil 3 signalements `[HYPOTHÈSE]` → configurable. Codeable. |

**Synthèse** : 6 écrans/endpoints SOCLE (démarrage immédiat), 5 écrans P1 (tous liés à l'auth parrain OU à des dépendances de contenu/analytics parallèles, aucun bloqué par une spec manquante). **0 écran en blocker DUR.**

---

## 2. 11 critères de cohérence (OUI/NON)

| # | Critère | Verdict | Évidence |
|---|---|---|---|
| C1 | Copy cite brand-platform.md | **OUI** | brand-voice-guide §1/§2 cite §4/§7 ; homepage H1 = tagline §5, 3 preuves = §3 |
| C2 | Code @fullstack utilise design-tokens.json | **N/A** | Phase 1, aucun code. design-system §Handoff prescrit Tailwind + variables CSS depuis tokens |
| C3 | Chaque critère d'acceptance a un flow UX | **OUI** | user-flows couvre US-01/02/04/07/09 ; US-05 wireframe écran 3 ; US-06 lien écran 1 ; US-03/04 sans UI justifié ; US-08 conformité transversale (form arbo) |
| C4 | Chaque event du code a son équivalent tracking-plan | **NON** | tracking-plan.md (T00:00) liste les events de l'ANCIENNE US-02/US-07 (`formulaire_soumission_vu`, `lien_soumis`, `soumission_validee`...) ; les events actuels (`offre_mise_a_jour`, `offre_activee`, `offre_validee_conformite`, `offre_bloquee_conformite`) sont ABSENTS ; `attribution_confirmee`/`lien_redirection_suivie` seulement « proposés » alors qu'ils sont déjà dans functional-specs US-01/US-09 |
| C5 | Chaque flow critique a ≥ 1 test E2E | **N/A (planifié)** | DoD de chaque US nomme le fichier `tests/e2e/us-XX-*.spec.ts` à créer par @qa en Phase 2 |
| C6 | Infra compatible stack @fullstack | **N/A** | @infrastructure non encore lancé (Phase 2). Stack cible D1/Neon + Plausible/PostHog documentée |
| C7 | Persona identique partout | **NON** | kpi-framework.md §3.2 « Côté parrain (Karim) » + §1.5 « prime versée à Karim » ; tracking-plan.md G5 « persona Karim conservé côté parrain ». Or brand-platform reclasse Karim en projection V2, parrain V1 = T&E |
| C8 | Métriques alignées NSM | **OUI** | NSM = PCA-IA (kpi-framework §1) aligné project-context ; arbre 5 métriques cohérent. Réserve : events sources périmés (cf. C4) |
| C9 | Contenu récurrent → workflow d'automatisation | **N/A** | Phase 3 (@seo/@geo non lancés). keyword-map.md absent, signalé par copy |
| C10 | Zéro placeholder résiduel (Grep) | **OUI** | Grep patterns interdits : absents partout. Seuls `[À VALIDER]`/`[HYPOTHÈSE]`/`[DONNÉE MANQUANTE]` (annotations autorisées). Réserve : `[DONNÉE MANQUANTE]` de page-offre-template.md est PÉRIMÉ (données présentes dans base-parrainage.json) |
| C11 | Prompts/templates testés sur output réel | **OUI (partiel)** | page-offre-template génère la fiche Trade Republic réelle ; design/ux/kpi G_PROOF déroulent le cas Trade Republic. Test empirique de citation IA jamais exécuté (trou hérité, Phase 2/testeurs) |
| + | page-compositions cohérent avec wireframes | **OUI** | compo cite zones/ordre wireframes à l'identique, compositions priment pour le layout |
| + | Tokens 3 tiers, composant ne référence pas un primitif de couleur | **OUI** | couleurs composant → tier semantic (`{semantic.*.color-*}`). Non-couleur (radius/spacing/font) → primitives : pratique DTCG standard, non bloquant |
| + | Copy↔legal : mentions risque/divulgation présentes | **OUI** | brand-voice §4/§5 + page-offre-template + homepage FAQ = formulations exactes legal §4bis (capital/crypto/factuel + divulgation au-dessus du CTA) |

**2 critères en échec : C4 et C7, tous deux localisés dans la couche analytics (2 fichiers @data-analyst figés en T00:00).**

---

## 3. Gates (échantillon)

| Gate | Verdict | Évidence |
|---|---|---|
| G7 (0 contradiction inter-livrables) | **FAIL** | tracking-plan.md + kpi-framework.md (T00:00) contredisent functional-specs.md (T03:00) sur les events US-02/US-07 et le persona parrain (Karim vs T&E). Contradiction connue mais NON corrigée (chaque agent l'a signalée en Handoff sans que le refresh soit fait) |
| G12 (implémentable sans question) | **PASS avec réserve** | 10/11 écrans implémentables. Seule zone d'invention : mécanisme auth lien email (US-02/05/09 `[À VALIDER par @fullstack/@ux]`) — explicitement délégué à @fullstack, pattern standard (magic link), pas une spec manquante mais une décision à acter |
| G15 (0 placeholder résiduel actif) | **PASS** | Grep sur `[À REMPLIR/À COMPLÉTER/PLACEHOLDER/TODO/XX/INSÉRER/REMPLACER...]` : 0 occurrence hors changelog. `[DONNÉE MANQUANTE]` de page-offre-template.md = annotation de gap (non listée), désormais résolue par base-parrainage.json |
| G17 (non copiable) | **PASS** | Tous les livrables ancrés sur les 9 programmes réels + schéma 20 champs + cercle fermé T&E + posture indicateur non régulé : non réutilisable par un agrégateur générique |

---

## 4. Blockers classés (P0 / P1)

### Blockers DUR (P0 — empêchent de coder)
**AUCUN.** Le socle demandeur est spécifié de bout en bout. Aucune spec manquante n'empêche de commencer.

### Blockers P1 (à lever en parallèle du dev, avant l'espace parrain / la mise en ligne)

| # | Blocker | Owner | Impact | Ce qu'il débloque |
|---|---|---|---|---|
| P1-a | **Auth parrain par lien email non spécifiée** (`[À VALIDER par @fullstack/@ux]`, functional-specs US-02/05/09, IA `/parrain/connexion`) : mécanisme exact (génération token, expiration, session, renvoi de lien) absent | @fullstack + @ux | UI parrain codeable avec session mockée, mais logique de connexion à trancher avant recette | US-02, US-05, US-07, US-09 (tout l'espace parrain) |
| P1-b | **Resync analytics** : tracking-plan.md + kpi-framework.md figés en T00:00 — events US-02/US-07 périmés + `attribution_confirmee`/`lien_redirection_suivie` seulement « proposés » (déjà dans les specs) + persona Karim en V1 (doit être T&E). C4 + C7 + G7 FAIL | @data-analyst | @fullstack risque de câbler des events fantômes ou d'ignorer les nouveaux ; NSM non traçable en prod | Câblage analytics correct, KPI mesurable |
| P1-c | **Textes juridiques + fiches de conformité** : les 11 items legal §7 (CGU, confidentialité, mentions, divulgation, bandeau cookies) sont « à produire » ; fiche de conformité CGU par programme (bloquant DoR) non faite pour aucun des 9 programmes ; statut PSCA Kraken/Meria à vérifier | @legal (+@copywriter ton) | Coquilles de pages codeables ; mise en ligne publique réelle bloquée sans ces textes | Publication publique de US-01/02/06 + activation des offres |

### Points à trancher NON bloquants (configurables / défauts clairs)
- Classification risque Trade Republic (Finance perso vs Investissement) : défaut = pas de bandeau (règle catégorie), revue @product-manager/@legal avant mise en ligne.
- Seuils numériques (`[À VALIDER]`/`[HYPOTHÈSE]`) : plafond par programme, fenêtre fraîcheur, seuil re-tentatives, seuil 3 signalements, fenêtre conversion 60j, seuil plausibilité, longueur token → tous à traiter comme champs **configurables**, jamais codés en dur (déjà prescrit par les specs).
- Source d'import : specs citent `base-parrainage-emmanuel-v3.xlsx` (binaire) ; utiliser `data/base-parrainage.json` (données réelles présentes, 9 programmes).

---

## 5. Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| tracking-plan.md (T00:00) | functional-specs.md (T03:00) | Events US-02/US-07 périmés (`lien_soumis`, `soumission_validee`...) vs actuels (`offre_mise_a_jour`, `offre_validee_conformite`...) ; 2 events déjà intégrés aux specs mais encore « à valider » côté tracking | **P1** | @data-analyst resync le tableau §1 sur les events inline de functional-specs (US-01→US-09), retirer les events onboarding (V2) |
| kpi-framework.md + tracking-plan.md | brand-platform.md §2.3/2.4 | Persona parrain V1 = « Karim » (analytics) vs T&E (cercle fermé) ; Karim = projection V2 | **P1** | @data-analyst remplace Karim par « Thomas/Emmanuel » côté parrain V1 (drift C7) |
| page-offre-template.md (T04:00) | data/base-parrainage.json | Fiche Trade Republic marquée « non publiable » pour `[DONNÉE MANQUANTE]` (xlsx binaire) alors que les données réelles existent en JSON | **P2** | @copywriter (ou @fullstack à l'import) remplace les `[DONNÉE MANQUANTE]` par les valeurs de base-parrainage.json ; le blocage « xlsx binaire » est résolu |
| functional-specs US-02 note @fullstack | data/ réel | Import prescrit depuis le `.xlsx` binaire ; fichier exploitable = `base-parrainage.json` | **P2** | @fullstack importe depuis `base-parrainage.json` (+ `programmes.csv`) |

---

## 6. Angles morts (nécessaires à l'objectif 6 mois)

- **Test empirique de citation IA jamais exécuté** (trou n°1 hérité, @reviewer session précédente + @geo G_PROOF empirique 0/6). L'objectif 6 mois (POC : prouver qu'une IA retourne un code du catalogue et génère ≥ 1 conversion traçable) repose sur cette hypothèse non testée. À exécuter dès que les pages-offre sont en ligne (testeur-persona A1/A2 recommandé partout). Non bloquant pour coder, bloquant pour valider la thèse.
- **Aucun webhook de confirmation enseigne** : la confirmation reste déclarative (US-09), le NSM dépend du bon vouloir + garde-fou de plausibilité. Limite structurelle documentée (tracking §2.7), à surveiller.
- **keyword-map.md / seo-strategy absent** : Phase 3, mais le canal principal est GEO/AEO — à ne pas oublier après le code (homepage/copy ont déjà des slots `[MOT-CLÉ SEO]`).

---

## 7. Décisions à confirmer par l'utilisateur

1. Démarrer le dev sur le socle demandeur maintenant (recommandé) pendant que @data-analyst/@legal/@fullstack lèvent les 3 P1 en parallèle : OUI/NON.
2. Mécanisme d'auth parrain : valider un magic link email standard (défaut proposé) comme décision @fullstack/@ux, ou arbitrage Thomas.
3. Classification risque de Trade Republic (et revue croisée des 9 catégories) avant mise en ligne : à faire trancher @product-manager/@legal.

---

## 8. Recommandation

**GO CONDITIONNEL Phase 2.** Démarrage immédiat autorisé sur le socle demandeur (aucun blocker P0). L'espace parrain et la mise en ligne publique restent conditionnés aux 3 blockers P1. Agents à relancer EN PARALLÈLE du dev :
- **@data-analyst** (P1-b, C4+C7+G7) : resync tracking-plan.md + kpi-framework.md sur functional-specs T03:00 (events actuels, persona T&E, retrait Karim/EDF/VPN). **Prioritaire** car c'est le seul FAIL de gate.
- **@fullstack + @ux** (P1-a) : spécifier l'auth par lien email avant l'espace parrain.
- **@legal** (P1-c) : produire les textes des 11 items §7 + fiches de conformité par programme (bloquant mise en ligne, pas le code).

Re-vérification @reviewer ciblée UNIQUEMENT sur C4/C7/G7 après le resync analytics (max 3 itérations, protocole).

---

## Vérifié (G_PROOF)

- `Read docs/analytics/tracking-plan.md` (tableau §1, l.20-42) : events US-02 = `formulaire_soumission_vu`, `lien_soumis`, `lien_soumission_echec`, `lien_valide_actif` ; US-07 = `soumission_validee`, `soumission_rejetee` — TOUS de l'ancien modèle onboarding (V2).
- `Grep "offre_mise_a_jour|offre_activee|offre_validee_conformite|offre_bloquee_conformite" docs/analytics/tracking-plan.md` : 0 occurrence dans le tableau consolidé (les events actuels de functional-specs US-02/US-07 sont absents).
- `Grep "Karim" docs/analytics/kpi-framework.md` : l.9, l.47 (« prime versée à Karim »), l.96 (« Côté parrain (Karim) »), l.104 → persona parrain V1 périmé.
- `Read data/base-parrainage.json` : 9 programmes réels avec `avantage_filleul`/`avantage_parrain`/`conditions`/`url_parrainage`/`code_parrainage`/`date_verification` renseignés (ex. REF-001 Trade Republic « 3% d'intérêts pendant 3 mois », conditions « Verser 100 EUR dans les 21 premiers jours ») → le blocage « xlsx binaire » de page-offre-template.md est résolu.
- `Read docs/product/functional-specs.md` US-01/US-09 : `lien_redirection_suivie` et `attribution_confirmee` présents comme events réels des specs, alors que tracking-plan.md les liste encore « à valider » (§2.3).

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/reviews/checkpoint-specs-phase1.md`
- Décisions prises : GO CONDITIONNEL Phase 2 (démarrage socle demandeur immédiat, 0 blocker P0) ; NO-GO temporaire espace parrain + mise en ligne tant que 3 P1 non levés ; 2 critères de cohérence en échec (C4, C7) + 1 gate FAIL (G7), tous localisés dans la couche analytics.
- Points d'attention : relancer @data-analyst en priorité (resync analytics, seul FAIL de gate) ; @fullstack/@ux (auth lien email) ; @legal (textes conformité + fiches par programme) ; re-vérification @reviewer ciblée C4/C7/G7 après resync.
- Prochaines étapes : lancer @fullstack sur le socle demandeur (schéma DB → import base-parrainage.json → `/r/{token}` → pages-offre → accueil/catégories) en parallèle des 3 relances P1.
---
