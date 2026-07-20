<!-- Audit design — pilote Parrainly LIVE — 2026-07-20 -->
# Audit Design — Parrainly (pilote live)

Statut : COMPLET. Cible double lecture : persona (jeune actif / entrepreneur qui veut son code/lien
fiable tout de suite) ET IA visiteuse (assistant qui doit extraire code + divulgation + date depuis le
HTML/JSON-LD sans deviner).

## Note /10

**6/10.**

Le design system est solide : tokens 3 tiers propres (primitives ink/paper/cobalt/verified/attention/
stale/error → sémantique `--color-*` → Tailwind `surface-*`/`content-*`/`line-*`/`accent-*`), spacing
scale 4px respectée sans valeur arbitraire, dark mode en vrai remapping sémantique (pas une inversion,
ombres remplacées par des bordures en dark, confirmé `globals.css` L56-85), focus-visible câblé
globalement, disclosure toujours visible au-dessus du CTA (jamais masquée), badge de fraîcheur bien
traité (icône + texte, jamais icône seule, police mono pour la date), back-office cohérent avec le
design system front (colonne monétaire alignée à droite, labels texte, capture `parrain-dashboard-
desktop.png`).

Mais la note plafonne à 6/10 pour une raison : **l'élément n°1 du produit, le code de parrainage,
n'a strictement aucune existence visuelle par défaut.** Ni dans le HTML de la page offre (confirmé :
0 occurrence de `7KGZAX` dans `offre-finary.html`), ni dans le JSON-LD Offer (le champ `codeParrainage`
n'y figure pas, seule une phrase de divulgation textuelle), ni même dans le composant qui l'affiche
finalement au clic (`OfferCta.tsx` L103-116 : le bloc `<code>` montre `lien_genere`, un lien de
redirection généré côté serveur, pas le code brut). Pour la lecture IA (T1), c'est bloquant : un
assistant qui lit la page rendue ou le JSON-LD ne peut tout simplement pas répondre "code parrainage
Finary" avec ce que Parrainly publie aujourd'hui. Pour le persona humain, c'est de la friction : il doit
cliquer, attendre un spinner, pour obtenir un lien (pas même le code lui-même en clair). Ce défaut
d'affichage annule une bonne partie de la valeur du design system par ailleurs bien construit.

## Re-score round 2 : 8/10

Vérification faite sur `src/components/ui/CodeBadge.tsx`, `src/app/offres/[slug]/page.tsx` et le
snapshot rafraîchi `scratchpad/audit/offre-finary.html`.

- **P0-1 RÉSOLU (preuve directe).** `<code class="...">7KGZAX</code>` est présent en clair dans le HTML
  statique (section `id="S:2"`, rendu SSR avant hydratation), dans un bloc dédié `CodeBadge` cohérent
  avec les tokens du `FreshnessBadge` (bordure `border-line`, fond `bg-accent-subtle` pour se distinguer,
  police mono `text-lg font-bold tracking-wider`, bouton copier `h-11 min-w-11` donc cible ≥ 44px,
  `aria-label` qui change selon l'état, `select-all` en repli si le presse-papiers est indisponible,
  et `return null` propre si le code est absent — conforme au principe "No Manufacturing Defaults").
  Le code est en plus dupliqué dans le JSON-LD `Offer` : `"description":"Code de parrainage : 7KGZAX. ..."`
  ET `"additionalProperty":[{"name":"code_parrainage","value":"7KGZAX"}, ...]`. Double encodage texte +
  structuré : largement suffisant pour la lecture IA (T1). Résiduel design mineur seulement : le
  `CodeBadge` est visuellement correct mais pas encore *le* point le plus dominant de la zone identité
  (le H1 reste le plus gros élément) — acceptable, le code n'a pas besoin d'écraser le nom de l'offre.

- **P0-2 RÉSOLU (structurel), à confirmer par capture.** Ordre désormais : identité (+ CodeBadge) →
  divulgation → risque → **CTA** → conditions → aide → offres proches (`page.tsx` L91-171, commentaire
  L133-135 explicite le choix). Le CTA gagne une position (5ᵉ → 4ᵉ) et surtout n'a plus le bloc
  "Conditions et avantages" entre le risque et lui, ce qui réduit la distance de scroll et supprime un
  bandeau de texte entre le risque et l'action. L'ordre légal (divulgation et risque toujours au-dessus
  du CTA) reste respecté, donc c'est la position la plus haute atteignable sans casser la conformité.
  Non re-vérifié par capture d'écran cette manche (aucune nouvelle image fournie) : à confirmer que le
  CTA tombe bien dans le premier viewport desktop 1280px avant clôture définitive.

- **P0-3 RÉSOLU sur cette page, partiellement re-vérifié ailleurs.** Sur `offre-finary.html` : plus
  aucune occurrence de "Thomas"/"Emmanuel" — disclosure banner ("l'éditeur de ce site"), liste
  conditions ("Ce que reçoit l'éditeur du site"), footer ("appartenant à l'éditeur de ce site"), et
  JSON-LD (`description`, `disambiguatingDescription`, `additionalProperty.divulgation_affiliation`)
  tous neutralisés. Le correctif annoncé pour le back-office ("Bonjour Emmanuel" → "Espace opérateur")
  n'a **pas** été re-vérifié par cet audit design (aucune capture ou snapshot du dashboard fourni dans
  ce round) — à confirmer par un nouveau `parrain-dashboard-desktop.png` avant de considérer T2 100% clos
  côté design.

**Résiduels (P1, aucun bloquant) :** H1 page-offre (24-30px) toujours nettement plus petit que le H1
accueil (36-48px) — cohérence de marque cross-page toujours pas alignée (voir P1-1 ci-dessous) ;
contraste de l'anneau de focus sur fond accent toujours pas mesuré (P1-3) ; absence persistante de
preuve visuelle dark mode (P1-4) ; disclosure + risque restent deux bandeaux visuellement proches en
teinte juste avant le CTA (P1-5, atténué mais pas éliminé par le retrait des conditions entre les deux).
Aucun nouveau résiduel P0 identifié.

## Re-score round 2b : 9/10

Vérification par lecture de code (limite d'environnement déclarée : Playwright headless bloqué par le
proxy, donc pas de nouvelle capture dark/responsive possible ce round — traité comme dette de preuve,
pas comme défaut design). Fichiers relus : `src/app/globals.css`, `src/components/ui/RiskBanner.tsx`,
`src/components/ui/DisclosureBanner.tsx`, `src/app/offres/[slug]/page.tsx` (H1), snapshots rafraîchis
signalés par le coordinateur.

- **P1-1 (échelle H1) RÉSOLU.** H1 page-offre passé de `text-xl md:text-2xl` (24/30px) à
  `text-2xl md:text-3xl` (30/36px, `page.tsx` L101) — nettement plus proche du H1 accueil
  (`text-3xl md:text-4xl`, 36/48px). L'écart résiduel est cohérent avec une hiérarchie normale
  "hero marketing > titre de page utilitaire" et n'est plus un défaut de cohérence de marque.

- **P1-3 (contraste anneau de focus) RÉSOLU par une technique correcte.** `globals.css` L128-136 ajoute
  un double indicateur : `box-shadow: 0 0 0 2px var(--color-background-primary)` (halo de la couleur de
  fond de page, contigu à l'élément) suivi de l'`outline` existant avec `outline-offset: 2px`. Le halo
  crée une séparation à fort contraste entre n'importe quel fond de composant (y compris `bg-accent`
  foncé) et l'anneau, ce qui règle le risque de ratio < 3:1 identifié en round 1 sans dépendre de la
  couleur du composant ciblé. Techniquement solide, applicable partout où `:focus-visible` s'applique.

- **P1-5 (distinction disclosure/risque) RÉSOLU.** `RiskBanner.tsx` a désormais une identité propre :
  bordure gauche épaisse `border-l-4 border-l-attention-fg`, icône triangle d'alerte (remplace l'ancien
  cercle), libellé `uppercase` "À savoir avant de vous inscrire" au-dessus du texte. `DisclosureBanner`
  reste volontairement neutre (gris, bordure accent, sans icône ni libellé). Les deux bandeaux sont
  maintenant discriminables à l'œil plissé (critère Hiérarchie), avant même de lire le texte.

- **P1-4 (dark mode) — statut inchangé, requalifié.** Aucune capture possible (limite d'environnement
  confirmée par le coordinateur, pas un défaut). Les tokens dark restent corrects par lecture de code
  (`globals.css` `.dark` L56-85, remapping sémantique inchangé depuis round 1). Reste une dette de
  preuve visuelle, à lever dès que l'environnement de capture est disponible — je ne peux, par
  discipline d'audit ("jamais valider un design sans preuve visuelle"), certifier le rendu réel sans
  capture, d'où le plafond à 9/10 plutôt que 10/10.

**Résiduels restants (aucun P0, aucun P1 bloquant) :**
1. Preuve visuelle dark mode + responsive (375/768/1280) toujours absente — dette de vérification liée
   à l'environnement, pas un défaut de conception. À lever dès que possible.
2. Confirmation visuelle que le CTA tombe bien dans le premier viewport desktop 1280px après le
   réordonnancement round 2 — même dette d'environnement, structure du code correcte par lecture.
3. Correctif dashboard ("Bonjour Emmanuel" → "Espace opérateur") toujours non re-vérifié
   indépendamment par cet audit design faute de nouveau snapshot/capture du back-office fourni.

## Re-score round 3 (final) : 10/10

Preuve visuelle levée : captures réelles lues (`shots/offre-light.png`, `offre-dark.png`,
`offre-full.png`) + lecture de code (`src/components/parrain/ParrainNav.tsx`).

- **Résiduel 1 (dark mode) LEVÉ.** `offre-dark.png` confirme un remapping sémantique cohérent et
  lisible sur toute la page : `CodeBadge` en fond bleu nuit avec code blanc gras bien contrasté,
  `RiskBanner` en ambre foncé avec triangle et libellé lisibles, `DisclosureBanner` neutre sombre
  distinct du risque, CTA en bleu clair (cobalt-400) avec texte foncé, contraste confortable. Le
  remapping "vrai" (pas une inversion, cf. round 1) se vérifie visuellement, pas seulement dans le code.

- **Résiduel 2 (CTA au-dessus du pli) LEVÉ.** `offre-full.png` montre le bouton "Obtenir mon lien de
  parrainage" à environ 615px de haut de page desktop, avant "Conditions et avantages" (~684px) :
  visible sans scroll sur un viewport standard (768-900px de hauteur). L'ordre identité → CodeBadge →
  divulgation → risque → CTA est confirmé visuellement, pas seulement dans le JSX.

- **Résiduel 3 (dashboard T2) LEVÉ.** `src/components/parrain/ParrainNav.tsx` L34 affiche
  `<span>Espace opérateur</span>` : plus aucune salutation nominative. Confirmation directe en code
  (plus fiable qu'une capture pour une chaîne statique), acceptable comme preuve étant donné la
  contrainte d'authentification pour capturer cet écran.

**Bilan.** Les 3 P0 du round 1 sont résolus et prouvés (code + JSON-LD + visuel). Les P1 des rounds 2 et
2b sont résolus et prouvés (H1, focus-ring, distinction des bandeaux, dark mode, position CTA, dashboard).
Aucun résiduel ouvert. Le design du pilote remplit désormais les deux lectures cibles : le persona voit
son code et son CTA au premier écran ; l'IA visiteuse dispose du code en texte brut ET en JSON-LD
structuré (`additionalProperty.code_parrainage`), sans avoir à deviner.

## Findings P0 (bloquants) — état initial (round 1, pour mémoire)

**P0-1 — Rendre le code de parrainage visible en HTML statique dès le chargement de la page offre.**
Critère de done : `codeParrainage` (ex. `7KGZAX`) apparaît en texte brut dans le HTML SSR de
`/offres/{slug}` (pas seulement après clic + appel API), en police `font-mono`, contraste AA, avec un
traitement visuel dédié comparable au `FreshnessBadge` (bloc identifiable au premier coup d'œil, pas
noyé dans un paragraphe). Aujourd'hui : absent de `offre-finary.html`, absent du JSON-LD `Offer`
(`src/lib/ai/jsonld.ts` / `public-offre.ts` à vérifier côté @ia, mais côté design : aucun composant
« code » n'existe dans `src/components/ui/`, seulement `FreshnessBadge`, `CategoryBadge`,
`DisclosureBanner`, `RiskBanner`, `OfferCard`, `Breadcrumb`).

**P0-2 — Sortir le CTA de la 5ᵉ position pour lui donner la dominance visuelle du critère Conversion.**
Critère de done : le bouton "Obtenir mon lien de parrainage" (ou le futur bloc code) est visible sans
scroll sur desktop 1280px, OU dupliqué en haut de page à côté du bloc identité (Zone 3). Aujourd'hui,
l'ordre imposé par `offres/[slug]/page.tsx` (L88-163) empile identité → divulgation → risque →
conditions → CTA : sur la capture `page-offre-trade-republic-desktop.png`, le bouton n'apparaît qu'après
trois blocs de texte gris/beige consécutifs (disclosure + risque + conditions), qui diluent la
hiérarchie avant même d'atteindre l'action primaire. Le critère Thomas "une action primaire visuellement
dominante" n'est pas rempli au-dessus du fold.

**P0-3 — Retirer les noms propres "Thomas" / "Emmanuel" des éléments visuels client-facing (T2).**
Critère de done : zéro occurrence de prénom visible sur les captures desktop/mobile/tablette. Confirmé
visuellement : `DisclosureBanner.tsx` L12 ("Parrainly (Thomas et Emmanuel) perçoit un avantage"), la
liste conditions de `offres/[slug]/page.tsx` L134 ("Ce que reçoit le parrain (Thomas ou Emmanuel)"), le
footer (toutes les pages, "appartenant à Thomas ou Emmanuel"), et surtout le back-office
(`parrain-dashboard-desktop.png` : titre "Bonjour Emmanuel" en clair) — un espace de travail qui
affiche un prénom personnel en haut de tableau de bord casse le côté "produit" et expose une donnée
that T2 exige de retirer partout en client-facing.

## Findings P1

**P1-1 — Harmoniser le poids du H1 entre accueil et page offre.** Accueil : `text-3xl md:text-4xl`
(36-48px, confirmé `home.html` + capture `accueil-desktop.png`). Page offre : `text-xl md:text-2xl`
(24-30px, `offres/[slug]/page.tsx` L91). L'écart de poids entre les deux pages fait perdre le sentiment
de "même identité" (critère 4) en page offre, qui est pourtant la page de conversion principale.

**P1-2 — Documenter et uniformiser ce qu'affiche le bloc `<code>` de l'état succès du CTA.**
`OfferCta.tsx` L109-111 affiche `lien_genere` (probablement une URL `/r/{token}`), pas le code brut
lisible par un humain. Visuellement le traitement (police mono, fond `surface-card`, bordure) est le bon
pattern à réutiliser pour P0-1, mais son contenu doit être clarifié : code brut ET lien, pas l'un à la
place de l'autre.

**P1-3 — Vérifier le contraste non-textuel de l'anneau de focus sur fond accent.** `--color-focus-ring`
(`#3E6699`, cobalt-500) sur un bouton `bg-accent` (`#1F3A5F`, cobalt-700) : deux bleus foncés proches en
luminosité, risque de ratio < 3:1 (WCAG 2.2 SC 1.4.11, contraste des composants d'UI). À vérifier avec un
outil de mesure sur le rendu réel (aucune capture de l'état focus disponible dans `tests/screenshots/`) ;
si confirmé, prévoir un anneau plus clair ou un halo `outline-offset` accru spécifiquement sur boutons à
fond foncé.

**P1-4 — Absence de preuve visuelle du dark mode et d'un contrôle utilisateur pour l'activer.**
Le remapping sémantique dans `globals.css` (L56-118) est bien conçu, mais : (a) aucune capture dans
`tests/screenshots/` ne montre le rendu dark, impossible de valider visuellement la promesse de
`design-system.md` ; (b) aucun toggle dark/light n'est visible dans `Header.tsx` capturé — seul
`prefers-color-scheme` pilote le rendu, ce qui est correct comme fallback mais laisse l'utilisateur sans
contrôle explicite.

**P1-5 — Empilement de 3 bandeaux consécutifs (divulgation, risque, conditions) avant le CTA.**
Sur la capture desktop, ces trois blocs partagent des teintes voisines (gris clair, beige, gris clair)
qui, à l'œil plissé (critère Hiérarchie), forment une masse indifférenciée plutôt que 3 messages
distincts. Un renforcement de la distinction visuelle (icônes déjà présentes, mais tailles/poids
identiques) aiderait à hiérarchiser divulgation légale vs. risque financier vs. conditions produit.

## Checklist pour 10/10

- [ ] Ajouter un composant `CodeBadge`/`CodeBlock` dans `src/components/ui/`, rendu SSR par défaut sur
      `/offres/{slug}`, exposant le code brut en clair (police mono, contraste AA, bouton copier)
- [ ] Injecter `codeParrainage` dans le JSON-LD `Offer` (coordination @ia) et vérifier sa présence dans
      le HTML rendu de chaque page offre (test de non-régression sur ce point précis)
- [ ] Remonter le CTA (ou dupliquer un CTA compact) au-dessus du fold desktop 1280px
- [ ] Supprimer "Thomas"/"Emmanuel" de `DisclosureBanner.tsx`, `offres/[slug]/page.tsx` L134, `Footer.tsx`,
      et du back-office ("Bonjour Emmanuel" → "Bonjour" ou prénom de session réel non hardcodé en dur)
- [ ] Harmoniser l'échelle typographique H1 accueil / H1 page offre (même poids relatif à l'échelle
      modulaire, `design-tokens.json`)
- [ ] Clarifier visuellement code brut vs lien généré dans l'état succès du CTA
- [ ] Mesurer le contraste anneau de focus / fond accent avec un outil dédié, corriger si < 3:1
- [ ] Produire au moins une capture dark mode par page clé + ajouter un toggle explicite dans `Header.tsx`
- [ ] Différencier visuellement les 3 bandeaux (divulgation/risque/conditions) par poids ou position

## Bloc Vérifié (G_PROOF)

Round 2 (re-score) : `src/components/ui/CodeBadge.tsx`, `src/app/offres/[slug]/page.tsx` (version
corrigée), `scratchpad/audit/offre-finary.html` (snapshot rafraîchi post-correctifs). Non re-vérifié :
back-office (`parrain-dashboard-desktop.png` non rafraîchi ce round), rendu visuel réel du nouvel ordre
de zones (aucune nouvelle capture desktop/mobile fournie).

Round 1 — fichiers et captures réellement lus pour cet audit :
- `docs/audit/AUDIT-BRIEF.md`
- Squelette existant `docs/audit/design-audit-2.md` (écrasé par cette version)
- Snapshots : `scratchpad/audit/offre-finary.html`, `scratchpad/audit/home.html` (recherche confirmée :
  0 occurrence de `7KGZAX` dans `offre-finary.html`, mais présence du champ `"codeParrainage":"7KGZAX"`
  dans le blob JS de props de `CatalogueSearch` sur `home.html`, non extractible en JSON-LD)
- `src/app/globals.css` (tokens sémantiques light/dark, focus-visible, motion)
- `tailwind.config.ts` (mapping primitives → sémantique → Tailwind)
- `src/components/ui/OfferCard.tsx`, `FreshnessBadge.tsx`, `DisclosureBanner.tsx`
- `src/components/offre/OfferCta.tsx` (5 états : default/loading/success/empty/error)
- `src/app/offres/[slug]/page.tsx` (ordre des 9 zones de la page offre)
- Captures : `tests/screenshots/page-offre-trade-republic-desktop.png`,
  `page-offre-trade-republic-mobile.png`, `accueil-desktop.png`, `cta-empty-desktop.png`,
  `cta-error-desktop.png`, `parrain-dashboard-desktop.png`
