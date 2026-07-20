<!-- Version: 2026-07-20 — @reviewer — AUDIT PHASE 3 (Contenu/SEO/GEO) scorecard /10 par livrable, demande fondateur -->

# Audit Phase 3 (Contenu / SEO / GEO) Parrainly — scorecard /10

## Verdict global : 8,7/10 — GO pour clore la Phase 3 / corrections P1-P2 avant mise en ligne

Les 9 livrables sont d'un niveau réellement élevé : posture non-conseil tenue partout, zéro montant de prime inventé, zéro superlatif affirmatif, zéro tiret cadratin dans le rendu client-facing, structure AEO non copiable, ancrage code réel systématique. Aucun P0 bloquant sur le contenu : la Phase 3 peut être close. MAIS le 10/10 n'est pas atteint, et il ne l'est pas pour des raisons précises que ce document traque au-delà de la surface : **une erreur de décompte propagée sur 2 fichiers** (l'incumbent parrainage.co est cité 9/9 dans le tableau de preuve mais annoncé « 8/9 » deux fois), **un mot-clé principal crypto qui n'est déployé nulle part dans le contenu ni fondé sur une requête testée**, et **deux ambiguïtés de coordination** qui feront diverger l'exécution @fullstack si elles ne sont pas tranchées. Ce sont ces écarts, pas la qualité globale, qui séparent la Phase 3 du 10/10.

## Rappel du P1 checkpoint : CLOS (vérifié)

Le seul P1 du `checkpoint-phase3.md` (topical map `seo-strategy.md` §4 : Qonto sous Finance personnelle, Finary sous Investissement+Gestion de patrimoine) est **corrigé et aligné 9/9** sur `00-index.md`. `Read seo-strategy.md` §4 (lignes 36-44) : Finance personnelle→Trade Republic, Investissement→Ramify, Gestion de patrimoine→Finary, Placement trésorerie→Spiko, Services entrepreneur→Qonto/Revolut Business/Dougs, Crypto→Kraken/Meria = identique 00-index. Le §4 cite désormais explicitement la correction du checkpoint et re-marque l'`[HYPOTHÈSE]` Finary (multi-catégories) sans erreur non signalée sur Qonto. **P1 clos, ne pas rouvrir.**

## Scorecard (trié par priorité de correction, plus urgent en haut)

| Prio | Livrable | Agent | Note | Écarts pour 10/10 |
|---|---|---|---|---|
| 1 | `test-citation-ia.md` | session | 9/10 | Décompte parrainage.co « 8/9 » (§6) alors que le tableau §3 le cite sur 9/9 rangées (P1, G13) |
| 2 | `keyword-map.md` | @seo | 8/10 | Mot-clé principal crypto `parrainage exchange crypto` (anglicisme, non testé, non déployé dans le contenu) (P1) |
| 3 | `fiches-categories.md` | @copywriter | 8/10 | H1 crypto ne porte pas le mot-clé principal keyword-map §3 ; H1 finance perso casse le mot-clé exact (P1/P2) |
| 4 | Intégrations (slot + 6 H1) | session | 8/10 | Défaut d'intégration = le mot-clé crypto ; 0 placeholder résiduel confirmé (P1) |
| 5 | `geo-strategy.md` | @geo | 9/10 | Hérite l'erreur « 8/9 » parrainage.co (§1) ; `mainEntityOfPage`/`Person` non tranchés (P1/P2) |
| 6 | `audit-technique.md` | @seo | 9/10 | §2.3 propose un title catégorie générique divergent des mots-clés spécifiques keyword-map §3 (P2) |
| 7 | `seo-strategy.md` | @seo | 9/10 | P1 clos ; dépendance résiduelle extraction xlsx (`[HYPOTHÈSE]` Finary) tracée (P2) |
| 8 | `monitoring-citations.md` | @geo | 9/10 | Requête #6 « Dougs parrainage (compta) » reformulée vs claim « recopiées à l'identique » (P2) |
| 9 | `faq-enrichie.md` | @copywriter | 9/10 | Note handoff périmée (« keyword-map absent ») ; 18 Q/R pas encore rendues (follow-up GEO) (P2) |

---

## 1. `docs/geo/test-citation-ia.md` — 9/10

Pièce maîtresse de la Phase 3 : c'est le test qui comble le trou n°1 hérité de la faisabilité (G_PROOF empirique 0/6). 11 requêtes WebSearch réelles, thèse tranchée (agrégateurs structurés captent 9/9 des intentions parrainage, comparateurs captent le générique), honnêteté du dispositif exemplaire (§2 : WebSearch ≠ UI live, Parrainly non déployé donc non mesurable), data-point Claude direct pertinent. Le doc est la source d'autorité de tout le reste de la phase.

**Ce qui le sépare de 10/10 :**
- **[P1 — G13, incohérence interne] Décompte parrainage.co faux.** `§6` affirme « **parrainage.co (8/9)** ». Or le tableau de preuve `§3` (lignes 33-41) cite parrainage.co sur **les 9 rangées** (Qonto, Trade Republic, Revolut Business, Ramify, Finary, Dougs, Kraken, Meria, Spiko) : c'est **9/9**, pas 8/9. Le chiffre le plus visible du set concurrentiel contredit son propre tableau. C'est exactement le type d'erreur que la règle G13 (zéro chiffre non vérifié) doit attraper, et elle est d'autant plus gênante qu'elle est dans le document-socle. **Owner : session principale.** **Done : `§6` lit « parrainage.co (9/9) » et le décompte est recoupé au tableau §3.**
- **[P2] Requête Dougs ambiguë.** La rangée Dougs du tableau §3 est libellée « Dougs (compta) » (sans le mot « parrainage »), alors que les 8 autres portent « parrainage {X} » / « code parrainage {X} ». Le libellé de requête réellement exécuté est donc incertain pour ce programme, et il est repris différemment ailleurs (cf. §3 monitoring). **Owner : session.** **Done : libellé de requête Dougs homogène avec les 8 autres, ou note explicite sur la variante testée.**

Note : la citation nominale d'incumbents (1parrainage.com, parrainage.co…) est légitime, ce document est une analyse **interne** non client-facing (règle marque n°9 ne s'applique pas). À ne jamais exposer publiquement.

## 2. `docs/geo/geo-strategy.md` — 9/10

Excellent. Ancrage code réel systématique (table §3 fichier→action avec `jsonld.ts`, `/api/v1/offres`, `llms.txt`, `robots.ts`), angle de différenciation net et non édulcoré (fraîcheur datée exacte + divulgation embarquée en donnée, statut 3 états), garde-fou de gouvernance fort (`url_parrainage` jamais exposé, §3), anti-cannibalisation @seo tranchée (§8), G_PROOF réel (Reads jsonld.ts/page.tsx + WebSearch incumbents). Structure de contenu citable (§4) opérationnelle et alignée brand-voice.

**Ce qui le sépare de 10/10 :**
- **[P1 — cohérence, hérité] Reprend l'erreur « 8/9 ».** `§1` : « un second (parrainage.co) sur **8/9** ». Même erreur que test-citation §6, propagée. À corriger en même temps (l'erreur devient « fausse à deux endroits » si on ne traite qu'un fichier). **Owner : @geo.** **Done : `§1` lit « 9/9 », cohérent avec test-citation §3 corrigé.**
- **[P2] Actions §6 partiellement hors-@geo, non encore exécutées.** `mainEntityOfPage` (action 5) et le schema `Person` (croisé avec audit-technique §4) sont signalés mais non tranchés : à confirmer par @ia/@fullstack comme in-scope ou différés. FAQ par offre (action 1) + enrichissement `/divulgation` (action 2) restent des findings non produits (cf. faq-enrichie non rendue). **Owner : @geo + @ia.** **Done : chaque action §6 a un statut « fait / différé V2 / assigné @X » explicite.**

## 3. `docs/geo/monitoring-citations.md` — 9/10

Plan de monitoring exécutable par Thomas/Emmanuel sans agent (procédure §8 en 7 étapes), grille de mesure claire (§4 : cité/position/exactitude/divulgation/fraîcheur), articulation propre avec le NSM (§7 : citations = amont qualitatif, PCA-IA = aval attribué, distinction juste et non fusionnée). NSM cité exactement : `Read kpi-framework.md:7,25` confirme « Parrainages Confirmés d'origine IA (PCA-IA) par mois » = libellé repris sans redéfinition. Pré-requis d'hygiène de donnée (§5, `date_verification` non nul) = garde-fou anti-faux-signal pertinent.

**Ce qui le sépare de 10/10 :**
- **[P2 — G_PROOF, précision] Claim « recopiées à l'identique » non tenu à la marge.** Le doc affirme (§2 titre, bloc Vérifié) que les 11 requêtes sont « reprises du test empirique, aucune requête réinventée ». Or `§2 #6` = « **Dougs parrainage (compta)** », alors que test-citation §3 libelle « Dougs (compta) ». Reformulation mineure, mais elle contredit une affirmation d'exactitude posée par le document lui-même. **Owner : @geo.** **Done : requête #6 identique au libellé source (après clôture du P2 de la section 1), ou claim reformulé en « intentions reprises » plutôt que « requêtes à l'identique ».**
- **[P2] Tableau de log §9 = gabarit vide (attendu).** Marqué explicitement comme gabarit à dupliquer post-déploiement, donc conforme (pas un placeholder déguisé). Aucune correction requise, signalé pour transparence.

## 4. `docs/seo/keyword-map.md` — 8/10

Rigueur méthodo exemplaire : `[HYPOTHÈSE]` posée dès l'entrée (aucun volume Ahrefs/Semrush/GSC inventé, G13 tenu), non-cannibalisation vérifiée (§5), slugs recalculés depuis `src/lib/slug.ts` réel, priorisation « parrainage {enseigne} » fondée sur le test empirique. La note est descendue à 8 pour une raison précise et corrigeable, pas pour un défaut de forme.

**Ce qui le sépare de 10/10 :**
- **[P1 — cohérence + fondement empirique] Le mot-clé principal crypto est le maillon faible du mapping.** `§3` (ligne 60) fixe pour la catégorie Crypto : principal = `parrainage exchange crypto`. Trois problèmes cumulés : (a) **anglicisme** (« exchange ») en tension avec le registre sobre et francophone de la marque (`brand-voice-guide.md` : « plateforme d'échange » est le terme employé côté copy) ; (b) **non testé** : les 11 requêtes du test empirique pour la crypto étaient « code parrainage Kraken » et « parrainage Meria », **jamais « exchange crypto »** — ce mot-clé principal est donc le seul du §3 qui ne repose sur aucune requête observée, contrairement à la promesse « intentions fondées sur le test empirique » ; (c) **non déployé** : la page catégorie crypto (fiches-categories §6 H1) porte « parrainage plateforme crypto », pas « exchange crypto ». Résultat : le mot-clé principal crypto n'existe ni dans la preuve, ni dans le contenu. **Owner : @seo (coordination @copywriter).** **Done : soit `parrainage plateforme crypto` (aligné copy + brand voice) devient le principal et `exchange` passe en variante, soit « exchange crypto » est justifié par une requête testée ET intégré au H1/title crypto. 0 mot-clé principal §3 sans ancrage empirique.**
- **[P2] Règle title/H1/P1 exact-match posée pour les offres (§2), pas pour les catégories.** Le §2 impose le mot-clé exact contigu en title/H1/P1 des 9 offres ; le §3 (catégories) ne pose pas la même exigence, mais les H1 catégorie cassent parfois le mot-clé exact (cf. section 3, finance perso). À clarifier : les mots-clés catégorie §3 sont-ils des cibles exact-match ou des cibles sémantiques ? **Owner : @seo.** **Done : §3 précise le niveau d'exigence (exact vs sémantique) pour les H1/title catégorie.**

## 5. `docs/seo/seo-strategy.md` — 9/10

Le livrable qui portait l'unique P1 du checkpoint, désormais **clos** (voir rappel en tête). Stratégie tranchée et argumentée : priorité absolue aux 9 pages offre (§1), catégories en maillage pur (§3), substitution intelligente du « blog obligatoire » (commandement 5) par la fraîcheur recalculée des fiches (§4/§7) — c'est l'un des meilleurs arbitrages de la phase, il transforme une contrainte de framework en cohérence produit. §7 « ce qui n'est PAS recommandé » = anti-invention exemplaire (pas de programmatic SEO, pas de blog générique).

**Ce qui le sépare de 10/10 :**
- **[P2 — dépendance tracée] `[HYPOTHÈSE]` Finary multi-catégories non levée.** `§4` marque correctement que Finary pourrait relever de plusieurs catégories, à trancher à l'extraction du xlsx (`data/base-parrainage-emmanuel-v3.xlsx`, illisible outils texte). Ce n'est plus une contradiction (00-index tranche « Gestion de patrimoine »), mais une dépendance DB non résolue. **Owner : @fullstack (extraction) + Emmanuel (confirmation).** **Done : mapping catégorie↔programme branché depuis un CSV/JSON source de vérité = 00-index 9/9, `[HYPOTHÈSE]` §4 levée.**
- **[P2] §6 ordre d'exécution recoupe audit-technique mais introduit une ambiguïté de title.** Voir section 6 (le point 1 de §6 renvoie à audit-technique §2, qui propose un format de title divergent de keyword-map §3). **Owner : @seo.**

## 6. `docs/seo/audit-technique.md` — 9/10

Le plus solide techniquement de la phase : audit de code réel exhaustif (14+ fichiers), 6 greps de preuve reproductibles, findings P0/P1/P2 en verbe+objet+critère, checklist multi-moteurs Google+Bing (§8), nuances factuelles honnêtes (Next 15.1.6 vs 15.5 non vérifiable sans node_modules, `Offer` sans `price` = attendu et non une erreur). Les 3 P0 Bing (canonicals, sitemap `lastModified`, mot-clé en title/H1) sont réels et correctement priorisés pour @fullstack en aval.

**Ce qui le sépare de 10/10 :**
- **[P2 — coordination inter-livrables] Format de title catégorie divergent de keyword-map.** `§2 finding 3` propose title `"Parrainage {catégorie} : offres vérifiées"` (gabarit générique), alors que `keyword-map.md §3` fixe des mots-clés catégorie **spécifiques** (« parrainage néobanque vérifié », « parrainage banque pro », « parrainage placement de trésorerie »…). @fullstack reçoit donc deux consignes de title incompatibles pour la même page. Exemple concret : pour la crypto, audit-technique dirait « Parrainage Crypto : offres vérifiées », keyword-map dirait « parrainage exchange crypto ». **Owner : @seo (arbitre entre les deux docs).** **Done : une seule règle de title catégorie (quel mot-clé exact va dans le `<title>` vs le H1 vs la description), cohérente entre audit-technique §2 et keyword-map §3.**
- **[P2] Schema `Person` Thomas/Emmanuel** (§4, E-E-A-T) laissé « à arbitrer avec @geo » et croisé avec geo-strategy §5 (`sameAs` absent). Décision non prise. **Owner : @geo + @ia.** **Done : décision tranchée (ajouter `Person`/`author` ou différer V2) écrite dans un des deux docs.**

## 7. `docs/copy/fiches-categories.md` — 8/10

Copy de très haute qualité : posture non-conseil stricte sur 6 catégories, chapô factuel + cadrage neutre + Q/R citables, mention de risque conditionnelle correctement appliquée par catégorie (recoupé `brand-voice-guide.md §5` : capital pour Investissement/Ramify, Gestion patrimoine/Finary, Placement/Spiko ; crypto pour Kraken/Meria ; factuelle pour Finance perso/TR et Services entrepreneur/Qonto-Revolut-Dougs = 6/6 conforme). Mapping 9/9 identique à 00-index. Zéro montant inventé, zéro superlatif, zéro classement (§5 « Parrainly ne compare pas »). La note descend à 8 pour un défaut d'intégration SEO réel, pas pour la qualité éditoriale.

**Ce qui le sépare de 10/10 :**
- **[P1 — cohérence keyword-map ↔ contenu] Le H1 crypto ne porte pas son mot-clé principal.** `§6` H1 = « Crypto : parrainage **plateforme crypto** et épargne programmée », annoté `[MOT-CLÉ SEO INTÉGRÉ : parrainage exchange crypto / parrainage plateforme crypto vérifié]`. Mais le H1 ne contient **ni** « exchange crypto » (le principal keyword-map §3), **ni** « parrainage plateforme crypto vérifié » entier (il manque « vérifié »). Le mot-clé principal de la catégorie n'est donc porté par aucun élément de la page. C'est le même nœud que le P1 de la section 4, vu côté contenu. **Owner : @copywriter + @seo (décision commune sur le mot-clé principal crypto).** **Done : H1 crypto porte le mot-clé principal retenu (contigu), annotation exacte.**
- **[P2] H1 finance perso casse le mot-clé exact.** `§1` H1 = « parrainage néobanque **et courtage** vérifiés » : le mot-clé principal keyword-map §3 « parrainage néobanque vérifié » n'est pas contigu (coupé par « et courtage »), et « vérifiés » (pluriel) ≠ « vérifié ». Acceptable si les mots-clés catégorie sont des cibles sémantiques (cf. section 4 P2), à confirmer. **Owner : @seo/@copywriter.** **Done : décision exact-match vs sémantique tranchée et H1 conforme à la règle retenue.**
- **[P2 — nuance, défendable] Finary : risque capital appliqué à une catégorie décrite comme « pas un service d'investissement ».** `§3` applique la mention capital tout en écrivant « elle ne constitue pas en elle-même un service d'investissement ». Choix conservateur assumé (aligné brand-voice §5 qui range la gestion de patrimoine dans le groupe capital). Pas un défaut, signalé pour traçabilité juridique. **Owner : @legal (confirmation).**

## 8. `docs/copy/faq-enrichie.md` — 9/10

18 Q/R autonomes et citables réparties en 6 thèmes, chaque réponse exacte hors contexte (exigence AEO tenue), question « meilleur parrainage » traitée par la négative (légitime, cohérent homepage §5), 0 doublon avec les 5 questions homepage, posture non-conseil parfaite (§6). Mécanisme d'attribution décrit au niveau utilisateur sans exposer d'implémentation. Prête pour structuration `FAQPage` par @geo.

**Ce qui le sépare de 10/10 :**
- **[P2 — note périmée] Handoff dit « keyword-map absent à ce jour ».** Le bloc Points d'attention indique « @seo intègre les mots-clés du futur `keyword-map.md` (absent à ce jour) » : `keyword-map.md` **existe désormais** (produit le même run). La note devrait être mise à jour, et surtout les intitulés des 18 questions gagneraient à porter les mots-clés/variantes keyword-map §2-3 (ex. « code parrainage Kraken ») pour maximiser la captation. **Owner : @copywriter (MàJ note) + @seo (mots-clés dans les intitulés).** **Done : handoff à jour, ≥ 1 mot-clé keyword-map par thème injecté dans les intitulés sans altérer le sens.**
- **[P2 — follow-up GEO, non bloquant] 18 Q/R pas encore rendues.** Ce contenu répond à geo-strategy §6 action 1 (FAQ par offre) mais reste un livrable doc : aucune page ne l'injecte encore en `faqPageJsonLd`. À tracer comme follow-up @copywriter/@fullstack, hors chemin critique de clôture. **Done : au moins la FAQ enrichie servie sur une page (accueil étendu ou `/divulgation`), bloc `FAQPage` injecté.**

## 9. Intégrations (slot homepage + 6 H1 catégorie) — 8/10

Vérification des points d'intégration réels : **0 placeholder résiduel** (`Grep "[(À REMPLIR|PLACEHOLDER|TODO|XX|INSÉRER|à compléter|à définir)"` sur `docs/{geo,seo,copy}/*.md` = **No matches found**). Le slot `[MOT-CLÉ SEO]` de homepage-copy §2 est rempli (`parrainage fintech vérifié`, = keyword-map §1 requête chapeau), et le mot-clé apparaît aussi dans le sous-titre hero (« chaque lien de parrainage fintech »). Les 6 H1 catégorie portent tous le mot « parrainage » (exigence Bing minimale d'audit-technique §2). C'est propre. La note descend à 8 à cause du seul vrai défaut d'intégration, concentré sur la crypto.

**Ce qui le sépare de 10/10 :**
- **[P1] Le défaut d'intégration = le mot-clé principal crypto** (sections 4 + 7) : keyword-map §3 dit `parrainage exchange crypto`, le H1 rendu dit « parrainage plateforme crypto ». Sur 6 H1, **5 portent leur mot-clé principal keyword-map §3 (contigu ou quasi), 1 (crypto) ne le porte pas**. Le checkpoint annonçait « 6/6 H1 = keyword-map §3 » : c'est en réalité 5/6 strict (le checkpoint avait lui-même substitué la variante pour la crypto). **Owner : @seo + @copywriter.** **Done : 6/6 H1 portent le mot-clé principal retenu, cohérent keyword-map §3 ↔ fiches-categories §1-6.**
- **[P2] Homepage H1 = tagline sans mot-clé transactionnel** (« Le parrainage, vérifié avant d'être cité »). Acceptable et voulu (page hub, intention marque/navigationnelle, keyword-map §1), le mot-clé est porté par le sous-titre et le §2. Signalé pour complétude, pas un défaut. **Done : n/a (conforme).**

---

## Contradictions inter-livrables

| Livrable A | Livrable B | Contradiction | Criticité | Résolution (owner) |
|---|---|---|---|---|
| `test-citation-ia.md` §6 | `test-citation-ia.md` §3 (tableau) | parrainage.co annoncé « 8/9 » vs cité sur 9/9 rangées du tableau | **P1** | Corriger §6 en « 9/9 » (session) |
| `geo-strategy.md` §1 | `test-citation-ia.md` §3 | parrainage.co « 8/9 » repris de l'erreur amont | **P1** | Corriger §1 en « 9/9 » en même temps (@geo) |
| `keyword-map.md` §3 (crypto) | `fiches-categories.md` §6 (H1) | Mot-clé principal `parrainage exchange crypto` absent du H1 rendu (« plateforme crypto ») | **P1** | Trancher le mot-clé principal crypto, aligner keyword-map ↔ H1 (@seo+@copywriter) |
| `keyword-map.md` §3 (crypto) | `test-citation-ia.md` §3 | `parrainage exchange crypto` n'est fondé sur aucune des 11 requêtes testées | **P1** | Mot-clé principal crypto = requête testée, ou justifier (@seo) |
| `audit-technique.md` §2.3 | `keyword-map.md` §3 | Title catégorie générique « Parrainage {catégorie} » vs mots-clés spécifiques | **P2** | Une seule règle de title catégorie (@seo) |
| `monitoring-citations.md` §2 #6 | `test-citation-ia.md` §3 | « Dougs parrainage (compta) » vs « Dougs (compta) », malgré claim « à l'identique » | **P2** | Aligner libellé ou reformuler le claim (@geo) |
| `faq-enrichie.md` (handoff) | `keyword-map.md` (existe) | Note « keyword-map absent à ce jour » périmée | **P2** | MàJ note + injecter mots-clés dans intitulés (@copywriter) |

Aucune contradiction P0. Aucun blocage de clôture Phase 3.

## Angles morts (objectif 6 mois)

- **Re-test post-déploiement non exécuté** (normal : site non déployé). Le baseline valide la thèse mais ne mesure pas la citation réelle de Parrainly. `monitoring-citations.md` le trace comme 1er cycle post-indexation. À rejouer pour transformer le baseline en G_PROOF de distribution complet. Non bloquant, à ne pas oublier.
- **Mot-clé principal crypto non empiriquement fondé** (déjà en P1 section 4) : c'est aussi un angle mort de couverture, car aucune requête « exchange crypto » ni « parrainage crypto » générique n'a été testée pour la catégorie (seulement les 2 programmes Kraken/Meria). Si le mot-clé catégorie crypto est conservé, un mini-test de la requête réelle est recommandé.
- **FAQ par offre + passages définition directe des pages catégorie non produits** (geo-strategy §6 actions 1-2-4) : la FAQ enrichie (18 Q/R) et les chapôs catégorie existent en doc mais ne sont pas encore injectés en `FAQPage`/rendus. Follow-up @copywriter/@fullstack, hors chemin critique.
- **Trade Republic + Kraken exposés dans le contenu** (fiches-categories §1 et §6) alors que `00-index.md` documente une **interdiction explicite de diffusion publique** de leur lien. Cohérent avec le CHOIX UTILISATEUR #3 (pilote exhaustif, revue juridique reportée) : ce n'est PAS une contradiction Phase 3, mais un point à **réarmer au gate juridique final** avant mise en ligne réelle. Vigilance, pas action Phase 3.
- **Décision `mainEntityOfPage` / schema `Person` / `sameAs`** (geo-strategy §5, audit-technique §4) laissée ouverte entre @geo/@ia/@fullstack : petit gain E-E-A-T non tranché, à statuer.

## Décisions à confirmer par Thomas/Emmanuel

1. **Mot-clé principal crypto** : `parrainage plateforme crypto` (aligné brand voice francophone, déjà dans le H1) ou `parrainage exchange crypto` (anglicisme actuel de keyword-map) ? Recommandation @reviewer : « plateforme crypto », plus cohérent avec le registre sobre de la marque et déjà déployé côté contenu. À trancher par @seo/Thomas.
2. **Mapping catégorie de Finary** : Gestion de patrimoine seul (00-index + copy tranchent) vs multi-catégories (`[HYPOTHÈSE]` seo §4) ? À confirmer à l'extraction du xlsx.
3. **Trade Republic + Kraken** : maintien en pilote confirmé (choix #3) ; arbitrage diffusion publique (retrait / CTA privé / publication assumée) reporté au gate juridique final. Rappel de vigilance, rien à décider maintenant.

## Synthèse : note globale + chemin ordonné vers 10/10

**Note globale Phase 3 : 8,7/10.** Phase de haute qualité, aucun P0 contenu, GO pour clôture. Le 10/10 se gagne en traitant, dans l'ordre :

1. **[P1] Corriger le décompte parrainage.co « 8/9 » → « 9/9 »** dans `test-citation-ia.md` §6 ET `geo-strategy.md` §1. **Critère : les deux fichiers = 9/9, recoupés au tableau test-citation §3. Owner : session + @geo.** (Correction de fond la plus rapide, elle restaure la rigueur G13 du document-socle.)
2. **[P1] Trancher et aligner le mot-clé principal crypto** sur les 3 fichiers : keyword-map §3 (principal), fiches-categories §6 (H1), audit-technique §2 (title/H1 recommandé). **Critère : un seul mot-clé principal crypto, fondé sur une requête testée, contigu dans le H1 rendu, annotation exacte. Owner : @seo + @copywriter.**
3. **[P1] Atteindre 6/6 H1 catégorie portant leur mot-clé principal** (aujourd'hui 5/6 : crypto manquant, finance perso non contigu). **Critère : keyword-map §3 ↔ fiches-categories §1-6 = 6/6, règle exact-match vs sémantique explicitée. Owner : @seo + @copywriter.**
4. **[P2] Trancher la règle de title catégorie** (audit-technique §2.3 vs keyword-map §3) pour ne pas laisser @fullstack avec deux consignes. **Critère : une règle unique title/H1/description catégorie. Owner : @seo.**
5. **[P2] Aligner le libellé de requête Dougs** (test-citation §3 ↔ monitoring §2 #6) ou reformuler le claim « recopiées à l'identique ». **Critère : cohérence des libellés ou claim honnête. Owner : session + @geo.**
6. **[P2] MàJ note handoff faq-enrichie** (keyword-map existe) + injecter ≥ 1 mot-clé keyword-map par thème dans les intitulés. **Critère : note à jour, intitulés enrichis sans altération de sens. Owner : @copywriter.**
7. **[P2] Statuer sur `mainEntityOfPage` / `Person` / `sameAs`** (fait / différé V2 / assigné). **Critère : décision écrite dans geo-strategy ou audit-technique. Owner : @geo + @ia.**

Après ces 7 actions, la Phase 3 atteint 10/10 sur les 9 livrables. Re-vérification @reviewer ciblée : uniquement les fichiers touchés (test-citation §6, geo-strategy §1, keyword-map §3, fiches-categories §6/§1, audit-technique §2), pas de re-audit complet.

---

### Vérifié (G_PROOF réel)

Reads et Greps réellement exécutés cette session (pas déclarés) :

```
Read  audit-phase2.md, checkpoint-phase3.md, project-context.md
Read  test-citation-ia.md, geo-strategy.md, monitoring-citations.md
Read  keyword-map.md, seo-strategy.md, audit-technique.md
Read  fiches-categories.md, faq-enrichie.md, homepage-copy.md
Read  00-index.md, brand-voice-guide.md
Grep  "parrainage\.co" test-citation-ia.md -n
      -> lignes 33-41 (tableau §3) = 9 rangées TOUTES avec parrainage.co ; §6 dit "8/9" -> ERREUR confirmée
Grep  "8/9" docs/geo -n
      -> geo-strategy.md:22 "un second (parrainage.co) sur 8/9" -> erreur propagée confirmée
Grep  "exchange" fiches-categories.md -n
      -> ligne 125 : H1 crypto = "parrainage plateforme crypto", annotation cite "exchange crypto" -> mot-clé principal absent du H1
Grep  "exchange crypto|plateforme crypto" keyword-map.md -n
      -> ligne 60 : principal = "parrainage exchange crypto", variante = "parrainage plateforme crypto vérifié"
Grep  "[(À REMPLIR|PLACEHOLDER|TODO|XX|INSÉRER|à compléter|à définir)" docs/{geo,seo,copy}/*.md
      -> No matches found -> 0 placeholder résiduel confirmé
Grep  "PCA-IA|Parrainages Confirmés" kpi-framework.md -n
      -> lignes 7,25 : "Parrainages Confirmés d'origine IA (PCA-IA) par mois" = NSM cité à l'identique par monitoring §7
Grep  "—" docs/copy -c
      -> 2/fichier sur fiches-categories/faq-enrichie/homepage (lignes 1 en-tête + 3 titre doc), 0 en client-facing rendu
Read  brand-voice-guide.md §5
      -> mentions de risque par groupe (capital / crypto / factuel) = 6/6 conformes à fiches-categories §1-6
```

Le P1 du checkpoint (seo-strategy §4) est vérifié CLOS. Les nouveaux écarts (parrainage.co 8/9, mot-clé crypto, coordination title) sont des trouvailles inédites de cet audit, non signalées au checkpoint.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/reviews/audit-phase3.md`
- Décisions prises : note globale Phase 3 = 8,7/10, GO clôture (0 P0 contenu). P1 checkpoint (seo §4) confirmé clos. 4 nouveaux écarts P1 identifiés (dont 1 erreur de décompte propagée sur 2 fichiers + 1 mot-clé principal crypto non fondé/non déployé), 3 P2.
- Points d'attention : agents à relancer pour le 10/10 = session (décompte parrainage.co §6 test-citation), @geo (décompte §1 geo-strategy + libellé Dougs monitoring), @seo + @copywriter (mot-clé principal crypto + 6/6 H1), @seo (règle title catégorie). Aucune correction appliquée aux livrables des autres (audit seul). Trade Republic/Kraken à réarmer au gate juridique final (choix #3, non bloquant Phase 3).
---
