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

