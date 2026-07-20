<!-- Version: 2026-07-20T00:00 — @reviewer — Revue de cohérence inter-livrables + gates + audit performance équipe (run Parrainage-IA) -->

# Revue croisée — Parrainage-IA — 2026-07-20

## Résumé exécutif (non-technique)

Les 6 livrables **convergent fortement** sur le fond : bonne intuition de trend, mais deux vérités dures reviennent chez plusieurs agents indépendamment. (1) Le MCP grand public n'est PAS un canal de distribution : le canal réel est le web structuré lu et cité par les IA. (2) Le lien de parrainage personnel est un actif fragile (plafonné, surveillé pour fraude), à ne pas confondre avec un code promo public scalable. L'équipe est **cohérente et de haut niveau**. Le risque n'est pas la contradiction, c'est un **angle mort partagé** : personne n'a fait le seul test qui tranche l'idée (poser de vraies requêtes aux IA). On peut avancer, mais PAS coder le MCP avant ce test.

## Résumé technique

Cohérence inter-livrables : forte (1 tension réelle, sur le rôle du MCP dans le positionnement). Blocage qualité : **G_PROOF empirique manquant sur tout le run** — 3/6 livrables sans bloc `Vérifié :` formel, et 0/6 a exécuté le test de distribution H1. **Verdict global : GO conditionnel** — livrables exploitables, mais le run doit être complété par un test empirique avant toute décision build.

---

## (1) Cohérence — convergences et tensions

### Convergences fortes (le signal du run)

| # | Convergence | Agents qui la portent | Force |
|---|---|---|---|
| C1 | **MCP ≠ canal grand public ; web structuré/cité = canal principal** | @geo, @ia, @elon | Très forte — 3 agents, verdicts identiques, sources concordantes (adoption MCP B2C quasi nulle 2026) |
| C2 | **Lien de parrainage = actif fragile** (plafonné, personnel, anti-fraude) ≠ code promo public scalable | @growth (§3), @legal (P0 n°1), @elon (H3) | Très forte — même diagnostic sous 3 angles (éco, juridique, stratégie) |
| C3 | **La distribution (H1) est l'hypothèse à tester AVANT de construire** | @elon (H1), @geo, @ia (chemin critique) | Forte — ordre de priorité identique : prouver la citation avant le MCP |
| C4 | **Vérification/fraîcheur = actif défendable central** (pas l'inventaire, pas le MCP) | @elon (insight 10x), @ia (KPI qualité), @geo (fraîcheur structurelle), @creative-strategy (Option A) | Forte — 4 agents, même moat |
| C5 | **Attribution des conversions = trou technique non résolu**, prérequis KPI North Star | @growth (§3.4), @ia (V1), @legal (RGPD) | Forte |
| C6 | **Désintermédiation par les plateformes IA = risque structurel** | @elon (§3.1), @growth (concurrence) | Forte |
| C7 | **Scinder le Google Sheet POC en 2 catégories** (promo public vs parrainage) | @growth (correctif n°1), @legal (impacte P0), @elon (implicite) | Forte — action immédiate consensuelle |

### Tensions / contradictions

| Livrable A | Livrable B | Tension | Criticité | Résolution proposée |
|---|---|---|---|---|
| @creative-strategy (why-now §d + G_PROOF : "si le service est intégré MCP", "Google Sheet exposé via MCP est le format qu'un moteur privilégie") | @geo + @ia (le MCP n'est PAS lu par les moteurs en browsing ; la citation passe par schema.org web) | @creative-strategy traite implicitement le MCP comme le **vecteur de citation** ; @geo/@ia prouvent que non. Le positionnement Option A repose donc partiellement sur un canal invalidé | **Moyenne** (non bloquant, mais fausse le messaging) | @creative-strategy réaligne : la promesse "IA ne se trompe jamais" est portée par la **page web structurée+fraîche**, le MCP restant brique secondaire. NB : produits le même jour → non imputable à @creative-strategy, à réconcilier maintenant |
| @creative-strategy §2a ("883 M utilisateurs mensuels") | @creative-strategy §2b ("900 M hebdomadaires") + @growth ("900M hebdo") | Incohérence interne : mensuel < hebdomadaire est illogique ; deux chiffres ChatGPT non harmonisés | **Faible** | Harmoniser sur une seule métrique sourcée (900M hebdo) |
| @legal (divulgation à embarquer surtout "dans la donnée retournée par le MCP") | @geo/@ia (canal principal = web, pas MCP) | @legal met l'accent divulgation sur le MCP alors que le canal réel est la page web | **Faible** (l@legal cite aussi la page) | Prioriser la divulgation sur la **page web structurée** ET la réponse, MCP en complément |

**Aucune contradiction bloquante.** La seule tension de fond (rôle du MCP dans le positionnement) est un artefact de production simultanée, pas un désaccord d'analyse.

---

## (2) Gates par livrable (G1/G3/G5/G7/G12/G13/G15/G17/G_PROOF)

| Livrable | G1 | G3 | G5 | G7 | G12 | G13 | G15 | G17 | G_PROOF | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| @elon | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | **NO-GO formel** (G_PROOF) |
| @creative-strategy | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | **PASS conditionnel** |
| @geo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | **NO-GO formel** (G_PROOF) |
| @growth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **GO** |
| @legal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | **NO-GO formel** (G_PROOF) |
| @ia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **GO 9/9** |

**Évidence des FAIL / réserves :**
- **@elon G_PROOF FAIL** : aucun bloc `Vérifié :` reproductible (commande + output). Projection présente (§4-§5) mais non formalisée. Attendu pour un avis, mais le gate est binaire.
- **@geo G_PROOF FAIL** : reconnaît lui-même le trou — Hypothèses à valider : "test direct en conversation Claude à faire en G_PROOF de la prochaine itération". Le test empirique n'a PAS été exécuté.
- **@legal G_PROOF FAIL** : sources listées mais aucun bloc `Vérifié :` formel (normal en droit, mais gate non satisfait).
- **@creative-strategy G7 ⚠️** : dépendance implicite au MCP comme canal de citation (cf. tension §1). **G13 ⚠️** : incohérence 883M/900M interne.
- **@growth G_PROOF ✅** : 7 WebSearch documentées, chaque chiffre relié à une URL, non-sourcés marqués `[HYPOTHÈSE]`/`[DONNÉE MANQUANTE]`.
- **@ia G_PROOF ✅** : bloc reproductible (requête NordVPN sans MCP → browsing → page schema.org citable). Seul 9/9 strict.

**Constat gate transversal** : le **G_PROOF empirique** est le point faible du run. 3 livrables sans bloc formel, et surtout **0/6 n'a exécuté le test de distribution réel** que @elon a pourtant posé comme kill criterion n°1. À promouvoir en exigence de la prochaine itération.

---

## (3) Trous — ce qui manque

**Trou n°1 (le plus grave) — aucun test empirique de distribution (H1).** Toute l'étude repose sur des sources secondaires et du raisonnement solide, mais l'hypothèse fatale identifiée par @elon (« une IA restitue-t-elle un code d'une source tierce sans friction ? ») n'a été **testée par personne**. C'est faisable immédiatement, gratuitement, sans code : poser 20-30 requêtes réelles ("code promo / parrainage [marque]") à ChatGPT, Claude, Perplexity, Gemini et mesurer citation/reprise/hallucination. Tant que ce test n'est pas fait, le GO POC reste théorique. → à faire exécuter (@geo pilote, appui @ia), AVANT tout build.

**Trou n°2 — "comment procéder" : pas de plan d'action séquencé unifié.** @ia donne l'architecture, @elon l'algorithme SpaceX, @growth les correctifs, mais aucun livrable ne consolide un **plan de test d'hypothèses ordonné** (H1→H2→H3, jalons, kill criteria, qui fait quoi). @product-manager a été recommandé par @elon ET @creative-strategy mais **non invoqué**. C'est la question de Thomas (4) "comment procéder" la moins finalisée.

**Trou n°3 — sizing de la demande réelle.** Le volume de requêtes "code promo via IA" n'est chiffré nulle part (signalé par @creative-strategy et @growth). @data-analyst recommandé, non invoqué. Question de Thomas (2) "y a-t-il un marché" : la tendance macro est solide, la **demande spécifique** reste non quantifiée.

**Angle qui manque le plus : le test empirique (Trou n°1).** L'équipe a excellemment raisonné sur des sources ; il lui manque une seule donnée de première main que le run pouvait produire lui-même.

---

## Top 3 corrections prioritaires

1. **Exécuter le test de distribution H1** (empirique, 20-30 requêtes réelles sur 4 IA) — comble le Trou n°1 et le G_PROOF du run. Sans lui, pas de décision build.
2. **Réaligner @creative-strategy** sur le rôle du MCP (canal = web structuré, pas MCP) pour lever la tension de positionnement.
3. **Invoquer @product-manager** pour consolider le plan de test d'hypothèses séquencé (H1→H2→H3 + jalons POC→V1).

## Décisions à confirmer par Thomas & Emmanuel

- Trancher code promo public (scalable) vs marketplace multi-parrains (change la nature légale/concurrentielle) — posé par @growth et @legal, non résolu (relève d'eux, pas d'un agent).
- Modèle de revenu exact (commission / abonnement) — non tranché, transverse à tous les livrables.
- Scinder le Google Sheet en 2 catégories : action immédiate consensuelle.

## Recommandation

**GO conditionnel.** Les 6 livrables sont cohérents, spécifiques et exploitables (aucune contradiction bloquante). Conditions avant de considérer le run "clos qualité" : (1) test empirique H1 exécuté, (2) tension MCP de @creative-strategy levée, (3) @product-manager pour le plan séquencé. Agents à relancer : **@geo+@ia** (test H1), **@creative-strategy** (réalignement MCP), **@product-manager** (plan), et pour la suite **@data-analyst** (sizing).

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/MCP/docs/reviews/revue-coherence-parrainage-ia.md` + section "Performance des agents" de `project-context.md` remplie.
- Décisions : GO conditionnel ; 7 convergences fortes, 1 tension moyenne (rôle MCP @creative-strategy), 0 contradiction bloquante ; G_PROOF empirique = faiblesse du run (0/6 test réel).
- Points d'attention : Trou n°1 = test de distribution H1 jamais exécuté (le seul qui tranche l'idée) ; @product-manager et @data-analyst recommandés mais non invoqués.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise (livrable documentaire).

[LEARNING DÉTECTÉ]
- Sur un run "étude de faisabilité", les agents ont validé G_PROOF par des WebSearch/projections mais aucun n'a produit la donnée de première main pourtant triviale à obtenir (test de prompts réels). / Catégorie : pattern·biais / Sévérité P1
- Cible propagation : règle-globale (G_PROOF) + agents @geo/@ia — exiger, quand un test empirique est réalisable à coût quasi nul et qu'il constitue le kill criterion de l'idée, qu'il soit EXÉCUTÉ dans le run, pas reporté.
- Fichiers impactés : `_gates.md` (préciser G_PROOF empirique), `reviewer.md`, `geo.md`, `ia.md`
---
