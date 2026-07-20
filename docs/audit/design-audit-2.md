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

## Findings P0 (bloquants)

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

Fichiers et captures réellement lus pour cet audit :
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
