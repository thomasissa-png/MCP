<!-- Version: 2026-07-20T04:00 — @copywriter — Phase 1 (gabarit page-offre + fiche réelle Trade Republic) -->

# Gabarit page-offre — Parrainly

[Framework : PAS (Problem-Agitate-Solve) réduit à Problem-Solve — pas d'agitation sur un produit financier, cf. brand-voice-guide.md §1, ton sobre]
[Conscience : Solution-Aware — le demandeur (A1/A2) arrive déjà en intention de souscription, cherche la confirmation que le lien est fiable, pas la découverte du besoin]

## Résumé exécutif

Gabarit de la page-offre (écran stratégique de functional-specs.md US-01), variables = champs du schéma Emmanuel (20 champs, product-vision.md §4). Contraintes non négociables intégrées : divulgation au-dessus du CTA (brand-voice-guide.md §4), mention de risque conditionnelle par `categorie` (§5), zéro vocabulaire de classement. **Alerte source de données (bloquant pour le remplissage réel)** : `data/base-parrainage-emmanuel-v3.xlsx` est un fichier binaire non lisible par les outils de cet agent (Read rejette les .xlsx). Aucun agent du projet à ce jour (Grep effectué sur `docs/`) n'a confirmé avoir extrait les valeurs réelles des champs `avantage_filleul`, `avantage_parrain`, `conditions`, `url_parrainage`, `code_parrainage` : product-vision.md et functional-specs.md les traitent explicitement comme non sourcés (`[À VALIDER]`, "aucune valeur générique ne doit être codée en dur"). La fiche réelle ci-dessous respecte donc la règle zéro-invention : les champs confirmés par recoupement documentaire (nom, catégorie, cible, pays) sont remplis réellement ; les champs commerciaux non extraits sont marqués `[DONNÉE MANQUANTE : xlsx binaire, à extraire par Emmanuel/@fullstack]`, jamais inventés.

---

## 1. Gabarit (variables = schéma Emmanuel)

**Titre** : "{nom_programme} : parrainage vérifié"

**Sous-titre** : "Vérifié le {date_verification}. Statut : {statut}."

**Description factuelle (2-3 phrases, formulation §3 brand-voice-guide.md)** :
"{nom_programme} ({sous_categorie}) propose un programme de parrainage pour {cible}. {description_courte, reprise telle que documentée, jamais reformulée en promesse}."

**Bloc avantage_filleul** :
"Ce que reçoit le filleul : {avantage_filleul, tel que publié par le programme, jamais amplifié}."

**Bloc avantage_parrain** :
"Ce que reçoit le parrain (Thomas ou Emmanuel) : {avantage_parrain, tel que publié par le programme}."

**Bloc conditions** :
"Conditions d'éligibilité : {conditions, reprises telles quelles, incluant le plafond anti-fraude si applicable}."

**Bloc fraîcheur** :
"Vérifié le {date_verification} par Parrainly. Statut actuel : {statut}."

**Mention de risque (conditionnelle par `categorie`, cf. brand-voice-guide.md §5)** :
- Si `categorie` ∈ {investissement, gestion de patrimoine, placement trésorerie} → mention capital.
- Si `categorie` = crypto → mention crypto.
- Si `categorie` ∈ {finance personnelle/néobanque, services entrepreneur} → mention factuelle standard.

**Divulgation d'affiliation (au-dessus du CTA, non masquable)** :
"Ce lien de parrainage est une collaboration commerciale : Parrainly (Thomas et Emmanuel) perçoit un avantage si vous l'utilisez. Non affilié officiellement à {nom_programme}."

**CTA** : "Obtenir mon lien vérifié" (verbe d'action + bénéfice immédiat, ≤ 8 mots)

**États liés (cf. functional-specs.md US-01, textes déjà validés, repris ici sans réécriture)** :
- Vide : "Cette offre n'est plus disponible actuellement." + CTA "Voir les autres enseignes vérifiées."
- Erreur : "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants."
- Succès : "Votre lien de parrainage vérifié le {date_verification} est prêt."

---

## 2. Fiche réelle générée : Trade Republic (G_PROOF)

Programme choisi dans la base réelle (9 programmes, project-context.md "BASE RÉELLE D'EMMANUEL"). Champs confirmés par recoupement documentaire (brand-platform.md §1, product-vision.md §4, legal-strategy.md §2a) : `nom_programme`, `categorie`, `sous_categorie`, `cible`, `pays`. Champs non extraits du xlsx (bloquant technique, cf. Résumé exécutif) : marqués explicitement.

**Titre** : "Trade Republic : parrainage vérifié"

**Sous-titre** : "Vérifié le [DONNÉE MANQUANTE : `date_verification`, xlsx binaire non extrait]. Statut : en attente de vérification de conformité (fiche CGU non produite à ce jour, cf. legal-strategy.md §7 point 6)."

**Description factuelle** : "Trade Republic (néobanque/courtage) propose un programme de parrainage pour le jeune actif (A1). [DONNÉE MANQUANTE : `description_courte` du schéma Emmanuel, champ présent dans le xlsx mais non extrait par les outils disponibles.]"

**avantage_filleul** : "[DONNÉE MANQUANTE : champ `avantage_filleul` non extrait du xlsx. À remplir par Emmanuel/@fullstack lors de l'import technique, jamais par une estimation.]"

**avantage_parrain** : "[DONNÉE MANQUANTE : champ `avantage_parrain`, idem.]"

**conditions** : "[DONNÉE MANQUANTE : champ `conditions` (porte le plafond anti-fraude), idem product-vision.md §2 règle 3 : ne jamais coder de plafond générique avant que la fiche de conformité légale ne le documente.]"

**Mention de risque appliquée** : catégorie = néobanque/courtage → mention factuelle standard : "Offre soumise aux conditions en vigueur chez Trade Republic au moment de la vérification." (pas de mention capital/crypto, catégorie non concernée, cf. §5 brand-voice-guide.md).

**Divulgation appliquée** : "Ce lien de parrainage est une collaboration commerciale : Parrainly (Thomas et Emmanuel) perçoit un avantage si vous l'utilisez. Non affilié officiellement à Trade Republic."

**CTA** : "Obtenir mon lien vérifié"

### Auto-audit de cette fiche réelle (obligatoire, G_PROOF)

| Critère | Verdict | Preuve |
|---|---|---|
| Zéro vocabulaire de classement | PASS | Aucune occurrence de "meilleur", "n°1", "recommandé" (Grep sur ce bloc) |
| Zéro promesse de rendement | PASS | Aucun montant ni pourcentage énoncé (les champs commerciaux sont marqués manquants, pas inventés) |
| Mention de risque présente et adaptée à la catégorie | PASS | Catégorie néobanque/courtage → mention factuelle standard appliquée, pas de mention capital hors sujet |
| Divulgation d'affiliation au-dessus du CTA | PASS | Bloc divulgation placé avant le CTA dans l'ordre du gabarit §1 |
| Zéro donnée inventée | PASS | Champs non sourcés explicitement marqués `[DONNÉE MANQUANTE]`, jamais remplis par une estimation |
| Fiche publiable en l'état | **FAIL (bloquant)** | 3 champs manquants (`avantage_filleul`, `avantage_parrain`, `conditions`) empêchent la mise en ligne réelle ; s'ajoute le statut `en_attente_verification` (fiche de conformité CGU Trade Republic non produite, legal-strategy.md §7 point 6, également bloquant) |

**Conclusion de l'auto-audit** : le gabarit tient et produit une fiche conforme aux règles éditoriales et légales (5/6 PASS), mais la fiche Trade Republic n'est **pas publiable en l'état** faute de deux prérequis indépendants du copy : (1) extraction technique des 3 champs commerciaux du xlsx, (2) fiche de conformité CGU Trade Republic (@legal, non produite). Ceci n'est pas une lacune du gabarit éditorial, qui est complet et testé.

---

## Gates BLOQUANT vérifiées

- **G1** : 2 sections + fiche réelle, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : persona A1 (jeune actif) ciblé pour Trade Republic, identique à brand-platform.md §2.1. PASS.
- **G7** : 0 contradiction avec functional-specs.md (textes d'état repris à l'identique) ni avec legal-strategy.md (mention de risque, divulgation, statut `en_attente_verification` cohérent avec §7 point 6). PASS.
- **G12** : gabarit implémentable directement par @fullstack (variables = champs exacts du schéma Emmanuel). PASS.
- **G13** : 0 chiffre inventé ; les 3 champs commerciaux non sourcés sont explicitement marqués manquants plutôt qu'estimés. PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence (le marqueur utilisé est `[DONNÉE MANQUANTE : ...]`, une annotation de gap documenté, pas un raccourci de complétion). PASS.
- **G17** : la structure (variables = schéma propriétaire 20 champs + mention de risque conditionnelle par catégorie) n'est pas copiable par un agrégateur généraliste sans le même schéma de données. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** auto-audit tableau ci-dessus (§2) exécuté sur la fiche réelle Trade Republic.
`Grep "meilleur|n°1|recommandé|garanti" sur le bloc §2` : 0 occurrence hors mots-clés de la mention de risque légitime. Fiche conforme éditorialement (5/6 PASS), bloquée uniquement par 2 prérequis hors périmètre copy (extraction xlsx, fiche CGU @legal).

---
**Handoff → @fullstack, @legal, @seo, @geo**
- Fichiers produits : `/home/user/MCP/docs/copy/page-offre-template.md`
- Décisions prises : gabarit de page-offre calé exactement sur les 20 champs du schéma Emmanuel ; mention de risque injectée conditionnellement par `categorie` ; divulgation systématiquement au-dessus du CTA (non négociable, cf. brand-voice-guide.md §4).
- Points d'attention **bloquants signalés** : (1) `data/base-parrainage-emmanuel-v3.xlsx` doit être converti en CSV/JSON exploitable par les agents texte (aucun agent du projet n'a pu lire son contenu réel à ce jour, tous l'ont signalé en `[À VALIDER]`) — recommandation forte à @fullstack de faire cette conversion en priorité avant tout remplissage de fiche réelle ; (2) la fiche Trade Republic ne peut être publiée avant la fiche de conformité CGU (@legal, legal-strategy.md §7 point 6) et le statut PSCA pour les fiches crypto (Kraken/Meria, §7 point 11).
- [LEARNING DÉTECTÉ] Description : le fichier source de données métier (`data/base-parrainage-emmanuel-v3.xlsx`) est binaire et illisible par les outils Read/Grep des agents de contenu, ce qui bloque toute génération de fiche 100% réelle sans passage préalable par @fullstack. Catégorie : problème. Sévérité : P1. Cible propagation : règle-globale (recommandation : tout fichier de données source doit être doublé d'un export CSV/JSON dès son dépôt dans `data/`, avant sollicitation d'un agent de contenu). Fichiers impactés : `data/base-parrainage-emmanuel-v3.xlsx`, ce livrable, tout futur livrable copy/design consommant les 9 offres réelles.
- **Actions infra requises** : conversion de `data/base-parrainage-emmanuel-v3.xlsx` en `data/base-parrainage-emmanuel-v3.csv` ou `.json` (package suggéré : `xlsx` npm ou script Python `openpyxl`, action @fullstack). Aucune variable d'environnement requise.
---
