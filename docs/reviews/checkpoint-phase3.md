<!-- Version: 2026-07-20 — @reviewer — Checkpoint qualité Phase 3 (Contenu/SEO/GEO) -->

# Checkpoint Phase 3 — Parrainly — Revue de cohérence croisée (Contenu / SEO / GEO)

## Résumé exécutif (non-technique)

La Phase 3 tient. Les 9 livrables (test empirique de citation, 2 GEO, 3 SEO, 3 contenus) racontent la même histoire : viser l'intention « parrainage {enseigne} » (là où les IA citent déjà des agrégateurs, prouvé par le test réel du 20/07), pas la comparaison bancaire générique (terrain perdu des comparateurs). Le contenu client-facing est propre : zéro montant de prime inventé, zéro superlatif affirmatif, zéro tiret cadratin, posture non-conseil tenue partout. Un seul accroc de cohérence à corriger avant de clore : un tableau interne de la stratégie SEO (§4) range Qonto et Finary dans les mauvaises catégories, en désaccord avec la source de référence (fiches légales). C'est isolé, non client-facing, et vite corrigé par @seo. Rien ne bloque, mais on ne peut pas signer un GO franc tant que ce mapping n'est pas aligné. Les 3 correctifs techniques Bing (canonicals, sitemap, mots-clés dans les balises) sont bien documentés et reviennent à @fullstack en aval.

## Résumé technique

Cohérence : CONVERGENTE, 1 contradiction P1 (mapping catégorie↔programme divergent dans seo-strategy.md §4 vs 00-index.md/fiches-categories.md). Gates : 9/9 livrables portent un bloc `Vérifié`, 0 placeholder résiduel, G_PROOF empirique enfin comblé (11 requêtes WebSearch réelles) — le trou n°1 de la Phase 0/faisabilité est levé. Blocages : aucun P0 sur le contenu ; la seule condition de clôture est la correction du §4. Verdict : **GO CONDITIONNEL** (lever le P1, puis GO).

## 1. Gates par livrable

| # | Livrable | Agent | Bloc `Vérifié` | Verdict gates | Évidence |
|---|---|---|---|---|---|
| 1 | `docs/geo/test-citation-ia.md` | session principale | Oui (G_PROOF empirique) | PASS 9/9 | 11 requêtes WebSearch réelles §3/§4, verdict thèse §7 |
| 2 | `docs/geo/geo-strategy.md` | @geo | Oui (G_PROOF) | PASS 9/9 | Reads `jsonld.ts`/`page.tsx` + WebSearch incumbents, angle fraîcheur/divulgation §1 |
| 3 | `docs/geo/monitoring-citations.md` | @geo | Oui (G_PROOF) | PASS 9/9 | 11 requêtes recopiées à l'identique du baseline, NSM repris sans redéfinition §7 |
| 4 | `docs/seo/keyword-map.md` | @seo | Oui (Vérifié) | PASS 9/9 | 15 mots-clés principaux, 0 doublon inter-URL §5, slugs recalculés `slug.ts` |
| 5 | `docs/seo/seo-strategy.md` | @seo | Oui (Vérifié) | **PARTIEL — G7 à corriger** | §4 topical map diverge du mapping de référence (voir §3, P1) |
| 6 | `docs/seo/audit-technique.md` | @seo | Oui (Vérifié) | PASS 9/9 | Audit code réel, 6 greps de preuve, findings P0/P1/P2 §9 |
| 7 | `docs/copy/fiches-categories.md` | @copywriter | Oui (Vérifié) | PASS 9/9 | Mapping 9/9 recoupé ligne à ligne avec 00-index, 6 H1 = keyword-map §3 |
| 8 | `docs/copy/faq-enrichie.md` | @copywriter | Oui (Vérifié) | PASS 9/9 | 18 Q/R, question « meilleur » traitée par la négative §6, 0 doublon homepage |
| 9 | `docs/copy/homepage-copy.md` | @copywriter | Oui (Vérifié) | PASS 9/9 | H1 = tagline marque, slot SEO §2 rempli depuis keyword-map §1 |

Synthèse : **8/9 livrables PASS strict, 1/9 PARTIEL** (seo-strategy.md, G7). Aucun placeholder résiduel (grep `[À REMPLIR|PLACEHOLDER|TODO|XX|INSÉRER]` sur `docs/{geo,seo,copy}/*.md` : les seules occurrences sont dans les blocs de déclaration G15 eux-mêmes).

## 2. Cohérence inter-agents (les 4 points de contrôle demandés)

1. **SEO cible bien « parrainage {enseigne} », pas le générique — PASS.** keyword-map §2 (9 pages offre, mot-clé principal `parrainage {enseigne}`, intention transactionnelle) et seo-strategy §1 priorisent explicitement cette intention, fondées sur test-citation-ia §3/§7 (9/9 requêtes captées par des agrégateurs). Le générique « meilleure {catégorie} » est explicitement écarté (seo-strategy §7, keyword-map §3 « ne visent PAS meilleure néobanque »), aligné constat n°3 du test.

2. **GEO et SEO ne se cannibalisent pas — PASS.** Partage de périmètre net et concordant des deux côtés : SEO = mot-clé/classement organique + maillage (seo-strategy §5, §3) ; GEO = angle de citation fraîcheur vérifiée datée + divulgation structurée + mode browsing (geo-strategy §1, §8). Une seule URL par offre sert les deux canaux, 0 doublon de page. Les deux documents se citent mutuellement et convergent (geo §8 « aucun livrable @seo édité », seo §5 « @geo possède l'angle de citation »).

3. **Mapping programme/catégorie identique partout — PARTIEL (P1).** `fiches-categories.md` = `00-index.md` : **9/9 identiques** (Finance personnelle→Trade Republic ; Investissement→Ramify ; Gestion de patrimoine→Finary ; Placement trésorerie→Spiko ; Services entrepreneur→Qonto/Revolut Business/Dougs ; Crypto→Meria/Kraken). MAIS la topical map illustrative de `seo-strategy.md` §4 **diverge** : elle place Qonto sous Finance personnelle (devrait être Services entrepreneur) et Finary sous Investissement + Gestion de patrimoine (00-index = Gestion de patrimoine seul). Voir §3 (contradiction P1).

4. **Les 6 H1 catégorie = keyword-map §3 — PASS (6/6).** Finance personnelle → `parrainage néobanque vérifié` ; Investissement → `parrainage plateforme d'investissement` ; Gestion de patrimoine → `parrainage agrégateur de patrimoine` ; Placement trésorerie → `parrainage placement de trésorerie` ; Services entrepreneur → `parrainage banque pro` ; Crypto → `parrainage plateforme crypto vérifié`. Chaque H1 de fiches-categories §1-6 porte le mot-clé principal correspondant, annoté `[MOT-CLÉ SEO INTÉGRÉ]`.

## 3. Contradictions classées

| Livrable A | Livrable B | Contradiction | Criticité | Résolution (owner) |
|---|---|---|---|---|
| `seo-strategy.md` §4 (topical map) | `00-index.md` + `fiches-categories.md` | Qonto rangé sous **Finance personnelle** (référence = Services entrepreneur) ; Finary sous **Investissement** ET Gestion de patrimoine (référence = Gestion de patrimoine seul). Finary est marqué `[HYPOTHÈSE]` par @seo, mais **Qonto ne l'est pas** : erreur non signalée. | **P1** | @seo aligne §4 sur 00-index (source d'autorité) : Trade Republic→Finance personnelle uniquement, Qonto→Services entrepreneur uniquement, Finary→Gestion de patrimoine uniquement. Critère : 0 écart §4 vs tableau 00-index. |
| `page-offre-template.md` (Phase 1/2, hors scope Phase 3) | Règle marque n°12 (0 tiret cadratin client-facing) | 5 tirets cadratins détectés dans le fichier. À confirmer s'ils sont dans du texte rendu client-facing ou dans la prose d'analyse/en-têtes. | **P2** | @copywriter vérifie ; si texte client-facing, restructurer. Hors périmètre de clôture Phase 3. |

Aucune contradiction P0. Aucune contradiction bloquante entre les livrables Phase 3 eux-mêmes hormis le §4 ci-dessus.

## 4. Top 3 corrections prioritaires

1. **[P1 — condition de clôture] Aligner seo-strategy.md §4 sur le mapping de référence 00-index.md** (@seo). C'est le seul écart de cohérence inter-livrables ; il fausserait le maillage catégorie↔offre si repris tel quel par @fullstack.
2. **[P0 technique — aval] Traiter les 3 gaps P0 Bing d'audit-technique.md §9.1-3** (@fullstack) : `alternates.canonical` sur les 4 routes, `lastModified` sitemap stable sur pages statiques/catégories, mot-clé « parrainage » dans title/H1/description des 6 catégories + H1 des 9 offres. Findings correctement documentés, hors contenu, à exécuter après le checkpoint.
3. **[P1] Extraire le mapping catégorie↔programme depuis la base réelle (xlsx→CSV/JSON) et le figer en source de vérité DB** (@fullstack) : lève l'`[HYPOTHÈSE]` de seo-strategy §4 et de fiches-categories (mapping documenté mais pas encore branché au code).

## 5. Contraintes marque

- **Tiret cadratin client-facing — PASS.** `fiches-categories.md`, `faq-enrichie.md`, `homepage-copy.md` : 2 occurrences chacun, **toutes dans la ligne d'en-tête `<!-- Version: … — @copywriter — … -->`** (prose interne, exemptée). ZÉRO tiret cadratin dans les H1, chapôs, cadrages, Q/R et textes de page. (Réserve P2 hors Phase 3 : `page-offre-template.md`, 5 occurrences à vérifier.)
- **Superlatifs / « meilleur » / « rendement » en affirmatif — PASS.** La question-posture « quel est le meilleur parrainage » est traitée par la négative (homepage §5 « Non… sans classement » ; faq §6 « Parrainly ne répond pas par un classement »), usage légitime. Aucun « meilleur »/« n°1 »/« top » affirmatif ; « rendement » absent des fichiers de contenu (relecture + grep). geo-strategy §1/§3 et seo-strategy §1 posent explicitement le langage promotionnel comme filtré/interdit.
- **Données inventées (primes, volumes) — PASS.** Aucun montant de prime cité (renvoi systématique à « la fiche affiche le montant vérifié à jour »). Aucune donnée de volume/trafic chiffrée (keyword-map méthodologie, seo-strategy §4 `[HYPOTHÈSE]`, monitoring §6 tarifs outils = repères marché génériques non spécifiques à Parrainly). G13 PASS sur les 9 livrables.

## 6. Angles morts

- **Source de vérité du mapping catégorie↔programme** : le xlsx d'Emmanuel n'est pas lisible par les outils texte ; 00-index sert de mapping de référence mais n'est pas encore branché au code. Tant que l'extraction n'est pas faite, le §4 SEO et fiches-categories reposent sur une transcription manuelle (correcte côté copy, divergente côté SEO). À figer par @fullstack (cf. §4 correction 3).
- **Trade Republic + Kraken exposés dans le contenu** (fiches-categories §1 et §6) alors que 00-index documente une **interdiction explicite de diffusion publique** de leur lien. Cohérent avec le CHOIX UTILISATEUR #3 (pilote exhaustif, revue juridique reportée avant mise en ligne réelle) : ce n'est PAS une contradiction Phase 3, mais un point à réarmer au gate juridique final avant publication.
- **FAQ par offre + enrichissement `/divulgation`** (geo §6 actions 1-2) : contenu non encore produit, différé à @copywriter. Non bloquant pour clore la Phase 3, à tracer comme follow-up GEO.
- **Pas de walkthrough post-code déclenché** : la Phase 3 ne modifie pas `src/` (livrables docs) ; les 3 correctifs code restent à l'état de findings pour @fullstack. Le walkthrough s'appliquera après leur implémentation, pas à ce checkpoint.

## 7. Décisions à confirmer par Thomas/Emmanuel

1. **Mapping catégorie de Finary** : Investissement, Gestion de patrimoine, ou les deux ? (ambiguïté produit signalée par @seo §4). Le contenu et 00-index tranchent « Gestion de patrimoine » ; confirmer à l'extraction du xlsx.
2. **Trade Republic + Kraken** : maintien en pilote confirmé (choix #3), arbitrage diffusion publique (retrait / CTA privé / publication assumée) à trancher au gate juridique final. Rien à décider maintenant, rappel de vigilance.

## 8. Verdict et actions résiduelles

**GO CONDITIONNEL** pour clore la Phase 3. Condition unique et rapide : correction du mapping seo-strategy §4 (P1). Les livrables sont de haute qualité, la cohérence est convergente, le G_PROOF empirique est enfin comblé.

Actions résiduelles priorisées (verbe + objet + critère + owner) :

1. **[P1, condition de clôture] Corriger** la topical map §4 de `seo-strategy.md` pour l'aligner sur `00-index.md` (Qonto→Services entrepreneur seul, Finary→Gestion de patrimoine seul, Trade Republic→Finance personnelle seul). **Critère** : 0 écart §4 vs tableau 00-index. **Owner : @seo.**
2. **[P0 technique, aval] Implémenter** les 3 gaps P0 Bing (`audit-technique.md` §9.1-3) : canonicals absolus sur 4 routes, `lastModified` sitemap stable, mot-clé « parrainage » dans title/H1/description catégories + H1 offres. **Critère** : items §9.1-3 en PASS au re-run. **Owner : @fullstack.**
3. **[P1] Extraire** le mapping catégorie↔programme du xlsx en CSV/JSON source de vérité DB. **Critère** : mapping DB = 00-index 9/9, `[HYPOTHÈSE]` §4 levée. **Owner : @fullstack.**
4. **[P2] Produire** la FAQ par offre (2-3 Q/R) + enrichir `/divulgation` (geo §6 actions 1-2). **Critère** : bloc `FAQPage` injecté par page-offre servable. **Owner : @copywriter.**
5. **[P2] Vérifier** les 5 tirets cadratins de `page-offre-template.md` (hors Phase 3). **Critère** : 0 tiret cadratin dans le texte rendu client-facing. **Owner : @copywriter.**

Re-vérification @reviewer : uniquement le gate G7 de `seo-strategy.md` après correction (action 1). Les autres actions sont en aval de la clôture, hors re-vérification checkpoint.

---

### Vérifié (G_PROOF)

- `Read` des 9 livrables Phase 3 + `00-index.md` + `project-context.md` : chacun des 9 livrables porte un bloc `Vérifié`/`Gates BLOQUANT vérifiées` (confirmé fichier par fichier, tableau §1).
- Mapping recoupé ligne à ligne : `Read fiches-categories.md` §1-6 vs `Read 00-index.md` tableau de synthèse = **9/9 identiques** ; `Grep "Qonto|Finary" docs/seo/seo-strategy.md` → lignes 36-38/40 confirment la divergence §4 (Qonto sous Finance personnelle, Finary sous Investissement + Gestion de patrimoine).
- 6 H1 recoupés : `Read fiches-categories.md` §1-6 (H1 annotés `[MOT-CLÉ SEO INTÉGRÉ]`) vs `Read keyword-map.md` §3 = **6/6 correspondances**.
- `Grep "—" docs/copy/{fiches-categories,faq-enrichie,homepage-copy}.md` → 2 occurrences par fichier, toutes en ligne 1 (en-tête `<!-- Version -->`), **0 en client-facing**.
- `Grep "[À REMPLIR|PLACEHOLDER|TODO|XX|INSÉRER|MOT-CLÉ SEO À]" docs/{geo,seo,copy}/*.md` → seules occurrences = lignes de déclaration G15, **0 placeholder résiduel**.
- Cohérence anti-cannibalisation : `Read geo-strategy.md` §8 + `Read seo-strategy.md` §5 = périmètres disjoints concordants (GEO=citation/fraîcheur, SEO=mot-clé/maillage, une URL/offre).
- Priorisation intention : `Read keyword-map.md` §2 + `seo-strategy.md` §1 + `test-citation-ia.md` §3/§7/§8 = « parrainage {enseigne} » priorisé, générique écarté, convergents.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/reviews/checkpoint-phase3.md` ; édition de la section « Performance des agents » de `/home/user/MCP/project-context.md` (3 lignes : @seo, @geo, @copywriter).
- Décisions prises : **GO CONDITIONNEL** pour clore la Phase 3. 8/9 livrables PASS strict, 1/9 PARTIEL (seo-strategy §4, G7). 1 contradiction P1 (mapping catégorie↔programme divergent), 0 P0 contenu.
- Points d'attention : condition de clôture = @seo corrige seo-strategy §4 (re-vérif @reviewer sur G7 seul) ; 3 gaps P0 Bing = @fullstack en aval (findings documentés, hors contenu) ; extraction xlsx du mapping = @fullstack (source de vérité DB) ; Trade Republic/Kraken à réarmer au gate juridique final avant mise en ligne (choix utilisateur #3, non bloquant Phase 3).
---
