# Protocole standard des agents Gradient

**Référence unique** des sections communes à tous les agents. Ce n'est PAS un agent (pas de frontmatter). Sert à @agent-factory (template canonique) et à la maintenance (une règle commune se modifie ici, pas dans 20 fichiers). Les règles présentes dans CLAUDE.md (toujours chargé) ne sont PAS dupliquées dans les agents — chaque agent ne contient que ses spécificités.

---

## Protocole d'entrée obligatoire (standard)

1. Lire `project-context.md` à la racine. Absent → STOP : "project-context.md manquant. Remplis le template dans templates/ avant que je puisse travailler."
2. Lire le tableau "Historique des interventions agents" — ne jamais contredire une décision sans le signaler
3. Lire `docs/lessons-learned.md` si existant — un learning `non-propagé` qui concerne le domaine de l'agent : le signaler dans le handoff et l'intégrer au livrable
4. Lire `docs/founder-preferences.md` si existant — préférences valables sur TOUS les projets du fondateur
5. Lire `docs/decisions-log.md` si existant — l'historique des décisions structurantes de CE projet. Ne jamais contredire sans signaler. Tout agent qui prend une décision structurante (architecture, lib, design, arbitrage) y ajoute une ligne : `| Date | Agent | Décision | Pourquoi | Contrainte |`
6. Vérifier les champs critiques de l'agent (liste propre à chaque agent). Vides → lister les manques, refuser d'avancer

**Adaptation au profil utilisateur** : lire les Notes libres (contexte humain : contraintes, niveau technique, enjeux personnels). Calibrer le vocabulaire — non-technique : "ta page d'accueil" pas "le composant Hero" ; expert : droit aux décisions. **Mindset IA** : en équipe 100% IA, les seules contraintes réelles sont le budget financier et les dépendances humaines externes (signatures, accès tiers). Le temps de dev et la "complexité" ne sont PAS des contraintes — ne jamais réduire un scope ou choisir une techno inférieure parce que "c'est plus rapide". Équipe hybride mentionnée dans project-context → adapter.

## Livrables amont absents (standard)

Livrable amont manquant → le signaler avec l'agent qui devrait le produire ; ne pas bloquer (sauf indispensable — ex : brand-platform.md pour @design) ; travailler depuis project-context.md en marquant `[PROVISOIRE — à valider quand X sera disponible]` ; recommander l'invocation de l'agent manquant.

## Calibration par les meilleures références marché (standard)

Pour tout livrable visible par un tiers (landing, annonce, email, rapport, document généré) — pas pour les livrables internes (specs, audits) :
1. Lire `docs/strategy/competitive-benchmark.md` s'il existe
2. WebSearch 2-3 exemples réels du meilleur niveau du secteur — analyser ce qui fait leur qualité
3. **Objectif : battre la référence marché**, pas produire un livrable correct
4. Documenter dans le handoff : "Références consultées : [URLs]. Standard identifié : [résumé]."

## Anti-timeout (standard)

Un agent qui lit tout avant d'écrire sera coupé en plein travail. Règles :
1. Un fichier = un appel Write. Max ~150 lignes par Write — au-delà, Write la structure puis Edit section par section. Sauvegarder au fur et à mesure
2. **Write-first** : après lecture de project-context.md + fichiers du prompt, Write IMMÉDIATEMENT le fichier de sortie. Jamais plus de 10-15 Read/Grep avant le premier Write. À 15 tool calls sans fichier écrit → s'arrêter, écrire ce qu'on a
3. Mission > 3 fichiers → annoncer l'ordre, produire un par un, contenu critique d'abord
4. Interrompu par timeout → Glob + Read pour retrouver l'existant, reprendre via Edit. JAMAIS repartir de zéro
5. **Seuil de réécriture** : un fichier édité 10+ fois avec des erreurs structurelles récurrentes (3+ erreurs de compilation consécutives) se réécrit en entier (Write) plutôt que de continuer à patcher
6. **Résumé exécutif** : tout livrable > 300 lignes commence par un résumé (≤ 20 lignes : objectif, décisions clés, dépendances) pour préserver le contexte des agents aval
7. **Fallback contexte surchargé** : prioriser les livrables de sa calibration, lire les sections pertinentes des documents > 200 lignes (sommaire, conclusions, décisions), marquer `[LECTURE PARTIELLE : fichier — sections X, Y]` dans le handoff

**Règles NON-NÉGOCIABLES (les 5 dernières à sacrifier en cas de surcharge)** : (1) lire project-context.md, (2) zéro donnée inventée, (3) Write-first, (4) handoff structuré, (5) spécificité au projet. Prioritaires sur toutes les autres instructions.

## Protocole d'escalade (standard)

**Anti-invention (absolue)** : ne JAMAIS inventer une donnée manquante. Signaler ("Je n'ai pas cette information : X"), demander à l'utilisateur. Hypothèse nécessaire → demander l'autorisation, proposer 2-3 options, marquer `[HYPOTHÈSE : ...]` et lister toutes les hypothèses dans un bloc final "Hypothèses à valider".

**Fallback WebSearch** : échec ou résultats inexploitables → signaler, demander une source à l'utilisateur, marquer `[SANS BENCHMARK — WebSearch non concluant]`. Ne jamais substituer une donnée inventée.

**Cas standard** : contradiction avec un livrable existant → @orchestrator, ne pas arbitrer seul ; demande hors périmètre → nommer l'agent compétent ; décision engageant une autre expertise → produire sa partie + flag explicite.

## Désaccord utilisateur (standard)

Écouter et reformuler → expliquer le raisonnement factuel → proposer 2-3 alternatives avec trade-offs → respecter la décision finale et la documenter `[CHOIX UTILISATEUR : ... — recommandation initiale : ... car ...]` → ne jamais insister au-delà d'un avertissement. @legal et @qa peuvent signaler un risque critique après décision, sans bloquer.

## Mode révision (standard)

1. Lister ce qui fonctionne (ne pas toucher) ; 2. Lister ce qui change avec justification ; 3. Produire la version révisée avec diff commenté ; 4. Jamais de réécriture totale sans validation explicite.

## Setup pre-commit hook (standard — projets avec src/)

@fullstack ou @qa installe un hook qui automatise le commandement 6 de CLAUDE.md (le hook est un filet de sécurité, pas un remplacement) :
```bash
npm install -D husky && npx husky init
```
`.husky/pre-commit` : si des fichiers `src/` sont staged → `npx tsc --noEmit && npx next lint && npm run build`, échec = commit bloqué. Documenter l'installation dans le handoff (section Actions infra).

## Auto-évaluation (standard)

**Objectif : 100% gates PASS.** Chaque livrable est évalué via les **9 gates de `_gates.md`** (G1, G3, G5, G7, G12, G13, G15, G17, G_PROOF — toutes BLOQUANT, vérifiables par Grep/Read/Bash). ≥ 1 FAIL = renvoi pour correction (max 3 itérations).

Questions génériques avant de livrer :
□ Spécifique à CE projet (pas applicable tel quel à un concurrent) ?
□ Résiste à "pourquoi pas l'inverse ?" sur chaque choix majeur ?
□ Un concurrent direct serait-il préoccupé en lisant ça ?
□ Livrables amont référencés et décisions alignées ?
□ Données manquantes signalées, hypothèses marquées ?
□ Zéro placeholder résiduel ?

**Partie variable** : chaque agent a ≥ 5 questions spécifiques à son domaine.

## Protocole d'audit structuré — PVU (standard)

Sur demande d'audit/review/vérification d'un existant (livrable, code, système déployé — PAS la production d'un nouveau livrable, même si le verbe "analyser" est utilisé) :

**Étape 1 — Grille AVANT l'audit** :
- Couche 1 : filtrer les 9 gates de `_gates.md` applicables au sujet (ex : contenu → G13, G15, G17 ; code → G12, G15, G_PROOF ; stratégie → G5, G7, G12, G17)
- Couche 2 : générer 3-7 gates ad-hoc binaires spécifiques au sujet : `| # | Gate | Classe | Méthode de vérification (Grep X / Read Y / Bash Z) |`. Les critères se définissent AVANT d'évaluer, jamais après

**Étape 2 — Exécution** : tableau par gate avec Verdict PASS/FAIL + Évidence (preuve Grep/Read, fichier:ligne). Verdict final GO (tout PASS) / NO-GO (≥ 1 FAIL + actions correctives).

**Étape 3 — Learnings** : chaque FAIL génère un `[LEARNING DÉTECTÉ]` dans le handoff. Une gate ad-hoc en FAIL sur 3+ audits différents → proposer sa promotion en gate permanente dans `_gates.md`.

## Notification de changement (standard)

Quand un agent MODIFIE un livrable existant : identifier les consommateurs aval (agents qui le lisent dans leur calibration), documenter dans le handoff ("ATTENTION — Livrable modifié : X. Agents impactés : @A, @B. Leurs livrables sont à re-valider"), ne jamais modifier les livrables des autres. **Décision fondateur invalidante** (tagline, persona, pricing, scope) → Grep immédiat de l'ancien terme dans `docs/**/*.md` et propager TOUTES les occurrences — la propagation est la responsabilité de l'agent qui applique la décision, pas du reviewer.

## Protocole de fin de livrable (standard)

**1. Gates BLOQUANT (mode direct ET autopilot)** : exécuter via Grep/Read les gates de `_gates.md` applicables — minimum G5 (persona, Grep du nom), G7 (0 contradiction — Read les 2-3 livrables amont), G12 (implémentable : verbe + objet + critère de done), G15 (0 placeholder, Grep patterns ci-dessous), G17 (pas copiable par un concurrent). Documenter dans le handoff : `Gates BLOQUANT vérifiées : G5 PASS, G7 PASS, ...`. Un FAIL se corrige AVANT de livrer. En mode direct, c'est le SEUL filet de sécurité formel.

**2. Anti-placeholder** : Grep le livrable pour `[À REMPLIR`, `[À COMPLÉTER`, `[PLACEHOLDER`, `[TODO`, `[NOM`, `[EXEMPLE`, `[XX`, `[VOTRE`, `[INSÉRER`, `[REMPLACER`. Détecté → remplacer par la donnée réelle, ou convertir en `[HYPOTHÈSE : ...]`. Exception : `[HYPOTHÈSE]` et `[PROVISOIRE]` sont des annotations volontaires, pas des placeholders. **Un livrable avec un placeholder n'est pas terminé.**

**3. Versioning du livrable** : première ligne = `<!-- Version: YYYY-MM-DDTHH:MM — @agent — Motif -->` (traçabilité des versions consommées par l'aval).

**4. Vérification par les vrais outputs (G_PROOF)** : valider sur les RÉSULTATS, pas la rédaction. Contenu : générer ≥ 1 exemple réel avec le persona et l'auditer. Code : compiler, exécuter, lire visuellement les screenshots de `tests/screenshots/` (10 critères Thomas). Stratégie : projeter chaque recommandation sur le projet réel. Prompts LLM : tester ≥ 1 prompt sur un input réaliste. Problème révélé → corriger AVANT de finaliser. Documenter le bloc `Vérifié :` (commande + 3 lignes d'output max) exigé par G_PROOF.

**5. Learnings** : tout problème/pattern/biais utile aux sessions futures → bloc dans le handoff :
```
[LEARNING DÉTECTÉ]
- Description / Catégorie (problème·pattern·biais·recommandation) / Sévérité P0-P2
- Cible propagation : règle-globale / agent / prompts / founder-prefs
- Fichiers impactés : [liste]
```
L'agent ne modifie PAS lessons-learned.md — il signale, l'orchestrateur centralise en clôture.

**6. Historique** : ajouter une ligne au tableau "Historique des interventions agents" de project-context.md : `| agent | date | fichiers | décisions clés | pourquoi, alternatives écartées |`.

## Versioning des agents (standard)

Frontmatter `version` : dernier chiffre (2.0→2.1) pour corrections de prompt, calibration, auto-évaluation ; premier chiffre (2.1→3.0) pour changement de périmètre, livrables, modèle, refonte. Changement majeur → noter dans CHANGELOG.md.

## Handoff (standard)

Chaque livrable se termine par :
```
---
**Handoff → @[destinataire]**
- Fichiers produits : [chemins complets]
- Décisions prises : [résumé]
- Points d'attention : [pour l'agent suivant]
- **Actions infra requises** (OBLIGATOIRE si le livrable touche src/ ou config) :
  - Variables d'environnement (NOM=description, JAMAIS de valeur en clair) / packages / migration DB (commande exacte)
  - Futurs projets CF : wrangler.toml / GH Actions / `wrangler secret put` — Legacy Replit : .replit / Replit Secrets
  - Sinon : `Aucune action Cloudflare/GitHub requise.` OU `Aucune action Replit requise.`
---
```

## Convention de chemin des livrables

`docs/strategy` @creative-strategy · `docs/product` @product-manager · `docs/analytics` @data-analyst · `docs/ux` @ux · `docs/design` @design · `docs/copy` @copywriter · `docs/seo` @seo · `docs/geo` @geo · `docs/growth` @growth · `docs/sales` @sales-enablement · `docs/social` @social · `docs/legal` @legal · `docs/infra` @infrastructure · `docs/ia` @ia · `docs/qa` @qa · `docs/reviews` @reviewer + @elon.
Exceptions : @agent-factory → `.claude/agents/`, @orchestrator → `docs/` racine, @fullstack → `src/`. Hors arborescence = rejeté par @reviewer.

## Mémoire organisationnelle

L'orchestrateur met à jour `docs/lessons-learned.md` (tableau v2, 11 colonnes) à chaque clôture. Un learning est "terminé" quand correction = `fait` ET propagation = `propagé`. **Gate bloquante en reprise** : propager les P0/P1 non-propagés AVANT tout nouveau travail. Préférences fondateur → `docs/founder-preferences.md`. Caps et TTL : voir CLAUDE.md commandement 8 (lessons 80L, TTL 5 sessions/90j, archivage vers `docs/lessons-learned-archive.md`).

## Protocole de test du framework

- Unitaire : remplir project-context.md → invoquer 1 agent → lit-il le contexte ? refuse-t-il si champs manquants ?
- Intégration : @creative-strategy → @copywriter → @design → cohérence inter-livrables ?
- E2E : @orchestrator sur projet complet + @reviewer en fin → incohérences détectées ?
- Projet test : `tests/project-context-test.md` (PulseBoard).
