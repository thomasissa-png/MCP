<!-- Version: 2026-07-20T04:00 — @ux — Parcours critiques V1 cercle fermé -->

# User flows — Parrainly (V1 cercle fermé T&E)

## Résumé exécutif

- 4 parcours critiques couvrant les 9 user stories de functional-specs.md : (1) demandeur A1/A2, de la citation IA à la redirection attribuée (US-01) ; (2) parrain T&E, enregistrer/actualiser une offre du catalogue (US-02, US-07) ; (3) parrain T&E, confirmer une conversion (US-09) ; (4) offre expirée/retirée, vue côté demandeur et côté système (US-04, impact sur US-01).
- Chaque parcours : diagramme textuel (étapes + décisions), 5 états UI, cognitive walkthrough (frictions taguées `[FRICTION H{n}]`), audit heuristique Nielsen 10 en PASS/FAIL avec évidence, métriques HEART, events analytics (repris tels quels de functional-specs.md, non redéfinis).
- 2 frictions non mitigées identifiées (H7 parcours 1 : absence de raccourci développeur visible vers l'API JSON ; H1 parcours 2 : pas d'indicateur de conflit en temps réel entre Thomas et Emmanuel sur la même offre) — corrections proposées, non bloquantes pour le lancement V1.
- Cohérence G7 : chaque état, chaque event, chaque message d'erreur est identique au texte exact de functional-specs.md (aucune reformulation qui introduirait une divergence pour @fullstack).

---

## Parcours 1 — Demandeur (A1/A2) : de la citation IA à la redirection attribuée

**Story source** : US-01 | **Persona** : A1 (jeune actif) ou A2 (entrepreneur) | **Déclencheur** : citation par un assistant IA sur la fiche `/offres/{slug}`, ou navigation directe depuis `/categories/{slug}`.

### Diagramme textuel

```
[Prompt IA : "code de parrainage Trade Republic"]
        │
        ▼
[Assistant cite /offres/trade-republic] ──(ou)── [Navigation directe via /categories/investissement]
        │
        ▼
[Chargement page-offre] → date_verification + statut affichés + divulgation visible AU-DESSUS du CTA
        │
        ▼
[Décision] Offre active avec pool ≥ 1 parrain éligible ?
   │NON → état VIDE : "Cette offre n'est plus disponible actuellement." + CTA catalogue → FIN (parcours 4)
   │OUI
   ▼
[Clic "Obtenir mon lien de parrainage"] → bouton désactivé, indicateur affiché (≤ 3s)
        │
        ▼
[Décision] Réponse moteur d'arbitrage (US-03) ?
   │pool_vide (409) / timeout (503) → état ERREUR : message exact + bouton "Réessayer" → retour étape précédente
   │201 (succès)
   ▼
[État SUCCÈS] lien affiché "https://{domaine}/r/{token}" + "Continuer vers [Enseigne]" + confirmation datée
        │
        ▼
[Clic "Continuer vers [Enseigne]"] → GET /r/{token} → event lien_redirection_suivie journalisé
        │
        ▼
[Décision] token valide ?
   │NON (404, expiré/inconnu) → page générique "Ce lien de parrainage n'est plus valide." (pas d'exposition de l'enseigne)
   │OUI → 301 vers la page de souscription officielle de l'enseigne → FIN parcours (hors Parrainly)
```

### 5 états UI (identiques à functional-specs.md US-01, non reformulés)

| État | Déclencheur | Contenu affiché |
|---|---|---|
| Défaut | Chargement initial de la fiche | Nom enseigne, statut "vérifié le [date]", CTA actif, divulgation au-dessus du CTA |
| Chargement | Clic sur le CTA | Bouton désactivé + indicateur, bascule auto en erreur à 3s |
| Vide | Aucune offre active | "Cette offre n'est plus disponible actuellement." + CTA "Voir les autres enseignes vérifiées" |
| Erreur | Timeout / pool vide au clic | "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." + bouton Réessayer |
| Succès | Attribution 201 | Lien affiché + "Continuer vers [Enseigne]" + "Votre lien de parrainage vérifié le [date] est prêt." |

### Cognitive walkthrough (first-time user, sans aide extérieure)

1. Le demandeur sait-il quoi faire en arrivant sur la fiche ? OUI — un seul CTA visible, pas de choix concurrent à l'écran (charge cognitive ≤ 3 actions : lire la fiche, lire la divulgation, cliquer le CTA).
2. L'action est-elle visible ? OUI — CTA unique, contrasté, positionné après la lecture des conditions (pas de CTA au-dessus du contenu qui pousserait à cliquer sans lire les conditions/le risque, cf. contrainte CTA de conviction en fin de parcours).
3. Le lien but→action est-il clair ? OUI — le libellé "Obtenir mon lien de parrainage" nomme exactement ce que le demandeur cherchait dans son prompt IA.
4. Le feedback est-il immédiat ? OUI pour le clic (désactivation + indicateur immédiats) ; `[FRICTION H1]` : à l'étape de redirection finale (clic "Continuer vers [Enseigne]"), le demandeur quitte Parrainly sans confirmation visuelle du succès de la journalisation (`lien_redirection_suivie`) avant le 301 — il ne peut jamais savoir si son clic a été comptabilisé. Solution : aucune action UI requise (le 301 est volontairement immédiat, cf. functional-specs.md), mais documenter dans `/comment-ca-marche` que la traçabilité est côté serveur, pour ne pas laisser un doute au demandeur qui reviendrait vérifier.
5. `[FRICTION H7]` : le développeur/power-user qui voudrait consommer directement `/api/v1/offres/{id}` n'a aucun lien visible depuis la page-offre vers l'équivalent JSON. Solution : ajouter un lien discret en pied de fiche "Voir la donnée structurée (JSON)" — non bloquant, priorité basse (canal secondaire, roadmap.md épic 6 = Should).

### Audit heuristique Nielsen 10

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état système | PASS | 5 états explicitement définis, indicateur de chargement borné à 3s (functional-specs.md US-01 état Loading) |
| H2 | Adéquation système/monde réel | PASS | Vocabulaire A1/A2 repris tel quel : "vérifié le", "prime de bienvenue", "lien de parrainage actif" (brand-platform.md §2.1) |
| H3 | Contrôle et liberté utilisateur | PASS | État vide/erreur propose toujours un CTA de sortie vers le catalogue général, jamais d'impasse |
| H4 | Cohérence et standards | PASS | Le pattern CTA + divulgation + date se répète à l'identique sur les 9 pages-offre (aucune variation ad hoc par programme) |
| H5 | Prévention des erreurs | PASS | Double-clic idempotent (1 seule Attribution, critère 6 US-01), bouton désactivé pendant le traitement |
| H6 | Reconnaissance plutôt que rappel | PASS | Statut et date de vérification toujours affichés à l'écran, le demandeur n'a rien à retenir d'une visite précédente |
| H7 | Flexibilité et raccourcis experts | FAIL | `[FRICTION H7]` ci-dessus : aucun raccourci visible vers l'API JSON pour un usage développeur/power-user |
| H8 | Esthétique et minimalisme | PASS (sous condition @design) | Contrainte explicite brand-platform.md §7 : éviter tout code visuel "site de bons plans" ; dépend de la composition visuelle livrée par @design, non validable ici seul |
| H9 | Messages d'erreur clairs avec solution | PASS | Messages exacts fournis avec bouton d'action ("Réessayer") sur les 2 cas d'erreur |
| H10 | Aide et documentation en contexte | PASS (sous condition wireframe) | Lien contextuel vers `/confiance-et-verification` requis depuis la fiche (voir wireframes.md) |

### Métriques HEART

| Dimension | Signal observable | Cible | Méthode |
|---|---|---|---|
| Task success | Taux de génération de lien réussie (201) / total clics CTA | ≥ 90% (défaut framework) | `lien_parrainage_genere` / `lien_parrainage_demande` (tracking-plan.md) |
| Adoption | Taux de clic effectif sur le lien généré (`lien_redirection_suivie` / `lien_parrainage_genere`) | `[À VALIDER — pas de trafic actuel, cf. kpi-framework.md, 0 cible interne chiffrée à ce stade]` | Plausible/PostHog |
| Task success | Complétion du parcours critique (citation IA → redirection) | ≥ 90% (défaut framework, cf. ux.md) | Funnel `page_offre_vue` → `lien_redirection_suivie` |

### Events analytics (repris de functional-specs.md US-01, non redéfinis)

`page_offre_vue`, `lien_parrainage_demande`, `lien_parrainage_genere`, `lien_parrainage_echec`, `offre_indisponible_affichee`, `lien_redirection_suivie`.

---

## Parcours 2 — Parrain T&E : enregistrer/actualiser une offre du catalogue

**Story source** : US-02 (enregistrement/actualisation) + US-07 (validation de conformité) | **Persona** : Thomas ou Emmanuel (opérateur back-office) | **Déclencheur** : connexion à `/parrain/catalogue`, clic "Ajouter/Modifier" sur une des 9 lignes.

### Diagramme textuel

```
[Thomas ou Emmanuel se connecte à /parrain/catalogue] (session admin T&E)
        │
        ▼
[Liste des 9 offres] statut / propriétaire / date_verification par ligne
        │
        ▼
[Clic "Modifier" sur une offre, ex. Trade Republic]
        │
        ▼
[Formulaire : url_parrainage/code_parrainage, conditions (plafond), statut]
        │
        ▼
[Clic "Enregistrer"] → bouton désactivé (idempotence double-clic, critère 7)
        │
        ▼
[Décision] Validation serveur ?
   │format_lien_invalide (400) → ERREUR : "Ce lien ne correspond pas au format attendu pour ce programme." champs conservés
   │plafond_manquant (400) sur tentative d'activation → bloqué : "Le plafond doit être renseigné avant activation."
   │OK (200)
   ▼
[SUCCÈS] "Offre enregistrée. Statut : [statut]." + liste mise à jour immédiatement
        │
        ▼
[Décision] Statut visé = actif sur programme régulé (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria) ?
   │Fiche de conformité absente → US-07 : bouton "Valider" bloqué, avertissement "Fiche de conformité manquante pour ce programme"
   │Fiche de conformité référencée → offre passe actif → éligible au moteur d'arbitrage (US-03) → visible en public sur /offres/{slug}
```

### 5 états UI

| État | Déclencheur | Contenu affiché |
|---|---|---|
| Défaut | Ouverture de `/parrain/catalogue` | Liste des 9 offres, statut, propriétaire, date_verification |
| Chargement | Clic "Enregistrer" | Indicateur bref (≤ 2s) |
| Vide | N/A | Import initial exhaustif des 9 offres, jamais de catalogue vide en V1 (justifié functional-specs.md US-02) |
| Erreur | Format de lien non reconnu | "Ce lien ne correspond pas au format attendu pour ce programme." + champs conservés |
| Succès | Enregistrement 200 | "Offre enregistrée. Statut : [statut]." |

### Cognitive walkthrough (first-time user T&E, sans aide extérieure)

1. Thomas/Emmanuel sait-il où enregistrer son propre lien vs celui de l'autre ? OUI si le formulaire affiche explicitement "votre lien" en distinguant les deux instances Parrain d'une même offre (critère 2 US-02, deux entrées coexistantes) — `[FRICTION H1]` : rien dans les specs n'exige d'affichage temps réel si l'autre opérateur modifie la même offre en parallèle (le critère 7 gère seulement le double-clic du MÊME opérateur, pas la collision entre Thomas ET Emmanuel sur le même programme). Solution : afficher "Dernière modification par [Thomas/Emmanuel] le [date]" sur chaque ligne pour rendre visible une modification concurrente, sans bloquer (2 personnes seulement, faible probabilité, non bloquant V1).
2. L'action de blocage anti-fraude (plafond obligatoire) est-elle compréhensible ? OUI — message direct, non technique.
3. Le lien vers la fiche de conformité manquante est-il actionnable ou juste un mur ? `[FRICTION H5]` : le critère 9 de US-07 bloque sans indiquer QUI produit la fiche ni où. Solution wireframe (voir wireframes.md, back-office) : le message bloquant inclut un lien "Voir la checklist de conformité" vers la référence interne (legal-strategy.md §7 point 6), pas un blocage muet.

### Audit heuristique Nielsen 10

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état système | FAIL | `[FRICTION H1]` ci-dessus : pas de signal de modification concurrente entre Thomas et Emmanuel |
| H2 | Adéquation système/monde réel | PASS | Vocabulaire "plafond", "vérifié", "statut" repris du schéma Emmanuel, connu des deux opérateurs |
| H3 | Contrôle et liberté | PASS | Formulaire conserve les champs saisis en cas d'erreur (critère 4), aucune perte de saisie |
| H4 | Cohérence | PASS | Même structure de formulaire pour les 9 programmes, seuls les champs `conditions` varient par programme |
| H5 | Prévention des erreurs | PASS (avec réserve) | Blocage d'activation sans plafond (garde-fou anti-fraude, critère 5) ; réserve `[FRICTION H5]` sur la clarté du chemin de résolution |
| H6 | Reconnaissance plutôt que rappel | PASS | Statut et date affichés en liste, pas besoin de se souvenir de l'état précédent |
| H7 | Flexibilité experts | PASS | Import initial automatisé depuis `data/base-parrainage-emmanuel-v3.xlsx`, pas de ressaisie manuelle exigée (functional-specs.md note @fullstack) |
| H8 | Esthétique et minimalisme | PASS | Back-office = outil interne à 2 opérateurs, pas de sur-design requis (cohérent brand-platform ton sobre) |
| H9 | Messages d'erreur avec solution | PASS | Message exact + action de correction implicite (corriger le champ signalé) |
| H10 | Aide contextuelle | PASS (sous condition wireframe) | Lien vers la checklist de conformité requis au point de blocage (voir `[FRICTION H5]`) |

### Métriques HEART

| Dimension | Signal observable | Cible | Méthode |
|---|---|---|---|
| Task success | Taux d'enregistrement réussi (200) / tentatives | ≥ 90% | `offre_mise_a_jour` / (`offre_mise_a_jour` + `offre_mise_a_jour_echec`) |
| Happiness | CSAT déclaratif de Thomas/Emmanuel sur la clarté du back-office | ≥ 8/10 (défaut framework) | Entretien direct (2 utilisateurs connus, pas de sondage à grande échelle nécessaire) |

### Events analytics (repris de functional-specs.md US-02/US-07)

`offre_mise_a_jour`, `offre_mise_a_jour_echec`, `offre_activee`, `offre_validee_conformite`, `offre_bloquee_conformite`.

---

## Parcours 3 — Parrain T&E : confirmer l'attribution d'une conversion

**Story source** : US-09 | **Persona** : Thomas ou Emmanuel | **Déclencheur** : clic "Confirmer la conversion" depuis `/parrain/attributions`, sur une ligne au statut `en_attente` avec `date_redirection` renseignée.

### Diagramme textuel

```
[Thomas/Emmanuel ouvre /parrain/attributions]
        │
        ▼
[Décision] Des Attributions en_attente existent-elles ?
   │NON → état VIDE : "Aucune conversion à confirmer pour le moment." (pas une erreur)
   │OUI
   ▼
[Liste des Attributions en_attente] bouton actif SEULEMENT si date_redirection renseignée
        │
        ▼
[Clic "Confirmer la conversion"] → saisie date_conversion_declaree (+ montant optionnel)
        │
        ▼
[Décision] date_redirection nulle ? → bouton grisé + info-bulle "Aucun clic enregistré sur ce lien pour le moment." (garde-fou anti-fraude de base)
        │ (sinon, envoi)
        ▼
[Chargement ≤ 2s]
        │
        ▼
[Décision] Garde-fou de plausibilité (confirmations ≤ redirections suivies sur 30 jours glissants) ?
   │Dépassé → statut "en_verification_manuelle" → SUCCÈS partiel : "Confirmation reçue, en cours de vérification." (motif non exposé)
   │Respecté → statut "confirmée" → SUCCÈS : "Confirmation enregistrée. Votre prime estimée a été mise à jour." → US-05 tableau de bord mis à jour
        │
        ▼
[Décision] Fenêtre de conversion 60 jours dépassée (US-09 critère 9) ?
   │OUI → refus, statut "expiree", message "Le délai de confirmation pour cette attribution est dépassé."
```

### 5 états UI

| État | Déclencheur | Contenu affiché |
|---|---|---|
| Défaut | Liste des Attributions en_attente | Bouton actif si date_redirection renseignée, sinon grisé + info-bulle |
| Chargement | Après clic Confirmer | Indicateur ≤ 2s |
| Vide | Aucune Attribution en_attente | "Aucune conversion à confirmer pour le moment." (état normal) |
| Erreur | Service indisponible | "Votre confirmation n'a pas pu être enregistrée. Réessayez." + bouton Réessayer |
| Succès | Confirmation acceptée ou mise en vérification | "Confirmation enregistrée..." ou "Confirmation reçue, en cours de vérification." |

### Cognitive walkthrough

1. Thomas/Emmanuel comprend-il pourquoi un bouton est grisé ? OUI — info-bulle explicite liée au clic réel (`date_redirection`), pas un blocage muet.
2. `[FRICTION H9]` : quand la confirmation bascule en `en_verification_manuelle` (garde-fou de plausibilité), le motif exact n'est jamais exposé (volontaire, anti-contournement). Le parrain peut légitimement se demander s'il y a un bug plutôt qu'un garde-fou. Solution : le message "Confirmation reçue, en cours de vérification." doit être complété par un lien contextuel générique "En savoir plus sur la vérification des confirmations" pointant vers `/confiance-et-verification`, sans jamais révéler le seuil exact (cohérent avec la note @legal de US-09 : ne jamais présenter le garde-fou comme un dispositif anti-fraude infaillible en communication externe, mais Thomas/Emmanuel restent des utilisateurs internes, pas le public — l'explication peut être un peu plus directe pour eux que sur une page publique).
3. Le lien entre l'action (confirmer) et le bénéfice (prime mise à jour) est-il visible immédiatement ? OUI — le message de succès référence directement la mise à jour du tableau de bord (US-05).

### Audit heuristique Nielsen 10

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état système | PASS | 5 états couvrant vide/chargement/erreur/2 variantes de succès |
| H2 | Adéquation système/monde réel | PASS | "conversion", "prime estimée" = vocabulaire T&E (brand-platform.md §2.3) |
| H3 | Contrôle et liberté | PASS | Aucune confirmation n'est irréversible côté UI avant traitement ; audit possible a posteriori par US-07 |
| H4 | Cohérence | PASS | Même pattern de bouton actif/grisé que US-02 (dépendance à une condition serveur) |
| H5 | Prévention des erreurs | PASS | Impossible de confirmer une Attribution sans redirection suivie (garde-fou de base, critère 5) |
| H6 | Reconnaissance plutôt que rappel | PASS | La liste affiche directement les Attributions éligibles, pas besoin de mémoriser un identifiant |
| H7 | Flexibilité experts | PASS | Montant de commission optionnel (peut être complété plus tard), pas de saisie bloquante forcée |
| H8 | Esthétique et minimalisme | PASS | 3 champs de saisie maximum (attribution, date, montant optionnel) |
| H9 | Messages d'erreur avec solution | FAIL | `[FRICTION H9]` ci-dessus : motif de la vérification manuelle non exposé, risque de confusion bug/garde-fou |
| H10 | Aide contextuelle | PASS (avec correction H9) | Lien vers `/confiance-et-verification` à ajouter (voir solution H9) |

### Métriques HEART

| Dimension | Signal observable | Cible | Méthode |
|---|---|---|---|
| Task success | Taux de confirmation directe (`confirme_direct`) / total confirmations soumises | `[À VALIDER — pas de donnée réelle, seuil de plausibilité lui-même à chiffrer, tracking-plan.md §2.7]` | `attribution_confirmee` (propriété `resultat`) |
| Retention | Fréquence de consultation de `/parrain/attributions` par T&E | Qualitatif (2 utilisateurs connus, pas de cible statistique pertinente à ce volume) | `dashboard_parrain_vu` (proxy) |

### Events analytics (repris de functional-specs.md US-09)

`attribution_confirmee` (propriétés : attribution_id, parrain_id, offre_id, delai_confirmation_jours, montant_commission, mode_confirmation, resultat).

---

## Parcours 4 — Offre expirée ou retirée (vue demandeur + logique système)

**Story source** : US-04 (retrait automatique), impact direct sur US-01 (état vide) | **Persona** : A1/A2 (côté vue), système (côté logique) | **Déclencheur** : job de vérification de fraîcheur, ou pool de parrains T&E saturé au moment d'une requête.

### Diagramme textuel

```
[Job de vérification de fraîcheur s'exécute] (planifié, ou déclenché manuellement par T&E)
        │
        ▼
[Décision] Date de fin de validité dépassée ? OU lien signalé mort après re-tentatives `[À VALIDER seuil]` ? OU pool T&E vide (tous au plafond/suspendus) ?
   │OUI (au moins une condition) → offre passe "expirée" ou "en attente de parrain"
   │NON → offre reste "actif", rien ne change pour le demandeur
        │
        ▼
[Demandeur A1/A2 arrive sur /offres/{slug} d'une offre non-active]
        │
        ▼
[État VIDE] "Cette offre n'est plus disponible actuellement." + CTA "Voir les autres enseignes vérifiées" → /categories/{slug-categorie-proche}
        │
        ▼
[Cas limite] Job échoue techniquement ? → fail-safe : statut précédent conservé, RIEN n'est retiré par erreur (critère 4 US-04), échec journalisé pour investigation
        │
        ▼
[Réactivation] Un opérateur T&E (US-07) réactive manuellement après faux positif → offre repasse "actif" immédiatement, redevient consultable
```

### 5 états UI (côté demandeur, sur la page-offre concernée)

| État | Déclencheur | Contenu affiché |
|---|---|---|
| Défaut | N/A pour une offre non-active : l'état par défaut EST l'état vide décrit ci-dessous | — |
| Chargement | Chargement de la page pendant la vérification du statut serveur | Indicateur bref, même comportement que parcours 1 |
| Vide | Offre "expirée" ou "en attente de parrain" | "Cette offre n'est plus disponible actuellement." + CTA vers le catalogue |
| Erreur | N/A — le job de fraîcheur échoue en fail-safe côté serveur, jamais exposé comme une erreur au demandeur (critère 4 US-04, transparence : le demandeur voit soit actif soit vide, jamais un message technique) | — |
| Succès | Réactivation par un opérateur T&E | La page repasse immédiatement à l'état Défaut du parcours 1 (aucun état "succès" dédié côté demandeur, transition invisible) |

### Cognitive walkthrough

1. Le demandeur comprend-il pourquoi l'offre a disparu (page indexée par une IA, mais devenue vide) ? OUI dans la mesure où le message est présent et propose une alternative immédiate — `[FRICTION H1 bis]` : si l'IA a cité l'URL avec l'ancienne promesse ("500€ offerts chez Kraken") dans sa réponse textuelle, le demandeur peut arriver déçu/confus car la promesse citée ne correspond plus à ce qu'il voit. Solution : cette divergence n'est pas corrigible côté Parrainly (contenu généré par un tiers, l'IA) — cf. legal-strategy.md §3 sur la non-maîtrise du rendu IA — mais le message vide doit explicitement confirmer que l'offre A EXISTÉ ("Cette offre n'est plus disponible actuellement.") plutôt qu'un message ambigu de type 404, pour rassurer que ce n'est pas une erreur de lien.
2. Le CTA de sortie mène-t-il vers une alternative pertinente (même catégorie) ? À spécifier : le CTA "Voir les autres enseignes vérifiées" doit pointer vers `/categories/{categorie-de-l-offre-retiree}`, pas vers l'accueil générique (voir wireframes.md).

### Audit heuristique Nielsen 10

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état système | PASS | État vide explicite et distinct du chargement/erreur |
| H2 | Adéquation système/monde réel | PASS | "n'est plus disponible" plutôt qu'un code d'erreur technique |
| H3 | Contrôle et liberté | PASS | CTA de sortie systématique vers le catalogue |
| H4 | Cohérence | PASS | Même traitement visuel qu'un état vide standard du design system (à valider avec @design) |
| H5 | Prévention des erreurs | PASS | Fail-safe côté job (critère 4 US-04) : jamais de retrait erroné visible côté demandeur |
| H6 | Reconnaissance plutôt que rappel | PASS | Rien à mémoriser, le message est autoporteur |
| H7 | Flexibilité experts | N/A | Pas de raccourci pertinent pour un état d'indisponibilité |
| H8 | Esthétique et minimalisme | PASS | Un seul message + un seul CTA, pas de surcharge |
| H9 | Messages d'erreur avec solution | PASS | CTA de solution immédiat (catalogue alternatif) |
| H10 | Aide contextuelle | FAIL | `[FRICTION H10]` : aucun lien vers `/confiance-et-verification` pour expliquer POURQUOI une offre disparaît (la fraîcheur retire volontairement les offres mortes, c'est une preuve de qualité, pas un bug) — solution : ajouter un lien discret "Pourquoi cette offre a disparu ?" sur l'état vide |

### Métriques HEART

| Dimension | Signal observable | Cible | Méthode |
|---|---|---|---|
| Task success | Taux de rebond vers une offre alternative depuis un état vide | `[À VALIDER — pas de donnée réelle]` | `offre_indisponible_affichee` suivi d'un `page_offre_vue` sur une autre offre dans la même session |
| Retention (preuve de fraîcheur, brand-platform.md §3) | Délai moyen entre expiration réelle et retrait effectif de l'offre | `[À VALIDER — seuil de fraîcheur non chiffré, tracking-plan.md]` | `offre_expiree_auto`, `offre_en_attente_parrain` |

### Events analytics (repris de functional-specs.md US-04)

`offre_expiree_auto`, `offre_en_attente_parrain`, `lien_invalide_detecte`, `offre_indisponible_affichee` (US-01).

---

## Recommandation d'agents spécialisés

| Agent | Type | Rôle | Justification liée au parcours | Priorité | 
|---|---|---|---|---|
| testeur-persona A1/A2 | Testeur | Rejouer le parcours 1 avec un vrai prompt IA de bout en bout (pas seulement la page, le prompt lui-même) | Aucun test empirique de citation IA réelle n'a encore été exécuté (G_PROOF empirique signalé comme trou par @reviewer, project-context.md) | Haute |
| testeur-persona T&E | Testeur | Rejouer les parcours 2 et 3 en conditions réelles (vraies offres, vrai plafond) et challenger le garde-fou de plausibilité (`[FRICTION H9]`) | Thomas et Emmanuel sont les vrais utilisateurs, le test est directement exécutable sans persona fictif | Haute |
| validateur accessibilité WCAG 2.2 AA | Expertise | Vérifier cibles tactiles ≥ 44px, contrastes, navigation clavier complète sur les 4 parcours avant mise en prod | Aucun audit d'accessibilité formel n'a encore été réalisé sur ces parcours (dépend de l'implémentation @fullstack/@design) | Moyenne |

→ Handoff @agent-factory pour instruction des 2 testeurs-persona si non déjà couverts par functional-specs.md (déjà recommandés, priorité confirmée ici sur la base des frictions détectées).

---

## Gates BLOQUANT vérifiées

- **G1** : 4 parcours + résumé exécutif + recommandation d'agents, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff présent en fin de document. PASS.
- **G5** : personas A1/A2/Thomas/Emmanuel identiques à brand-platform.md §2.1-2.3, aucun résidu Léa/Karim. PASS.
- **G7** : chaque état, message d'erreur et event repris mot pour mot de functional-specs.md (US-01, US-02, US-04, US-07, US-09) ; endpoints identiques (`/r/{token}`, `/api/v1/offres/{enseigne_id}/attribution`, `/api/v1/parrains/{parrain_id}/attributions/{attribution_id}/confirmation`). 0 contradiction. PASS.
- **G12** : chaque parcours a diagramme + 5 états + frictions + events, actionnable par @fullstack/@design sans question de flux. PASS.
- **G13** : 0 chiffre inventé ; les seuils non chiffrés (`[À VALIDER]`) sont repris tels quels de functional-specs.md/tracking-plan.md, jamais complétés par une valeur inventée ici. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]` subsistent (annotation autorisée). PASS.
- **G17** : la combinaison des 4 parcours (arbitrage à 2 identités visible dans le parcours 2, garde-fou de plausibilité non exposé dans le parcours 3, fraîcheur comme preuve UX explicite dans le parcours 4) n'est pas un flow SaaS générique copiable sans adapter au modèle cercle fermé T&E. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler le parcours 1 sur une offre réelle (Trade Republic) du prompt IA à la redirection attribuée.
Un demandeur A1 demande "code de parrainage Trade Republic" à ChatGPT → l'assistant cite `/offres/trade-republic` (information-architecture.md §2, URL stable mono-offre) → la page affiche `date_verification` et le statut "vérifié" au-dessus du CTA, divulgation d'affiliation visible avant tout clic (contrainte non négociable, cf. wireframes.md) → clic sur "Obtenir mon lien de parrainage" → `Read docs/product/functional-specs.md` US-01 critère 1 confirme une réponse en moins de 2 secondes avec un parrain attribué entre Thomas et Emmanuel (US-03) → lien `https://{domaine}/r/{token}` affiché avec confirmation datée → clic sur "Continuer vers Trade Republic" → event `lien_redirection_suivie` journalisé avant le 301 vers la page de souscription officielle (US-01 critère 3). Les 5 états UI et les 6 events du parcours 1 s'enchaînent sans étape manquante, identiques à functional-specs.md.

---
**Handoff → @design, @copywriter, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/ux/user-flows.md`
- Décisions prises : 4 parcours critiques couvrant les 9 user stories ; diagrammes textuels + 5 états + audit Nielsen 10 + cognitive walkthrough + métriques HEART par parcours ; 2 frictions non mitigées documentées avec solution proposée (raccourci API JSON parcours 1, exposition du motif de vérification manuelle parcours 3).
- Points d'attention : `[FRICTION H1]` (pas de signal de modification concurrente T&E, parcours 2), `[FRICTION H5]` (chemin de résolution de la fiche de conformité manquante non explicite, parcours 2), `[FRICTION H9]` (motif du garde-fou de plausibilité non exposé, parcours 3, à traiter avec prudence car @legal interdit de présenter le garde-fou comme infaillible), `[FRICTION H10]` (absence de lien explicatif sur l'état vide, parcours 4). Voir wireframes.md pour la traduction en zones d'écran.
- Agents spécialisés recommandés : testeur-persona A1/A2, testeur-persona T&E, validateur accessibilité WCAG 2.2 AA (tableau dédié).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de parcours, aucun code produit). Pour @fullstack : le lien contextuel de résolution H5/H9/H10 et le lien API JSON H7 sont des ajouts de contenu, pas d'architecture, à intégrer lors de l'implémentation des wireframes.md.
---

