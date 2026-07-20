<!-- Version: 2026-07-20T04:00 — @ux — Wireframes basse fidélité V1 cercle fermé -->

# Wireframes — Parrainly (V1 cercle fermé T&E)

## Résumé exécutif

- 4 écrans détaillés par zones : page-offre (écran le plus stratégique, US-01), accueil + catégories (découverte), tableau de bord parrain (US-05), écran de confirmation de conversion (US-09).
- Chaque zone précise pattern de layout, contenu exact par élément, comportement responsive avec ordre de priorité par breakpoint, et interactions (hover/click/scroll).
- Contraintes non négociables intégrées dans chaque wireframe concerné : divulgation d'affiliation visible AVANT le CTA (jamais en pied de page), date de vérification au-dessus de la ligne de flottaison, mention de risque sur les offres financières/crypto, zéro CTA en tête de page-offre (le CTA arrive après lecture des conditions), zéro wording de classement.
- Source de vérité de la structure fonctionnelle (sections, contenu, ordre, responsive) ; @design ajuste les proportions visuelles sans toucher à l'ordre ni au contenu par zone (primauté ux.md).

---

## Écran 1 — Page-offre `/offres/{slug}` (US-01, écran le plus stratégique)

**Pattern général** : stack vertical de zones full-width, pas de grille multi-colonnes pour le contenu principal (lecture séquentielle imposée : identité → divulgation → risque → conditions → CTA), sauf la zone 3 en split desktop.

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header persistant | Full-width, bar horizontale, 3 éléments alignés (logo gauche / nav centre / espace droite) | Logo Parrainly (lien vers `/`), nav "Accueil · Catégories · Comment ça marche", pas de CTA agressif dans le header | <768px : logo + icône menu hamburger uniquement, nav en tiroir latéral | Hover : soulignement des liens nav. Click logo → `/` |
| 2. Fil d'Ariane | Full-width, ligne unique | "Accueil > [Catégorie] > [Nom programme]" | <768px : uniquement "< Retour à [Catégorie]" (raccourci, pas la chaîne complète) | Click sur chaque segment → page correspondante |
| 3. Bloc identité offre | Split 70/30 desktop (≥1024px) ; stack sur tablette/mobile | **Gauche (70%)** : H1 = nom_programme, badge catégorie (couleur neutre, pas de couleur "promo"), sous_categorie en texte secondaire, ligne "Vérifié le [date_verification]" avec icône check (registre visuel brand-platform.md §7), tags_mcp en petits chips discrets sous la ligne de vérification. **Droite (30%)** : carte "avantage_filleul" mise en avant, texte factuel repris tel quel du champ (ex. "Offre de bienvenue telle que publiée par Trade Republic"), jamais reformulé en promesse de gain | <768px : ordre = H1+badge → statut vérifié → carte avantage_filleul (pleine largeur, sous le H1, pas à droite) | Hover badge catégorie : surbrillance légère. Click badge → `/categories/{slug}` |
| 4. Bandeau divulgation d'affiliation | Full-width, fond distinct du reste de la page (pas une bannière discrète), au-dessus de la ligne de flottaison sur desktop | "Lien de parrainage Parrainly : Thomas ou Emmanuel perçoivent une commission si vous l'utilisez." + lien "En savoir plus" → `/divulgation-affiliation` | Reste full-width et visible sans scroll supplémentaire sur mobile (priorité haute, jamais masquée derrière un accordéon) | Click "En savoir plus" → nouvelle page (pas de modal, contenu légal doit être une page dédiée indexable) |
| 5. Bandeau mention de risque (SI catégorie ∈ {investissement, gestion de patrimoine, placement trésorerie, crypto}) | Full-width, style distinct (bordure ou fond neutre différent de la divulgation, pas de rouge alarmiste) | Investissement/patrimoine/trésorerie : "Investir comporte des risques de perte en capital." Crypto : "Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier." (legal-strategy.md §4bis, formulations exactes) | Identique desktop/mobile, jamais masquée ni réduite en taille de police | Aucune interaction, texte statique obligatoire |
| 6. Bloc conditions | Full-width, texte structuré en liste à puces | description_courte en intro, puis avantage_parrain et conditions d'éligibilité PERTINENTES POUR LE FILLEUL uniquement (montant minimum de dépôt, durée de détention si applicable) — **le plafond anti-fraude interne (champ `conditions`, usage back-office) n'est jamais affiché publiquement tel quel**, seule sa traduction filleul-utile l'est (voir note @copywriter) | <768px : liste conservée, pas de résumé tronqué (l'utilisateur doit lire les conditions avant le CTA) | Aucune interaction, lecture uniquement |
| 7. Zone CTA dynamique (5 états, voir tableau dédié plus bas) | Full-width, bouton pleine largeur sur mobile / largeur contenue centrée sur desktop | Voir "5 états UI" ci-dessous | <768px : **CTA sticky en bas du viewport** une fois la zone atteinte au scroll (ne bloque pas la lecture des conditions au-dessus) | Click → déclenche état Chargement. Hover desktop : assombrissement léger du bouton |
| 8. Liens d'aide contextuelle | Full-width, ligne de liens discrets sous la zone CTA | "Comment vérifions-nous cette offre ?" → `/confiance-et-verification` · "Voir la donnée structurée (JSON)" → `/api/v1/offres/{id}` (correction friction H7/H10, user-flows.md) | Identique, empilés verticalement si largeur insuffisante | Click → nouvelle page/nouvel onglet pour le lien JSON |
| 9. Offres proches | Grid 3 colonnes desktop (≥1024px) / 2 colonnes tablette / carrousel horizontal scrollable mobile | 2-3 cartes d'offres de la même `categorie` ou `cible` (schéma Emmanuel), chaque carte = mini version de la carte catalogue (zone 10, écran 2) | <768px : carrousel horizontal, swipe, indicateur de position (dots) | Click carte → `/offres/{autre-slug}` |
| 10. Footer | Full-width, 3 colonnes desktop / stack mobile | Mentions légales, CGU, confidentialité, divulgation affiliation (lien répété, pas la seule occurrence), contact | <768px : accordéon par colonne pour limiter le scroll | Click → pages correspondantes |

### 5 états UI de la zone CTA (identiques à functional-specs.md US-01)

| État | Affichage dans la zone 7 |
|---|---|
| Défaut | Bouton plein "Obtenir mon lien de parrainage", actif |
| Chargement | Bouton désactivé (grisé) + spinner inline, texte "Génération de votre lien..." |
| Vide | Bandeau remplace le bouton : "Cette offre n'est plus disponible actuellement." + bouton secondaire "Voir les autres enseignes vérifiées" → `/categories/{meme-categorie}` + lien discret "Pourquoi cette offre a disparu ?" → `/confiance-et-verification` (correction friction H10) |
| Erreur | Bandeau + bouton : "Impossible de générer votre lien pour le moment. Réessayez dans quelques instants." + bouton "Réessayer" (remplace le CTA initial, pas un ajout au-dessus) |
| Succès | Bloc remplace le bouton : lien affiché en lecture seule (`https://{domaine}/r/{token}`), bouton "Continuer vers [Enseigne]", texte "Votre lien de parrainage vérifié le [date] est prêt." |

**Note @copywriter/@legal** : la traduction "conditions filleul-utiles" (zone 6) vs "plafond interne" doit être arbitrée programme par programme avec la fiche de conformité (legal-strategy.md §7 point 6) — ne pas exposer publiquement un chiffre de plafond anti-fraude qui pourrait être interprété comme une limite artificielle par le filleul, alors qu'il protège la relation entre T&E et le programme.

---

## Écran 2 — Accueil `/` et catégories `/categories/{slug}`

### Accueil `/`

**Pattern général** : stack vertical, zéro CTA de conviction en tête (contrainte "CTA en fin de parcours, sauf pages d'action" — l'accueil est une page de découverte, pas d'action).

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header | Identique écran 1, zone 1 | — | Identique | Identique |
| 2. Bandeau d'intention (pas un hero promotionnel) | Full-width, centré, texte + un seul champ de recherche | Tagline "Le parrainage, vérifié avant d'être cité." + sous-texte 1 ligne + champ de recherche "Chercher un programme (Trade Republic, Qonto...)" — pas de bouton CTA à côté, la recherche filtre en direct la grille zone 4 | <768px : champ de recherche pleine largeur sous le texte | Focus champ → filtre en direct sur la zone 4 (scroll auto vers les résultats si hors écran) |
| 3. Grille des 6 catégories | Grid 3 colonnes desktop (≥1024px) / 2 colonnes tablette (≥768px) / 1 colonne mobile stack | Carte par catégorie active (finance personnelle, investissement, gestion de patrimoine, placement trésorerie, services entrepreneur, crypto) : icône sobre + nom + nombre d'offres actives | Mobile : cartes empilées pleine largeur, ordre = ordre de `priorite_affichage` si défini, sinon ordre alphabétique | Hover : légère élévation de la carte (ombre). Click → `/categories/{slug}` |
| 4. Grille des 9 offres vérifiées | Grid 4 colonnes desktop (≥1280px) / 3 colonnes desktop standard (≥1024px) / 2 colonnes tablette / 1 colonne mobile stack | Carte par offre : nom_programme, badge catégorie, badge "Vérifié le [date]" (icône check, même code visuel que zone 3 écran 1), teaser 1 ligne d'avantage_filleul | Mobile : cartes empilées, priorité = offres `actif` en premier, "en attente de parrain"/expirées en dernier avec badge visuel distinct (pas masquées, juste reléguées, transparence de fraîcheur) | Hover : élévation carte. Click → `/offres/{slug}` |
| 5. Footer | Identique écran 1, zone 10 | — | Identique | Identique |

### Catégorie `/categories/{slug}`

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header + fil d'Ariane | Identique écran 1 | "Accueil > [Nom catégorie]" | Identique | Identique |
| 2. En-tête de catégorie | Full-width, bloc texte simple | H1 = nom de la catégorie, 1 phrase de description factuelle (ex. "Parrainages vérifiés pour l'investissement et l'épargne.") | Identique | Aucune |
| 3. Grille des offres de la catégorie | Grid, même pattern que écran Accueil zone 4, mais filtré à la catégorie (1 à 3 cartes en V1 selon la catégorie, jamais de grille vide grâce à l'import initial exhaustif des 9 offres) | Identique carte que zone 4 Accueil | Identique | Identique |
| 4. Footer | Identique | — | Identique | Identique |

---

## Écran 3 — Tableau de bord parrain `/parrain/tableau-de-bord` (US-05)

**Pattern général** : dashboard = coaching, pas bibliothèque (préférence fondateur) — la page guide Thomas/Emmanuel vers la prochaine action (confirmer une conversion, réactiver un lien en pause), elle ne se contente pas de lister des données passives.

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header parrain | Full-width, bar horizontale | Logo + "Bonjour [Thomas/Emmanuel]" + lien "Se déconnecter" à droite (pas de menu complexe, 2 utilisateurs seulement) | <768px : identique, pas de compression nécessaire (peu d'éléments) | Click déconnexion → invalide la session, retour `/parrain/connexion` |
| 2. Carte prime estimée cumulée | Full-width, carte unique mise en avant (pas une grille) | Montant de la prime estimée cumulée en gros caractère + sous-texte "Mise à jour à chaque conversion confirmée" | Identique | Aucune interaction, lecture |
| 3. Bandeau de coaching (nudge d'action) | Full-width, bandeau distinct sous la carte prime, visible seulement si des Attributions `en_attente` avec `date_redirection` existent | "Vous avez [N] conversion(s) à confirmer." + bouton "Voir mes attributions" → `/parrain/attributions` (écran 4). Absent si aucune Attribution éligible (pas de nudge vide) | Identique | Click → `/parrain/attributions` |
| 4. Liste des liens par offre | Stack de lignes (pattern liste, pas de grille de cartes — lecture séquentielle par ligne plus adaptée à un tableau de statuts) | Par ligne : nom_programme, statut (actif/en pause/suspendu), "quota utilisé/max", si en pause : "en pause jusqu'au [date_reinitialisation]" | <768px : chaque ligne devient une carte empilée (mêmes champs, disposition verticale au lieu d'une ligne horizontale) | Click sur une ligne → `/parrain/catalogue/{offre_id}` (US-02, si l'opérateur veut modifier) |
| 5. État vide (par ligne, si un programme n'a pas de lien enregistré par ce parrain) | Remplace la ligne standard | "Vous n'avez pas encore de lien enregistré." + CTA "Enregistrer un lien" → `/parrain/catalogue/{offre_id}` | Identique | Click → formulaire US-02 |
| 6. Footer minimal | Full-width, ligne unique | Mentions légales, contact — pas de footer marketing complet sur une page d'outil interne | Identique | — |

### 4 états UI pertinents (succès = N/A justifié, écran de consultation pure, cf. functional-specs.md US-05)

| État | Affichage |
|---|---|
| Défaut | Zones 2-4 remplies avec les données à jour |
| Chargement | Squelette de chargement (skeleton) sur les zones 2-4, ≤ 2 secondes |
| Vide | Si aucun lien enregistré pour aucun programme (cas théorique, non attendu en V1 vu l'import initial) : message "Vous n'avez pas encore de lien enregistré." pleine page + CTA vers US-02 |
| Erreur | Bandeau plein écran (remplace zones 2-4) : "Impossible de charger votre espace parrain. Réessayez." + bouton Réessayer |

---

## Écran 4 — Confirmation de conversion `/parrain/attributions` (US-09)

**Pattern général** : stack de lignes/cartes, action de confirmation en formulaire léger inline ou modal (fermable X / clic dehors / Escape, préférence fondateur, header/footer restent visibles derrière l'overlay).

| Zone | Pattern | Contenu | Responsive | Interaction |
|---|---|---|---|---|
| 1. Header parrain | Identique écran 3 | — | Identique | Identique |
| 2. Fil d'Ariane / retour | Ligne simple | "< Retour au tableau de bord" → `/parrain/tableau-de-bord` | Identique | Click → écran 3 |
| 3. Liste des Attributions en_attente | Stack de cartes (1 carte = 1 Attribution) | Par carte : nom_programme, date de redirection suivie, bouton "Confirmer la conversion" (actif si `date_redirection` renseignée, sinon grisé + info-bulle "Aucun clic enregistré sur ce lien pour le moment.") | <768px : cartes empilées pleine largeur, bouton pleine largeur en bas de chaque carte | Click bouton actif → ouvre le modal zone 4 |
| 4. Modal de confirmation | Popup modal centré (desktop) / plein écran avec en-tête fermable (mobile), fermable par X / clic en dehors / touche Escape — header/footer de la page restent visibles derrière l'overlay au format desktop | Champ date "Date de conversion déclarée" (calendrier, ≤ date du jour, ≥ date de redirection), champ optionnel "Montant de commission (si connu)", boutons "Confirmer" / "Annuler" | Mobile : modal occupe la largeur complète mais garde une croix de fermeture explicite en haut, jamais un plein écran sans échappatoire | Click "Confirmer" → état Chargement inline dans le modal. Click "Annuler"/X/clic dehors/Escape → ferme sans envoi |
| 5. Retour inline post-confirmation | Remplace la carte concernée dans la liste (zone 3), pas de redirection de page | Succès direct : bandeau vert discret "Confirmation enregistrée. Votre prime estimée a été mise à jour." · Vérification manuelle : bandeau neutre "Confirmation reçue, en cours de vérification." + lien "En savoir plus sur la vérification des confirmations" → `/confiance-et-verification` (correction friction H9, user-flows.md) | Identique | Aucune interaction supplémentaire requise, la carte reste visible avec son nouveau statut |
| 6. État vide | Remplace la zone 3 entière | "Aucune conversion à confirmer pour le moment." (état normal, pas de CTA, pas de ton d'erreur) | Identique | — |
| 7. Footer minimal | Identique écran 3 | — | Identique | — |

### 5 états UI (identiques à functional-specs.md US-09)

| État | Affichage |
|---|---|
| Défaut | Liste des Attributions en_attente, boutons actifs/grisés selon `date_redirection` |
| Chargement | Spinner inline dans le modal ouvert, ≤ 2 secondes |
| Vide | "Aucune conversion à confirmer pour le moment." |
| Erreur | Dans le modal : "Votre confirmation n'a pas pu être enregistrée. Réessayez." + bouton Réessayer, le modal reste ouvert (pas de perte de saisie) |
| Succès | Bandeau inline sur la carte concernée (2 variantes : confirmée directe / en vérification manuelle, voir zone 5) |

---

## Tests UX (bloc obligatoire, 4 écrans)

| Test | Écran 1 (page-offre) | Écran 2 (accueil/catégories) | Écran 3 (dashboard) | Écran 4 (confirmation) |
|---|---|---|---|---|
| Parcours sans aide extérieure | PASS (cognitive walkthrough user-flows.md parcours 1) | PASS (navigation directe, pas d'action complexe) | PASS (coaching nudge explicite zone 3) | PASS avec réserve `[FRICTION H9]` (motif de vérification manuelle non exposé, mitigé par lien contextuel) |
| Charge cognitive ≤ 3 actions principales | 1 action (CTA) après lecture — conforme | 2 actions (recherche, click carte) — conforme | 2 actions (voir attributions, modifier un lien) — conforme | 1 action par carte (confirmer) — conforme |
| Time-to-value ≤ 3 étapes | 2 étapes (lecture fiche → clic CTA → lien obtenu) — conforme | N/A (page de découverte, pas de conversion directe) | N/A (page de consultation) | 2 étapes (clic Confirmer → saisie date → validation) — conforme |
| Edge cases (vide/erreur/chargement/connexion lente/retour 30 jours) | 5/5 couverts (voir 5 états UI + scénario 4G faible, functional-specs.md US-01 scénario 5) | Vide N/A justifié (import exhaustif) ; chargement/erreur à spécifier par @fullstack sur la grille | 4/4 couverts (succès N/A justifié) ; retour après 30 jours = données à jour au rechargement, rien de spécifique à cacher | 5/5 couverts ; retour après 30 jours = Attribution passée en `expiree` si fenêtre de 60 jours dépassée (US-09 critère 9), visible dans la liste avec statut distinct |
| Accessibilité WCAG 2.2 AA | CTA et boutons ≥ 44px, contraste du bandeau de risque à valider par @design (pas de rouge/vert seul comme unique signal, toujours accompagné de texte) | Cartes cliquables en entier (zone de clic ≥ 44px), focus visible au clavier sur la recherche et les cartes | Navigation clavier complète entre les lignes de liens, focus visible | Modal : piège de focus (focus trap) dans le modal, fermeture au clavier (Escape) obligatoire, focus renvoyé au bouton d'origine à la fermeture |

---

## Recommandation d'agents spécialisés

| Agent | Type | Rôle | Justification liée au parcours | Priorité |
|---|---|---|---|---|
| validateur accessibilité WCAG 2.2 AA | Expertise | Auditer les 4 wireframes une fois implémentés (contraste bandeau de risque, focus trap du modal, cibles tactiles) | Repris de user-flows.md, complété ici avec le détail modal (écran 4) qui introduit un risque de piège de focus si mal implémenté | Moyenne |
| testeur-persona A1/A2 | Testeur | Valider que la lecture séquentielle imposée (identité → divulgation → risque → conditions → CTA) ne provoque pas d'abandon avant le CTA sur mobile (scroll long) | Écran 1 est le plus stratégique et le plus long à lire avant conversion ; aucun test réel de complétion de scroll n'existe à ce jour | Haute |

---

## Gates BLOQUANT vérifiées

- **G1** : 4 écrans + tests UX + recommandation d'agents, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff présent en fin de document. PASS.
- **G5** : personas A1/A2/Thomas/Emmanuel identiques à brand-platform.md, vocabulaire repris ("vérifié le", "prime estimée", "en pause jusqu'au"). PASS.
- **G7** : chaque zone dérive d'un champ exact du schéma Emmanuel (product-vision.md §4) ou d'un état exact de functional-specs.md (US-01, US-02, US-05, US-09) ; 0 contradiction avec information-architecture.md (mêmes chemins `/offres/{slug}`, `/categories/{slug}`, `/parrain/*`) ni avec user-flows.md (mêmes 5 états, mêmes frictions corrigées H7/H9/H10). PASS.
- **G12** : chaque zone porte pattern + contenu + responsive + interaction, implémentable par @fullstack sans question de disposition (2 colonnes vs 3, ordre mobile, sticky ou non). PASS.
- **G13** : 0 chiffre inventé ; les champs affichés sont ceux du schéma Emmanuel (20 champs), les mentions de risque sont les formulations exactes de legal-strategy.md §4bis. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. PASS.
- **G17** : le registre visuel imposé (zéro badge "PROMO", zéro compte à rebours, divulgation avant CTA, mention de risque non alarmiste) est l'inverse du pattern des agrégateurs de coupons/parrainage bancaire benchmarkés (brand-platform.md §6, §7) — non copiable sans renoncer à ce positionnement. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler visuellement le parcours A1 sur la fiche Trade Republic (écran 1) du scroll d'arrivée au clic CTA.
Le demandeur A1 arrive sur `/offres/trade-republic` depuis une citation IA → zone 3 affiche immédiatement "Trade Republic" + "Vérifié le [date_verification]" au-dessus de la ligne de flottaison (aucun scroll requis pour voir la fraîcheur) → zone 4 (divulgation) est visible sans scroll supplémentaire sur mobile, avant tout élément cliquable → zone 5 (mention de risque, catégorie investissement/néobanque `[À VALIDER si Trade Republic est classé investissement ou finance personnelle par @product-manager, product-vision.md §4]`) s'affiche si applicable → zone 6 (conditions) liste les éléments factuels sans promesse de rendement → zone 7 (CTA) n'apparaît qu'après ce parcours de lecture, jamais en premier écran. Le clic déclenche l'état Chargement puis Succès avec le lien `/r/{token}`, cohérent avec user-flows.md parcours 1 et functional-specs.md US-01. Les 5 zones bloquantes (fraîcheur, divulgation, risque, conditions, CTA) sont toutes présentes et dans l'ordre imposé par les contraintes juridiques et UX du brief.

---

## Hypothèses à valider

- `[À VALIDER]` Classification exacte de chaque programme dans la liste des catégories déclenchant la mention de risque (zone 5, écran 1) : à confirmer ligne par ligne avec @product-manager/@legal à partir du champ `categorie` réel de chacune des 9 offres (ex. Trade Republic = "finance personnelle/néobanque" selon roadmap.md, mention de risque investissement à confirmer si le produit proposé via ce lien inclut du courtage).
- `[À VALIDER]` Traduction exacte "conditions filleul-utiles" vs "plafond interne non public" par programme (zone 6, écran 1) : dépend de la fiche de conformité par programme (legal-strategy.md §7 point 6), non encore produite pour aucun des 9 programmes.

---
**Handoff → @design, @copywriter, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/ux/wireframes.md`
- Décisions prises : page-offre structurée en 10 zones séquentielles (identité → divulgation → risque → conditions → CTA → aide → offres proches → footer) avec CTA jamais en premier écran ; dashboard parrain en mode coaching (nudge d'action, pas liste passive) ; confirmation de conversion en modal fermable (X/clic dehors/Escape) avec feedback inline sans perte de contexte ; corrections des frictions H7/H9/H10 de user-flows.md intégrées comme zones explicites.
- Points d'attention : classification risque par programme et traduction plafond interne/conditions publiques restent `[À VALIDER]` (voir section dédiée) ; le registre visuel (couleurs, typographie) reste la primauté de @design, ce document ne fixe que la structure et l'ordre ; le focus trap du modal (écran 4) est un point d'accessibilité bloquant WCAG 2.2 AA à ne pas oublier en implémentation.
- Agents spécialisés recommandés : validateur accessibilité WCAG 2.2 AA, testeur-persona A1/A2 (scroll et complétion avant CTA).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de structure, aucun code produit). Pour @fullstack : prévoir le squelette de chargement (skeleton) sur les écrans 1/3, le focus trap du modal écran 4, et le comportement sticky du CTA mobile écran 1.
---

