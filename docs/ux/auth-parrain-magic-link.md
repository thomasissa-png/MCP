<!-- Version: 2026-07-20T05:00 — @ux — Spécification UX auth parrain par lien email (lève blocker P1-a, volet UX) -->

# Authentification espace parrain par lien email (magic link) — Parrainly V1 cercle fermé T&E

## Résumé exécutif

- Lève le volet UX du blocker P1-a (`docs/reviews/checkpoint-specs-phase1.md` §4, `[À VALIDER par @fullstack/@ux]`, functional-specs.md US-02/05/07/09). Débloque le codage de l'espace parrain (`/parrain/*`).
- Cercle FERMÉ V1 : 2 comptes connus (Thomas, Emmanuel), aucune inscription, aucune création de compte publique. Mécanisme = magic link email, standard de l'industrie (pas de mot de passe), déjà posé comme principe dans functional-specs.md (checklist §"Compte") et information-architecture.md (`/parrain/connexion`).
- Écran de connexion traité en **modal popup** (fermable X / clic dehors / Escape, header/footer visibles derrière), conformément à la préférence fondateur sur l'auth — appliqué ici même si le trafic est interne, pour cohérence du design system.
- 12 états couverts (les 8 demandés + 4 variantes nécessaires à la cohérence du parcours) : idle, envoi en cours, envoyé, erreur email invalide, erreur email non autorisé, erreur trop de demandes, lien expiré, lien déjà consommé, lien invalide générique, erreur technique, session active, session expirée en cours d'usage.
- 4 points techniques tranchés avec défaut recommandé pour @fullstack (durée de validité, persistance de session, limite de renvoi, comportement multi-device) — aucun laissé ouvert.

---

## 1. Parcours complet (Given/When/Then, format functional-specs.md)

**Persona** : Thomas ou Emmanuel (les 2 seuls comptes autorisés en V1) | **Dépendances** : US-02, US-05, US-07, US-09 (toutes conditionnées à cette session) | **Déclencheur** : accès à une URL `/parrain/*` sans session valide, ou clic direct sur `/parrain/connexion`.

### Diagramme textuel (parcours nominal + branches)

```
[Thomas/Emmanuel accède à /parrain/tableau-de-bord (ou tout /parrain/*) sans session]
        │
        ▼
[Modal "Se connecter" s'ouvre par-dessus la page courante] (header/footer visibles, fond assombri)
        │
        ▼
[Saisie de l'email] → CTA "Recevoir mon lien de connexion" (grisé tant que le champ n'a pas un format email valide)
        │
        ▼
[Clic CTA] → état ENVOI EN COURS (bouton désactivé + indicateur, ≤ 2s)
        │
        ▼
[Décision] Email ∈ liste autorisée (Thomas, Emmanuel) ?
   │NON → état ERREUR "email non autorisé" (message générique, ne confirme ni n'infirme l'existence d'un compte)
   │OUI
   ▼
[Décision] Fréquence de renvoi respectée (cf. §4 point 3) ?
   │NON → état ERREUR "trop de demandes" + délai d'attente affiché
   │OUI
   ▼
[Email envoyé] → état ENVOYÉ : écran "Vérifiez votre boîte mail" remplace le formulaire dans le MÊME modal
        │
        ▼
[Thomas/Emmanuel ouvre son email, clique le lien] (peut être sur un autre appareil, cf. §4 point 4)
        │
        ▼
[Landing /parrain/verifier?token=...] → état CHARGEMENT bref (vérification serveur du token)
        │
        ▼
[Décision] Statut du token ?
   │Expiré (au-delà de la durée de validité, §4 point 1) → page "Lien expiré" + CTA "Recevoir un nouveau lien" → retour formulaire (pré-rempli si email connu en session locale)
   │Déjà consommé (un usage antérieur) → page "Lien déjà utilisé" + même CTA de renvoi
   │Invalide/inconnu (altéré, mal copié) → page générique "Lien invalide" + même CTA de renvoi
   │Valide et non consommé
   ▼
[Session ouverte] cookie de session posé (durée §4 point 2) → redirection immédiate vers /parrain/tableau-de-bord
        │
        ▼
[État SESSION ACTIVE] Thomas/Emmanuel navigue librement dans /parrain/* jusqu'à expiration ou déconnexion volontaire (lien "Se déconnecter", wireframes.md écran 3 zone 1)
```

### Critères d'acceptance Given/When/Then

1. (Happy path) Given Thomas saisit son email sur le modal "Se connecter", When il clique "Recevoir mon lien de connexion", Then un email contenant un lien à usage unique lui est envoyé et l'écran bascule sur "Vérifiez votre boîte mail" sans recharger la page.
2. (Happy path) Given Thomas clique le lien reçu dans les délais de validité, When la page `/parrain/verifier` charge le token, Then une session est ouverte et il est redirigé vers `/parrain/tableau-de-bord` sans ressaisir d'information.
3. (Renvoi) Given Thomas n'a pas reçu l'email après 30 secondes, When il clique "Je n'ai rien reçu, renvoyer le lien" sur l'écran "Vérifiez votre boîte mail", Then un nouveau lien est envoyé et invalide silencieusement le précédent (un seul token valide à la fois par email, cf. §4 point 3).
4. (Erreur — email non autorisé) Given une adresse email hors du cercle T&E est saisie, When le CTA est cliqué, Then le message "Cette adresse n'est pas autorisée à accéder à l'espace parrain." s'affiche, aucun email n'est envoyé, et l'UI ne révèle jamais si l'adresse existe ou non dans un autre système.
5. (Erreur — lien expiré) Given Emmanuel clique un lien reçu il y a plus longtemps que la durée de validité (§4 point 1), When la page `/parrain/verifier` charge le token, Then le message "Ce lien de connexion a expiré." s'affiche avec un CTA direct pour en redemander un, sans qu'il ait à ressaisir son email s'il est reconnaissable depuis le contexte du clic (paramètre email dans le lien de renvoi).
6. (Erreur — lien déjà consommé) Given Thomas clique une seconde fois sur un lien déjà utilisé pour ouvrir une session (ex. depuis un ancien email retrouvé), When la page `/parrain/verifier` charge le token, Then le message "Ce lien a déjà été utilisé." s'affiche avec le même CTA de renvoi, jamais de réouverture automatique d'une session déjà consommée.
7. (Cas limite — double-clic sur le CTA d'envoi) Given Thomas clique deux fois rapidement sur "Recevoir mon lien de connexion", When le second clic survient avant la fin du traitement du premier, Then un seul email est envoyé (idempotence, bouton désactivé dès le premier clic).
8. (Permissions) Given une personne hors T&E obtient malgré tout un lien de connexion valide (fuite), When elle l'utilise, Then la session ouverte lui donne accès aux mêmes droits qu'un opérateur T&E — **aucune granularité de rôle en V1** (2 comptes = 2 opérateurs équivalents), risque signalé et accepté au regard du cercle fermé (2 personnes), à revoir en V2 si le pool s'ouvre.
9. (Session expirée en cours d'usage) Given la session de Thomas expire pendant qu'il consulte `/parrain/attributions`, When il tente une action nécessitant la session (ex. confirmer une conversion), Then il est invité à redemander un lien de connexion sans perte des données déjà affichées à l'écran (cohérent avec US-05 critère 7 de functional-specs.md), et redirigé vers la page qu'il consultait après reconnexion réussie (paramètre de retour conservé dans le lien de renvoi).

### Événements analytics (à intégrer par @data-analyst, non présents dans tracking-plan.md actuel — signalé, pas inventé ici)

`connexion_lien_demande` (email_hash, resultat: envoye/non_autorise/frequence_depassee), `connexion_lien_ouvert` (resultat: succes/expire/consomme/invalide), `session_parrain_ouverte` (operateur: thomas/emmanuel), `session_parrain_expiree`. **`[À VALIDER par @data-analyst]`** : ces 4 events n'existent pas encore dans tracking-plan.md, à ajouter lors de la prochaine resync (même trou que celui déjà signalé pour US-02/US-07 avant le correctif T04:00).

## 2. Écrans / wireframes

**Pattern général** : le point d'entrée (`/parrain/connexion`) est un **modal popup** superposé à la page courante (l'accueil `/` si accès direct au lien, ou la page `/parrain/*` visée si redirection depuis une session expirée), jamais une page pleine qui ferait perdre les repères (préférence fondateur). La page de destination du lien reçu par email (`/parrain/verifier`) est en revanche une **page autonome** (header + footer du site, carte centrée) : à ce stade il n'y a pas de page d'arrière-plan à préserver (arrivée depuis un client email, souvent un nouvel onglet/appareil).

### Écran A — Modal "Se connecter" (2 sous-états : formulaire / confirmation d'envoi)

**Pattern** : modal centré (desktop) / plein écran avec en-tête fermable (mobile), même famille de composant que le modal de confirmation US-09 (wireframes.md écran 4 zone 4). Fermable par X, clic en dehors, touche Escape. Header et footer de la page d'arrière-plan restent visibles et assombris derrière l'overlay.

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. En-tête du modal | Ligne horizontale, titre + croix de fermeture à droite | Titre "Se connecter à l'espace parrain" + icône X | Mobile : identique, croix toujours accessible (cible ≥ 44px) | Click X / clic en dehors / Escape → ferme le modal, retour à la page d'arrière-plan sans navigation |
| 2. Sous-titre explicatif | Ligne unique sous le titre | "Recevez un lien de connexion par email, aucun mot de passe n'est nécessaire." | Identique | Aucune |
| 3. Champ email (sous-état formulaire) | Un seul champ pleine largeur du modal | Label "Adresse email", placeholder "vous@exemple.com", validation de format en direct (bordure rouge + message inline si format invalide au blur, pas au premier caractère tapé) | Identique | Focus → bordure active. Blur avec format invalide → message inline "Format d'email invalide." |
| 4. CTA d'envoi (sous-état formulaire) | Bouton pleine largeur du modal, sous le champ | "Recevoir mon lien de connexion" — grisé tant que le champ n'a pas un format email valide | Identique | Click → bascule vers état Envoi en cours puis Envoyé (voir §3), remplace la zone 3+4 par la zone 5 |
| 5. Confirmation d'envoi (sous-état "Vérifiez votre boîte mail", remplace zones 3+4 dans le même modal) | Bloc centré : icône enveloppe + texte + 2 liens d'action | "Vérifiez votre boîte mail" (titre) + "Nous avons envoyé un lien de connexion à [email saisi]. Cliquez dessus pour accéder à votre espace." + lien "Je n'ai rien reçu, renvoyer le lien" (désactivé pendant le cooldown, cf. §4 point 3, avec minuteur visible "Renvoyer dans [N]s") + lien discret "Utiliser une autre adresse" (retour à la zone 3) | Identique | Click renvoi (hors cooldown) → ré-émet l'envoi, minuteur repart. Click "Utiliser une autre adresse" → retour formulaire, champ vidé |
| 6. Erreurs inline (email non autorisé / trop de demandes) | Remplace la zone 4 par un bandeau d'erreur sous le champ, formulaire reste rempli | Voir §3 pour le texte exact par cas | Identique | Le champ reste éditable, le CTA redevient actif dès correction |

### Écran B — Landing du lien `/parrain/verifier` (chargement / erreur)

**Pattern** : page autonome, stack vertical, carte centrée pleine largeur limitée (max 480px desktop), header + footer minimal identiques à l'écran 3 des wireframes.md (dashboard parrain).

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header minimal | Identique wireframes.md écran 3 zone 1, sans "Bonjour [prénom]" tant que la session n'est pas ouverte | Logo Parrainly (lien vers `/`) | Identique | Click logo → `/` (abandonne la vérification en cours) |
| 2. Carte centrale (état Chargement) | Carte unique centrée | Icône de chargement + "Vérification de votre lien de connexion..." | Identique | Aucune, transition automatique dès réponse serveur (≤ 2s cible) |
| 3. Carte centrale (état Erreur — 3 variantes) | Remplace la zone 2 | Voir §3 pour le texte exact par variante (expiré / consommé / invalide) + CTA unique "Recevoir un nouveau lien" qui rouvre le modal Écran A avec l'email pré-rempli si connu (paramètre porté par le lien de renvoi) | Identique | Click CTA → ouvre le modal Écran A (sous-état formulaire, email pré-rempli si disponible) |
| 4. Footer minimal | Identique wireframes.md écran 3 zone 6 | Mentions légales, contact | Identique | — |

**Note de cohérence @design** : les 2 écrans partagent la même famille de composant "carte de confirmation/erreur centrée" que les états vide/erreur des écrans 3 et 4 de wireframes.md — aucun nouveau pattern visuel à créer, réutilisation des tokens existants (badge de statut, bouton principal/secondaire).

## 3. Matrice des états + copy

Copy factuel, sobre, zéro tiret cadratin, aligné brand-voice-guide (ton direct, pas de familiarité de type "Oups !").

| # | État | Écran | Déclencheur | Copy exact | Action proposée |
|---|---|---|---|---|---|
| 1 | Idle | Modal A, zone 3+4 | Ouverture du modal, avant toute saisie | Titre "Se connecter à l'espace parrain" + "Recevez un lien de connexion par email, aucun mot de passe n'est nécessaire." | Champ vide, CTA grisé |
| 2 | Envoi en cours | Modal A, zone 4 | Clic sur "Recevoir mon lien de connexion" | Bouton : "Envoi en cours..." (bouton désactivé) | Aucune action possible, ≤ 2s |
| 3 | Envoyé | Modal A, zone 5 | Envoi confirmé côté serveur | "Vérifiez votre boîte mail" + "Nous avons envoyé un lien de connexion à [email]. Cliquez dessus pour accéder à votre espace." | Lien "Je n'ai rien reçu, renvoyer le lien" (cooldown), lien "Utiliser une autre adresse" |
| 4 | Erreur — email invalide (format) | Modal A, zone 3 (inline) | Blur du champ avec format non reconnu | "Format d'email invalide." | Champ reste éditable, CTA reste grisé |
| 5 | Erreur — email non autorisé | Modal A, zone 6 | Email hors des 2 comptes T&E | "Cette adresse n'est pas autorisée à accéder à l'espace parrain." | Champ reste éditable, aucun email envoyé, formulation volontairement neutre (ne confirme ni n'infirme l'existence d'un compte) |
| 6 | Erreur — trop de demandes | Modal A, zone 6 | Fréquence de renvoi dépassée (§4 point 3) | "Trop de demandes de connexion. Réessayez dans [N] minutes." | CTA grisé jusqu'à expiration du délai affiché |
| 7 | Lien expiré | Écran B, zone 3 | Token au-delà de la durée de validité | "Ce lien de connexion a expiré." + "Les liens de connexion sont valables [durée]." | CTA unique "Recevoir un nouveau lien" |
| 8 | Lien déjà consommé | Écran B, zone 3 | Token déjà utilisé pour ouvrir une session | "Ce lien a déjà été utilisé." + "Chaque lien de connexion ne fonctionne qu'une seule fois." | CTA unique "Recevoir un nouveau lien" |
| 9 | Lien invalide (générique) | Écran B, zone 3 | Token altéré, malformé ou inconnu | "Ce lien de connexion n'est pas valide." | CTA unique "Recevoir un nouveau lien" |
| 10 | Erreur technique (envoi ou vérification) | Modal A zone 6 / Écran B zone 3 | Service d'envoi ou de vérification indisponible | "Impossible d'envoyer votre lien de connexion pour le moment. Réessayez." / "Impossible de vérifier votre lien pour le moment. Réessayez." | Bouton "Réessayer" |
| 11 | Session active | Toutes les pages `/parrain/*` | Cookie de session valide détecté | Header : "Bonjour [Thomas/Emmanuel]" + lien "Se déconnecter" (wireframes.md écran 3 zone 1) | Navigation libre dans `/parrain/*` |
| 12 | Session expirée en cours d'usage | Toute page `/parrain/*` | Action nécessitant une session pendant la consultation | "Votre session a expiré. Reconnectez-vous pour continuer." | Rouvre le modal A avec un paramètre de retour vers la page consultée, données déjà affichées conservées à l'écran |

**Notes de copy** :
- Aucune mention du nombre exact de comptes autorisés (2) dans les messages d'erreur, pour ne pas exposer la liste fermée à un tiers qui teste des adresses.
- Le message de renvoi ne redémarre jamais le compte à rebours à zéro sans raison : le cooldown affiché correspond exactement à la limite technique (§4 point 3), pas une valeur cosmétique différente.
- Cohérent avec le principe brand-platform.md §4 (vérité, pas de survente) : aucun copy alarmiste sur l'expiration ("votre session a expiré" et non "session invalide, erreur de sécurité").

## 4. Points à trancher par @fullstack (proposés avec défaut)

Chaque point est proposé avec un défaut recommandé par @ux, pas laissé ouvert. @fullstack tranche l'implémentation exacte (algorithme, stockage), le défaut ci-dessous encadre le comportement visible côté utilisateur, sur lequel le copy et les états du présent document sont déjà calés.

| # | Point à trancher | Défaut recommandé | Justification | Impact UX si valeur différente retenue |
|---|---|---|---|---|
| 1 | Durée de validité du lien de connexion | **15 minutes**, à usage unique | Standard de l'industrie pour un magic link (assez court pour limiter l'exposition d'un email compromis, assez long pour laisser le temps d'ouvrir sa boîte mail sans reprécipiter Thomas/Emmanuel) ; cohérent avec le profil de risque cercle fermé (2 comptes internes, pas de PII sensible côté demandeur) | Si plus court (ex. 5 min) : augmente le taux de "lien expiré" (état 7) donc le taux de renvoi, à surveiller via `connexion_lien_ouvert.resultat=expire`. Si plus long (ex. 24h) : le copy "Les liens de connexion sont valables [durée]" doit changer de registre (minutes → heures), sans autre impact d'écran |
| 2 | Session persistante ou non | **Persistante, 30 jours glissants** (renouvelée à chaque visite active), cookie httpOnly + secure + sameSite=strict | Thomas/Emmanuel sont des opérateurs internes qui reviennent fréquemment confirmer des conversions (US-09) et gérer le catalogue (US-02) ; forcer une reconnexion par email à chaque visite ajoute de la friction sans bénéfice de sécurité proportionné pour 2 comptes connus, cohérent avec la préférence fondateur "zéro duplication d'info / zéro friction récurrente" | Si session courte (ex. 24h, non glissante) : `[FRICTION]` renvoi de lien quotidien pour un usage professionnel récurrent, dégrade l'adoption de US-05/US-09. Le message de l'état 12 (session expirée) reste valable dans les deux cas |
| 3 | Renvoi limité en fréquence | **Cooldown de 60 secondes entre deux demandes** pour la même adresse + **maximum 5 envois par heure glissante** | Empêche le spam de la boîte mail de Thomas/Emmanuel en cas de double-clic ou de script malveillant testant l'adresse, sans jamais bloquer un usage normal (une demande toutes les minutes suffit largement à 2 utilisateurs) | Si cooldown plus court : risque de flood de boîte mail en cas de clics répétés. Si plus long (ex. 5 min) : `[FRICTION]` un vrai échec de réception (spam, latence email) devient plus pénalisant à corriger. Le minuteur affiché à l'état 3 (Envoyé) doit toujours refléter la valeur exacte retenue |
| 4 | Comportement multi-device | **Le lien n'est pas lié à l'appareil qui l'a demandé** : Thomas peut demander le lien depuis son ordinateur et l'ouvrir depuis son téléphone (client mail), la session s'ouvre sur l'appareil où le lien est cliqué. Le token reste à usage unique (un seul appareil obtient la session, cf. état 8 "lien déjà consommé" pour toute tentative suivante) | Usage réel attendu : consultation du tableau de bord (US-05) et confirmation de conversion (US-09) fréquemment depuis mobile, demande du lien parfois depuis desktop (email pro) | Si le lien était verrouillé à l'appareil demandeur : `[FRICTION]` bloquerait l'usage mobile-desktop croisé, contraire à l'usage réel observé (Emmanuel gère par email/WhatsApp/LinkedIn selon project-context.md, appareils variables) |

**Hors périmètre UX (signalé, pas tranché ici)** : format et longueur exacte du token, algorithme de hachage, stockage de la table de session, mécanisme de rate-limiting côté infrastructure — relèvent entièrement de @fullstack/@infrastructure (cf. checkpoint-specs-phase1.md `[À VALIDER par @infrastructure]` sur le rate limit de US-09).

## 5. Cognitive walkthrough (first-time reconnection, sans aide extérieure)

1. Thomas sait-il quoi faire en arrivant sur une page `/parrain/*` sans session ? OUI — le modal s'ouvre automatiquement (pas de page 403 muette), un seul champ, un seul CTA.
2. L'action est-elle visible ? OUI — champ email + CTA unique, aucun choix concurrent (mot de passe, "se souvenir de moi", inscription).
3. Le lien but→action est-il clair ? OUI — le libellé "Recevoir mon lien de connexion" nomme exactement le mécanisme, cohérent avec le sous-titre qui prévient qu'aucun mot de passe n'est demandé (évite la confusion "j'ai oublié mon mot de passe").
4. Le feedback est-il immédiat ? OUI pour l'envoi (bouton désactivé + bascule vers l'écran de confirmation dans le même modal, pas de rechargement de page). `[FRICTION H1]` : entre le clic sur le lien reçu par email et l'ouverture effective de la session, Thomas quitte son client mail sans savoir combien de temps la vérification va prendre s'il a une connexion lente. Solution : état Chargement explicite sur l'Écran B (zone 2) avec texte "Vérification de votre lien de connexion..." plutôt qu'un écran blanc, déjà intégré au wireframe §2.
5. `[FRICTION H2]` : si Thomas ouvre le lien de connexion sur un appareil différent de celui où il consultait déjà `/parrain/attributions` (session expirée en cours d'usage), il perd le fil de la page qu'il consultait sur le premier appareil. Solution : le paramètre de retour porté par le lien de renvoi (état 12) ramène vers la page d'origine seulement si le clic se fait sur le MÊME appareil ; sur un appareil différent, la redirection par défaut vers `/parrain/tableau-de-bord` (point d'entrée standard, cohérent avec le principe "dashboard = coaching") reste acceptable, non bloquant pour 2 utilisateurs internes.

## 6. Audit heuristique Nielsen 10

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état système | PASS (avec correction) | 12 états couvrant idle/envoi/envoyé/erreurs/session, `[FRICTION H1]` §5 corrigée par l'état Chargement explicite de l'Écran B |
| H2 | Adéquation système/monde réel | PASS | "Vérifiez votre boîte mail", "lien de connexion" : vocabulaire courant du magic link, pas de jargon technique (token, JWT) exposé à l'écran |
| H3 | Contrôle et liberté utilisateur | PASS | Modal fermable X/clic dehors/Escape (préférence fondateur) ; lien "Utiliser une autre adresse" permet de corriger sans fermer/rouvrir le modal |
| H4 | Cohérence et standards | PASS | Réutilise la famille de composant modal de US-09 (wireframes.md écran 4 zone 4) et la carte centrée des états vide/erreur existants, aucun nouveau pattern visuel |
| H5 | Prévention des erreurs | PASS | CTA d'envoi grisé tant que le format email est invalide ; cooldown de renvoi empêche le double-envoi accidentel ; idempotence sur double-clic (critère 7) |
| H6 | Reconnaissance plutôt que rappel | PASS | L'email pré-rempli est repris automatiquement sur le CTA de renvoi depuis l'Écran B (paramètre porté par le lien), Thomas n'a pas à se souvenir/ressaisir son adresse après un lien expiré |
| H7 | Flexibilité et raccourcis experts | PASS | Multi-device autorisé par défaut (§4 point 4) : Thomas peut demander depuis un appareil et confirmer depuis un autre sans friction supplémentaire |
| H8 | Esthétique et minimalisme | PASS | 1 champ, 1 CTA, aucun élément de conviction marketing sur un écran d'authentification interne (cohérent ton sobre back-office, wireframes.md écran 3 note) |
| H9 | Messages d'erreur clairs avec solution | PASS | Chaque état d'erreur (5 à 10, §3) a un message exact et un CTA d'action (renvoi ou réessai), jamais un message technique brut |
| H10 | Aide et documentation en contexte | FAIL | `[FRICTION H10]` : aucun lien contextuel n'explique pourquoi l'espace parrain n'utilise pas de mot de passe (une incompréhension possible pour un opérateur peu familier du pattern magic link, même si Thomas/Emmanuel sont déjà informés du choix produit). Solution : ajouter un lien discret "Pourquoi pas de mot de passe ?" sous le sous-titre du modal (zone 2, Écran A), pointant vers une micro-explication inline (tooltip), pas une page dédiée pour 2 utilisateurs internes déjà briefés — priorité basse, non bloquante pour le codage.

## 7. Métriques HEART

| Dimension | Signal observable | Cible | Méthode |
|---|---|---|---|
| Task success | Taux de session ouverte avec succès / total demandes de lien (`connexion_lien_ouvert.resultat=succes` / `connexion_lien_demande.resultat=envoye`) | ≥ 90% (défaut framework) | Events proposés §1, à intégrer par @data-analyst |
| Task success | Time-to-value : temps entre la demande du lien et l'ouverture effective du tableau de bord | `[À VALIDER — pas de donnée réelle, 2 utilisateurs connus, pas de cible statistique pertinente à ce volume]` | Delta `connexion_lien_demande` → `connexion_lien_ouvert` |
| Happiness | CSAT déclaratif de Thomas/Emmanuel sur la fluidité de la reconnexion | ≥ 8/10 (défaut framework) | Entretien direct (2 utilisateurs connus, pas de sondage à grande échelle) |
| Adoption | Taux de renvoi de lien (`connexion_lien_demande` avec un `connexion_lien_demande` précédent pour le même email dans les 5 minutes) | Signal de friction si > 20% des sessions (proxy de latence email ou de confusion) | Tracking-plan.md, une fois les 4 events intégrés |

## 8. Tests UX

| Test | Critère | Résultat sur ce flow |
|---|---|---|
| Parcours persona sans aide extérieure | Frictions documentées | 3 frictions identifiées (H1 chargement Écran B, H2 changement d'appareil, H10 absence d'explication du choix "pas de mot de passe"), toutes corrigées ou non bloquantes (§5, §6) |
| Charge cognitive | ≤ 3 actions principales par écran | Modal A (formulaire) : 1 action (saisir + envoyer). Écran B : 0 action requise sauf en cas d'erreur (1 CTA). Conforme |
| Time-to-value | Inscription → premier résultat concret ≤ 3 étapes | N/A (pas d'inscription, cercle fermé) — reconnexion → dashboard = 2 étapes (demander le lien, cliquer le lien), sous le seuil de 3 |
| Edge cases | États vide / erreur / chargement / connexion lente / retour après 30 jours | Couverts : erreur email invalide/non autorisé/trop de demandes/technique (§3 états 4-6-10), chargement (états 2 et Écran B zone 2), lien expiré/consommé/invalide (états 7-8-9), retour après 30 jours = session expirée par défaut de persistance (§4 point 2), redemande de lien sans perte de contexte (état 12) |
| Accessibilité WCAG 2.2 AA | Clavier complet, focus visible, cibles ≥ 44px, contrastes | Modal navigable au clavier (Tab entre champ/CTA/liens, Escape ferme), croix de fermeture et CTA ≥ 44px (cohérent wireframes.md), contraste du bandeau d'erreur à valider par @design lors de l'implémentation des tokens (non bloquant pour le codage de la structure) |

---

## Gates BLOQUANT vérifiées

- **G1** : 8 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : persona Thomas/Emmanuel identique à brand-platform.md §2.3 et functional-specs.md US-05/US-09, aucun résidu "Karim". PASS.
- **G7** : parcours et copy dérivés sans contradiction de functional-specs.md US-02/US-05/US-07/US-09 (messages "session expirée" US-05 critère 7 repris à l'identique, endpoints `/api/v1/parrains/{parrain_id}/...` non modifiés), information-architecture.md (`/parrain/connexion` conservée comme route, comportement précisé), wireframes.md (header/footer écran 3 zone 1 réutilisés tels quels, famille de composant modal US-09 réutilisée). 0 contradiction. PASS.
- **G12** : 2 écrans détaillés par zones + 12 états + copy exact + 4 décisions techniques tranchées avec défaut : @fullstack peut coder sans poser de question de disposition ni de comportement. PASS.
- **G13** : 0 chiffre inventé sans marquage — les 4 défauts (§4) sont des recommandations UX explicitement signalées comme telles (pas des données produit préexistantes), les seuils déjà `[À VALIDER]` dans functional-specs.md/tracking-plan.md (fenêtre 60 jours, seuil de plausibilité) ne sont pas repris ici car hors périmètre de ce document. PASS.
- **G15** : Grep mental sur les patterns interdits (`[À REMPLIR]`, `PLACEHOLDER`, `TODO`, `XX`) : absents. Seuls `[À VALIDER]` légitimes (events analytics à intégrer par @data-analyst, contraste à valider par @design). PASS.
- **G17** : la combinaison modal réutilisant le pattern US-09 + comportement multi-device explicitement pensé pour l'usage réel de Thomas/Emmanuel (LinkedIn/WhatsApp/email, project-context.md) + absence volontaire de granularité de rôle (2 comptes équivalents) n'est pas un flow d'auth SaaS générique copiable sans adaptation au cercle fermé. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** `Read docs/reviews/checkpoint-specs-phase1.md` §4 (P1-a) confirme que le mécanisme d'auth par lien email est absent de functional-specs.md US-02/05/07/09 (`[À VALIDER par @fullstack/@ux]`) et bloque uniquement l'espace parrain, pas le socle demandeur. `Read docs/product/functional-specs.md` US-05 critère 5/7 et US-09 payload API confirment que le texte "session expirée" et le comportement de redirection vers une page de renvoi de lien sont déjà posés côté specs : ce document reprend ces critères mot pour mot (état 12, §3) plutôt que de les reformuler. `Read docs/ux/information-architecture.md` l.31-32 confirme la route `/parrain/connexion` et son statut `[À VALIDER @fullstack/@ux]` : ce document la referme en la transformant en modal (préférence fondateur) tout en conservant l'URL comme point d'entrée direct (lien de renvoi, accès direct). `Read docs/ux/wireframes.md` écran 4 zone 4 confirme le pattern modal fermable X/clic dehors/Escape déjà utilisé pour US-09 : réutilisé à l'identique ici plutôt que créer un nouveau pattern.

---
**Handoff → @fullstack**
- Fichiers produits : `/home/user/MCP/docs/ux/auth-parrain-magic-link.md`
- Décisions prises : parcours complet en 9 critères GWT (connexion, renvoi, expiré, consommé, non autorisé, session expirée en cours d'usage) ; écran de connexion en **modal popup** superposé (fermable X/clic dehors/Escape, header/footer visibles), réutilisant le pattern modal existant de US-09 ; landing `/parrain/verifier` en page autonome avec 3 variantes d'erreur (expiré/consommé/invalide) et 1 CTA unique de renvoi ; 12 états UI avec copy exact (§3) ; 4 points techniques tranchés avec défaut recommandé (§4) : durée de validité 15 minutes à usage unique, session persistante 30 jours glissants (cookie httpOnly/secure/sameSite=strict), cooldown de renvoi 60s + max 5/heure, multi-device autorisé (token non lié à l'appareil demandeur, usage unique conservé).
- Points d'attention : `[FRICTION H10]` non bloquante (lien explicatif "pourquoi pas de mot de passe" à ajouter, priorité basse) ; `[FRICTION H2]` changement d'appareil en cours de session (redirection par défaut acceptable vers le tableau de bord) ; aucune granularité de rôle en V1 (2 comptes T&E strictement équivalents, risque signalé et accepté au regard du cercle fermé) ; 4 events analytics proposés (`connexion_lien_demande`, `connexion_lien_ouvert`, `session_parrain_ouverte`, `session_parrain_expiree`) absents de tracking-plan.md, à faire intégrer par @data-analyst avant le câblage définitif (même pattern de resync que celui déjà réalisé pour US-02/US-07).
- Décisions techniques restant à acter par @fullstack (implémentation, pas UX) : format/longueur/algorithme du token, mécanisme de stockage de session, rate-limiting infrastructure (déjà signalé `[À VALIDER par @infrastructure]` dans functional-specs.md US-09 et checkpoint-specs-phase1.md).
- Prochaines étapes : @fullstack code l'espace parrain (US-02/05/07/09) sur la base de ce document + wireframes.md écrans 3/4 ; @data-analyst intègre les 4 events dans tracking-plan.md ; @design ajuste les tokens visuels du modal (aucun nouveau composant, réutilisation de la famille modal US-09).
---
</content>
