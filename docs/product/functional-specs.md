<!-- Version: 2026-07-20T00:00 — @product-manager — Specs fonctionnelles Phase 0 (parcours critiques marketplace à rotation de parrains) -->

# Specs fonctionnelles — Parrainage-IA

## Résumé exécutif

- 8 user stories : 4 parcours critiques minimum (US-01 à US-04, template complet) + 4 stories de couverture du parcours marketplace (US-05 à US-08, template allégé où pertinent).
- Triage par complexité appliqué : les stories sans UI (moteur de rotation, retrait automatique) utilisent le template allégé (JTBD + critères + payload + events).
- Checklist de couverture du parcours (§ fin de document) : chaque point de la checklist bloquante a une story ou une exclusion documentée avec raison business.
- Divulgation d'affiliation traitée comme exigence produit non négociable (US-01, DoD transversal), conformément à legal-strategy.md §3.
- DoR/DoD en fin de document pour que @fullstack code sans poser de question.

---

## US-01 : Consulter une offre et récupérer un lien de parrainage attribué

**Persona** : Léa | **Epic** : Catalogue d'offres + Moteur de rotation/attribution | **Dépendances** : US-03 (moteur d'attribution), Épic 1 roadmap.md (pages de conformité, divulgation embarquée) | **RICE : R5/I5/C4 → 100**

#### Job-to-be-done
En tant que Léa, je veux consulter la fiche de parrainage d'une enseigne et récupérer un lien attribué afin d'obtenir un parrainage vérifié sans chercher ailleurs (lié au KPI North Star : parrainages confirmés attribués à une réponse IA/mois).

#### Contexte de navigation
Origine : citation par un assistant IA (lien direct vers la page enseigne) ou accès direct au catalogue. Déclencheur : clic sur le lien cité par l'IA, ou clic sur le CTA "Obtenir mon lien de parrainage" depuis la fiche enseigne. Destination succès : lien attribué affiché + redirection vers la page de souscription officielle de l'enseigne (paramètre de tracking d'attribution dans l'URL). Destination échec : message "Aucune offre disponible" avec CTA vers le catalogue général.

#### Données et champs
N/A — story sans saisie (page de consultation, Léa ne remplit aucun champ). Données affichées : nom enseigne, date de dernière vérification, statut de l'offre, mention de divulgation d'affiliation (obligatoire, non masquable).

#### 5 états UI
- **Défaut** : fiche enseigne affichée avec statut "vérifié le [date]", CTA "Obtenir mon lien de parrainage" actif, mention de divulgation visible au-dessus du CTA.
- **Loading** : après clic CTA, bouton désactivé + indicateur de chargement, durée max 3 secondes avant bascule automatique en état erreur.
- **Vide** : aucune offre active pour l'enseigne demandée (expirée/saturée) → message exact "Cette offre n'est plus disponible actuellement." + CTA "Voir les autres enseignes vérifiées" vers le catalogue.
- **Erreur** : échec de génération du lien (timeout moteur, pool vide au moment du clic) → message exact "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." + bouton "Réessayer".
- **Succès** : lien attribué affiché avec bouton "Continuer vers [Enseigne]" + confirmation "Votre lien de parrainage vérifié le [date] est prêt."

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given une offre EDF active avec au moins un parrain éligible dans le pool, When Léa clique sur "Obtenir mon lien de parrainage", Then le moteur attribue un parrain et affiche un lien unique en moins de 2 secondes.
2. (Happy path) Given Léa arrive via un lien cité par un assistant IA sur la fiche EDF, When la page se charge, Then la date de dernière vérification et le statut "vérifié" s'affichent au-dessus du lien, avec la mention de divulgation d'affiliation visible sans clic supplémentaire.
3. (Happy path) Given un lien attribué généré, When Léa clique sur le lien "Continuer vers [Enseigne]", Then elle est redirigée vers la page de souscription officielle de l'enseigne avec le paramètre de tracking d'attribution dans l'URL.
4. (Erreur) Given aucune offre valide pour l'enseigne demandée (offre expirée), When Léa charge la page, Then le message exact "Cette offre n'est plus disponible actuellement." s'affiche avec le CTA vers le catalogue.
5. (Erreur) Given le moteur d'attribution est indisponible ou en timeout, When Léa clique sur "Obtenir mon lien de parrainage", Then après 3 secondes maximum le message exact "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." s'affiche avec un bouton "Réessayer".
6. (Cas limite — double-clic) Given Léa clique deux fois rapidement sur "Obtenir mon lien de parrainage", When le second clic survient avant la fin du traitement du premier, Then une seule Attribution est créée et un seul lien est affiché (le bouton est désactivé pendant le traitement).
7. (Cas limite — timeout) Given la génération du lien dépasse 3 secondes, When le délai est atteint, Then l'UI bascule automatiquement en état erreur (jamais de chargement infini).
8. (Permissions) Given Léa n'a pas de compte (parcours B2C anonyme), When elle consulte la page et récupère un lien, Then aucune authentification n'est requise et aucun identifiant civil n'est collecté (cohérent avec legal-strategy.md §6a, minimisation RGPD).
9. (Données existantes) Given l'offre EDF existe déjà avec 3 parrains éligibles dans le pool et une première Attribution a eu lieu le matin même, When Léa (deuxième visite le même jour) récupère un lien l'après-midi, Then le parrain attribué peut différer du premier tour selon la rotation FIFO (pas nécessairement le même parrain à chaque requête).

#### Payload API
- `POST /api/v1/offres/{enseigne_id}/attribution` — création d'une Attribution et génération du lien.
- Auth : aucune (accès anonyme, cohérent avec le parcours B2C sans compte).
- Rate limit : `[À VALIDER par @infrastructure]` — à définir selon la capacité serveur ; recommandation qualitative : limiter par IP/session pour prévenir la génération abusive de liens (protection anti-fraude), valeur exacte non inventée ici.
- Request : `{ "enseigne_id": string, "canal_source": "page_web" | "api_json", "session_id": string (anonyme, non lié à une identité civile) }`
- Response 201 : `{ "attribution_id": string, "lien_genere": string (URL), "parrain_id_attribue": string (interne, jamais exposé côté front), "date_verification_offre": string (ISO 8601) }`
- Response 404 : offre inexistante ou expirée → `{ "error": "offre_indisponible" }`
- Response 409 : pool éligible vide au moment de la requête → `{ "error": "pool_vide" }`
- Response 503 : moteur d'attribution indisponible/timeout → `{ "error": "moteur_indisponible" }`

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `page_offre_vue` | Chargement de la fiche enseigne | enseigne_id, canal_source (page/API), referrer | Awareness |
| `lien_parrainage_demande` | Clic sur "Obtenir mon lien de parrainage" | enseigne_id, session_id anonyme | Considération |
| `lien_parrainage_genere` | Attribution réussie (201) | enseigne_id, attribution_id | Conversion intermédiaire |
| `lien_parrainage_echec` | Erreur de génération (404/409/503) | enseigne_id, type_erreur | Frein |
| `offre_indisponible_affichee` | Pool vide ou offre expirée affichée sans action possible | enseigne_id | Frein |

#### Scénarios persona concrets

1. Léa demande à ChatGPT "code de parrainage EDF" un mardi soir ; l'assistant cite la fiche EDF de Parrainage-IA ; elle clique, obtient un lien vérifié il y a 2 jours, s'inscrit chez EDF le soir même.
2. Léa consulte directement la fiche NordVPN un dimanche soir avant de payer son abonnement annuel ; le pool est momentanément vide (tous les parrains au plafond) ; elle voit le message d'indisponibilité et le CTA vers une autre offre VPN du catalogue.
3. Léa clique deux fois rapidement sur le bouton par réflexe (double-tap accidentel sur mobile) pendant le chargement ; un seul lien est généré, une seule redirection a lieu.
4. Léa revient consulter la fiche Box Repas deux semaines après une première visite ; le lien affiché correspond à un parrain différent du premier tour (rotation), la date de vérification est plus récente.
5. Léa est en 4G faible dans le métro ; le chargement du lien dépasse 3 secondes ; elle voit le message d'erreur de timeout avec bouton "Réessayer", réessaie et obtient son lien.

#### Definition of Done
UI 5 états conformes ci-dessus ; endpoint `/api/v1/offres/{enseigne_id}/attribution` testé sur les 4 réponses (201/404/409/503) ; les 5 scénarios persona reproductibles en recette ; test E2E à créer par @qa (nom proposé : `tests/e2e/us-01-lien-attribue.spec.ts`, fichier non encore créé) ; screenshot conforme au registre visuel brand-platform.md §7 (mention de vérification datée visible, pas de code visuel type site de bons plans).

#### Notes @qa / @ux / @fullstack
@qa : vérifier particulièrement le critère 6 (double-clic = 1 seule Attribution, pas de doublon en base). @ux : la mention de divulgation (critère 2) doit être au-dessus du CTA, jamais en dessous ou en petit texte (brand-platform.md §4 valeur Discrétion = transparence visible, pas mention légale reléguée). @fullstack : le `parrain_id_attribue` ne doit jamais être exposé côté front (protection du parrain contre un ciblage direct hors rotation).

---

## US-02 : Soumettre un lien de parrainage et entrer dans la rotation

**Persona** : Karim | **Epic** : Onboarding/soumission parrain | **Dépendances** : Épic 1 roadmap.md (CGU internes parrains), objet métier Parrain (product-vision.md §4) | **RICE : R4/I4/C4 → 64**

#### Job-to-be-done
En tant que Karim, je veux soumettre mon lien de parrainage et entrer dans la rotation afin de faire vivre mon lien et toucher ma prime sans le griller par un pic suspect (brand-platform.md §2.2).

#### Contexte de navigation
Origine : page "Devenir parrain" ou CTA "Vous avez ce lien ? Proposez-le" depuis une fiche enseigne. Déclencheur : clic "Soumettre mon lien". Destination succès : confirmation "Votre lien est en file de vérification" + accès à "Mon espace parrain" (US-05). Destination échec : message d'erreur de validation, formulaire conservé.

#### Données et champs

| Champ | Type | Obligatoire | Validation | Limites | Exemple réaliste |
|---|---|---|---|---|---|
| enseigne_id | Select | Oui | Doit exister au catalogue hors-régulé actif | Liste fermée aux enseignes actives | "EDF" |
| lien_parrainage | Texte/URL | Oui | Format URL ou code alphanumérique selon l'enseigne | Max 500 caractères | "https://www.edf.fr/parrainage/ABC123" |
| email_contact | Email | Oui | Format email valide | Max 254 caractères | "karim.b@example.com" |
| moyen_versement | N/A à la soumission | Non | KYC différé après validation (legal-strategy.md §6b) | N/A | N/A — collecté après validation, pas à la soumission |
| cgu_acceptees | Checkbox | Oui | Doit être coché | Booléen | true |

#### 5 états UI
- **Défaut** : formulaire vide, CTA "Soumettre mon lien" désactivé tant que les champs obligatoires ne sont pas remplis.
- **Loading** : après clic, indicateur affiché, durée max 2 secondes (validation de format uniquement, pas de contrôle live du lien à la soumission).
- **Vide** : aucune enseigne hors-régulé disponible pour proposer un lien → message exact "Aucune enseigne disponible pour le moment." + CTA "Être averti par email".
- **Erreur** : format de lien non reconnu pour l'enseigne choisie → message exact "Ce lien ne correspond pas au format attendu pour cette enseigne." + les autres champs restent remplis.
- **Succès** : "Votre lien est en file de vérification. Vous serez averti par email une fois validé." + redirection vers "Mon espace parrain".

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Karim remplit tous les champs obligatoires avec un lien EDF au format valide et coche les CGU, When il clique "Soumettre mon lien", Then une entrée Parrain/lien au statut "en attente de vérification" est créée et la confirmation s'affiche.
2. (Happy path) Given Karim a déjà un lien validé pour NordVPN, When il soumet un second lien pour EDF, Then les deux liens coexistent sous son profil Parrain, chacun avec son propre statut et quota.
3. (Happy path) Given un lien soumis passe la vérification, When son statut passe à "actif", Then Karim entre dans le pool de rotation de l'enseigne correspondante et reçoit un email de confirmation.
4. (Erreur) Given Karim soumet un lien dans un format non reconnu pour l'enseigne choisie, When il clique "Soumettre", Then le message exact "Ce lien ne correspond pas au format attendu pour cette enseigne." s'affiche sans effacer les autres champs.
5. (Erreur) Given Karim ne coche pas la case CGU, When il clique "Soumettre mon lien", Then le bouton reste désactivé et le message "Vous devez accepter les CGU parrains pour continuer." s'affiche.
6. (Cas limite — champ vide) Given le champ email_contact est laissé vide, When Karim clique "Soumettre", Then la validation bloque l'envoi sur ce champ précis sans soumettre le formulaire.
7. (Cas limite — double soumission) Given Karim clique deux fois rapidement sur "Soumettre mon lien", When le second clic survient avant la fin du traitement du premier, Then une seule entrée est créée en base (pas de doublon).
8. (Permissions) Given Karim n'a pas encore de compte parrain, When il soumet son premier lien, Then un compte Parrain minimal (email + CGU acceptées) est créé automatiquement, sans étape d'inscription séparée.
9. (Données existantes) Given Karim a un lien EDF au statut "suspendu" (plafond atteint le mois précédent), When la nouvelle période démarre, Then son quota est réinitialisé automatiquement et son statut repasse à "actif" sans nouvelle action de sa part.

#### Payload API
- `POST /api/v1/parrains/{parrain_id}/liens` — soumission d'un lien.
- Auth : lien de confirmation par email (compte minimal créé à la soumission, pas de mot de passe au POC) — mécanisme exact `[À VALIDER par @fullstack/@ux]`.
- Rate limit : `[À VALIDER par @infrastructure]`.
- Request : `{ "enseigne_id": string, "lien_parrainage": string, "email_contact": string, "cgu_acceptees": boolean }`
- Response 201 : `{ "lien_id": string, "statut": "en_attente_verification" }`
- Response 400 : `{ "error": "format_lien_invalide" }`
- Response 409 : `{ "error": "lien_deja_soumis" }`

#### Events analytics

| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `formulaire_soumission_vu` | Chargement de la page soumission | enseignes_disponibles_count | Awareness |
| `lien_soumis` | Soumission réussie (201) | enseigne_id, parrain_id | Activation |
| `lien_soumission_echec` | Erreur de validation/format | enseigne_id, type_erreur | Frein |
| `lien_valide_actif` | Statut passe à "actif" après vérification | enseigne_id, parrain_id, delai_verification_jours | Activation confirmée |

#### Scénarios persona concrets

1. Karim, après avoir ouvert un compte NordVPN, retrouve son lien égaré dans ses emails et le soumet le soir même depuis son mobile.
2. Karim se trompe de format en soumettant son lien EDF (colle l'URL complète au lieu du code), voit le message d'erreur, corrige et resoumet avec succès.
3. Karim oublie de cocher les CGU, le bouton reste grisé, il relit la mention et coche, la soumission passe.
4. Karim, parrain actif depuis 2 mois sur EDF, atteint son plafond mi-mois, voit son statut "en pause jusqu'au [date]" dans son espace, puis redevient actif le mois suivant sans rien faire.
5. Karim soumet deux liens le même jour (EDF et Box Repas), retrouve les deux dans son espace parrain avec des statuts indépendants.

#### Definition of Done
UI 5 états conformes ; endpoint testé sur 201/400/409 ; les 5 scénarios reproductibles en recette ; test E2E à créer par @qa (nom proposé : `tests/e2e/us-02-soumission-parrain.spec.ts`) ; CGU internes parrains (roadmap.md épic 1, item 9) liées depuis le formulaire.

#### Notes @qa / @ux / @fullstack
@legal : le mécanisme d'authentification par lien email (sans mot de passe) reste à valider avant prod. @ux : le champ `lien_parrainage` doit accepter aussi bien une URL complète qu'un code brut selon l'enseigne (validation contextuelle par `enseigne_id`).

---

## US-03 : Attribuer un filleul à un parrain en respectant les plafonds (moteur de rotation)

**Persona** : N/A — story technique sans utilisateur direct (bénéficie indirectement à Léa via US-01 et à Karim via US-02) | **Epic** : Moteur de rotation/attribution | **Dépendances** : US-02 (pool de parrains existant), Épic 2 roadmap.md (catalogue d'offres) | **RICE : R4/I5/C3 → 60**

#### Job-to-be-done
En tant que produit, attribuer automatiquement un filleul à un parrain éligible en respectant les plafonds anti-fraude afin de garantir une rotation équitable et protéger les primes des parrains (product-vision.md §2).

#### Données et champs / 5 états UI
N/A — story sans UI (template allégé, cf. product-manager.md règle de triage par complexité).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given un pool de 3 parrains éligibles pour l'offre EDF (aucun au plafond), When une requête d'attribution arrive, Then le moteur sélectionne le parrain dont `date_dernier_tour` est la plus ancienne.
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

**Persona** : N/A — story technique (bénéficie indirectement à Léa : jamais de lien mort affiché ; au gestionnaire de programme : pas de sur-sollicitation d'un parrain) | **Epic** : Vérification de fraîcheur automatisée | **Dépendances** : Épic 2 roadmap.md (catalogue d'offres), US-03 (moteur d'attribution) | **RICE : R4/I5/C3 → 60**

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

**Persona** : Karim | **Epic** : Onboarding/soumission parrain | **Dépendances** : US-02, US-03 | **RICE : R3/I3/C4 → 36**

#### Job-to-be-done
En tant que Karim, je veux consulter le statut de mes liens et ma prime estimée afin de savoir si mon lien est actif dans la rotation et s'il approche de son plafond.

#### 5 états UI
- **Défaut** : liste des liens soumis avec statut (en attente/actif/en pause/suspendu), quota utilisé/max par offre.
- **Loading** : chargement du tableau, durée max 2 secondes.
- **Vide** : aucun lien soumis → message "Vous n'avez pas encore soumis de lien." + CTA "Soumettre mon premier lien" (US-02).
- **Erreur** : échec de chargement → message exact "Impossible de charger votre espace parrain. Réessayez." + bouton Réessayer.
- **Succès** : N/A pour un écran de consultation pure — la confirmation se fait à l'affichage des données à jour.

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Karim a 2 liens actifs (EDF, NordVPN), When il ouvre son tableau de bord, Then il voit les 2 liens avec leur quota utilisé/max respectif.
2. (Happy path) Given un des liens de Karim est "en pause" (plafond atteint), When il consulte son tableau de bord, Then le statut affiche "en pause jusqu'au [date de réinitialisation]".
3. (Happy path) Given une Attribution liée à un lien de Karim est passée à "confirmée", When il consulte son tableau de bord, Then sa prime estimée cumulée reflète cette conversion.
4. (Erreur) Given le service de chargement du tableau échoue, When Karim ouvre la page, Then le message exact "Impossible de charger votre espace parrain. Réessayez." s'affiche avec bouton Réessayer.
5. (Erreur) Given Karim accède à l'URL de son tableau de bord sans lien de session valide (email expiré), When la page se charge, Then il est redirigé vers une page de renvoi de lien de connexion.
6. (Cas limite — aucun lien) Given Karim n'a jamais soumis de lien, When il ouvre son tableau de bord, Then l'état "vide" s'affiche avec le CTA vers US-02.
7. (Cas limite — session expirée en cours de consultation) Given le lien de session de Karim expire pendant qu'il consulte la page, When il tente une action (ex. rafraîchir), Then il est invité à redemander un lien de connexion sans perte des données déjà affichées à l'écran.
8. (Permissions) Given Karim tente d'accéder au tableau de bord d'un autre parrain via une URL modifiée, When la requête est faite, Then l'accès est refusé (403) — un parrain ne voit que ses propres liens.
9. (Données existantes) Given Karim a un lien suspendu pour fraude (US-07), When il consulte son tableau de bord, Then ce lien est visible avec le statut "suspendu" et un message générique, sans détail de l'enquête anti-fraude.

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

**Persona** : Léa (et Karim pour son propre lien) | **Epic** : Vérification de fraîcheur automatisée | **Dépendances** : US-04 | **RICE : R3/I4/C4 → 48**

#### Job-to-be-done
En tant que Léa, je veux signaler qu'un lien de parrainage ne fonctionne plus afin que le registre reste fiable pour les prochains demandeurs (renforce la preuve de Fraîcheur, brand-platform.md §3).

#### 5 états UI
- **Défaut** : lien "Ce lien ne fonctionne pas ?" visible sous chaque lien attribué (US-01).
- **Loading** : après clic, indicateur bref, durée max 1 seconde.
- **Vide** : N/A — pas d'état vide pertinent pour une action de signalement ponctuelle.
- **Erreur** : échec d'enregistrement du signalement → message exact "Votre signalement n'a pas pu être enregistré. Réessayez." + bouton Réessayer.
- **Succès** : "Merci, votre signalement a été transmis pour vérification." (pas de détail sur la suite donnée, pour ne pas exposer le fonctionnement anti-fraude).

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Léa constate que le lien attribué ne fonctionne pas, When elle clique "Ce lien ne fonctionne pas ?", Then un signalement est enregistré et lié à l'Attribution concernée.
2. (Happy path) Given un lien reçoit 3 signalements distincts `[HYPOTHÈSE — seuil non chiffré]` en moins de 24h, When le 3e signalement est enregistré, Then le lien est mis en priorité de re-vérification manuelle (US-07).
3. (Happy path) Given Karim signale lui-même son propre lien comme non fonctionnel, When il le fait depuis son tableau de bord (US-05), Then le lien passe directement au statut "en re-vérification" sans attendre plusieurs signalements tiers.
4. (Erreur) Given le service de signalement est indisponible, When Léa clique "Ce lien ne fonctionne pas ?", Then le message exact "Votre signalement n'a pas pu être enregistré. Réessayez." s'affiche.
5. (Erreur) Given Léa signale un lien déjà au statut "invalide", When elle clique le bouton, Then un message informe que le signalement est déjà pris en compte, sans créer de doublon.
6. (Cas limite — double-clic) Given Léa clique deux fois rapidement sur le bouton de signalement, When le second clic survient avant la fin du traitement, Then un seul signalement est enregistré.
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

## US-07 : Valider ou rejeter une soumission de parrain (back-office admin)

**Persona** : Thomas ou Emmanuel (opérateur back-office au POC, tout futur administrateur ensuite) | **Epic** : Back-office admin | **Dépendances** : US-02, objet métier Parrain | **RICE : R2/I4/C5 → 40**

#### Job-to-be-done
En tant qu'opérateur back-office, je veux valider ou rejeter une soumission de lien de parrain afin de garantir qu'aucun lien invalide ou en violation des CGU d'un programme n'entre dans le pool de rotation (legal-strategy.md §4).

#### Données et champs
N/A — pas de formulaire de saisie complexe : action binaire (valider/rejeter) sur une soumission existante, avec champ optionnel "motif de rejet" (texte libre, max 500 caractères, obligatoire si rejet).

#### 5 états UI
- **Défaut** : liste des soumissions "en attente de vérification" avec lien, enseigne, date de soumission.
- **Loading** : après clic Valider/Rejeter, indicateur bref, durée max 2 secondes.
- **Vide** : aucune soumission en attente → message "Aucune soumission à traiter."
- **Erreur** : échec d'enregistrement de la décision → message exact "L'action n'a pas pu être enregistrée. Réessayez." + bouton Réessayer.
- **Succès** : "Soumission validée, le parrain est actif." ou "Soumission rejetée, le parrain a été notifié."

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given une soumission de Karim en attente pour EDF, When l'opérateur clique "Valider", Then le lien passe au statut "actif", Karim reçoit un email de confirmation, et le lien entre dans le pool de rotation (US-03).
2. (Happy path) Given une soumission ne correspond pas aux CGU du programme (ex. EDF interdit la diffusion tierce), When l'opérateur clique "Rejeter" avec un motif, Then le lien passe au statut "rejeté" et Karim reçoit le motif par email.
3. (Happy path) Given un opérateur consulte la fiche de conformité de l'enseigne (legal-strategy.md §7 point 6) avant de statuer, When il valide en connaissance de cause, Then la décision est journalisée avec l'identifiant de l'opérateur.
4. (Erreur) Given le service d'enregistrement de décision échoue, When l'opérateur clique Valider ou Rejeter, Then le message exact "L'action n'a pas pu être enregistrée. Réessayez." s'affiche et le statut reste "en attente".
5. (Erreur) Given l'opérateur tente de rejeter sans motif, When il clique "Rejeter", Then le bouton reste bloqué tant que le champ motif n'est pas rempli.
6. (Cas limite — double traitement) Given deux opérateurs traitent la même soumission simultanément, When les deux actions arrivent en même temps, Then seule la première est appliquée, la seconde reçoit un message "Déjà traité par un autre opérateur".
7. (Cas limite — annulation) Given une soumission vient d'être validée par erreur, When l'opérateur la repasse en "suspendu" dans les 5 minutes `[HYPOTHÈSE — délai non validé]`, Then le parrain sort immédiatement du pool de rotation.
8. (Permissions) Given un utilisateur non-administrateur tente d'accéder au back-office, When il charge l'URL, Then l'accès est refusé (403) et redirigé vers la page d'accueil.
9. (Données existantes) Given une enseigne n'a pas encore de fiche de conformité produite (legal-strategy.md §7 point 6), When l'opérateur ouvre une soumission pour cette enseigne, Then un avertissement bloquant "Fiche de conformité manquante pour cette enseigne" empêche la validation tant que la fiche n'est pas renseignée.

#### Payload API
`POST /api/v1/admin/soumissions/{lien_id}/decision` — Auth : session admin (rôle back-office) — Request : `{ "decision": "valider" | "rejeter", "motif": string (obligatoire si rejeter) }` — Response 200 : `{ "statut": "actif" | "rejete" }` — Response 403 si non-admin — Response 409 si déjà traité.

#### Events analytics
| Event | Trigger | Propriétés | Étape funnel |
|---|---|---|---|
| `soumission_validee` | Décision "valider" enregistrée | lien_id, enseigne_id, admin_id | Opération |
| `soumission_rejetee` | Décision "rejeter" enregistrée | lien_id, enseigne_id, motif | Opération |

#### Definition of Done
UI 5 états conformes ; endpoint testé 200/403/409 ; le garde-fou "fiche de conformité manquante" (critère 9) est un blocage produit non contournable, cohérent avec legal-strategy.md §7.

#### Notes @legal
Le critère 9 traduit directement l'exigence de legal-strategy.md §4/§7 : aucune enseigne ne doit être ouverte à la rotation sans fiche de conformité CGU documentée.

---

## US-08 : Exercer ses droits RGPD (accès, rectification, opposition, suppression)

**Persona** : Karim (données KYC) et Léa (données de tracking d'attribution) | **Epic** : Onboarding/soumission parrain + Tracking d'attribution IA→conversion | **Dépendances** : Épic 1 (pages de conformité), objets métier Parrain et Attribution/Conversion | **RICE : R2/I5/C5 → 50**

#### Job-to-be-done
En tant que Karim (ou Léa), je veux accéder à mes données, les rectifier, m'opposer à leur traitement ou les faire supprimer afin d'exercer mes droits RGPD (legal-strategy.md §6).

#### Données et champs / 5 états UI
N/A — story couvrant plusieurs points d'entrée (formulaire de contact dédié + export automatisé), pas un écran unique. Traité comme story de conformité transversale : voir critères ci-dessous.

#### Critères d'acceptance Given/When/Then

1. (Happy path) Given Karim demande l'accès à ses données via le formulaire dédié (page de conformité), When la demande est soumise avec son email vérifié, Then un export de ses données (liens, statuts, historique de commissions) lui est transmis sous le délai légal.
2. (Happy path) Given Léa souhaite s'opposer au tracking d'attribution, When elle utilise le lien "gérer mes préférences" présent sur toute page consultée, Then son identifiant de session anonyme cesse d'être associé à de nouvelles Attributions.
3. (Happy path) Given Karim souhaite rectifier son email de contact, When il soumet la demande via son tableau de bord (US-05) ou le formulaire dédié, Then l'email est mis à jour après vérification.
4. (Erreur) Given une demande de suppression est soumise alors que Karim a des commissions en attente de versement, When la demande est traitée, Then la suppression des données d'identité est différée jusqu'à l'obligation légale de conservation comptable (legal-strategy.md §6b, 10 ans), avec explication claire du délai.
5. (Erreur) Given une demande RGPD est soumise depuis un email non vérifié, When elle est reçue, Then elle est mise en attente de vérification d'identité avant tout traitement.
6. (Cas limite) Given Karim demande la suppression de son compte alors qu'un lien est actuellement dans le pool de rotation, When la demande est traitée, Then le lien est immédiatement retiré du pool avant toute suppression de compte.
7. (Cas limite) Given Léa exerce son droit d'opposition après plusieurs Attributions déjà créées, When la demande est traitée, Then les Attributions passées ne sont pas supprimées rétroactivement (nécessaires au calcul de commissions déjà dues) mais aucune nouvelle Attribution n'est associée à sa session.
8. (Permissions) Given une demande RGPD concerne les données d'un tiers, When elle est soumise sans preuve d'identité correspondante, Then elle est rejetée avec message explicatif.
9. (Données existantes) Given Karim a déjà exercé un droit d'accès dans les 30 derniers jours `[HYPOTHÈSE — délai de traitement à valider par @legal]`, When il soumet une nouvelle demande, Then elle est traitée normalement (le RGPD n'impose pas de limite de fréquence, seulement un délai de réponse).

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

## Checklist de couverture du parcours (bloquante)

| Parcours | Story ou exclusion documentée |
|---|---|
| Acquisition/onboarding demandeur | US-01 (consultation offre + lien attribué) |
| Onboarding parrain | US-02 (soumission), US-07 (validation back-office) |
| Core loop (JTBD principal, CRUD) | US-01, US-02, US-03, US-04, US-05, US-06 |
| Paiement (souscription/désabonnement) | **Exclu, N/A justifié** : le modèle n'est pas un abonnement SaaS payé par Léa ou Karim ; le seul flux financier est le versement de commission à Karim (traité en V1.5 via prestataire de paiement dédié, cf. roadmap.md exclusions) |
| Compte (profil/mdp/email, suppression) | US-05 (tableau de bord), US-08 (RGPD, inclut suppression) — pas de mot de passe au POC (auth par lien email) |
| Droits RGPD | US-08 |
| Erreurs transversales (session expirée, 404, 403, double soumission) | Couvertes dans les critères de US-01 (double-clic), US-02 (double soumission), US-05 (session expirée, 403), US-07 (403, double traitement) |
| Multi-utilisateurs (rôles/permissions/admin) | US-07 (rôle admin back-office), critères permissions dans chaque story |
| Réactivation (inactif → retour) | Couvert par le critère 9 de US-02 (réinitialisation automatique de quota) ; réactivation d'un ancien parrain totalement inactif = **hors V1, N/A** — pas de mécanique de relance email spécifique au POC, à instruire en V1.5 avec le reste du CRM parrain |

---

## Definition of Ready (avant qu'une story entre en développement)

1. Objets métier Enseigne/Offre, Parrain, Attribution/Conversion modélisés en base (product-vision.md §4).
2. Fiche de conformité CGU produite pour l'enseigne concernée (legal-strategy.md §4/§7 point 6) — bloquant pour toute story touchant une enseigne réelle (US-01, US-02, US-07).
3. Pages de conformité (CGU, confidentialité, divulgation) publiées (roadmap.md épic 1) avant toute mise en ligne publique de US-01/US-02/US-06.
4. Événements analytics de la story validés par @data-analyst (schéma de tracking-plan).
5. Maquette validée par @ux pour toute story avec UI (US-01, US-02, US-05, US-06, US-07).

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
| testeur-persona Léa | Testeur | Rejouer les 5 scénarios de US-01 et US-06 sur un environnement de recette avec de vrais prompts IA | US-01, US-06 : la promesse de fraîcheur/vérification n'a jamais été testée sur un vrai parcours de bout en bout | Haute |
| testeur-persona Karim | Testeur | Rejouer les scénarios de US-02/US-05 et challenger la protection anti-fraude perçue | US-02, US-05 : frustrations `[HYPOTHÈSE]` de brand-platform.md non confirmées par interview | Haute |
| testeur-client gestionnaire de programme | Testeur | Valider que le flux d'attribution généré par US-03 reste indiscernable d'un parrainage organique aux yeux de l'émetteur | US-03 : critère central du modèle marketplace, non testable par un E2E générique (brand-platform.md §2.2) | Haute |
| auditeur conformité CGU par programme | Expertise métier | Produire et maintenir la fiche de conformité par enseigne (legal-strategy.md §4/§7 point 6) avant chaque intégration au catalogue | US-01, US-02, US-07 : bloquant en Definition of Ready, processus récurrent non couvert par un agent générique | Haute |

---

## Gates BLOQUANT vérifiées

- **G1** : 8 user stories + checklist de couverture + DoR/DoD présents, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : personas Léa et Karim identiques à brand-platform.md/project-context.md, Grep cohérent sur les deux noms. PASS.
- **G7** : 0 contradiction avec product-vision.md (mécanique de rotation, objets métier), legal-strategy.md (fiche de conformité bloquante en DoR, divulgation en US-01), roadmap.md (épics et dépendances repris à l'identique). PASS.
- **G12** : chaque story a un JTBD verbe+objet+bénéfice, chaque critère est binaire (Given/When/Then), chaque DoD est vérifiable. PASS.
- **G13** : 0 chiffre inventé ; les seuils non sourcés (plafond, fenêtre de fraîcheur, délai de re-tentatives) sont marqués `[À VALIDER]`/`[HYPOTHÈSE]`, jamais codés en dur avec une valeur fictive. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]` et `[HYPOTHÈSE]` subsistent (annotations autorisées). PASS.
- **G17** : la combinaison rotation FIFO pondérée + fiche de conformité bloquante par enseigne + divulgation embarquée dans le payload n'est reproductible par un concurrent sans adapter à son propre modèle de plafonds. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler US-01 → US-03 → US-04 sur le cas EDF, du prompt IA à la conversion attribuée.
`Read docs/product/product-vision.md` (bloc Vérifié) : Léa demande "code de parrainage EDF" à un assistant IA → clic sur la fiche EDF (US-01 critère 1-3) → le moteur (US-03 critère 1) sélectionne le parrain le moins récemment servi dans le pool EDF → une Attribution est créée avec canal `page_web` (US-01 payload) → si l'offre EDF venait à atteindre son plafond total ou expirer, US-04 critère 1/3 la retire automatiquement et bascule son statut en "en attente de parrain", ce que US-01 affiche alors en état "vide" (message "Cette offre n'est plus disponible actuellement."). Les trois stories s'enchaînent sans étape manquante ni contradiction de statut.

---

## Hypothèses à valider

- `[À VALIDER]` Seuil exact de re-tentatives avant de marquer un lien "invalide" (US-04 critère 2) et fenêtre exacte de fraîcheur (US-04 critère 7) : à chiffrer par @data-analyst/@ia.
- `[HYPOTHÈSE]` Seuil de 3 signalements distincts avant priorisation de re-vérification (US-06 critère 2) : à valider par @data-analyst sur les premières données réelles.
- `[HYPOTHÈSE]` Délai de 5 minutes pour annuler une validation back-office par erreur (US-07 critère 7) et délai de traitement RGPD de 30 jours (US-08 critère 9) : à valider par @legal.
- `[À VALIDER par @fullstack/@ux]` Mécanisme exact d'authentification par lien email pour Karim (US-02, US-05) : pas de mot de passe au POC, à spécifier techniquement avant développement.

---
**Handoff → @ux, @design, @data-analyst, @fullstack, @qa**
- Fichiers produits : `/home/user/MCP/docs/product/functional-specs.md`
- Décisions prises : 8 user stories (4 critiques full template + 4 de couverture, triage par complexité appliqué aux stories backend US-03/US-04) ; checklist de couverture du parcours traitée avec exclusion justifiée (paiement SaaS N/A, réactivation hors V1) ; DoR/DoD définis pour développement sans question.
- Points d'attention : fiche de conformité par enseigne = prérequis bloquant en Definition of Ready (US-01, US-02, US-07) ; plusieurs seuils numériques `[À VALIDER]`/`[HYPOTHÈSE]` ne doivent jamais être codés en dur avec une valeur inventée, ils doivent rester configurables jusqu'à validation par @legal/@data-analyst.
- Agents spécialisés recommandés : testeur-persona Léa, testeur-persona Karim, testeur-client gestionnaire de programme, auditeur conformité CGU par programme (voir tableau dédié).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de specs, aucun code produit). Actions futures signalées pour @fullstack/@infrastructure au moment de l'implémentation (rate limits, mécanisme d'authentification par lien email, verrouillage transactionnel du moteur d'attribution).
---
