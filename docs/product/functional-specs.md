<!-- Version: 2026-07-20T03:00 — @product-manager — CORRECTIF D'ALIGNEMENT C7 (personas canoniques A1/A2) -->

<!-- DIFF vs version 2026-07-20T02:00 :
1. Persona demandeur "Léa" (OBSOLÈTE, shopper générique) remplacé partout par "le jeune actif (A1)" ou "l'entrepreneur (A2)" selon le sens de chaque scénario (parrainage grand public/investissement/crypto → A1 ; contexte banque pro/compta → A2), conformément aux personas canoniques de brand-platform.md §2.1/2.2.
2. Exemple résiduel hors-catalogue "offre VPN du catalogue" (scénario 2, US-01) remplacé par un exemple fintech réel (offre bancaire pro, ex. Revolut Business).
3. Résidu "Parrainage-IA" (ancien nom commercial) corrigé en "Parrainly" (scénario 1, US-01).
4. Gates G5/G7 repassés de PARTIAL à PASS sans réserve persona ; hypothèse et notes de handoff sur le persona en attente supprimées/mises à jour car résolues.
-->

<!-- DIFF vs version 2026-07-20T01:00 :
1. US-02 (onboarding/soumission de parrain externe) est RETIRÉE du V1 et déplacée en V2 (cf. roadmap.md section 4). Elle est remplacée par une nouvelle US-02 V1, allégée : "Gérer le catalogue des 9 offres et l'arbitrage T&E" (back-office, template allégé, pas de formulaire d'inscription tiers).
2. Persona Parrain : "Thomas (ou Emmanuel)" (persona marketplace fictif) est remplacé par "Thomas" ou "Emmanuel" (personnes réelles, project-context.md), conformément à l'objet Parrain=T&E en V1. C'est une réduction d'invention, pas un ajout : plus de persona fictif à imaginer côté parrain en V1.
3. Persona demandeur : le prénom "Léa" est CONSERVÉ comme identifiant de continuité dans ce document (le renommage complet n'est pas demandé par ce corrective et est explicitement le mandat de @creative-strategy, cf. project-context.md CHOIX #2 point 4 — Léa marquée OBSOLETE en attendant le persona définitif "Jeune actif"/"Entrepreneur"). Signalé comme point à valider, pas résolu ici.
4. Toutes les enseignes d'exemple (Trade Republic, Qonto, Ramify) sont remplacées par des programmes réels de la base Emmanuel (Trade Republic, Qonto, Ramify, etc.), conformément à la correction verticales (fintech/finance/crypto/entrepreneur, banques incluses).
5. L'objet Offre est explicitement rattaché au schéma Emmanuel (20 champs) dans les sections Données et champs concernées.
6. Marque = Parrainly (remplace "Parrainage-IA" en usage commercial dans ce document).
-->

# Specs fonctionnelles — Parrainly (V1 cercle fermé Thomas & Emmanuel)

## Résumé exécutif

- 9 user stories : US-01 (demandeur, template complet), US-02 REFONDUE en V1 (gestion interne du catalogue par T&E, template allégé — l'onboarding parrain externe est reporté en V2, cf. roadmap.md section 4), US-03/US-04 (moteur d'arbitrage T&E et fraîcheur, template allégé), US-05 à US-09 (couverture, template allégé où pertinent).
- Triage par complexité appliqué : les stories sans UI (moteur d'arbitrage, retrait automatique) utilisent le template allégé (JTBD + critères + payload + events).
- L'objet Offre de toutes les stories suit le schéma Emmanuel à 20 champs (id, nom_programme, categorie, sous_categorie, cible, pays, langue, url_parrainage, code_parrainage, description_courte, avantage_filleul, avantage_parrain, conditions, statut, priorite_affichage, tags_mcp, date_ajout, date_verification, source, notes) — détaillé en product-vision.md §4, référencé ici plutôt que dupliqué.
- Checklist de couverture du parcours (§ fin de document) : chaque point de la checklist bloquante a une story ou une exclusion documentée avec raison business, y compris l'onboarding parrain désormais explicitement V2.
- Divulgation d'affiliation traitée comme exigence produit non négociable (US-01, DoD transversal), conformément à legal-strategy.md §3 (à réévaluer par @legal en config cercle fermé, signalé).
- DoR/DoD en fin de document pour que @fullstack code sans poser de question.

---

## US-01 : Consulter une offre et récupérer un lien de parrainage attribué

**Persona** : le jeune actif (A1) | **Epic** : Catalogue d'offres + Moteur de rotation/attribution | **Dépendances** : US-03 (moteur d'attribution), Épic 1 roadmap.md (pages de conformité, divulgation embarquée) | **RICE : R5/I5/C4 → 100**

#### Job-to-be-done
En tant que le jeune actif (A1), je veux consulter la fiche de parrainage d'une enseigne et récupérer un lien attribué afin d'obtenir un parrainage vérifié sans chercher ailleurs (lié au KPI North Star : parrainages confirmés attribués à une réponse IA/mois).

#### Contexte de navigation
Origine : citation par un assistant IA (lien direct vers la page enseigne) ou accès direct au catalogue. Déclencheur : clic sur le lien cité par l'IA, ou clic sur le CTA "Obtenir mon lien de parrainage" depuis la fiche enseigne. Destination succès : lien attribué affiché sous la forme `https://{domaine}/r/{token}` (token dans le CHEMIN de l'URL, pas en query param — survit à la copie/troncature, cf. tracking-plan.md §2.2) ; le clic sur ce lien passe par l'endpoint de redirection tracké `GET /r/{token}`, qui journalise l'event `lien_redirection_suivie` puis exécute un 301 vers la page de souscription officielle de l'enseigne. Destination échec : message "Aucune offre disponible" avec CTA vers le catalogue général.

#### Données et champs
N/A — story sans saisie (page de consultation, le jeune actif (A1) ne remplit aucun champ). Données affichées : nom enseigne, date de dernière vérification, statut de l'offre, mention de divulgation d'affiliation (obligatoire, non masquable).

#### 5 états UI
- **Défaut** : fiche enseigne affichée avec statut "vérifié le [date]", CTA "Obtenir mon lien de parrainage" actif, mention de divulgation visible au-dessus du CTA.
- **Loading** : après clic CTA, bouton désactivé + indicateur de chargement, durée max 3 secondes avant bascule automatique en état erreur.
- **Vide** : aucune offre active pour l'enseigne demandée (expirée/saturée) → message exact "Cette offre n'est plus disponible actuellement." + CTA "Voir les autres enseignes vérifiées" vers le catalogue.
- **Erreur** : échec de génération du lien (timeout moteur, pool vide au moment du clic) → message exact "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." + bouton "Réessayer".
- **Succès** : lien attribué affiché avec bouton "Continuer vers [Enseigne]" + confirmation "Votre lien de parrainage vérifié le [date] est prêt."

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given une offre Trade Republic active avec au moins un parrain éligible dans le pool, When le jeune actif (A1) clique sur "Obtenir mon lien de parrainage", Then le moteur attribue un parrain et affiche un lien unique en moins de 2 secondes.
2. (Happy path) Given le jeune actif (A1) arrive via un lien cité par un assistant IA sur la fiche Trade Republic, When la page se charge, Then la date de dernière vérification et le statut "vérifié" s'affichent au-dessus du lien, avec la mention de divulgation d'affiliation visible sans clic supplémentaire.
3. (Happy path) Given un lien attribué généré sous la forme `https://{domaine}/r/{token}`, When le jeune actif (A1) clique sur le lien "Continuer vers [Enseigne]" (donc atteint l'endpoint `GET /r/{token}`), Then l'event `lien_redirection_suivie` est journalisé (token, attribution_id, referrer capturé à cet instant) et il est redirigé en 301 vers la page de souscription officielle de l'enseigne, même si le clic survient plusieurs heures ou jours après la génération du lien (ex. lien copié-collé depuis un autre appareil).
4. (Erreur) Given aucune offre valide pour l'enseigne demandée (offre expirée), When le jeune actif (A1) charge la page, Then le message exact "Cette offre n'est plus disponible actuellement." s'affiche avec le CTA vers le catalogue.
5. (Erreur) Given le moteur d'attribution est indisponible ou en timeout, When le jeune actif (A1) clique sur "Obtenir mon lien de parrainage", Then après 3 secondes maximum le message exact "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." s'affiche avec un bouton "Réessayer".
6. (Cas limite — double-clic) Given le jeune actif (A1) clique deux fois rapidement sur "Obtenir mon lien de parrainage", When le second clic survient avant la fin du traitement du premier, Then une seule Attribution est créée et un seul lien est affiché (le bouton est désactivé pendant le traitement).
7. (Cas limite — timeout) Given la génération du lien dépasse 3 secondes, When le délai est atteint, Then l'UI bascule automatiquement en état erreur (jamais de chargement infini).
8. (Permissions) Given le jeune actif (A1) n'a pas de compte (parcours B2C anonyme), When il consulte la page et récupère un lien, Then aucune authentification n'est requise et aucun identifiant civil n'est collecté (cohérent avec legal-strategy.md §6a, minimisation RGPD).
9. (Données existantes) Given l'offre Trade Republic existe déjà avec 3 parrains éligibles dans le pool et une première Attribution a eu lieu le matin même, When le jeune actif (A1) (deuxième visite le même jour) récupère un lien l'après-midi, Then le parrain attribué peut différer du premier tour selon la rotation FIFO (pas nécessairement le même parrain à chaque requête).

#### Payload API
- `POST /api/v1/offres/{enseigne_id}/attribution` — création d'une Attribution et génération du lien.
- Auth : aucune (accès anonyme, cohérent avec le parcours B2C sans compte).
- Rate limit : `[À VALIDER par @infrastructure]` — à définir selon la capacité serveur ; recommandation qualitative : limiter par IP/session pour prévenir la génération abusive de liens (protection anti-fraude), valeur exacte non inventée ici.
- Request : `{ "enseigne_id": string, "canal_source": "page_web" | "api_json", "session_id": string (anonyme, non lié à une identité civile) }`
- Response 201 : `{ "attribution_id": string, "lien_genere": string (URL de la forme https://{domaine}/r/{token}), "parrain_id_attribue": string (interne, jamais exposé côté front), "date_verification_offre": string (ISO 8601) }`
- Response 404 : offre inexistante ou expirée → `{ "error": "offre_indisponible" }`
- Response 409 : pool éligible vide au moment de la requête → `{ "error": "pool_vide" }`
- Response 503 : moteur d'attribution indisponible/timeout → `{ "error": "moteur_indisponible" }`

**Endpoint de redirection trackée (ajout corrective 2026-07-20)** :
- `GET /r/{token}` — endpoint public de redirection, séparé de l'endpoint d'attribution ci-dessus (celui-ci ne fait QUE générer le lien, celui-là trace le clic réel dessus).
- Auth : aucune (accès public, comme le lien lui-même).
- Response : 301 vers l'URL de souscription officielle de l'enseigne, après journalisation de l'event `lien_redirection_suivie` (référentiel du token → `attribution_id` via la table `attribution`, tracking-plan.md §2.4).
- Response 404 : token inconnu ou déjà expiré (fenêtre de conversion dépassée, cf. US-09 critère 9) → `{ "error": "token_invalide" }`, redirection vers une page générique "Ce lien de parrainage n'est plus valide." (pas d'exposition de l'enseigne d'origine pour éviter le fingerprinting du catalogue).

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `page_offre_vue` | Chargement de la fiche enseigne | enseigne_id, canal_source (page/API), referrer | Awareness |
| `lien_parrainage_demande` | Clic sur "Obtenir mon lien de parrainage" | enseigne_id, session_id anonyme | Considération |
| `lien_parrainage_genere` | Attribution réussie (201) | enseigne_id, attribution_id | Conversion intermédiaire |
| `lien_parrainage_echec` | Erreur de génération (404/409/503) | enseigne_id, type_erreur | Frein |
| `offre_indisponible_affichee` | Pool vide ou offre expirée affichée sans action possible | enseigne_id | Frein |
| `lien_redirection_suivie` | Clic effectif sur `/r/{token}`, avant le 301 vers l'enseigne (ajout corrective 2026-07-20, tracking-plan.md §2.3) | token, attribution_id, referrer_capture, origine_detectee, delai_depuis_generation_s | Conversion intermédiaire (mesure du clic réel, distinct de la génération) |

#### Scénarios persona concrets

1. Le jeune actif (A1) demande à ChatGPT "code de parrainage Trade Republic" un mardi soir ; l'assistant cite la fiche Trade Republic de Parrainly ; il clique, obtient un lien vérifié il y a 2 jours, s'inscrit chez Trade Republic le soir même.
2. L'entrepreneur (A2) consulte directement la fiche Qonto un dimanche soir avant de payer son abonnement pro annuel ; le pool est momentanément vide (tous les parrains au plafond) ; il voit le message d'indisponibilité et le CTA vers une autre offre bancaire pro vérifiée du catalogue (ex. Revolut Business).
3. Le jeune actif (A1) clique deux fois rapidement sur le bouton par réflexe (double-tap accidentel sur mobile) pendant le chargement ; un seul lien est généré, une seule redirection a lieu.
4. Le jeune actif (A1) revient consulter la fiche Ramify deux semaines après une première visite ; le lien affiché correspond à un parrain différent du premier tour (rotation), la date de vérification est plus récente.
5. Le jeune actif (A1) est en 4G faible dans le métro ; le chargement du lien dépasse 3 secondes ; il voit le message d'erreur de timeout avec bouton "Réessayer", réessaie et obtient son lien.

#### Definition of Done
UI 5 états conformes ci-dessus ; endpoint `/api/v1/offres/{enseigne_id}/attribution` testé sur les 4 réponses (201/404/409/503) ; endpoint `GET /r/{token}` testé sur la redirection 301 et le cas 404 token invalide ; les 5 scénarios persona reproductibles en recette ; test E2E à créer par @qa (nom proposé : `tests/e2e/us-01-lien-attribue.spec.ts`, fichier non encore créé) ; screenshot conforme au registre visuel brand-platform.md §7 (mention de vérification datée visible, pas de code visuel type site de bons plans).

#### Notes @qa / @ux / @fullstack
@qa : vérifier particulièrement le critère 6 (double-clic = 1 seule Attribution, pas de doublon en base) et le critère 3 révisé (clic différé sur `/r/{token}`, plusieurs heures après génération, doit toujours rediriger correctement). @ux : la mention de divulgation (critère 2) doit être au-dessus du CTA, jamais en dessous ou en petit texte (brand-platform.md §4 valeur Discrétion = transparence visible, pas mention légale reléguée). @fullstack : le `parrain_id_attribue` ne doit jamais être exposé côté front (protection du parrain contre un ciblage direct hors rotation) ; l'endpoint `/r/{token}` est le socle technique prioritaire signalé par @data-analyst (tracking-plan.md, Handoff infra).

---

## US-02 : Enregistrer et actualiser une offre du catalogue (gestion interne T&E)

*(RÉVISION 2026-07-20T02:00 : cette story remplace "Soumettre un lien de parrainage et entrer dans la rotation" (onboarding parrain externe), déplacée en V2 — cf. roadmap.md section 4. En cercle fermé, il n'y a rien à "onboarder" : Thomas et Emmanuel enregistrent et actualisent directement leurs propres offres dans le catalogue via le back-office. La mécanique CGU/inscription/file de validation tierce, non pertinente en V1, est conservée comme brouillon de référence pour le futur chantier V2 dans roadmap.md.)*

**Persona** : Thomas ou Emmanuel (opérateur du catalogue) | **Epic** : Catalogue des 9 offres réelles | **Dépendances** : Épic 1 roadmap.md (pages de conformité), objet métier Programme/Offre au schéma Emmanuel (product-vision.md §4) | **RICE : R2/I4/C5 → 40**

#### Job-to-be-done
En tant que Thomas ou Emmanuel, je veux enregistrer ou actualiser une offre du catalogue avec mon lien et mes conditions afin qu'elle soit disponible pour le moteur d'arbitrage (US-03) et vérifiable pour sa fraîcheur (US-04).

#### Contexte de navigation
Origine : back-office, section "Catalogue des offres". Déclencheur : clic "Ajouter une offre" ou "Modifier" sur une des 9 lignes existantes. Destination succès : l'offre apparaît (ou est mise à jour) dans le catalogue public dès que son statut passe à `actif`. Destination échec : message d'erreur de validation, formulaire conservé.

#### Données et champs

Champs = les 20 champs du schéma Emmanuel (product-vision.md §4, non redupliqués intégralement ici) ; les 5 saisis manuellement par T&E à l'ajout/mise à jour :

| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| nom_programme | Texte | Oui | Doit correspondre à un des 9 programmes de la base Emmanuel en V1 | Liste fermée en V1 | "Trade Republic" |
| url_parrainage / code_parrainage | Texte/URL | Au moins un des deux | Format URL ou code alphanumérique selon le programme | Max 500 caractères | "https://www.traderepublic.com/parrainage/ABC123" |
| conditions | Texte structuré | Oui | Porte le plafond anti-fraude (cf. product-vision.md §2 règle 3) | `[À VALIDER selon fiche de conformité par programme]` | "Max 10 filleuls/mois" |
| statut | Select | Oui | actif / en_attente_verification / suspendu / retiré | Enum fermée | "actif" |
| date_verification | Date (auto) | Oui | Mise à jour par US-04 (job automatisé) ou manuellement par T&E | ≤ date du jour | "2026-07-18" |

#### 5 états UI
- **Défaut** : liste des 9 offres avec statut, propriétaire (Thomas/Emmanuel), date de dernière vérification.
- **Loading** : après clic Enregistrer, indicateur bref, durée max 2 secondes.
- **Vide** : N/A — les 9 offres sont importées au démarrage (import direct de `data/base-parrainage-emmanuel-v3.xlsx`), il n'y a jamais de catalogue vide en V1.
- **Erreur** : format de lien non reconnu pour le programme choisi → message exact "Ce lien ne correspond pas au format attendu pour ce programme." + les autres champs restent remplis.
- **Succès** : "Offre enregistrée. Statut : [statut]." + mise à jour immédiate visible dans la liste.

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Thomas modifie le lien Trade Republic qu'il détient, When il clique "Enregistrer", Then l'offre Trade Republic est mise à jour avec le nouveau lien et `date_verification` repasse à la date du jour.
2. (Happy path) Given Thomas et Emmanuel détiennent chacun un lien pour le même programme (ex. Qonto), When les deux sont enregistrés, Then les deux entrées coexistent comme deux instances de Parrain rattachées à la même Offre, chacune avec son propre quota (cf. product-vision.md §2 règle 1).
3. (Happy path) Given une offre passe le contrôle de conformité (fiche produite par @legal), When son statut est basculé de `en_attente_verification` à `actif`, Then elle devient éligible au moteur d'arbitrage (US-03) et visible au catalogue public.
4. (Erreur) Given Emmanuel soumet un lien dans un format non reconnu pour le programme choisi, When il clique "Enregistrer", Then le message exact "Ce lien ne correspond pas au format attendu pour ce programme." s'affiche sans effacer les autres champs.
5. (Erreur) Given le champ `conditions` (plafond) est laissé vide pour un programme régulé, When Thomas tente de passer le statut à `actif`, Then l'action est bloquée avec le message "Le plafond doit être renseigné avant activation." (garde-fou anti-fraude, cf. product-vision.md §2 règle 3).
6. (Cas limite — champ vide) Given ni `url_parrainage` ni `code_parrainage` n'est renseigné, When Thomas ou Emmanuel clique "Enregistrer", Then la validation bloque l'envoi sur ce point précis.
7. (Cas limite — double soumission) Given Thomas clique deux fois rapidement sur "Enregistrer", When le second clic survient avant la fin du traitement du premier, Then une seule mise à jour est appliquée (idempotence sur `id` de l'offre).
8. (Permissions) Given une personne autre que Thomas ou Emmanuel tente d'accéder à cette section du back-office, When elle charge l'URL, Then l'accès est refusé (403) — aucun accès public à la gestion du catalogue en V1.
9. (Données existantes) Given une offre Kraken détenue uniquement par Emmanuel atteint son plafond (`conditions`), When la période se renouvelle, Then son quota est réinitialisé automatiquement et son statut repasse à `actif` sans action manuelle.

#### Payload API
- `PATCH /api/v1/admin/offres/{offre_id}` — mise à jour d'une offre existante (les 9 offres sont pré-créées à l'import initial, pas de `POST` de création en V1).
- Auth : session admin T&E (rôle back-office, même mécanisme que US-07).
- Rate limit : N/A (2 opérateurs internes, pas de risque d'abus).
- Request : `{ "url_parrainage": string, "code_parrainage": string, "conditions": string, "statut": "actif" | "en_attente_verification" | "suspendu" | "retire" }`
- Response 200 : `{ "id": string, "statut": string, "date_verification": string }`
- Response 400 : `{ "error": "format_lien_invalide" }` / `{ "error": "plafond_manquant" }`
- Response 403 : accès refusé (non T&E).

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `offre_mise_a_jour` | Enregistrement réussi (200) | offre_id, statut, operateur (thomas/emmanuel) | Opération |
| `offre_mise_a_jour_echec` | Erreur de validation/format | offre_id, type_erreur | Frein |
| `offre_activee` | Statut passe à `actif` | offre_id | Opération |

#### Scénarios persona concrets

1. Thomas met à jour son lien Trade Republic après un changement d'URL du programme, la date de vérification repasse au jour même.
2. Emmanuel enregistre son propre lien Kraken (Thomas n'en détient pas) ; l'offre Kraken n'a qu'un seul détenteur dans le pool d'arbitrage (US-03), ce qui est normal en V1.
3. Thomas tente d'activer l'offre Meria sans avoir renseigné le plafond ; le blocage l'empêche de publier une offre sans garde-fou anti-fraude.
4. Emmanuel modifie deux fois de suite très rapidement le statut de Spiko par erreur de manipulation tactile ; une seule mise à jour est appliquée.
5. Thomas et Emmanuel enregistrent chacun un lien Qonto le même jour ; le back-office affiche les deux entrées distinctement avec leurs quotas propres.

#### Definition of Done
UI 5 états conformes (vide = N/A justifié, import initial exhaustif) ; endpoint testé sur 200/400/403 ; les 5 scénarios reproductibles en recette ; test E2E à créer par @qa (nom proposé : `tests/e2e/us-02-gestion-catalogue.spec.ts`).

#### Notes @qa / @ux / @fullstack
@fullstack : l'import initial des 9 offres doit se faire directement depuis `data/base-parrainage-emmanuel-v3.xlsx` (les 20 colonnes du schéma Emmanuel), pas de ressaisie manuelle des champs déjà documentés par Emmanuel. @legal : le blocage du critère 5 (plafond obligatoire avant activation) est le seul garde-fou produit tant que la fiche de conformité par programme n'est pas réévaluée en configuration cercle fermé.

---

## US-03 : Attribuer un filleul à un parrain en respectant les plafonds (moteur d'arbitrage T&E)

*(RÉVISION 2026-07-20T02:00 : pool ramené à 2 identités maximum — Thomas et Emmanuel — au lieu d'un pool ouvert. La logique de sélection et les garde-fous restent identiques et directement réutilisables lors de l'ouverture V2, cf. product-vision.md §2 règle 7.)*

**Persona** : N/A — story technique sans utilisateur direct (bénéficie indirectement au jeune actif (A1) via US-01 et à Thomas/Emmanuel via US-02) | **Epic** : Moteur d'arbitrage T&E | **Dépendances** : US-02 (offres et liens T&E enregistrés), Épic 2 roadmap.md (catalogue d'offres) | **RICE : R3/I5/C4 → 60**

#### Job-to-be-done
En tant que produit, attribuer automatiquement un filleul au parrain (Thomas ou Emmanuel) éligible en respectant les plafonds anti-fraude afin de garantir un arbitrage équitable entre les deux et protéger leurs primes (product-vision.md §2).

#### Données et champs / 5 états UI
N/A — story sans UI (template allégé, cf. product-manager.md règle de triage par complexité).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Thomas ET Emmanuel détiennent chacun un lien éligible pour l'offre Trade Republic (aucun au plafond), When une requête d'attribution arrive, Then le moteur sélectionne celui des deux dont `date_dernier_tour` est la plus ancienne.
2. (Happy path) Given le parrain sélectionné atteint son plafond après cette attribution, When l'attribution est enregistrée, Then ce parrain est automatiquement exclu du pool pour les requêtes suivantes sur cette offre.
3. (Happy path) Given deux parrains ont exactement la même `date_dernier_tour` (jamais servis), When une requête arrive, Then le moteur applique un critère de départage déterministe et documenté (ex. ordre d'inscription), jamais un tirage aléatoire non traçable.
4. (Erreur) Given le pool éligible est vide (tous au plafond ou suspendus), When une requête d'attribution arrive, Then le moteur retourne l'erreur `pool_vide` (409) sans créer d'Attribution, et déclenche le passage de l'offre au statut "en attente de parrain" (US-04).
5. (Erreur) Given une incohérence de données (parrain marqué éligible mais lien signalé mort entre-temps), When le moteur tente de l'attribuer, Then il exclut ce parrain à la volée et sélectionne le suivant éligible sans exposer l'incohérence au demandeur.
6. (Cas limite — concurrence) Given deux requêtes d'attribution arrivent simultanément pour la même offre avec un seul parrain éligible restant sous son plafond, When les deux requêtes sont traitées, Then un verrouillage transactionnel garantit qu'une seule attribution fait passer ce parrain au-delà de son plafond ; l'autre requête retombe sur le parrain suivant éligible ou sur `pool_vide`.
7. (Cas limite — plafond atteint exactement) Given un parrain à `quota_utilise = quota_max - 1`, When il est sélectionné pour une attribution, Then son `quota_utilise` passe à `quota_max` et il est exclu du pool immédiatement après cette attribution (pas d'attribution en surplus).
8. (Permissions) Given une requête d'attribution provient d'un canal non reconnu (ni `page_web` ni `api_json`), When elle atteint le moteur, Then elle est rejetée avec `canal_invalide` (400), aucune Attribution n'est créée.
9. (Données existantes) Given un parrain a un statut `suspendu` (signalement de fraude, géré via US-07 back-office), When le moteur constitue le pool éligible, Then ce parrain est exclu quel que soit son quota restant.

#### Payload API
- `POST /internal/attribution-engine/select` — appel interne uniquement, jamais exposé publiquement (appelé par le service catalogue/US-01).
- Auth : interne (clé de service).
- Rate limit : N/A (appel interne, pas d'utilisateur final direct).
- Request : `{ "offre_id": string, "canal_source": "page_web" | "api_json" }`
- Response 200 : `{ "parrain_id": string, "attribution_id": string }`
- Response 409 : `{ "error": "pool_vide" }`
- Response 400 : `{ "error": "canal_invalide" }`

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `attribution_moteur_execute` | Chaque exécution du moteur | offre_id, resultat (succes/pool_vide), duree_ms | Technique |
| `attribution_parrain_exclu` | Exclusion automatique d'un parrain du pool | parrain_id, offre_id, raison (plafond/lien_mort/suspendu) | Technique |

#### Definition of Done
Logique testée unitairement sur les 9 critères ; test de concurrence (verrouillage transactionnel, critère 6) référencé ; N/A pour test E2E UI (story sans UI).

#### Notes @qa / @ia
@qa : le critère 6 (concurrence) nécessite un test de charge simulant deux requêtes simultanées, pas seulement séquentielles. @ia : le critère de départage (critère 3) doit être documenté dans le code, pas seulement dans la spec, pour rester auditable en cas de contestation d'un parrain.

---

## US-04 : Retirer automatiquement une offre expirée ou saturée

**Persona** : N/A — story technique (bénéficie indirectement au demandeur (jeune actif A1 ou entrepreneur A2) : jamais de lien mort affiché ; au gestionnaire de programme : pas de sur-sollicitation d'un parrain) | **Epic** : Vérification de fraîcheur automatisée | **Dépendances** : Épic 2 roadmap.md (catalogue d'offres), US-03 (moteur d'attribution) | **RICE : R4/I5/C3 → 60**

#### Job-to-be-done
En tant que produit, retirer automatiquement une offre expirée ou dont le pool de parrains est saturé afin de ne jamais exposer un lien mort ou indisponible à un demandeur (preuve de Fraîcheur, brand-platform.md §3 ; KPI de survie identifié par @growth).

#### Données et champs / 5 états UI
N/A — story sans UI (template allégé).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given une offre dont la date de fin de validité est dépassée, When le job de vérification de fraîcheur s'exécute, Then l'offre passe au statut "expirée" et n'est plus proposée en consultation (US-01 état "vide").
2. (Happy path) Given un lien de parrainage signalé mort par un contrôle automatisé, When le contrôle échoue de manière répétée `[À VALIDER — seuil exact de re-tentatives non chiffré]`, Then le lien passe au statut "invalide" et le parrain associé est retiré du pool pour cette offre.
3. (Happy path) Given le pool éligible d'une offre devient vide (tous les parrains au plafond ou invalides), When le moteur détecte cet état après une tentative d'attribution en échec (US-03 critère 4), Then l'offre passe automatiquement au statut "en attente de parrain" et n'est plus exposée comme disponible.
4. (Erreur) Given le job de vérification de fraîcheur échoue techniquement, When l'échec survient, Then aucune offre n'est retirée par erreur : le statut précédent est conservé et l'échec est journalisé pour investigation (principe fail-safe, pas de retrait sur incertitude).
5. (Erreur) Given une offre est retirée à tort suite à un faux positif de contrôle, When un opérateur back-office (US-07) réactive manuellement l'offre, Then son statut repasse à "actif" et elle redevient consultable immédiatement.
6. (Cas limite — réactivation/re-expiration le même jour) Given une offre repasse "active" puis atteint sa nouvelle date d'expiration le même jour, When le job s'exécute à nouveau, Then elle repasse "expirée" sans erreur de double traitement.
7. (Cas limite — fraîcheur à la limite exacte) Given une offre dont la dernière vérification date exactement de la limite de fraîcheur `[À VALIDER — fenêtre non chiffrée]`, When le job s'exécute au moment exact de la limite, Then l'offre est traitée comme expirée (principe de précaution : à la limite = expirée).
8. (Permissions) Given le job de vérification de fraîcheur, When il s'exécute, Then seul un processus système authentifié par clé interne peut modifier le statut d'une offre — aucun accès public à cette action.
9. (Données existantes) Given une offre a déjà 2 parrains actifs et 1 parrain suspendu, When le parrain actif restant atteint son plafond au cours de la journée, Then l'offre passe "en attente de parrain" même si elle avait le statut "actif" le matin même.

#### Payload API
- `POST /internal/freshness-check/run` — déclenchement du job (planifié ou manuel depuis le back-office US-07).
- Auth : clé interne système.
- Response 200 : `{ "offres_expirees": number, "liens_invalides": number }`

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `offre_expiree_auto` | Job détecte une expiration | offre_id | Technique |
| `offre_en_attente_parrain` | Pool vide détecté | offre_id | Technique |
| `lien_invalide_detecte` | Contrôle de lien échoué | parrain_id, offre_id | Technique |

#### Definition of Done
Job testé sur les 9 critères, y compris le cas fail-safe (critère 4) ; seuils exacts (`[À VALIDER]` re-tentatives et fenêtre de fraîcheur) à chiffrer par @data-analyst/@ia avant mise en prod, pas à la charge de cette spec ; N/A pour test E2E UI.

#### Notes @qa / @data-analyst
@data-analyst : chiffrer la fenêtre de fraîcheur et le seuil de re-tentatives (actuellement `[À VALIDER]`) à partir des premières données réelles de citation IA, pas d'une valeur générique.

---

## US-05 : Consulter son tableau de bord parrain (statut, quota, prime)

**Persona** : Thomas (ou Emmanuel) | **Epic** : Catalogue des 9 offres réelles | **Dépendances** : US-02, US-03 | **RICE : R2/I3/C4 → 24**

#### Job-to-be-done
En tant que Thomas (ou Emmanuel), je veux consulter le statut de mes liens et ma prime estimée afin de savoir si mon lien est actif dans l'arbitrage et s'il approche de son plafond.

#### 5 états UI
- **Défaut** : liste des liens enregistrés avec statut (en attente/actif/en pause/suspendu), quota utilisé/max par offre.
- **Loading** : chargement du tableau, durée max 2 secondes.
- **Vide** : aucun lien encore enregistré pour ce parrain (ex. Emmanuel n'a pas de lien Kraken) → message "Vous n'avez pas encore de lien enregistré." + CTA "Enregistrer un lien" (US-02).
- **Erreur** : échec de chargement → message exact "Impossible de charger votre espace parrain. Réessayez." + bouton Réessayer.
- **Succès** : N/A pour un écran de consultation pure — la confirmation se fait à l'affichage des données à jour.

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Thomas (ou Emmanuel) a 2 liens actifs (Trade Republic, Qonto), When il ouvre son tableau de bord, Then il voit les 2 liens avec leur quota utilisé/max respectif.
2. (Happy path) Given un des liens de Thomas (ou Emmanuel) est "en pause" (plafond atteint), When il consulte son tableau de bord, Then le statut affiche "en pause jusqu'au [date de réinitialisation]".
3. (Happy path) Given une Attribution liée à un lien de Thomas (ou Emmanuel) est passée à "confirmée", When il consulte son tableau de bord, Then sa prime estimée cumulée reflète cette conversion.
4. (Erreur) Given le service de chargement du tableau échoue, When Thomas (ou Emmanuel) ouvre la page, Then le message exact "Impossible de charger votre espace parrain. Réessayez." s'affiche avec bouton Réessayer.
5. (Erreur) Given Thomas (ou Emmanuel) accède à l'URL de son tableau de bord sans lien de session valide (email expiré), When la page se charge, Then il est redirigé vers une page de renvoi de lien de connexion.
6. (Cas limite — aucun lien) Given Thomas (ou Emmanuel) n'a jamais enregistré de lien pour un programme donné, When il ouvre son tableau de bord, Then l'état "vide" s'affiche avec le CTA vers US-02.
7. (Cas limite — session expirée en cours de consultation) Given le lien de session de Thomas (ou Emmanuel) expire pendant qu'il consulte la page, When il tente une action (ex. rafraîchir), Then il est invité à redemander un lien de connexion sans perte des données déjà affichées à l'écran.
8. (Permissions) Given Thomas (ou Emmanuel) tente d'accéder au tableau de bord d'un autre parrain via une URL modifiée, When la requête est faite, Then l'accès est refusé (403) — un parrain ne voit que ses propres liens.
9. (Données existantes) Given Thomas (ou Emmanuel) a un lien suspendu pour fraude (US-07), When il consulte son tableau de bord, Then ce lien est visible avec le statut "suspendu" et un message générique, sans détail de l'enquête anti-fraude.

#### Payload API
`GET /api/v1/parrains/{parrain_id}/tableau-de-bord` — Auth : lien de session email — Response 200 : `{ "liens": [ { "enseigne_id", "statut", "quota_utilise", "quota_max", "date_reinitialisation" } ], "prime_estimee_cumulee": number }` — Response 403 si parrain_id ne correspond pas à la session.

#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `dashboard_parrain_vu` | Chargement du tableau de bord | parrain_id, nb_liens | Rétention |
| `dashboard_parrain_erreur` | Échec de chargement | parrain_id | Frein |

#### Definition of Done
UI 4 états pertinents conformes (succès = N/A justifié, écran de consultation) ; endpoint testé 200/403 ; test E2E à créer par @qa (`tests/e2e/us-05-dashboard-parrain.spec.ts`).

---

## US-06 : Signaler un lien de parrainage mort ou invalide

**Persona** : le jeune actif (A1) ou l'entrepreneur (A2) (et Thomas (ou Emmanuel) pour son propre lien) | **Epic** : Vérification de fraîcheur automatisée | **Dépendances** : US-04 | **RICE : R3/I4/C4 → 48**

#### Job-to-be-done
En tant que le jeune actif (A1) ou l'entrepreneur (A2), je veux signaler qu'un lien de parrainage ne fonctionne plus afin que le registre reste fiable pour les prochains demandeurs (renforce la preuve de Fraîcheur, brand-platform.md §3).

#### 5 états UI
- **Défaut** : lien "Ce lien ne fonctionne pas ?" visible sous chaque lien attribué (US-01).
- **Loading** : après clic, indicateur bref, durée max 1 seconde.
- **Vide** : N/A — pas d'état vide pertinent pour une action de signalement ponctuelle.
- **Erreur** : échec d'enregistrement du signalement → message exact "Votre signalement n'a pas pu être enregistré. Réessayez." + bouton Réessayer.
- **Succès** : "Merci, votre signalement a été transmis pour vérification." (pas de détail sur la suite donnée, pour ne pas exposer le fonctionnement anti-fraude).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given le jeune actif (A1) constate que le lien attribué ne fonctionne pas, When il clique "Ce lien ne fonctionne pas ?", Then un signalement est enregistré et lié à l'Attribution concernée.
2. (Happy path) Given un lien reçoit 3 signalements distincts `[HYPOTHÈSE — seuil non chiffré]` en moins de 24h, When le 3e signalement est enregistré, Then le lien est mis en priorité de re-vérification manuelle (US-07).
3. (Happy path) Given Thomas (ou Emmanuel) signale lui-même son propre lien comme non fonctionnel, When il le fait depuis son tableau de bord (US-05), Then le lien passe directement au statut "en re-vérification" sans attendre plusieurs signalements tiers.
4. (Erreur) Given le service de signalement est indisponible, When le jeune actif (A1) clique "Ce lien ne fonctionne pas ?", Then le message exact "Votre signalement n'a pas pu être enregistré. Réessayez." s'affiche.
5. (Erreur) Given le jeune actif (A1) signale un lien déjà au statut "invalide", When il clique le bouton, Then un message informe que le signalement est déjà pris en compte, sans créer de doublon.
6. (Cas limite — double-clic) Given le jeune actif (A1) clique deux fois rapidement sur le bouton de signalement, When le second clic survient avant la fin du traitement, Then un seul signalement est enregistré.
7. (Cas limite — signalement anonyme répété) Given la même session anonyme signale le même lien plusieurs fois d'affilée, When le 2e signalement identique arrive dans la même session, Then il n'est pas compté deux fois dans le seuil de priorisation (déduplication par session).
8. (Permissions) Given aucune authentification n'est requise pour signaler (parcours anonyme comme US-01), When un signalement est soumis, Then il est enregistré sans identifiant civil, seulement un identifiant de session anonyme.
9. (Données existantes) Given un lien déjà signalé et re-vérifié comme fonctionnel entre-temps, When un nouveau signalement arrive après cette re-vérification, Then le compteur de signalements repart de zéro (pas d'accumulation d'anciens signalements obsolètes).

#### Payload API
`POST /api/v1/attributions/{attribution_id}/signalement` — Auth : aucune (anonyme) — Request : `{ "session_id": string }` — Response 201 : `{ "signalement_id": string }` — Response 409 si lien déjà "invalide".

#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `lien_signale` | Signalement enregistré | attribution_id, offre_id | Frein/Qualité |
| `lien_priorite_reverification` | Seuil de signalements atteint | offre_id, parrain_id | Technique |

#### Definition of Done
UI 3 états pertinents conformes (vide = N/A justifié) ; endpoint testé 201/409 ; seuil de signalements `[HYPOTHÈSE]` à valider par @data-analyst avant prod.

---

## US-07 : Valider la mise en ligne d'une offre après contrôle de conformité (back-office)

*(RÉVISION 2026-07-20T02:00 : remplace "Valider ou rejeter une soumission de parrain" — sans onboarding tiers en V1, il n'y a plus de soumission à arbitrer entre plusieurs candidats. Cette story devient une porte de conformité : T&E ne peuvent pas eux-mêmes activer une offre régulée tant que la fiche de conformité par programme n'existe pas, cf. legal-strategy.md §7 point 6, à réévaluer par @legal en configuration cercle fermé.)*

**Persona** : Thomas ou Emmanuel (opérateur back-office) | **Epic** : Back-office minimal + Pages de conformité | **Dépendances** : US-02, Épic 1 roadmap.md | **RICE : R2/I4/C4 → 32**

#### Job-to-be-done
En tant qu'opérateur back-office, je veux valider qu'une offre dispose de sa fiche de conformité avant de basculer son statut à `actif`, afin de garantir qu'aucune offre non conforme (CGU du programme, mentions réglementaires spécifiques aux programmes régulés) n'est exposée publiquement (legal-strategy.md §4/§7 point 6).

#### Données et champs
N/A — pas de formulaire de saisie complexe : action binaire (valider/bloquer) sur une offre en attente d'activation, avec champ "référence de la fiche de conformité" (lien/identifiant, obligatoire pour valider).

#### 5 états UI
- **Défaut** : liste des offres au statut `en_attente_verification` avec programme, catégorie, date d'enregistrement.
- **Loading** : après clic Valider/Bloquer, indicateur bref, durée max 2 secondes.
- **Vide** : aucune offre en attente de contrôle de conformité → message "Aucune offre à valider."
- **Erreur** : échec d'enregistrement de la décision → message exact "L'action n'a pas pu être enregistrée. Réessayez." + bouton Réessayer.
- **Succès** : "Offre validée, elle est désormais active." ou "Offre bloquée, fiche de conformité manquante ou insuffisante."

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given l'offre Trade Republic est enregistrée par Thomas (US-02) et sa fiche de conformité est produite, When l'opérateur clique "Valider" en référençant la fiche, Then l'offre passe au statut `actif` et entre dans le pool d'arbitrage (US-03).
2. (Happy path) Given l'offre Kraken (crypto, enjeu réglementaire PSAN/MiCA) n'a pas encore de fiche de conformité, When l'opérateur ouvre l'offre pour la valider, Then le bouton "Valider" reste bloqué tant que la référence de fiche n'est pas renseignée.
3. (Happy path) Given un opérateur consulte la fiche de conformité du programme (legal-strategy.md §7 point 6) avant de statuer, When il valide en connaissance de cause, Then la décision est journalisée avec l'identifiant de l'opérateur (Thomas ou Emmanuel) et la référence de la fiche.
4. (Erreur) Given le service d'enregistrement de décision échoue, When l'opérateur clique Valider, Then le message exact "L'action n'a pas pu être enregistrée. Réessayez." s'affiche et le statut reste `en_attente_verification`.
5. (Erreur) Given l'opérateur tente de valider sans renseigner la référence de fiche de conformité, When il clique "Valider", Then le bouton reste bloqué et le message "La référence de la fiche de conformité est obligatoire." s'affiche.
6. (Cas limite — double traitement) Given Thomas et Emmanuel traitent la même offre simultanément depuis deux sessions, When les deux actions arrivent en même temps, Then seule la première est appliquée, la seconde reçoit un message "Déjà traité par un autre opérateur".
7. (Cas limite — retrait après activation) Given une offre déjà `actif` doit être suspendue suite à une évolution des CGU du programme, When l'opérateur la repasse en `suspendu`, Then elle sort immédiatement du pool d'arbitrage (US-03) sans délai.
8. (Permissions) Given un utilisateur autre que Thomas ou Emmanuel tente d'accéder au back-office, When il charge l'URL, Then l'accès est refusé (403) et redirigé vers la page d'accueil.
9. (Données existantes) Given un programme régulé (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria) n'a pas encore de fiche de conformité produite par @legal, When l'opérateur ouvre l'offre correspondante, Then un avertissement bloquant "Fiche de conformité manquante pour ce programme" empêche la validation tant que la fiche n'est pas renseignée.

#### Payload API
`POST /api/v1/admin/offres/{offre_id}/validation` — Auth : session admin T&E (rôle back-office) — Request : `{ "decision": "valider" | "bloquer", "reference_fiche_conformite": string }` — Response 200 : `{ "statut": "actif" | "en_attente_verification" }` — Response 403 si non-admin — Response 400 si `reference_fiche_conformite` absente sur décision "valider".

#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `offre_validee_conformite` | Décision "valider" enregistrée | offre_id, admin_id, reference_fiche | Opération |
| `offre_bloquee_conformite` | Décision "bloquer" enregistrée | offre_id, admin_id | Opération |

#### Definition of Done
UI 5 états conformes ; endpoint testé 200/400/403 ; le garde-fou "fiche de conformité manquante" (critère 9) est un blocage produit non contournable, cohérent avec legal-strategy.md §7 (sous réserve de la réévaluation §7 en cercle fermé, non faite à ce jour).

#### Notes @legal
Le critère 9 traduit l'exigence de legal-strategy.md §4/§7 : aucun programme, en particulier régulé, ne doit être activé sans fiche de conformité documentée. Signalé : cette exigence a été écrite pour une marketplace ouverte ; @legal doit confirmer qu'elle reste identique (ou l'ajuster) en configuration cercle fermé T&E avant mise en prod réelle.

---

## US-08 : Exercer ses droits RGPD (accès, rectification, opposition, suppression)

**Persona** : Thomas (ou Emmanuel) (données de son profil Parrain) et le jeune actif (A1) / l'entrepreneur (A2) (données de tracking d'attribution) | **Epic** : Catalogue des 9 offres réelles + Tracking d'attribution IA→conversion | **Dépendances** : Épic 1 (pages de conformité), objets métier Parrain et Attribution/Conversion | **RICE : R2/I5/C5 → 50**

#### Job-to-be-done
En tant que Thomas (ou Emmanuel) (ou le jeune actif (A1) / l'entrepreneur (A2)), je veux accéder à mes données, les rectifier, m'opposer à leur traitement ou les faire supprimer afin d'exercer mes droits RGPD (legal-strategy.md §6).

#### Données et champs / 5 états UI
N/A — story couvrant plusieurs points d'entrée (formulaire de contact dédié + export automatisé), pas un écran unique. Traité comme story de conformité transversale : voir critères ci-dessous.

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Thomas (ou Emmanuel) demande l'accès à ses données via le formulaire dédié (page de conformité), When la demande est soumise avec son email vérifié, Then un export de ses données (liens, statuts, historique de commissions) lui est transmis sous le délai légal.
2. (Happy path) Given le jeune actif (A1) souhaite s'opposer au tracking d'attribution, When il utilise le lien "gérer mes préférences" présent sur toute page consultée, Then son identifiant de session anonyme cesse d'être associé à de nouvelles Attributions.
3. (Happy path) Given Thomas (ou Emmanuel) souhaite rectifier son email de contact, When il soumet la demande via son tableau de bord (US-05) ou le formulaire dédié, Then l'email est mis à jour après vérification.
4. (Erreur) Given une demande de suppression est soumise alors que Thomas (ou Emmanuel) a des commissions en attente de versement, When la demande est traitée, Then la suppression des données d'identité est différée jusqu'à l'obligation légale de conservation comptable (legal-strategy.md §6b, 10 ans), avec explication claire du délai.
5. (Erreur) Given une demande RGPD est soumise depuis un email non vérifié, When elle est reçue, Then elle est mise en attente de vérification d'identité avant tout traitement.
6. (Cas limite) Given Thomas (ou Emmanuel) demande la suppression de son compte alors qu'un lien est actuellement dans le pool de rotation, When la demande est traitée, Then le lien est immédiatement retiré du pool avant toute suppression de compte.
7. (Cas limite) Given le jeune actif (A1) exerce son droit d'opposition après plusieurs Attributions déjà créées, When la demande est traitée, Then les Attributions passées ne sont pas supprimées rétroactivement (nécessaires au calcul de commissions déjà dues) mais aucune nouvelle Attribution n'est associée à sa session.
8. (Permissions) Given une demande RGPD concerne les données d'un tiers, When elle est soumise sans preuve d'identité correspondante, Then elle est rejetée avec message explicatif.
9. (Données existantes) Given Thomas (ou Emmanuel) a déjà exercé un droit d'accès dans les 30 derniers jours `[HYPOTHÈSE — délai de traitement à valider par @legal]`, When il soumet une nouvelle demande, Then elle est traitée normalement (le RGPD n'impose pas de limite de fréquence, seulement un délai de réponse).

#### Payload API
`POST /api/v1/rgpd/demandes` — Auth : email vérifié — Request : `{ "type_demande": "acces" | "rectification" | "opposition" | "suppression", "email": string }` — Response 202 : `{ "demande_id": string, "statut": "en_verification" }`.

#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `demande_rgpd_soumise` | Formulaire soumis | type_demande | Conformité |
| `demande_rgpd_traitee` | Demande clôturée | type_demande, delai_traitement_jours | Conformité |

#### Definition of Done
Processus testé sur les 9 critères ; page de conformité "Comment ça marche / vos droits" référencée (roadmap.md épic 1) ; délais exacts de traitement à valider par @legal avant prod.

---

## US-09 : Confirmer l'attribution d'une conversion par le parrain

*(Ajout corrective 2026-07-20T01:00, suite au gap signalé par @data-analyst — tracking-plan.md §2.3/§2.7 : c'est le maillon qui alimente directement le NSM PCA-IA, product-vision.md §3 statut "confirmée".)*

**Persona** : Thomas (ou Emmanuel) | **Epic** : Tracking d'attribution IA→conversion | **Dépendances** : US-03 (Attribution existante), US-05 (tableau de bord, point d'entrée UI), US-01 (endpoint `/r/{token}`, condition préalable : la redirection doit avoir été suivie) | **RICE : R4/I5/C4 → 80**

#### Job-to-be-done
En tant que Thomas (ou Emmanuel), je veux confirmer qu'un filleul qui a suivi mon lien a effectivement souscrit afin de déclencher le calcul de ma commission et faire compter ce parrainage dans le KPI North Star (parrainages confirmés attribués à une réponse IA/mois).

#### Contexte de navigation
Origine : tableau de bord parrain (US-05), section "Mes attributions en attente". Déclencheur : clic sur "Confirmer la conversion" sur une ligne d'Attribution au statut `en_attente` dont `date_redirection` est renseignée (le lien a été suivi au moins une fois, cf. US-01 `lien_redirection_suivie`). Destination succès : l'Attribution passe au statut `confirmée` (ou `en_verification_manuelle` si le garde-fou de plausibilité se déclenche, critère 7), la prime estimée cumulée de Thomas (ou Emmanuel) (US-05) est mise à jour. Destination échec : message d'erreur explicite, statut inchangé.

#### Données et champs

| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| attribution_id | Select (liste des Attributions `en_attente` de Thomas (ou Emmanuel) avec `date_redirection` renseignée) | Oui | Doit appartenir à Thomas (ou Emmanuel), statut `en_attente`, `date_redirection` non nulle | N/A | "attr_8f3d2" |
| date_conversion_declaree | Date | Oui | ≤ date du jour, ≥ `date_redirection` | Fenêtre max de 60 jours `[HYPOTHÈSE — tracking-plan.md §2.5, à valider par @product-manager/@legal]` après `date_generation` | "2026-08-10" |
| montant_commission_declare | Nombre décimal | Non (peut être complété/corrigé après validation de l'enseigne) | ≥ 0 | Max `[À VALIDER selon barème par enseigne, fiche de conformité legal-strategy.md §7 point 6]` | "35.00" |

#### 5 états UI
- **Défaut** : liste des Attributions `en_attente` avec bouton "Confirmer la conversion" actif uniquement si `date_redirection` renseignée ; sinon bouton grisé + info-bulle "Aucun clic enregistré sur ce lien pour le moment."
- **Loading** : après clic, indicateur affiché, durée max 2 secondes.
- **Vide** : aucune Attribution `en_attente` à confirmer → message "Aucune conversion à confirmer pour le moment." (état normal d'attente, pas une erreur, pas de CTA).
- **Erreur** : échec d'enregistrement de la confirmation → message exact "Votre confirmation n'a pas pu être enregistrée. Réessayez." + bouton Réessayer.
- **Succès** : "Confirmation enregistrée. Votre prime estimée a été mise à jour." si passage direct à `confirmée` ; "Confirmation reçue, en cours de vérification." si le garde-fou de plausibilité bascule l'Attribution en `en_verification_manuelle` (sans exposer le motif exact du blocage à Thomas (ou Emmanuel)).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given une Attribution de Thomas (ou Emmanuel) au statut `en_attente` avec `date_redirection` renseignée depuis 10 jours, When Thomas (ou Emmanuel) clique "Confirmer la conversion" et renseigne la date de conversion, Then l'Attribution passe au statut `confirmée`, l'event `attribution_confirmee` est émis avec `mode_confirmation = declaratif_parrain`, et la prime estimée cumulée de Thomas (ou Emmanuel) (US-05) est mise à jour.
2. (Happy path) Given le nombre de confirmations déclarées par Thomas (ou Emmanuel) sur les 30 derniers jours reste inférieur ou égal au nombre de `lien_redirection_suivie` enregistrées sur la même période (garde-fou de plausibilité, tracking-plan.md §2.7), When il confirme une nouvelle conversion, Then la confirmation est acceptée directement, sans revue manuelle.
3. (Happy path) Given une Attribution confirmée, When un opérateur back-office (US-07) audite ponctuellement les confirmations déclaratives, Then il retrouve l'historique complet (`date_redirection`, `date_confirmation`, `mode_confirmation`) pour vérification.
4. (Erreur) Given le service d'enregistrement de la confirmation est indisponible, When Thomas (ou Emmanuel) clique "Confirmer la conversion", Then le message exact "Votre confirmation n'a pas pu être enregistrée. Réessayez." s'affiche et le statut reste `en_attente`.
5. (Erreur) Given une Attribution dont `date_redirection` est nulle (jamais cliquée), When Thomas (ou Emmanuel) tente de la confirmer, Then le bouton reste désactivé et le message "Aucun clic enregistré sur ce lien pour le moment." empêche toute confirmation (garde-fou anti-fraude de base : impossible de déclarer une conversion sur un lien jamais suivi).
6. (Cas limite — double-clic) Given Thomas (ou Emmanuel) clique deux fois rapidement sur "Confirmer la conversion", When le second clic survient avant la fin du traitement du premier, Then une seule confirmation est enregistrée (idempotence sur `attribution_id`).
7. (Cas limite — dépassement du seuil de plausibilité) Given Thomas (ou Emmanuel) déclare plus de confirmations que de redirections suivies sur la fenêtre de 30 jours glissants `[HYPOTHÈSE — seuil exact à chiffrer par @data-analyst, tracking-plan.md §2.7]`, When la confirmation qui dépasse ce seuil est soumise, Then l'Attribution passe au statut `en_verification_manuelle` (pas `confirmée` directement) et un signalement est créé pour revue back-office (US-07), sans notifier Thomas (ou Emmanuel) du motif exact du blocage.
8. (Permissions) Given Thomas (ou Emmanuel) tente de confirmer une Attribution qui n'est pas la sienne (`attribution_id` d'un autre parrain, URL modifiée), When la requête est faite, Then l'accès est refusé (403).
9. (Données existantes) Given une Attribution dépasse la fenêtre de conversion de 60 jours `[HYPOTHÈSE — tracking-plan.md §2.5]` sans confirmation, When Thomas (ou Emmanuel) tente de la confirmer après ce délai, Then la confirmation est refusée avec le message "Le délai de confirmation pour cette attribution est dépassé." et l'Attribution reste/passe au statut `expiree` (jamais comptée dans le NSM, cohérent avec tracking-plan.md §2.5).

#### Payload API
- `POST /api/v1/parrains/{parrain_id}/attributions/{attribution_id}/confirmation`
- Auth : lien de session email (même mécanisme que US-05, `[À VALIDER par @fullstack/@ux]`).
- Rate limit : `[À VALIDER par @infrastructure]`.
- Request : `{ "date_conversion_declaree": string (ISO 8601), "montant_commission_declare": number | null }`
- Response 200 : `{ "statut": "confirmee" | "en_verification_manuelle" }`
- Response 403 : Attribution n'appartenant pas au parrain → `{ "error": "acces_refuse" }`
- Response 409 : `date_redirection` nulle, ou fenêtre de conversion dépassée → `{ "error": "redirection_absente" }` / `{ "error": "fenetre_expiree" }`
- Response 503 : service indisponible → `{ "error": "service_indisponible" }`

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `attribution_confirmee` | Le parrain déclare que le filleul attribué a converti (ajout corrective 2026-07-20, tracking-plan.md §2.3) | attribution_id, parrain_id, offre_id, delai_confirmation_jours, montant_commission, mode_confirmation (declaratif_parrain / webhook_enseigne) **+ enrichi : resultat (confirme_direct / en_verification_manuelle)** | Conversion confirmée — base du NSM (PCA-IA) |

#### Scénarios persona concrets

1. Thomas (ou Emmanuel) confirme la conversion du jeune actif (A1), qu'il a orienté vers Trade Republic trois semaines plus tôt, dès qu'il reçoit l'email de confirmation de souscription de Trade Republic.
2. Thomas (ou Emmanuel), pressé de gonfler sa prime affichée un dimanche soir, tente de confirmer 8 conversions d'un coup alors qu'il n'a eu que 3 redirections suivies ce mois-ci ; la 4e confirmation bascule automatiquement en vérification manuelle sans qu'il en comprenne le motif exact.
3. Thomas (ou Emmanuel) clique deux fois par réflexe sur le bouton de confirmation sur mobile (mauvaise connexion) ; une seule confirmation est enregistrée, pas de doublon de commission.
4. Thomas (ou Emmanuel) tente de confirmer une Attribution générée il y a 70 jours (au-delà de la fenêtre de 60 jours) ; le message de délai dépassé s'affiche, il comprend que cette attribution ne comptera pas.
5. Emmanuel, en tant qu'opérateur back-office (US-07), audite les confirmations du mois et retrouve pour chaque Attribution confirmée par Thomas (ou Emmanuel) l'historique complet de `date_redirection` à `date_confirmation`, confirmant la cohérence du parcours avant de valider le versement de commission.

#### Definition of Done
UI 5 états conformes ; endpoint testé sur 200/403/409/503 ; garde-fou de plausibilité (critère 7) testé avec un scénario de dépassement de seuil ; les 5 scénarios persona reproductibles en recette ; test E2E à créer par @qa (nom proposé : `tests/e2e/us-09-confirmation-conversion.spec.ts`).

#### Notes @qa / @legal / @data-analyst
@qa : vérifier en priorité le critère 7 (garde-fou anti-fraude déclenché) et le critère 9 (fenêtre de conversion). @legal : le garde-fou déclaratif est une mitigation de plausibilité, pas une preuve légale de conversion réelle (tracking-plan.md §2.7 limite 1) — ne jamais le présenter comme un dispositif anti-fraude infaillible en communication externe. @data-analyst : la fenêtre de 60 jours et le seuil de plausibilité (redirections ≥ confirmations sur fenêtre glissante) restent `[HYPOTHÈSE]` à chiffrer sur données réelles avant mise en prod.

---

## Checklist de couverture du parcours (bloquante)

| Parcours | Story ou exclusion documentée |
|---|---|
| Acquisition/onboarding demandeur | US-01 (consultation offre + lien attribué) |
| Onboarding parrain externe | **Reporté en V2, N/A en V1** : cercle fermé T&E tranché par le fondateur (project-context.md CHOIX #2 point 3) ; rien à onboarder tant que le pool = 2 personnes déjà identifiées. Cf. roadmap.md section 4 pour le chantier V2 documenté. |
| Gestion interne du catalogue (T&E) | US-02 (enregistrer/actualiser une offre), US-07 (validation de conformité avant activation) |
| Core loop (JTBD principal, CRUD) | US-01, US-02, US-03, US-04, US-05, US-06, US-09 (confirmation de conversion, maillon final vers le NSM) |
| Paiement (souscription/désabonnement) | **Exclu, N/A justifié** : le modèle n'est pas un abonnement SaaS payé par le demandeur ou T&E ; le seul flux financier est le versement de commission à T&E (versement manuel suivi en back-office en V1, prestataire de paiement dédié seulement à l'ouverture V2, cf. roadmap.md exclusions) |
| Compte (profil/mdp/email, suppression) | US-05 (tableau de bord), US-08 (RGPD, inclut suppression) — pas de mot de passe au POC (auth par lien email) |
| Droits RGPD | US-08 |
| Erreurs transversales (session expirée, 404, 403, double soumission) | Couvertes dans les critères de US-01 (double-clic), US-02 (double soumission), US-05 (session expirée, 403), US-07 (403, double traitement) |
| Multi-utilisateurs (rôles/permissions/admin) | US-07 (rôle admin back-office), critères permissions dans chaque story — périmètre volontairement réduit à 2 opérateurs (T&E) en V1 |
| Réactivation (inactif → retour) | Couvert par le critère 9 de US-02 (réinitialisation automatique de quota) ; réactivation d'un ancien parrain totalement inactif = **hors V1, N/A** — sans objet tant que le pool = T&E (toujours actifs par construction) ; à instruire en V2 avec le reste du CRM parrain |

---

## Definition of Ready (avant qu'une story entre en développement)

1. Objets métier Programme/Offre (schéma Emmanuel, 20 champs), Parrain (=T&E en V1), Attribution/Conversion modélisés en base (product-vision.md §4).
2. Fiche de conformité produite pour le programme concerné (legal-strategy.md §4/§7 point 6) — bloquant pour toute story touchant un programme réel (US-01, US-02, US-07), en particulier les 6 programmes régulés (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria).
3. Pages de conformité (CGU, confidentialité, divulgation, mentions financières) publiées (roadmap.md épic 1) avant toute mise en ligne publique de US-01/US-02/US-06.
4. Événements analytics de la story validés par @data-analyst (schéma de tracking-plan).
5. Maquette validée par @ux pour toute story avec UI (US-01, US-02, US-05, US-06, US-07, US-09).

## Definition of Done (toute story)

1. Tous les critères Given/When/Then de la story passent en test (unitaire + E2E si UI).
2. Les 5 états UI sont implémentés et vérifiés visuellement (ou N/A justifié pour les stories sans UI).
3. Le payload API correspond exactement au schéma documenté (endpoint, auth, codes de statut).
4. Les events analytics de la story sont émis et vérifiables dans l'outil de tracking retenu par @data-analyst.
5. Aucun placeholder générique en dur dans le code (les champs marqués `[À VALIDER]` dans les specs doivent être configurables, jamais codés en dur avec une valeur inventée).
6. Revue @qa effectuée sur les scénarios persona concrets de la story.

---

## Recommandation d'agents spécialisés

| Agent proposé | Type | Rôle | Justification (US-XX) | Priorité |
|---|---|---|---|---|
| testeur-persona demandeur (Jeune actif/Entrepreneur) | Testeur | Rejouer les 5 scénarios de US-01 et US-06 sur un environnement de recette avec de vrais prompts IA | US-01, US-06 : la promesse de fraîcheur/vérification n'a jamais été testée sur un vrai parcours de bout en bout ; persona désormais calé sur A1/A2 canoniques (brand-platform.md §2.1/2.2) | Haute |
| testeur-persona T&E (Thomas et Emmanuel) | Testeur | Rejouer les scénarios de US-02/US-05/US-09 et challenger la protection anti-fraude perçue, y compris le déclenchement du garde-fou de plausibilité | US-02, US-05, US-09 : contrairement à la version précédente, T&E sont les vrais utilisateurs (pas un persona fictif) — le test est directement exécutable avec eux, priorité renforcée | Haute |
| testeur-client gestionnaire de programme | Testeur | Valider que le flux d'attribution T&E reste indiscernable d'un parrainage organique aux yeux de l'émetteur, en particulier pour les programmes régulés (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria) | US-03 : critère central du modèle même en cercle fermé, non testable par un E2E générique (brand-platform.md §2.2) | Haute |
| auditeur conformité par programme | Expertise métier | Produire et maintenir la fiche de conformité par programme (legal-strategy.md §4/§7 point 6, à réévaluer en configuration cercle fermé) avant chaque activation au catalogue | US-01, US-02, US-07 : bloquant en Definition of Ready, processus récurrent non couvert par un agent générique, enjeu renforcé par l'inclusion des banques/fintech/crypto dès le V1 | Haute |

---

## Gates BLOQUANT vérifiées

- **G1** : 9 user stories + checklist de couverture + DoR/DoD présents, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : PASS — persona Parrain = Thomas (ou Emmanuel), identique à project-context.md CHOIX #2 (autorité). Persona demandeur : "le jeune actif (A1)" et "l'entrepreneur (A2)", alignés sur les personas canoniques de brand-platform.md §2.1/2.2 (corrective d'alignement 2026-07-20, @product-manager) — plus aucun prénom générique résiduel.
- **G7** : 0 contradiction avec product-vision.md (mécanique d'arbitrage T&E, objets métier Programme/Offre au schéma Emmanuel), roadmap.md (épics et dépendances repris à l'identique, US-02 alignée sur l'épic "Catalogue des 9 offres réelles"), et désormais brand-platform.md §2.1/2.2 (personas canoniques A1/A2 repris à l'identique). legal-strategy.md reste non refresh suite à CHOIX #2 (contradiction connue, signalée, hors mandat @product-manager de corriger). **Cohérence n°4 (bidirectionnelle avec tracking-plan.md) inchangée** : les events `lien_redirection_suivie` et `attribution_confirmee` restent identiques, non touchés par ce corrective. PASS pour ce document, sans réserve persona.
- **G12** : chaque story a un JTBD verbe+objet+bénéfice, chaque critère est binaire (Given/When/Then), chaque DoD est vérifiable ; US-09 respecte la répartition minimale (3 happy path, 2 erreur, 2 cas limite, 1 permissions, 1 données existantes = 9 critères). PASS.
- **G13** : 0 chiffre inventé ; les seuils non sourcés (plafond, fenêtre de fraîcheur, délai de re-tentatives, fenêtre de conversion 60 jours, seuil de plausibilité anti-fraude US-09) sont marqués `[À VALIDER]`/`[HYPOTHÈSE]`, jamais codés en dur avec une valeur fictive ; les 9 programmes, le schéma à 20 champs et les personas "Jeune actif"/"Entrepreneur" sont repris tels quels de project-context.md. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]` et `[HYPOTHÈSE]` subsistent (annotations autorisées). PASS.
- **G17** : la combinaison arbitrage à 2 identités connues + fiche de conformité bloquante par programme + divulgation embarquée dans le payload + garde-fou de plausibilité déclarative (US-09) n'est reproductible par un concurrent sans adapter à son propre modèle de plafonds, de cercle fermé et de commission différée. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous (étendu à la chaîne complète jusqu'à la confirmation).

**Vérifié :** dérouler US-01 → US-03 → US-04 → US-09 sur le cas Trade Republic, du prompt IA à la conversion confirmée (chaîne complète jusqu'au NSM).
`Read project-context.md` (BASE RÉELLE D'EMMANUEL, confirme Trade Republic comme l'un des 9 programmes réels) : un demandeur (jeune actif) demande "code de parrainage Trade Republic" à un assistant IA → clic sur la fiche Trade Republic (US-01 critère 1-3) → le moteur d'arbitrage (US-03 critère 1) sélectionne, entre Thomas et Emmanuel, celui qui détient un lien Trade Republic actif et non au plafond → une Attribution est créée avec canal `page_web` et un lien `https://{domaine}/r/{token}` (US-01 payload) → le demandeur clique sur ce lien, l'event `lien_redirection_suivie` est journalisé et il est redirigé en 301 vers Trade Republic (US-01 critère 3 révisé) → si l'offre Trade Republic venait à atteindre son plafond total ou expirer (ex. ni Thomas ni Emmanuel n'ont plus de lien éligible), US-04 critère 1/3 la retire automatiquement et bascule son statut en "en attente de parrain", ce que US-01 affiche alors en état "vide" → le demandeur souscrit chez Trade Republic, le parrain attribué (Thomas ou Emmanuel) constate la souscription et confirme la conversion depuis son tableau de bord (US-09 critère 1) → l'event `attribution_confirmee` est émis, le garde-fou de plausibilité (US-09 critère 2/7) valide la déclaration car cohérente avec ses redirections suivies → l'Attribution passe au statut "confirmée" et alimente le PCA-IA du mois de confirmation (kpi-framework.md §1.3). Les quatre stories s'enchaînent sans étape manquante ni contradiction de statut.

---

## Hypothèses à valider

- `[À VALIDER]` Seuil exact de re-tentatives avant de marquer un lien "invalide" (US-04 critère 2) et fenêtre exacte de fraîcheur (US-04 critère 7) : à chiffrer par @data-analyst/@ia.
- `[HYPOTHÈSE]` Seuil de 3 signalements distincts avant priorisation de re-vérification (US-06 critère 2) : à valider par @data-analyst sur les premières données réelles.
- `[HYPOTHÈSE]` Délai de traitement RGPD de 30 jours (US-08 critère 9) : à valider par @legal.
- `[À VALIDER par @fullstack/@ux]` Mécanisme exact d'authentification par lien email pour Thomas (ou Emmanuel) (US-02, US-05, US-09) : pas de mot de passe au POC, à spécifier techniquement avant développement.
- `[HYPOTHÈSE]` Fenêtre de conversion de 60 jours entre `date_generation` et `date_confirmation` (US-09 critère 9, tracking-plan.md §2.5) : à valider par @product-manager/@legal selon les délais réels de validation de prime par programme.
- `[HYPOTHÈSE]` Seuil de plausibilité anti-fraude (confirmations ≤ redirections suivies sur fenêtre de 30 jours glissants, US-09 critère 7, tracking-plan.md §2.7) : à chiffrer par @data-analyst sur les premières données réelles.
- `[À VALIDER]` legal-strategy.md doit être réévalué par @legal en configuration cercle fermé T&E (project-context.md CHOIX #2 le signale explicitement) avant que US-01/US-02/US-07 puissent être considérées comme définitivement calibrées, en particulier pour les 6 programmes régulés.

---
**Handoff → @ux, @design, @data-analyst, @fullstack, @qa**
- Fichiers produits : `/home/user/MCP/docs/product/functional-specs.md`
- Décisions prises : 9 user stories recalibrées cercle fermé T&E ; **US-02 refondue** (gestion interne du catalogue par T&E, remplace l'onboarding parrain externe déplacé en V2 — roadmap.md section 4) ; **US-07 refondue** (validation de conformité avant activation d'une offre, remplace la validation de soumission tierce) ; personas Parrain désormais nommément Thomas/Emmanuel ; toutes les enseignes d'exemple remplacées par des programmes réels de la base Emmanuel (Trade Republic, Qonto, Ramify) ; checklist de couverture du parcours mise à jour (onboarding parrain externe explicitement V2) ; DoR/DoD alignés sur le schéma Emmanuel.
- Points d'attention : fiche de conformité par programme = prérequis bloquant en Definition of Ready (US-01, US-02, US-07), enjeu renforcé par l'inclusion des banques/fintech/crypto dès le V1 ; plusieurs seuils numériques `[À VALIDER]`/`[HYPOTHÈSE]` ne doivent jamais être codés en dur ; persona demandeur désormais aligné sur "le jeune actif (A1)" et "l'entrepreneur (A2)" (corrective d'alignement 2026-07-20, cf. brand-platform.md §2.1/2.2) ; legal-strategy.md reste à refresh suite à CHOIX #2 (signalé, pas corrigé ici).
- Agents spécialisés recommandés : testeur-persona demandeur (Jeune actif/Entrepreneur), testeur-persona T&E, testeur-client gestionnaire de programme, auditeur conformité par programme (voir tableau dédié).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de specs, aucun code produit). Actions futures signalées pour @fullstack/@infrastructure au moment de l'implémentation (rate limits, mécanisme d'authentification par lien email, verrouillage transactionnel du moteur d'arbitrage, endpoint `GET /r/{token}` en priorité haute cf. tracking-plan.md Handoff, import initial des 9 offres depuis `data/base-parrainage-emmanuel-v3.xlsx`).
---
