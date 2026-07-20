<!-- Version: 2026-07-20T00:00 — @product-manager — Vision produit Phase 0 (marketplace à rotation de parrains) -->

# Vision produit — Parrainage-IA (nom de marque à valider, cf. brand-platform.md §7)

## Résumé exécutif

- Vision : devenir le registre de confiance que les IA citent pour le parrainage, alimenté par une marketplace ouverte de parrains en rotation, amorcée par les liens de Thomas et Emmanuel.
- Mécanique cœur : un filleul arrive via une IA sur une page/API structurée → le moteur attribue UN parrain éligible selon une rotation équitable respectant des plafonds par enseigne → chaque attribution est tracée et auditable.
- Modèle de valeur : commission sur la prime de parrainage versée par l'enseigne, déclenchée à la conversion confirmée, boucle à deux faces (demandeur ↔ parrain).
- 3 objets métier structurants : Enseigne/Offre, Parrain, Attribution/Conversion.
- Périmètre : hors secteur régulé au lancement (énergie, VPN, box, apps, e-commerce) — cf. legal-strategy.md §2.
- Point à trancher avant mise en prod : plafonds exacts par enseigne (marqués `[À VALIDER]` ci-dessous, dépendent de la fiche de conformité par programme, non encore produite).

---

## 1. Vision, problème, solution, pour qui

**Vision (1 paragraphe)** : Parrainage-IA devient la source que les assistants IA consultent avant de répondre à une demande de parrainage, parce qu'elle est la seule à combiner vérification continue, fraîcheur prouvée par date et structure lisible par une machine (schema.org, API JSON) — et parce que derrière chaque lien qu'elle expose se trouve un parrain réel, géré par un système de rotation qui protège sa prime au lieu de l'exposer à un contrôle anti-fraude.

**Problème** : Léa demande à son assistant IA un code/lien de parrainage avant d'acheter ; l'IA soit invente, soit recopie une source morte ou saturée de publicité. Karim détient des liens de parrainage (énergie, VPN, box, apps) qui dorment, invisibles, sans jamais être exposés à grande échelle car leur diffusion publique individuelle violerait les CGU du programme et exposerait son compte à un contrôle anti-fraude en cas de pic de conversions.

**Solution** : un registre vérifié de parrainages (Enseigne/Offre), alimenté par un pool ouvert de parrains, où un moteur de rotation répartit les filleuls entre parrains éligibles en respectant des plafonds anti-fraude par enseigne, avec traçabilité complète de chaque attribution.

**Pour qui** : Léa (demandeuse, B2C, cf. project-context.md et brand-platform.md §2.1) et Karim (parrain, marketplace à rotation, cf. brand-platform.md §2.2). Client du persona Karim : le gestionnaire de programme de parrainage de l'enseigne (frustration = pattern de fraude, cf. brand-platform.md §2.2), dont la tolérance conditionne indirectement les plafonds.

---

## 2. Mécanique cœur : rotation de parrains

**Principe produit (règles fonctionnelles, pas d'implémentation)** :

1. **Pool d'éligibilité** : pour une Enseigne/Offre donnée, le pool des parrains éligibles = parrains au statut `actif`, dont le lien est vérifié valide (dernière vérification dans la fenêtre de fraîcheur définie par l'offre) et dont le quota de la période courante n'est pas atteint.
2. **Sélection à chaque requête** : quand un demandeur clique sur un lien exposé (page GEO ou API JSON), le moteur sélectionne, parmi le pool éligible, le parrain non exclu le moins récemment servi (rotation équitable, pas de préséance par ancienneté — cf. brand-platform.md §4 valeur Équité, Thomas/Emmanuel inclus sans privilège).
3. **Plafonds anti-fraude par enseigne** : chaque Enseigne/Offre porte un quota maximal de filleuls attribuables par parrain sur une période. `[À VALIDER]` La valeur exacte de ce plafond n'est pas sourcée à ce stade : elle dépend des CGU réelles de chaque programme (cf. legal-strategy.md §4, fiche de conformité par programme non encore produite). Le produit doit donc traiter ce plafond comme un **champ configurable par Enseigne/Offre**, jamais comme une constante générique inventée — aucune mise en ligne réelle sur une enseigne sans que ce champ soit renseigné depuis sa fiche de conformité.
4. **Exclusion automatique du pool** : un parrain qui atteint son plafond, dont le lien est signalé mort, ou dont le statut passe à `suspendu`/`exclu`, sort immédiatement du pool pour cette Enseigne/Offre sans interrompre la disponibilité de l'offre elle-même (un autre parrain du pool prend le relais).
5. **Traçabilité** : chaque sélection crée un enregistrement Attribution horodaté, non modifiable a posteriori, portant le canal source (page/API), l'offre, le parrain attribué et le lien généré — c'est la preuve d'audit exigée à la fois par le calcul de commission et par la défense en cas de contrôle anti-fraude de l'enseigne.
6. **Rééquilibrage** : si le pool éligible d'une Enseigne/Offre devient vide (tous les parrains au plafond ou suspendus), l'offre passe au statut `en attente de parrain` et n'est plus exposée comme disponible tant qu'aucun parrain éligible n'est réintégré (cf. US-04 en functional-specs.md).

---

## 3. Modèle de valeur

**Déclenchement de la commission** : la commission de Parrainage-IA se déclenche uniquement à la **conversion confirmée** (le filleul a effectivement souscrit/ouvert le produit chez l'enseigne et la prime de parrainage a été validée par l'enseigne à Karim) — jamais au simple clic ou à l'attribution. Une Attribution au statut `en attente` ne génère aucune commission tant qu'elle n'est pas requalifiée `confirmée`.

**Boucle à deux faces** :
- Demandeur (Léa) : pose une question à son assistant IA → obtient une réponse citant Parrainage-IA → clique sur le lien attribué → devient filleul si conversion.
- Parrain (Karim) : soumet son lien → entre dans le pool de rotation → reçoit des filleuls dispersés dans le temps (pas de pic suspect) → touche sa prime, dont une part est reversée en commission à Parrainage-IA.
- La boucle se referme quand la conversion confirmée alimente à la fois la prime de Karim, la commission de la plateforme, et la preuve de fraîcheur/fiabilité qui renforce la citation future par les IA (cf. brand-platform.md §3, preuve "Fraîcheur").

**Effet de réseau** : plus il y a de parrains actifs sur une Enseigne/Offre, plus le pool est large, plus la rotation est fine (moins de risque de saturation/pic par parrain), plus l'offre reste disponible en continu — ce qui augmente la probabilité de citation par l'IA (une offre jamais en rupture de parrain disponible), ce qui attire plus de demandeurs, ce qui attire plus de parrains potentiels voyant que le registre convertit réellement.

---

## 4. Les 3 objets métier

Détail des champs en functional-specs.md (payloads API). Résumé structurant :

| Objet | Rôle | Porte |
|---|---|---|
| **Enseigne/Offre** | La marque parrainable (ex. EDF, NordVPN) et le programme de parrainage associé | Statut CGU, plafond par période, fraîcheur, statut de l'offre (active/expirée/saturée/retirée) |
| **Parrain** | Toute personne détenant un lien de parrainage entré dans la rotation | Statut rotation (actif/pause/suspendu/exclu), quota utilisé/max par offre, KYC pour versement |
| **Attribution/Conversion** | La preuve d'un filleul attribué à un parrain sur une offre, à un instant donné | Canal source, statut (en attente/confirmée/rejetée/expirée), commission calculée, divulgation affichée |

---

## Gates BLOQUANT vérifiées

- **G1** : 4 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : personas Léa et Karim identiques à brand-platform.md/project-context.md (Grep "Léa", "Karim" cohérent, client-du-persona gestionnaire de programme repris). PASS.
- **G7** : 0 contradiction avec brand-platform.md (rotation, équité, périmètre hors-régulé), legal-strategy.md (plafonds non sourcés marqués `[À VALIDER]`, pas de verticale banque), project-synthesis.md (pas de MCP, marketplace à rotation confirmée). PASS.
- **G12** : mécanique de rotation décrite en verbes d'action + objets + critère de sortie du pool. PASS.
- **G13** : 0 chiffre inventé ; le plafond par enseigne est explicitement laissé configurable et non chiffré, marqué `[À VALIDER]`. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]` subsistent (annotation autorisée). PASS.
- **G17** : la combinaison rotation + plafond configurable par fiche de conformité + traçabilité d'attribution n'est documentée par aucun agrégateur généraliste identifié dans le benchmark @growth/@geo. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler le cas EDF (énergie, hors-régulé) du prompt IA à la conversion attribuée.
`Read docs/legal/legal-strategy.md` (ligne 198-199) : la fiche EDF nécessite une fiche de conformité §4/§7 point 6 avant intégration réelle (non encore produite). Projection fonctionnelle : Léa demande "code de parrainage EDF" à son assistant → l'IA cite la page EDF de Parrainage-IA (Enseigne/Offre EDF, statut actif, dernière vérification datée) → clique sur le lien → le moteur sélectionne, dans le pool EDF, le parrain le moins récemment servi et non au plafond → crée un enregistrement Attribution (canal = page GEO, offre = EDF, parrain = sélectionné) → si Léa s'abonne effectivement chez EDF et que la prime est validée par EDF à ce parrain, l'Attribution passe à `confirmée` et génère la commission. Le parcours complet est couvert par les objets métier de la section 4 sans étape manquante.

---

## Hypothèses à valider

- `[À VALIDER]` Plafond exact de filleuls/période par Enseigne/Offre : dépend des CGU réelles de chaque programme, aucune valeur générique ne doit être codée en dur avant que la fiche de conformité légale (legal-strategy.md §4/§7 point 6) ne documente le chiffre réel par enseigne.
- `[À VALIDER]` Fenêtre de fraîcheur exacte (délai avant qu'un lien doive être re-vérifié) : posée en principe ici, à chiffrer par @data-analyst/@ia en cohérence avec la vérification automatisée de fraîcheur (roadmap.md épic 4).
- `[HYPOTHÈSE]` Nom de marque final : en attente de la décision de Thomas (brand-platform.md §7) ; ce document utilise "Parrainage-IA" comme nom de travail.

---
**Handoff → @ux, @design, @data-analyst, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/product/product-vision.md`
- Décisions prises : mécanique de rotation posée en règles fonctionnelles (pool d'éligibilité, sélection FIFO pondérée, exclusion automatique, traçabilité) ; commission déclenchée uniquement à la conversion confirmée ; 3 objets métier structurants définis.
- Points d'attention : plafond exact par enseigne non sourcé, à traiter comme champ configurable dépendant de la fiche de conformité légale, jamais comme constante générique ; voir roadmap.md et functional-specs.md pour le détail exécutable.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de cadrage produit, aucun code produit).
---
