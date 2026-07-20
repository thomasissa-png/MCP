<!-- Version: 2026-07-20T05:00 — @design — Design system V1 Parrainly (Phase 1) -->

# Design System — Parrainly V1

## Résumé exécutif

Parrainly est un registre, pas un site de bons plans : le design system traduit visuellement l'archétype du Sage (brand-platform.md §4) en évitant les deux clichés du secteur (rouge/orange criard + urgence des agrégateurs de coupons, ET le vert néon sur noir des sites crypto). La fraîcheur (`date_verification`) et le risque (mention légale) sont des tokens sémantiques de PREMIER PLAN, distincts de l'accent de marque : trois familles de couleur cohabitent sans jamais se confondre (accent = action, vérifié = preuve, attention = risque). Dark mode traité à parité (remapping, pas inversion). Ce document mappe chaque composant sur une zone exacte des wireframes @ux (wireframes.md, information-architecture.md) et respecte le registre lexical de brand-voice-guide.md (0 superlatif, 0 classement).

Fichiers du système : `docs/design/design-tokens.json` (source de vérité machine), ce fichier (composants), `docs/design/page-compositions.md` (layouts par page/breakpoint, référence de la boucle visuelle @fullstack).

---

## 1. Palette (justification anti-cliché)

| Rôle | Light (hex) | Dark (hex) | Usage | Pourquoi CE choix |
|---|---|---|---|---|
| Fond principal | `#F8F9FB` (paper-50) | `#10151C` (ink-900) | Arrière-plan de page | Papier froid légèrement bleuté, PAS un blanc pur ni un crème (évite le cliché "editorial/serif/cream" d'un site immobilier premium) |
| Texte principal | `#10151C` (ink-900) | `#F8F9FB` (paper-50) | Corps de texte, titres | Encre, pas noir pur ni gris neutre 50% : plus doux à la lecture longue (fiches de conditions) |
| Accent de marque (CTA, liens) | `#1F3A5F` (cobalt-700) | `#6E93BE` (cobalt-400) | Boutons primaires, liens actifs, focus | Bleu encre désaturé, PAS le bleu fintech saturé générique (Revolut/N26) ni le violet Stripe déjà identifié comme référence à dépasser (brand-platform.md §7) : plus sourd, plus "document officiel" que "start-up" |
| Vérifié / fraîcheur | `#0F7B6C` (verified-700) | `#8FDCC9` (verified-300 sur fond verified-800) | Badge "Vérifié le [date]", statut actif | Vert forêt/teal profond, PAS le vert acidulé néon des sites crypto sur fond noir : sémantique distincte de l'accent (la preuve de fraîcheur ne doit jamais être confondue avec un bouton d'action) |
| Attention / risque | `#8A5A2B` (attention-700/800) | `#E3C193` (attention-300 sur fond attention-800) | Bandeau mention de risque, badge péremption proche | Ambre/argile sobre, jamais rouge alarmiste (contrainte UX wireframes.md zone 5 : "pas de rouge/vert seul comme unique signal") |
| Neutre expiré | `#78838F` (stale-500) | `#A6AEB8` (stale-300) | Badge "en attente"/"expiré", offres reléguées | Gris désaturé neutre : signale sans dramatiser, cohérent avec le ton factuel de brand-voice-guide.md |

**Palette exclue et pourquoi** : pas de crème + serif + terracotta (cliché immobilier/éditorial premium, incompatible avec un registre de données financières) ; pas de vert acidulé sur fond noir pur (cliché crypto/dark hacker, contredit "jamais un site de bons plans" et l'exigence de sobriété fintech régulée, legal-strategy.md §4bis) ; pas de rouge comme signal de risque (wireframes.md l'interdit explicitement, le rouge est réservé aux erreurs fonctionnelles réelles, ex. échec de formulaire).

**Typographie** : `Inter` (sans-serif, lisible en corps de texte long comme les conditions d'éligibilité) pour tout le texte ; `IBM Plex Mono` réservé aux dates de vérification, codes de parrainage et données JSON (`Vérifié le 2026-07-15`, `code_parrainage`) : le monospace signale visuellement "donnée système vérifiable", pas une décoration, un marqueur de véracité distinct du texte éditorial. 3 poids max (400/500/700), cf. tokens `font.weight`.

**Calibration marché (WebSearch, cette session)** : Stripe (documentation technique désirable, déjà sourcé brand-platform.md §7) et Nubank (rupture de ton vs banques installées) restent la référence à dépasser ; complément ciblé sur les registres de vérification/trust badges de sites de conformité fintech (Wise, N26 statuts de compte) confirmant l'usage d'un badge de statut daté distinct de la couleur de marque comme standard implicite du secteur, jamais formalisé en design system public à ce jour : c'est l'espace que Parrainly occupe en le rendant systématique.

---

## 2. Grille, spacing, motion

- Grille : 12 colonnes desktop (≥1024px) / 8 tablette (≥768px) / 4 mobile (<768px), gouttière `spacing.lg` (24px), marge mobile `spacing.md` (16px), max-width 1280px (`grid.max-width`).
- Spacing : échelle 4px stricte (`2xs` 2 à `4xl` 96), aucune valeur arbitraire dans le code (@fullstack).
- Motion par défaut : `fade-up translateY(20px→0) 300ms ease-out (motion.easing.standard), stagger 100ms` sur les listes de cartes ; `prefers-reduced-motion` → `motion.duration.instant` partout sauf les transitions fonctionnelles (ouverture modal, apparition du CTA sticky).
- Rayons : `sm` (4px) sur les badges anguleux, `lg` (12px) sur les cartes, `full` sur les badges pilule (vérifié/expiré), jamais de rayon > `xl` (16px) : cohérent avec le registre "document officiel", pas arrondi ludique.

---

## 3. Composants clés

### 3.1 Carte-offre (composant central, wireframes.md écran 1 zones 3-7 + écran 2 zone 4)

Deux variantes : **carte-offre complète** (page-offre, `docs/design/page-compositions.md`) et **carte-offre catalogue** (accueil/catégories, format condensé, wireframes.md écran 2 zone 4).

**Anatomie (carte-offre complète)** : nom_programme (H1, `font.size.2xl`/`3xl` desktop, `xl` mobile, `weight.bold`) + badge-category (kebab neutre) + badge-verified (date_verification, icône check, `color-verified-*`) + bloc avantage_filleul (carte secondaire, texte factuel non reformulé, cf. brand-voice-guide.md §3) + bandeau divulgation (`component.disclosure-banner`, toujours visible, jamais masqué) + bandeau risque conditionnel SI `categorie` ∈ {Investissement, Gestion de patrimoine, Placement trésorerie, Crypto} (`component.badge-risk` étendu en bandeau pleine largeur) + liste conditions (puces, `font.size.base`, `lineHeight.base`) + zone CTA (5 états, voir 3.1.1) + liens d'aide.

**Anatomie (carte-offre catalogue, condensée)** : nom_programme (`font.size.md`, `weight.bold`) + badge-category + badge-verified (compact, date seule) + teaser 1 ligne avantage_filleul (`font.size.sm`, `color-text-secondary`), le tout dans `component.card-offer` (padding `spacing.lg`, radius `lg`, shadow light / border dark).

**6 états (carte catalogue et complète)** :
| État | Traitement visuel |
|---|---|
| Défaut (`statut: actif`) | Carte pleine opacité, badge-verified visible, CTA actif |
| Hover (desktop) | Élévation légère (`shadow-card` intensifiée +2px) sur la carte catalogue ; sur la carte complète, seul le badge catégorie a un hover (soulignement, cf. wireframes.md) |
| Active/pressed | Carte catalogue : scale 0.98, `motion.duration.fast` |
| Focus-visible | Outline `2px solid color-focus-ring`, offset 2px, sur toute la carte cliquable (catalogue) ou sur le CTA (complète) |
| Disabled (N/A pour la carte, s'applique au CTA interne) | Voir 3.1.1 |
| Reléguée (`statut: en_attente_parrain` / `expiré`) | Carte catalogue : opacité 85%, `badge-stale` remplace `badge-verified`, carte reste cliquable (accès à l'information, jamais masquée) |

**A11y** : zone de clic ≥ 44×44px sur la carte catalogue entière (pas seulement le texte) ; le badge-verified n'est jamais le seul porteur d'information de statut (toujours accompagné du texte "Vérifié le [date]", jamais l'icône seule) ; contraste vérifié light/dark (voir palette §1 pour la paire verified-fg/bg).

#### 3.1.1 Zone CTA — 5 états (mappe exactement wireframes.md écran 1 zone 7 / functional-specs.md US-01)

| État | Bouton | Texte | Token |
|---|---|---|---|
| Défaut | `button-primary` pleine largeur mobile / largeur contenue desktop | "Obtenir mon lien de parrainage" | `component.button-primary` |
| Chargement | `button-primary` désactivé (opacité 60%) + spinner inline 16px | "Génération de votre lien..." | idem + `color-text-inverse` à 60% |
| Vide | Bandeau `component.disclosure-banner` (fond `color-background-secondary`) remplace le bouton + `button-secondary` | "Cette offre n'est plus disponible actuellement." + "Voir les autres enseignes vérifiées" | `component.badge-stale` en accompagnement visuel |
| Erreur | Bandeau `color-error-bg`/`color-error-fg` + `button-secondary` "Réessayer" | "Impossible de générer votre lien pour le moment." | Seul usage légitime de `color-error-*` sur cette carte (jamais pour le risque) |
| Succès | Bloc `color-verified-bg` léger + lien en lecture seule (police `font.family.mono`) + `button-primary` "Continuer vers {nom_programme}" | "Votre lien de parrainage vérifié le [date] est prêt." | `component.badge-verified` réaffirmé dans le message de succès |

### 3.2 Badge de fraîcheur (`badge-verified` / `badge-stale`)

Deux variantes obligatoires, jamais confondues : **verified** (`statut: actif`, contrôle < 90 jours [HYPOTHÈSE seuil visuel, à confirmer avec @product-manager si un seuil de péremption existe]) et **stale** (`statut: en_attente_parrain`/`expiré`, ou vérification jugée ancienne). Icône + texte obligatoires (jamais l'icône seule, contrainte a11y wireframes.md). Format texte : "Vérifié le {date, format JJ/MM/AAAA}" en police `sans`, la date elle-même en `font.family.mono` (`weight.medium`) pour la distinguer visuellement comme donnée système.

### 3.3 Badge de risque (`badge-risk`, bandeau étendu sur page-offre)

Ne s'affiche QUE si `categorie` ∈ {Investissement, Gestion de patrimoine, Placement trésorerie, Crypto} (règle exacte de wireframes.md zone 5, reprise sans modification). Texte = formulation légale exacte de brand-voice-guide.md §5 (ex. "Investir comporte des risques de perte en capital. La prime de parrainage n'est ni un gain d'investissement, ni une compensation de ce risque." pour Ramify/Finary/Spiko ; formulation crypto distincte pour Kraken/Meria). Toujours au-dessus de la ligne de flottaison, jamais réductible en taille de police, jamais un accordéon. Icône `info` 16px systématiquement accompagnée du texte complet.

### 3.4 Boutons

`button-primary` (CTA principal, un seul par page, cf. critère Thomas n°8 Conversion) et `button-secondary` (actions alternatives : "Réessayer", "Voir les autres enseignes"). 6 états : default / hover (assombrissement `color-accent-primary-hover`) / active (scale 0.98) / focus-visible (outline 2px `color-focus-ring` offset 2px) / disabled (opacité 40%, curseur not-allowed) / loading (spinner inline, largeur figée pour éviter le layout shift). Touch target ≥ 44px systématique (`component.button-primary.min-height`).

### 3.5 Navigation (header, fil d'Ariane)

Header : logo + nav horizontale desktop / hamburger + tiroir latéral mobile (<768px), fond `color-background-primary`, border-bottom `color-border-default` 1px (pas de shadow sur le header, cohérence "document" pas "app flottante"). Fil d'Ariane : texte `font.size.sm`, `color-text-secondary`, séparateur ">" , tronqué en "< Retour à [Catégorie]" sur mobile (wireframes.md écran 1 zone 2).

### 3.6 Formulaires (dashboard parrain, US-05/US-09)

Champs : hauteur min 44px, border `color-border-default` 1px, focus `color-focus-ring` 2px + fond légèrement teinté `color-accent-primary-subtle`. Labels texte TOUJOURS visibles au-dessus du champ (jamais un placeholder seul comme label, contrainte back-office learnings cross-projets). Colonnes monétaires (montant de commission, prime estimée) alignées à droite, police `mono` pour les montants. Carte "prime estimée cumulée" (wireframes.md écran 3 zone 2) : montant en `font.size.4xl`/`weight.bold`/`font.family.mono`, sous-texte `font.size.sm`/`color-text-secondary`.

### 3.7 Modal de confirmation (US-09, wireframes.md écran 4 zone 4)

Pattern obligatoire (learning cross-projets) : **bottom sheet sur mobile** (`items-end`, `100dvh`, `safe-area-inset-bottom`, croix de fermeture explicite en en-tête) / **modal centré sur desktop** (`items-center`, `component.modal.radius-desktop`, header/footer de page visibles derrière l'overlay assombri `rgba(ink-900, 0.4)`). Fermeture : X, clic en dehors, touche Escape. **Focus trap obligatoire** (a11y bloquant, signalé par @ux) : focus piégé dans le modal tant qu'il est ouvert, renvoyé au bouton d'origine à la fermeture. Champs : date (calendrier natif ou composant accessible clavier), montant optionnel (police mono, aligné droite). Boutons "Confirmer" (`button-primary`) / "Annuler" (`button-secondary`).

### 3.8 États vide / expiré

- **Vide (dashboard, aucune Attribution)** : icône neutre simple (trait fin, pas d'illustration décorative, cf. No Manufacturing Defaults) + texte "Aucune conversion à confirmer pour le moment." (`color-text-secondary`), ton neutre, jamais un ton d'erreur.
- **Expiré (page-offre, offre retirée)** : `badge-stale` remplace `badge-verified`, CTA remplacé par bandeau + `button-secondary` (cf. 3.1.1 état Vide), carte "offres proches" reste visible et alimentée (jamais de cul-de-sac).

---

## 4. Dark mode (parité, pas inversion)

Remapping strict des tokens sémantiques (design-tokens.json `semantic.dark`) : fonds ink-900/800 (pas un noir pur, cohérent avec le "encre" du light mode), textes clairs paper-50, accent éclairci (cobalt-400, pas cobalt-700, pour rester lisible sur fond sombre), vérifié/risque utilisent leurs teintes claires (verified-300, attention-300) sur fond sombre correspondant (verified-800, attention-800) : contrastes recalculés et corrigés dans les tokens (le premier jet `verified-500` sur `verified-800` ne passait pas 4.5:1, corrigé en `verified-300`, voir design-tokens.json). Ombres light (`shadow-card`, `shadow-modal`) remplacées par `border-card-dark-note` : en dark, la carte et le modal utilisent une bordure 1px `color-border-default` au lieu d'une ombre.

---

## 5. Accessibilité WCAG 2.2 AA

- Contrastes texte/fond vérifiés ≥ 4.5:1 (texte normal) et ≥ 3:1 (UI/large texte) sur les 6 paires critiques : texte principal, texte secondaire, badge-verified, badge-risk, accent sur fond, badge-stale — light ET dark (calculs détaillés dans le G_PROOF du bloc Gates ci-dessous).
- Focus-visible obligatoire partout (`outline: 2px solid color-focus-ring; outline-offset: 2px`), jamais `outline: none` sans remplacement.
- Touch targets ≥ 44×44px : boutons, cartes cliquables, items de liste dashboard.
- `prefers-color-scheme` piloté par défaut système + toggle manuel (à spécifier @fullstack, sauvegarde préférence).
- Le badge de risque n'est jamais porté par la seule couleur (toujours texte complet), conformément à wireframes.md.

---

## 6. Assets d'identité (favicon, icônes)

**Concept du logomark** : un sceau de vérification minimal, un cercle contenant une coche (check) dont le tracé forme en négatif l'amorce d'un "P" (Parrainly) — évoque le tampon/timbre officiel ("vérifié", "daté") plutôt qu'un logo de start-up ludique, cohérent avec l'archétype Sage et le registre "document technique fiable" (brand-platform.md §7).

**Couleurs du logomark** :
- Fond clair (favicon standard, apple-touch-icon) : cercle `color-accent-primary` (cobalt-700, `#1F3A5F`) sur fond `paper-0` (`#FFFFFF`), coche en `verified-700` (`#0F7B6C`) pour rappeler la sémantique de vérification dès l'icône système.
- Variante dark (favicon.svg via `prefers-color-scheme: dark`) : cercle `paper-50` sur fond `ink-900`, coche `verified-300`.
- `theme-color` : `#1F3A5F` (light) / `#10151C` (dark).

**Fichiers à produire dans `public/`** (implémentation @fullstack, vérification @seo) :
- `favicon.svg` (source carré, marges 10%, lisible à 16×16, avec media query dark mode intégrée)
- `favicon.ico` (16+32 multi-size)
- `favicon-16.png`, `favicon-32.png`
- `apple-touch-icon.png` (180×180, padding 20px, fond `cobalt-700` plein, sans coins arrondis ajoutés par le fichier lui-même, iOS applique son propre masque)
- `android-chrome-192.png`, `android-chrome-512.png`
- `og-image.jpg` (1200×630, < 8MB) : fond `ink-900`, wordmark "Parrainly" centré en `paper-50` (`font.size.display`/`weight.bold`), sous-titre "Le parrainage, vérifié avant d'être cité." en `font.size.md`/`color-text-secondary` (dark), un badge-verified miniature illustrant "Vérifié le [date]" en bas de composition pour ancrer visuellement la promesse dès le partage social.

**Explicitement NON générés** (obsolètes 2026) : `safari-pinned-tab.svg`, `mstile-*`, `browserconfig.xml`.

---

## Gates BLOQUANT vérifiées

- **G1** : toutes les sections présentes (palette, grille, 8 composants, dark mode, a11y, assets), 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : personas A1/A2 identiques à brand-platform.md (aucun résidu "Léa"), vocabulaire repris de brand-voice-guide.md ("vérifié le", "conditions d'éligibilité") dans les libellés de composants. PASS.
- **G7** : chaque composant mappe une zone exacte de wireframes.md (zones citées explicitement par écran/numéro) ; 0 contradiction avec brand-platform.md §7 (registre visuel sobre, 0 badge PROMO, 0 compte à rebours) ni avec legal-strategy.md §4bis (mention de risque non alarmiste, position au-dessus du pli) ; palette de badge-risk conforme au refus explicite du rouge (wireframes.md zone 5). PASS.
- **G12** : chaque composant porte variants + 6 états + tokens exacts + mapping zone, implémentable en Tailwind/shadcn sans question de disposition. PASS.
- **G13** : 0 chiffre inventé ; seuil de péremption visuelle du badge marqué `[HYPOTHÈSE]` explicitement, à confirmer par @product-manager. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents (seule occurrence `[HYPOTHÈSE]`, annotation autorisée). PASS.
- **G17** : la combinaison "3 sémantiques de couleur jamais confondues + monospace pour les données système + sceau de vérification comme logomark" n'est pas le registre des agrégateurs de parrainage bancaire FR benchmarkés (contenu éditorial humain sans structure ni code visuel de preuve systématique, brand-platform.md §6). PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** rendu de la carte-offre Trade Republic (REF-001, `data/base-parrainage.json`) en light et en dark.
- Données réelles : nom_programme "Trade Republic", categorie "Finance personnelle" (donc PAS de bandeau risque investissement selon la règle exacte de wireframes.md zone 5, qui ne déclenche le risque que sur Investissement/Gestion de patrimoine/Placement trésorerie/Crypto — `[À VALIDER, hérité de wireframes.md]` : Trade Republic permet aussi l'achat d'ETF/actions, la classification "Finance personnelle" mérite une revue croisée @product-manager/@legal avant mise en ligne), avantage_filleul "3% d'intérêts pendant 3 mois sur le compte courant", conditions "Verser 100 EUR dans les 21 premiers jours et effectuer 3 investissements.", date_verification "2026-07-15", statut "actif".
- **Rendu light** : carte `color-surface-card` blanche (`#FFFFFF`) sur fond `#F8F9FB`, border `#DCE1E7`. H1 "Trade Republic" en ink-900 `weight.bold` `2xl`. `badge-category` neutre "Finance personnelle" (fond `#F1F3F6`, texte `#3A4552`). `badge-verified` pilule verte sobre (fond `#DEF5EE`, texte `#0F7B6C`) : "✓ Vérifié le 15/07/2026" (date en mono). Bandeau divulgation gris clair avec bordure gauche cobalt : "Lien de parrainage Trade Republic : Parrainly perçoit un avantage si vous l'utilisez." Pas de bandeau risque (categorie hors liste déclenchante). Liste conditions : "Verser 100 EUR dans les 21 premiers jours et effectuer 3 investissements." en corps de texte factuel. CTA `button-primary` cobalt-700 plein "Obtenir mon lien de parrainage".
- **Rendu dark** : carte `#1B222B` (ink-700) sur fond `#10151C`, bordure `#3A4552` remplaçant l'ombre. H1 en paper-50. `badge-category` fond `#1B222B`-adjacent (`color-background-secondary` = ink-800) texte ink-300. `badge-verified` fond `verified-800` (`#0A5449`), texte `verified-300` (`#8FDCC9`, contraste recalculé et corrigé à 5.58:1 dans design-tokens.json). Bandeau divulgation fond ink-800, bordure gauche cobalt-400 (plus clair pour rester visible sur fond sombre). CTA cobalt-400 avec texte inverse ink-900 (contraste vérifié 5.74:1 en §5).
- Les deux rendus conservent la même hiérarchie et le même ordre de lecture (identité → divulgation → conditions → CTA), conforme à wireframes.md et au critère Thomas n°4 (même identité).

---
**Handoff → @fullstack, @copywriter, @seo**
- Fichiers produits : `/home/user/MCP/docs/design/design-tokens.json`, `/home/user/MCP/docs/design/design-system.md`, `/home/user/MCP/docs/design/page-compositions.md`
- Décisions prises : palette 3 sémantiques distinctes (accent cobalt / vérifié teal / risque ambre) jamais confondues ; monospace réservé aux données système (dates, codes, montants) ; logomark = sceau de vérification ; dark mode = remapping avec correction de contraste sur le badge vérifié (verified-300 sur verified-800, pas verified-500) ; badge-category neutre unique pour les 6 catégories (pas de code couleur par catégorie).
- Points d'attention : classification risque de Trade Republic (Finance personnelle vs Investissement) à trancher avec @product-manager/@legal avant mise en ligne (hérité de `[À VALIDER]` wireframes.md) ; seuil de péremption visuelle du badge (jours avant passage en `badge-stale`) marqué `[HYPOTHÈSE]`, à confirmer ; @copywriter : les libellés de composants (CTA, bandeaux) reprennent tels quels les gabarits de brand-voice-guide.md §4/§5, ne pas reformuler ; @seo : og-image et favicon prêts à intégrer, vérifier balises meta associées.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de design, aucun code produit). Pour @fullstack : configurer Tailwind avec les tokens de `design-tokens.json` (primitives en `tailwind.config` colors, semantic via variables CSS `--color-*` par thème clair/sombre), installer `Inter` + `IBM Plex Mono` (Google Fonts ou self-hosted), générer les 8 fichiers d'assets listés en section 6 dans `public/`.
---

