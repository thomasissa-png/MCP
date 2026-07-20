<!-- Version: 2026-07-20T05:00 — @design — Compositions de page V1 Parrainly (Phase 1) -->

# Compositions de page — Parrainly V1

## Résumé exécutif

Ce fichier est la source de vérité de la BOUCLE VISUELLE @fullstack (comparaison des screenshots de `tests/screenshots/` à ces compositions). Structure et ordre de contenu = wireframes.md (primauté @ux, non modifiée ici) ; ce document ajoute les proportions, tokens exacts, comportement précis par breakpoint (640/768/1024/1280) et animations. 4 pages couvertes : page-offre (écran stratégique, 3 variantes de layout pour la zone 3), accueil/catégories, dashboard parrain, confirmation de conversion. Pattern d'animation par défaut : `fade-up translateY(20px→0) 300ms ease-out (motion.easing.standard), stagger 100ms`, désactivé en `prefers-reduced-motion` (tout en `instant`).

---

## 1. Page-offre `/offres/{slug}` (US-01, écran le plus stratégique)

### Layout général (mobile 375 / tablette 768 / desktop 1280)

Stack vertical full-width sur les 3 breakpoints (aucune grille multi-colonnes pour le contenu séquentiel, cf. wireframes.md). Largeur de contenu max `grid.max-width` (1280px) centrée, marges latérales `spacing.xl` (32px) desktop / `spacing.md` (16px) mobile.

| Zone | Mobile (<768px) | Tablette (768-1023px) | Desktop (≥1024px) |
|---|---|---|---|
| Header | Logo + hamburger, hauteur 56px, sticky top | Logo + nav complète, hauteur 64px | Logo + nav complète, hauteur 72px |
| Fil d'Ariane | "< Retour à [Catégorie]" seul | Chaîne complète | Chaîne complète |
| Bloc identité (zone 3) | Voir 3 variantes ci-dessous | Stack : H1+badges puis carte avantage pleine largeur | Split 70/30 (voir variante A retenue) |
| Divulgation | Pleine largeur, visible sans scroll additionnel | Pleine largeur | Pleine largeur, sous le split |
| Risque (conditionnel) | Pleine largeur, sous divulgation | Idem | Idem |
| Conditions | Liste à puces pleine largeur | Idem, colonne unique | Colonne unique, max-width 720px pour la lisibilité |
| CTA (zone 7) | Sticky bottom du viewport au scroll, pleine largeur | Centré, largeur 480px | Centré, largeur 480px |
| Offres proches | Carrousel horizontal, swipe, dots | Grid 2 colonnes | Grid 3 colonnes |
| Footer | Accordéon par colonne | 3 colonnes | 3 colonnes |

### Variantes de layout — Zone 3 (bloc identité, page critique)

**Variante A (retenue par défaut)** : split 70/30 desktop (H1+badges+statut à gauche, carte avantage_filleul à droite dans un encart `card-offer` secondaire), stack mobile (carte avantage sous le H1, pleine largeur). Justification : hiérarchise le nom du programme comme information dominante (critère Thomas n°9) tout en gardant l'avantage visible sans scroll.

**Variante B (alternative)** : carte avantage_filleul en bandeau horizontal pleine largeur juste sous le H1 (au lieu d'un split latéral), sur tous les breakpoints. Justification : simplifie l'implémentation mobile/desktop (un seul comportement), au prix d'un avantage moins mis en avant visuellement en desktop.

**Variante C (alternative)** : badge-verified extrait du bloc identité et positionné seul dans le header sticky (visible en permanence au scroll). Justification : maximise la visibilité permanente de la fraîcheur (la promesse n°1 de la marque), au prix d'un header plus chargé et d'une rupture avec le pattern de header simple des autres écrans.

**Décision** : Variante A retenue (meilleur équilibre hiérarchie/faisabilité), B et C `[À VALIDER PAR THOMAS]` si la variante A sous-performe au test utilisateur (testeur-persona A1/A2 recommandé par wireframes.md).

### Image spécifiée

Aucune photographie de produit (Parrainly ne vend rien, cf. brand-platform.md exclusions) : la seule image de la page-offre est le **logomark en filigrane léger** (opacité 4%, `color-text-tertiary`) positionné en fond du bloc identité (zone 3), format SVG, taille 240×240px desktop / masqué sur mobile (économie d'espace). Aucune image de "l'enseigne" (Trade Republic, Qonto...) sans licence de logo, cf. legal-strategy.md checklist point 8 : le nom du programme est en typographie, jamais en logo tiers.

### Animation

Zones 3 à 7 : `fade-up` stagger 100ms à l'arrivée sur la page (chargement initial, pas au scroll : la page-offre doit afficher fraîcheur/divulgation/risque immédiatement, cf. wireframes.md G_PROOF). Zone 9 (offres proches) : `fade-up` déclenché au scroll (intersection observer), stagger 100ms par carte. CTA sticky mobile : apparition `slide-up 300ms ease-out` quand la zone 7 initiale sort du viewport.

---

## 2. Accueil `/` et catégories `/categories/{slug}`

### Accueil

| Zone | Mobile | Tablette | Desktop |
|---|---|---|---|
| Bandeau d'intention | Texte + champ recherche pleine largeur, centré, padding vertical `spacing.2xl` (48px) | Idem, padding `spacing.3xl` (64px) | Idem, max-width 640px centré, padding `spacing.4xl` (96px) |
| Grille catégories (6) | 1 colonne stack | 2 colonnes | 3 colonnes |
| Grille offres (9) | 1 colonne stack, priorité `actif` d'abord | 2 colonnes | 4 colonnes (≥1280px) / 3 colonnes (1024-1279px) |

**Image spécifiée** : aucune photo de héros (cohérent avec "pas de hero promotionnel", wireframes.md écran 2). Le bandeau d'intention est typographique pur sur fond `color-background-secondary` légèrement distinct du fond de page, avec le logomark filigrane centré derrière le champ de recherche (opacité 3%, 320px, desktop uniquement).

**Animation** : bandeau d'intention `fade-up 300ms` au chargement ; grilles catégories/offres `fade-up` au scroll, stagger 100ms par carte, groupé par ligne (pas carte par carte individuellement au-delà de la ligne visible, pour éviter un effet cascade trop long sur 9 cartes).

### Catégories `/categories/{slug}`

En-tête catégorie : H1 + description factuelle sur une ligne, padding vertical `spacing.xl`. Grille offres identique au pattern accueil zone 4, filtrée. Aucune image spécifique (page de filtrage, pas de page éditoriale).

---

## 3. Dashboard parrain `/parrain/tableau-de-bord` (US-05)

| Zone | Mobile | Desktop |
|---|---|---|
| Header parrain | Logo + "Bonjour [prénom]" + déconnexion, une seule ligne | Idem |
| Carte prime cumulée | Pleine largeur, montant `font.size.3xl` mono | Pleine largeur, montant `font.size.4xl` mono, max-width 640px centrée dans la zone de contenu |
| Bandeau coaching | Pleine largeur sous la carte, visible seulement si Attributions en attente | Idem |
| Liste des liens par offre | Cartes empilées verticales (1 par programme) | Lignes de tableau (nom / statut / quota), colonnes alignées, montants à droite |

**Aucune image** (outil interne, cf. patterns obligatoires "backoffice = même design system que le front", pas d'illustration décorative). Icônes de statut toujours accompagnées de leur libellé texte ("actif", "en pause jusqu'au...").

**Animation** : chargement = skeleton (rectangles `color-background-secondary` pulsants `motion.duration.slow`) sur les zones 2 à 4, `≤ 2s`. Contenu réel : apparition `fade-up 300ms` une fois chargé, pas de stagger (page d'outil, pas de "spectacle" à l'arrivée).

---

## 4. Confirmation de conversion `/parrain/attributions` (US-09)

| Zone | Mobile | Desktop |
|---|---|---|
| Liste Attributions en_attente | Cartes empilées pleine largeur, bouton pleine largeur | Cartes en grille 1 colonne, largeur contenue 720px |
| Modal de confirmation | **Bottom sheet** : `items-end`, `100dvh`, `safe-area-inset-bottom`, croix en en-tête sticky | **Modal centré** : `items-center`, largeur 480px, `component.modal.radius-desktop`, overlay `rgba(ink-900,0.4)` |

**Animation modal** : ouverture `slide-up 300ms ease-out` (mobile) / `scale-in 0.96→1 200ms ease-out` (desktop), fermeture inverse `200ms ease-in`. Focus trap actif dès l'ouverture (a11y bloquant, cf. design-system.md §3.7). Retour inline post-confirmation (zone 5 wireframes.md) : la carte concernée transitionne `background-color 300ms` vers un fond `color-verified-bg` léger, pas de redirection de page.

**Aucune image** (formulaire d'action, pas de page éditoriale).

---

## Gates BLOQUANT vérifiées

- **G1** : 4 pages couvertes, 3 breakpoints chacune, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : personas A1/A2/Thomas-Emmanuel identiques à brand-platform.md, aucun résidu obsolète. PASS.
- **G7** : ordre et contenu de zone strictement identiques à wireframes.md (aucune zone ajoutée, supprimée ou réordonnée) ; tokens repris de design-tokens.json sans valeur arbitraire ; 0 contradiction. PASS.
- **G12** : chaque page porte layout + comportement par breakpoint + image (ou absence justifiée) + animation, implémentable par @fullstack sans question. PASS.
- **G13** : 0 chiffre inventé ; données de la page-offre exemple reprises de data/base-parrainage.json. PASS.
- **G15** : Grep effectué, absent hors `[À VALIDER PAR THOMAS]` (annotation autorisée). PASS.
- **G17** : l'absence totale de photographie produit/enseigne (remplacée par un logomark filigrane sobre) et le refus du hero promotionnel sont l'inverse du registre visuel des agrégateurs de coupons/parrainage bancaire benchmarkés (brand-platform.md §6). PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** application de la Variante A (zone 3, page-offre) à la fiche Trade Republic sur les 3 breakpoints.
- Mobile (375px) : H1 "Trade Republic" (`font.size.xl`, weight.bold) + badge-category "Finance personnelle" + badge-verified "Vérifié le 15/07/2026" empilés, suivis immédiatement (sans scroll caché) de la carte avantage_filleul pleine largeur "3% d'intérêts pendant 3 mois sur le compte courant" sur fond `card-offer`. Le bandeau divulgation apparaît juste en dessous, toujours sans scroll supplémentaire nécessaire pour l'atteindre depuis l'arrivée sur la page.
- Tablette (768px) : même empilement, largeur de carte avantage étendue à la largeur de la colonne de contenu (max 720px), padding augmenté (`spacing.xl`).
- Desktop (1280px) : split 70/30, H1+badges à gauche (70%, ~840px de large dans un conteneur 1280px avec marges), carte avantage_filleul à droite (30%, ~360px) alignée en haut du split, même hauteur de départ que le H1 (pas de décalage vertical).
- Sur les 3 breakpoints, l'ordre de lecture reste identique (identité → divulgation → conditions → CTA) et la date de vérification reste visible au-dessus de la ligne de flottaison, conforme à wireframes.md G_PROOF et au principe n°3 d'information-architecture.md.

---
**Handoff → @fullstack**
- Fichiers produits : `/home/user/MCP/docs/design/page-compositions.md`
- Décisions prises : Variante A (split 70/30) retenue pour la zone 3 de la page-offre, B et C documentées comme alternatives si test utilisateur défavorable ; aucune photographie produit sur tout le site (logomark filigrane uniquement, cohérent avec l'absence de vente/conseil de la marque) ; animations désactivées en `prefers-reduced-motion`.
- Points d'attention : la boucle visuelle (screenshots `tests/screenshots/`) doit être comparée page par page à ce fichier, pas au wireframe seul (les proportions/tokens exacts sont ici, pas dans wireframes.md) ; le focus trap du modal de confirmation (page 4) est un point bloquant WCAG déjà signalé par @ux, à ne pas oublier à l'implémentation.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de composition visuelle, aucun code produit). Pour @fullstack : implémenter l'intersection observer pour les animations au scroll (zone offres proches, grilles catégories/offres), le skeleton de chargement dashboard, et la media query `prefers-reduced-motion`.
---
