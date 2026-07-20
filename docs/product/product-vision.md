<!-- Version: 2026-07-20T03:00 — @product-manager — CORRECTIF D'ALIGNEMENT C7 (personas canoniques A1/A2) -->

<!-- DIFF vs version 2026-07-20T02:00 :
1. G5/G7 repassés de PARTIAL à PASS : le persona demandeur "Jeune actif"/"Entrepreneur" déjà utilisé dans ce document est désormais confirmé identique aux personas canoniques A1/A2 livrés par brand-platform.md §2.1/2.2 (plus de résidu "Léa" en attente ailleurs, cf. functional-specs.md corrigé en parallèle).
2. Hypothèse "persona demandeur définitif" marquée résolue.
-->

<!-- DIFF vs version 2026-07-20T00:00 :
1. Le modèle n'est plus une marketplace ouverte amorcée par T&E, mais un cercle FERMÉ où le Parrain = T&E exclusivement en V1 (2 identités, 9 offres réelles). La mécanique "rotation" (section 2) devient un "arbitrage" entre les liens de T&E, dimensionné et testable (2 parrains, pas un pool hypothétique).
2. Les 3 objets métier (section 4) sont réécrits : "Enseigne/Offre" devient "Programme/Offre" et adopte le schéma de données réel d'Emmanuel (onglet Schema_MCP, 20 champs) au lieu d'un schéma générique inventé.
3. Le périmètre n'est plus "hors secteur régulé" : les verticales sont celles de la base réelle (finance personnelle, investissement, gestion de patrimoine, placement trésorerie, services entrepreneur, crypto — banques incluses). Télécom/Énergie/Mobilité passent en "à venir".
4. Marque = Parrainly (tranché, project-context.md CHOIX #2), remplace le nom de travail "Parrainage-IA" en usage commercial.
5. Ouverture à des parrains externes = V2 explicite, documentée en fin de section 2 comme trajectoire, pas comme mécanique V1.
-->

# Vision produit — Parrainly (V1 cercle fermé Thomas & Emmanuel)

## Résumé exécutif

- Vision : devenir le registre de confiance que les IA citent pour le parrainage fintech/entrepreneurial, en V1 alimenté exclusivement par les 9 offres réelles et les liens de Thomas et Emmanuel (cercle fermé), avec une architecture pensée pour ouvrir à des parrains tiers en V2.
- Mécanique cœur V1 : un filleul arrive via une IA sur une page/API structurée → le moteur arbitre entre les liens disponibles de T&E pour ce programme, en respectant les plafonds propres à chaque programme → chaque attribution est tracée et auditable.
- Modèle de valeur : commission sur la prime de parrainage versée par le programme, déclenchée à la conversion confirmée, boucle à deux faces (demandeur ↔ T&E en V1, parrain tiers en V2).
- 3 objets métier structurants : Programme/Offre (schéma Emmanuel, 20 champs), Parrain (= T&E exclusivement en V1), Attribution/Conversion.
- Périmètre V1 : les 6 catégories actives de la base réelle (finance personnelle/néobanque, investissement, gestion de patrimoine, placement trésorerie, services entrepreneur, crypto) — banques et fintech INCLUSES, ce ne sont plus un ajout différé. Télécom/Énergie/Mobilité = catégories "à venir", pas encore de programme réel disponible.
- Point à trancher avant mise en prod : plafonds exacts par programme (marqués `[À VALIDER]` ci-dessous, dépendent de la fiche de conformité par programme, non encore produite) ; réévaluation de legal-strategy.md par @legal en configuration cercle fermé (signalée, pas faite dans ce document).

---

## 1. Vision, problème, solution, pour qui

**Vision (1 paragraphe)** : Parrainly devient la source que les assistants IA consultent avant de répondre à une demande de parrainage fintech/entrepreneurial, parce qu'elle est la seule à combiner vérification continue, fraîcheur prouvée par date et structure lisible par une machine (schema.org, API JSON) — et parce que derrière chaque lien qu'elle expose se trouve un parrain réel (Thomas ou Emmanuel en V1), géré par un système d'arbitrage qui protège sa prime au lieu de l'exposer à un contrôle anti-fraude.

**Problème** : le demandeur (le jeune actif A1 ou l'entrepreneur A2, évaluant néobanque, courtage, investissement, crypto régulé, banque pro, compta — personas canoniques livrés par brand-platform.md §2.1/2.2) interroge son assistant IA avant d'ouvrir un compte Trade Republic, Qonto ou de placer sa trésorerie ; l'IA soit invente un lien, soit recopie une source morte. Thomas et Emmanuel détiennent 9 liens de parrainage réels (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko) qui dorment, invisibles, sans jamais être exposés à grande échelle car leur diffusion publique individuelle violerait les CGU du programme et exposerait leur compte à un contrôle anti-fraude en cas de pic de conversions.

**Solution V1** : un registre vérifié des 9 offres réelles (Programme/Offre), alimenté exclusivement par les liens de T&E (cercle fermé, pas de pool ouvert), où un moteur d'arbitrage répartit les filleuls entre les liens disponibles de T&E en respectant des plafonds anti-fraude par programme, avec traçabilité complète de chaque attribution. L'architecture des objets métier (section 4) est conçue pour être étendue à un pool de parrains tiers en V2, sans réécriture.

**Pour qui** : le demandeur ("le jeune actif A1" / "l'entrepreneur A2", personas canoniques livrés par brand-platform.md §2.1/2.2) et T&E (Thomas et Emmanuel), qui sont en V1 les seuls parrains du registre, pas un persona marketplace générique. Client indirect en V1 : aucun (T&E sont les fondateurs, pas un tiers à convaincre) ; redevient pertinent en V2 sous la forme du gestionnaire de programme de l'émetteur (frustration = pattern de fraude, cf. brand-platform.md §2.4 projection Karim ; non traité ici, hors mandat de ce corrective).

---

## 2. Mécanique cœur V1 : arbitrage entre les liens de T&E

**Principe produit (règles fonctionnelles, pas d'implémentation)** :

1. **Pool d'éligibilité (V1 = 2 identités maximum)** : pour un Programme/Offre donné, le pool des parrains éligibles = parmi Thomas et Emmanuel, ceux dont le lien pour ce programme est au statut `actif`, vérifié valide (dernière vérification dans la fenêtre de fraîcheur définie par l'offre) et dont le quota de la période courante n'est pas atteint. Un programme peut n'avoir qu'un seul détenteur (ex. un seul de T&E a un lien Kraken) : le pool est alors réduit à 1, ce qui est un cas normal en V1, pas une anomalie.
2. **Sélection à chaque requête** : quand un demandeur clique sur un lien exposé (page GEO ou API JSON), le moteur sélectionne, parmi le pool éligible, le parrain (T&E) non exclu le moins récemment servi (arbitrage équitable, pas de préséance entre Thomas et Emmanuel — cf. brand-platform.md §4 valeur Équité). Si le pool ne contient qu'un seul détenteur pour ce programme, il est sélectionné par défaut tant qu'il reste éligible.
3. **Plafonds anti-fraude par programme** : chaque Programme/Offre porte un quota maximal de filleuls attribuables par parrain sur une période. `[À VALIDER]` La valeur exacte de ce plafond n'est pas sourcée à ce stade : elle dépend des CGU réelles de chaque programme (cf. legal-strategy.md §4, fiche de conformité par programme non encore produite — et non encore réévaluée par @legal en configuration cercle fermé, cf. diff en tête de document). Le produit doit donc traiter ce plafond comme un **champ configurable par Programme/Offre** (correspond au champ `conditions` du schéma Emmanuel, section 4), jamais comme une constante générique inventée — aucune mise en ligne réelle sur un programme sans que ce champ soit renseigné depuis sa fiche de conformité.
4. **Exclusion automatique du pool** : un parrain (T&E) qui atteint son plafond sur un programme, dont le lien est signalé mort, ou dont le statut passe à `suspendu`, sort immédiatement du pool pour ce Programme/Offre sans interrompre la disponibilité de l'offre elle-même SI l'autre détient également un lien actif pour ce même programme (sinon, cf. règle 6).
5. **Traçabilité** : chaque sélection crée un enregistrement Attribution horodaté, non modifiable a posteriori, portant le canal source (page/API), l'offre, le parrain attribué (T&E) et le lien généré — c'est la preuve d'audit exigée à la fois par le calcul de commission et par la défense en cas de contrôle anti-fraude du programme.
6. **Rééquilibrage** : si le pool éligible d'un Programme/Offre devient vide (le ou les détenteurs T&E sont tous au plafond ou suspendus pour ce programme), l'offre passe au statut `en attente de parrain` et n'est plus exposée comme disponible tant qu'aucun des deux ne redevient éligible (cf. US-04 en functional-specs.md).
7. **Trajectoire V2 (non développée en V1)** : cette mécanique est délibérément conçue pour être étendue à un pool de N parrains sans changer le modèle de données (le pool passe de "T&E" à "tout parrain actif") : c'est le chantier "Élargissement du pool de rotation" documenté dans roadmap.md section 4.

---

## 3. Modèle de valeur

**Déclenchement de la commission** : la commission de Parrainly se déclenche uniquement à la **conversion confirmée** (le filleul a effectivement souscrit/ouvert le produit chez le programme et la prime de parrainage a été validée par le programme au parrain T&E) — jamais au simple clic ou à l'attribution. Une Attribution au statut `en attente` ne génère aucune commission tant qu'elle n'est pas requalifiée `confirmée`.

**Boucle à deux faces (V1 = boucle fermée sur T&E)** :
- Demandeur : pose une question à son assistant IA → obtient une réponse citant Parrainly → clique sur le lien attribué → devient filleul si conversion.
- Parrain (Thomas ou Emmanuel) : son lien pour un programme est déjà enregistré au catalogue (pas de soumission ouverte en V1) → reçoit des filleuls arbitrés dans le temps entre les deux (pas de pic suspect sur un seul lien) → touche sa prime, dont une part est reversée en commission à Parrainly.
- La boucle se referme quand la conversion confirmée alimente à la fois la prime du parrain, la commission de la plateforme, et la preuve de fraîcheur/fiabilité qui renforce la citation future par les IA (cf. brand-platform.md §3, preuve "Fraîcheur").

**Effet de réseau (V1 limité, V2 amplifié)** : en V1, l'effet de réseau est contraint par le nombre de parrains (2, T&E) : la disponibilité continue d'un programme dépend de ce que T&E détiennent effectivement un lien actif dessus (ex. si ni Thomas ni Emmanuel n'ont de lien Meria valide, l'offre Meria passe `en attente de parrain`). C'est un effet de réseau volontairement réduit en V1 (pas un pool qui grossit), documenté comme limite connue plutôt que comme risque caché. L'effet de réseau complet (plus de parrains → moins de saturation → disponibilité continue → plus de citations IA → plus de demandeurs → plus de parrains) ne se déploie qu'à l'ouverture V2 (roadmap.md section 4).

---

## 4. Les 3 objets métier

**Programme/Offre adopte le schéma de données réel d'Emmanuel** (`data/base-parrainage-emmanuel-v3.xlsx`, onglet Schema_MCP, 20 champs) — ce modèle n'est pas réinventé, il est repris tel quel comme structure canonique de l'objet, y compris pour l'API JSON (section suivante) et le contenu structuré (schema.org).

| Objet | Rôle | Champs (Programme/Offre : les 20 champs du schéma Emmanuel) |
|---|---|---|
| **Programme/Offre** | Le programme de parrainage réel (ex. Trade Republic, Qonto) tel que documenté par Emmanuel | `id`, `nom_programme`, `categorie` (enum : finance personnelle/néobanque, investissement, gestion de patrimoine, placement trésorerie, services entrepreneur, crypto ; catégories "à venir" : télécom, énergie, mobilité), `sous_categorie`, `cible` (jeune actif / entrepreneur), `pays`, `langue`, `url_parrainage`, `code_parrainage`, `description_courte`, `avantage_filleul`, `avantage_parrain`, `conditions` (porte notamment le plafond anti-fraude, cf. section 2 règle 3), `statut`, `priorite_affichage`, `tags_mcp` (conservé tel quel comme nom de champ existant dans la base d'Emmanuel, malgré l'abandon du protocole MCP — champ de taxonomie interne, pas un tool MCP), `date_ajout`, `date_verification` (alimente la vérification de fraîcheur, roadmap.md épic 4), `source`, `notes`. |
| **Parrain** | En V1 : exclusivement Thomas et Emmanuel (2 identités fixes, pas d'inscription). En V2 : tout parrain entré via l'onboarding (roadmap.md section 4) | Statut par lien/programme (actif/pause/suspendu), quota utilisé/max par Programme/Offre (dérivé du champ `conditions`), identité (T&E en V1, KYC pour versement en V2 uniquement). |
| **Attribution/Conversion** | La preuve d'un filleul attribué à un parrain (T&E) sur une offre, à un instant donné | Canal source, statut (en attente/confirmée/rejetée/expirée), commission calculée, divulgation affichée. Inchangé par ce corrective (déjà conforme au gap signalé par @data-analyst, cf. historique project-context.md). |

---

## Gates BLOQUANT vérifiées

- **G1** : 4 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : PASS — le persona "Parrain" est désormais nommément T&E (Thomas et Emmanuel), identique à project-context.md CHOIX #2 point 1/3. Le persona demandeur utilise "le jeune actif (A1)" / "l'entrepreneur (A2)", personas canoniques désormais livrés et alignés avec brand-platform.md §2.1/2.2 (corrective d'alignement 2026-07-20, @product-manager) — plus de prénom générique résiduel.
- **G7** : 0 contradiction avec project-context.md CHOIX #2 (autorité) ; désormais 0 contradiction avec brand-platform.md sur le persona demandeur (A1/A2 alignés §2.1/2.2). Reste une contradiction connue et non cachée avec legal-strategy.md (périmètre hors-régulé, banques exclues du V1), qui n'a pas encore été refresh par son agent — signalé en "Points à valider", hors mandat @product-manager de corriger. PASS pour ce document, sans réserve persona.
- **G12** : mécanique d'arbitrage décrite en verbes d'action + objets + critère de sortie du pool. PASS.
- **G13** : 0 chiffre inventé ; le plafond par programme est explicitement laissé configurable et non chiffré, marqué `[À VALIDER]` ; les 9 programmes et le schéma à 20 champs sont repris tels quels de project-context.md. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]` subsistent (annotation autorisée). PASS.
- **G17** : la combinaison arbitrage à 2 identités + schéma de données propriétaire à 20 champs + traçabilité d'attribution + trajectoire V1→V2 documentée n'est reproductible par aucun agrégateur généraliste identifié dans le benchmark @growth/@geo. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler le cas Trade Republic (programme réel de la base Emmanuel, catégorie finance personnelle/néobanque) du prompt IA à la conversion attribuée.
`Read project-context.md` section "BASE RÉELLE D'EMMANUEL" confirme Trade Republic comme l'un des 9 programmes réels du catalogue V1. Projection fonctionnelle : un demandeur (jeune actif) demande "code de parrainage Trade Republic" à son assistant → l'IA cite la page Trade Republic de Parrainly (Programme/Offre au statut `actif`, dernière `date_verification` affichée) → clique sur le lien → le moteur d'arbitrage sélectionne, entre Thomas et Emmanuel (celui des deux qui détient un lien Trade Republic actif et non au plafond, ou le moins récemment servi si les deux en détiennent un), le parrain à attribuer → crée un enregistrement Attribution (canal = page GEO, offre = Trade Republic, parrain = T ou E) → si le demandeur ouvre effectivement un compte chez Trade Republic et que la prime est validée par Trade Republic au parrain attribué, l'Attribution passe à `confirmée` et génère la commission. Le parcours complet est couvert par les objets métier de la section 4 (Programme/Offre au schéma Emmanuel, Parrain=T&E, Attribution/Conversion) sans étape manquante.

---

## Hypothèses à valider

- `[À VALIDER]` Plafond exact de filleuls/période par Programme/Offre (champ `conditions` du schéma Emmanuel) : dépend des CGU réelles de chaque programme, aucune valeur générique ne doit être codée en dur avant que la fiche de conformité légale ne documente le chiffre réel par programme.
- `[À VALIDER]` Fenêtre de fraîcheur exacte (délai avant qu'un lien doive être re-vérifié) : posée en principe ici, à chiffrer par @data-analyst/@ia en cohérence avec la vérification automatisée de fraîcheur (roadmap.md épic 4).
- `[À VALIDER]` legal-strategy.md doit être réévalué par @legal en configuration "cercle fermé, liens personnels de T&E" (project-context.md CHOIX #2 le signale explicitement) : le profil de risque diffère d'une marketplace à commission tierce, notamment pour les 6 programmes régulés (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria).
- Persona demandeur définitif : RÉSOLU — "le jeune actif (A1)" et "l'entrepreneur (A2)" sont désormais les personas canoniques livrés par @creative-strategy (brand-platform.md §2.1/2.2), repris à l'identique dans ce document et dans functional-specs.md (corrective d'alignement 2026-07-20).

---
**Handoff → @ux, @design, @data-analyst, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/product/product-vision.md`
- Décisions prises : mécanique d'arbitrage V1 posée en règles fonctionnelles (pool à 2 identités T&E, sélection pondérée, exclusion automatique, traçabilité) ; commission déclenchée uniquement à la conversion confirmée ; 3 objets métier structurants redéfinis, Programme/Offre adoptant explicitement le schéma Emmanuel à 20 champs.
- Points d'attention : plafond exact par programme non sourcé, à traiter comme champ configurable (`conditions`) dépendant de la fiche de conformité légale, jamais comme constante générique ; persona demandeur désormais aligné sur "le jeune actif (A1)" / "l'entrepreneur (A2)" (brand-platform.md §2.1/2.2, corrective d'alignement 2026-07-20) ; legal-strategy.md reste à refresh suite à CHOIX #2 (signalé, pas corrigé ici) ; voir roadmap.md et functional-specs.md pour le détail exécutable.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de cadrage produit, aucun code produit).
---
