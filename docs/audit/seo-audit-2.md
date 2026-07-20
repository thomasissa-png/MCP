# Audit SEO technique — Parrainly LIVE (itération 2)

> Site audité : https://parrainly.thomas-issa.workers.dev (Cloudflare Workers/OpenNext, D1, 9 offres réelles).
> Angle : persona qui cherche « parrainage {programme} » + IA/AI Overviews qui consomme la structure indexable.
> Cet audit vérifie en réel (curl/grep) l'état du pilote, pas le code en abstrait. Session : 2026-07-20.

## Re-score round 2b : 9,5/10 (FINALE pilote)

Polish appliqué re-vérifié en curl, ce jour, sur le site live :
- **P1-2 (meta desc offre)** : les 9 pages offre portent désormais `Parrainage {Programme} : code et avantages vérifiés à date. {descriptionCourte}` en `<meta name="description">` — vérifié sur les 9 slugs (`finary, kraken, qonto, ramify, spiko, trade-republic, dougs, meria, revolut-business`). Le mot-clé exact « Parrainage {Programme} » est désormais dans title ET meta description.
- **P1-1 (casse titles catégorie)** : les 6 `<title>` catégorie sont désormais en casse propre (`Parrainage néobanque vérifié`, `Parrainage plateforme crypto`, etc.), cohérents avec les 9 titles offre. Vérifié sur les 6 slugs.
- **P1-3 (favicons)** : `favicon.ico` → `200 image/vnd.microsoft.icon`, `/icon` → `200 image/png`, `/apple-icon` → `200 image/png`. Le `<head>` référence les 4 variantes (`favicon.ico` 16×16, `favicon.svg`, `/icon` PNG, `/apple-icon` PNG dédié). Plus de 404. Seul `Organization.logo` (JSON-LD) reste en SVG — accepté comme résiduel gated (voir ci-dessous), pas un bug de code.
- **P1-4 (meta desc pages légales)** : `cgu`, `mentions-legales`, `confidentialite`, `divulgation` ont chacune une description unique et spécifique à son contenu (vérifié, plus aucune duplication du texte du layout).

**Tous les résiduels de code identifiés en round 2 sont clos et re-vérifiés.** Les seuls points restants sont explicitement hors code (gated fondateur/QA humaine, cf. section dédiée) : GSC/Bing Webmaster Tools + IndexNow (accès compte Thomas requis), validation visuelle du rendu social OG (QA humaine sur Facebook Sharing Debugger/LinkedIn Post Inspector), `Organization.logo` en SVG (arbitrage produit, pas un blocage technique). Le pilote est **techniquement propre** sur tout ce qui relève du code : je retire 0,5 point uniquement parce que la validation visuelle réelle du rendu social (Facebook/LinkedIn) n'a pas pu être exécutée depuis cet environnement — c'est une vérification humaine requise avant de clore 100%, pas un doute sur le code.

## Round 2 (historique) : 8,5/10

Les 4 correctifs annoncés par le coordinateur sont vérifiés en direct (curl, ce jour) et **réels, pas déclaratifs** :
- **P0-1 (meta desc accueil)** : `curl .../ | grep description` → `"Parrainly vérifie chaque lien de parrainage bancaire, investissement et crypto avant de le recommander : statut à jour et date de contrôle sur chaque offre."` (149 caractères). Plus de « parrainage fintech », plus de « sans lien mort ». Propre, précis, dans la fourchette 120-160.
- **P0-2 (og:image)** : `curl .../opengraph-image`, `.../offres/finary/opengraph-image`, `.../categories/crypto/opengraph-image` → les 3 renvoient `200 image/png`. Meta tags confirmés : `og:image:width=1200`, `og:image:height=630`, `twitter:image` présent avec les mêmes dimensions, `og:image:alt` renseigné. Carte sociale complète sur les 3 types de page testés.
- **P0-3 (soft 404)** : `curl -o /dev/null -w "%{http_code}"` sur `/offres/inexistant` → **404** (était 200), `/categories/inexistant` → **404** (était 200), route générique inconnue → 404 (inchangé, référence). Le body renvoyé est désormais le `not-found.tsx` générique du site (title « Parrainly · Le parrainage, vérifié avant d'être cité », `noindex`), plus la page « Offre introuvable » à 200. Le middleware corrige bien le comportement OpenNext/Cloudflare sur `notFound()`.
- **P0-4 (code de parrainage indexable)** : `grep -c "7KGZAX" offre-finary.html` → 1 dans le texte visible (« Code de parrainage : 7KGZAX. ») et confirmé dans le bloc `<script type="application/ld+json">` sous forme de `PropertyValue` (`"name":"code_parrainage","value":"7KGZAX"`). Une IA qui lit soit le HTML rendu soit le graphe structuré récupère désormais le code. Objectif n°1 du projet atteint sur la page testée.

Les 4 P0 de l'itération précédente sont donc clos et vérifiés. La note monte de 6,5 à **8,5/10** ; le point restant sous 10/10 est un P1 déjà documenté (meta description offre sans mot-clé exact) plus la finition P1 non encore traitée (casse des titles catégorie, favicons, pages légales, GSC/Bing/IndexNow). Aucun de ces résiduels n'est bloquant.

## Note initiale (round 1) : 6,5/10

**Justification double lecture :**
- **Persona (humain)** : les 9 pages offre portent le mot-clé exact « Parrainage {Programme} vérifié » en title ET en H1, canonicals absolus corrects, sitemap propre (20 URLs, `lastModified` stable et réel — le P0 de l'audit précédent est corrigé). C'est du solide.
- **IA visiteuse** : la structure JSON-LD existe (Product/Offer, BreadcrumbList, ItemList, FAQPage) mais **le code de parrainage lui-même reste invisible** dans le HTML et le JSON-LD des pages offre — l'IA ne peut toujours pas l'extraire de la page citable, seulement du miroir `/api/v1`. Sur l'angle strictement SEO (indexabilité, meta, social), deux bugs réels (soft 404, zéro image sociale) et une meta description bancale toujours en ligne tirent la note vers le milieu.

La base technique (canonicals, sitemap, robots) est bonne. Ce qui manque est de la finition (metadata sociale, cohérence de casse, statuts HTTP) et une correction copy déjà identifiée par le fondateur mais pas encore appliquée.

---

## Findings bloquants

### P0 — tous résolus et re-vérifiés en round 2 (voir bloc ci-dessus + Vérifié round 2)

**[RÉSOLU round 2] P0-1 — Reformuler la meta description de l'accueil (et son duplicata dans le hero) — critère de done : la nouvelle description ne contient plus « parrainage fintech » ni « sans lien mort », est ≤ 160 caractères, et est déployée en prod (vérifiable par `curl .../ | grep description`).**
Vérifié en direct : `<meta name="description" content="Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée."/>` — c'est exactement la formulation que le fondateur a qualifiée de bancale (T3), encore en ligne. Le même texte est dupliqué mot pour mot dans `SITE_DESCRIPTION` (`src/lib/ai/site.ts`), le hero de `page.tsx` (L64-66) et l'`openGraph.description` du layout : une seule correction dans `src/lib/ai/site.ts` + propagation suffit à corriger les 4 occurrences.
Reformulation proposée (158 caractères) :
> « 9 parrainages vérifiés à date : néobanque, investissement, crypto, compte pro (Trade Republic, Qonto, Kraken...). Statut et date de contrôle sur chaque offre. »
Pourquoi : remplace l'assimilation floue « parrainage fintech » par un chiffre concret (9) et une liste de catégories réelles ; supprime le gadget « sans lien mort » ; conserve la preuve de fraîcheur (statut + date de contrôle) qui est l'argument différenciant du produit.

**[RÉSOLU round 2] P0-2 — Ajouter une image sociale (`og:image` + `twitter:image`) sur toutes les pages, format 1200×630 — critère de done : chaque page (home, 9 offres, 6 catégories) expose une image testable OK sur Facebook Sharing Debugger et LinkedIn Post Inspector.**
Vérifié en direct : `curl .../ | grep 'og:image\|twitter:image'` → **zéro résultat**. Le layout définit `twitter: { card: 'summary_large_image' }` sans jamais fournir d'image : la carte sociale est cassée (un `summary_large_image` sans image tombe en aperçu vide ou dégradé selon la plateforme). Aucun fichier `og-image.png`/`opengraph-image` n'existe (`/og-image.png` → 404). Impact direct Bing (checklist §"Règle multi-moteurs") et partage LinkedIn/X, canal de distribution du pilote.

**[RÉSOLU round 2] P0-3 — Corriger le statut HTTP des pages offre/catégorie inexistantes (soft 404) — critère de done : `/offres/{slug-inexistant}` et `/categories/{slug-inexistant}` renvoient un status HTTP 404 réel, pas 200.**
Vérifié en direct :
```
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/offres/inexistant       → 200
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/categories/inexistant    → 200
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/page-qui-n-existe-pas    → 404 (référence : le not-found.tsx global fonctionne, lui)
```
La page rendue contient bien `<meta name="robots" content="noindex"/>` (le `notFound()` de `src/app/offres/[slug]/page.tsx` et `categories/[slug]/page.tsx` déclenche le bon template), mais le code HTTP réel reste 200 sur l'environnement Cloudflare Workers (probable limite de l'adaptateur OpenNext sur les routes `force-dynamic`). Le `noindex` limite le risque d'indexation Google, mais Bing (crawl budget plus serré, cf. règle multi-moteurs) crawle ces URLs comme des pages valides et Search Console/Bing Webmaster Tools les remontera en anomalie « soft 404 », polluant le diagnostic de qualité du site. À signaler à @fullstack : vérifier si `NextResponse` avec status explicite est possible sur ces routes dynamiques dans l'adaptateur Cloudflare, sinon documenter la limite.

**[RÉSOLU round 2] P0-4 (coordination @geo, ne pas dupliquer le fix) — Exposer le code de parrainage dans le HTML indexable et le JSON-LD, pas seulement dans `/api/v1` — critère de done : le champ `code_parrainage` apparaît dans le DOM rendu de la page offre ET dans `offreJsonLd()`.**
Vérifié en direct : `curl .../offres/finary` puis grep du HTML → 0 occurrence de `7KGZAX` (le code réel renvoyé par `/api/v1/offres/finary`). Le builder `offreJsonLd()` (`src/lib/ai/jsonld.ts` L38-75) ne lit jamais `o.code_parrainage`, alors que `PublicOffre` le porte (`public-offre.ts` L33/71). C'est l'objectif n°1 du projet (T1, brief) : une IA qui lit la page rendue ou le graphe structuré ne récupère toujours pas le code. Propriété de correction = @geo/@ia (couche `src/lib/ai/*`), mais je le maintiens en P0 dans mon audit car il conditionne directement la requête cible « parrainage {programme} » que ce document SEO traite : sans le code dans le contenu indexable, aucune page offre ne peut servir de source complète à un AI Overview.

### P1 — tous résolus et re-vérifiés en round 2b, sauf résiduels gated (voir section dédiée)

**[RÉSOLU round 2b] P1-1 — Mettre en majuscule initiale les 6 titles de page catégorie — critère de done : chaque `<title>` catégorie commence par une majuscule, cohérent avec les title des pages offre.**
Vérifié : les 6 pages catégorie ont un title en minuscules (`<title>parrainage plateforme crypto · Parrainly</title>`, `<title>parrainage néobanque vérifié · Parrainly</title>`, etc.) alors que les 9 pages offre et l'accueil sont correctement capitalisés (`Parrainage Finary vérifié · Parrainly`). Origine : `CATEGORY_META.motCle` (`src/lib/offres.ts` L27+) est saisi en minuscules et injecté tel quel dans `generateMetadata` (`categories/[slug]/page.tsx` L24). Incohérence de casse visible en SERP, nuit au CTR et à la cohérence de marque.

**[RÉSOLU round 2b] P1-2 — Injecter le mot-clé exact « parrainage {Programme} » dans la meta description des 9 pages offre — critère de done : chaque meta description contient la chaîne « parrainage {nom_programme} » verbatim.**
Vérifié : les 9 `<meta name="description">` des pages offre reprennent `descriptionCourte` telle quelle (ex. Finary : « Suivi et analyse de l'ensemble du patrimoine (comptes, immobilier, crypto, actions) dans une seule application. » — zéro occurrence de « parrainage » ou « Finary » associés). Le title porte le mot-clé, pas la meta description : Google/Bing peuvent réécrire le snippet SERP en piochant ailleurs, en particulier si l'intention de requête (« parrainage finary ») n'apparaît nulle part dans le extrait généré. Format proposé : `Parrainage {Programme} vérifié le {date} : {avantage_filleul}. {conditions courtes}` — garde `descriptionCourte` en complément, pas en remplacement intégral.

**[RÉSOLU PARTIEL round 2b — favicons OK, logo JSON-LD gated] P1-3 — Compléter le jeu de favicons et remplacer le logo `Organization` par un raster — critère de done : `favicon.ico` répond 200, `apple-touch-icon.png` dédié (PNG, pas SVG), `organizationJsonLd().logo` pointe vers un PNG/JPG ≥ 112×112.**
Vérifié : `curl -o /dev/null -w "%{http_code}" .../favicon.ico` → 404 ; `curl .../apple-touch-icon.png` → 404 (le head ne référence que `favicon.svg`, y compris pour `apple-touch-icon`). Le JSON-LD `Organization.logo` (`src/lib/ai/jsonld.ts` L87) pointe aussi vers `favicon.svg` : Google documente explicitement que le format vectoriel n'est pas garanti pour l'éligibilité au Knowledge Panel (checklist « Schema.org Organization.logo » de la règle multi-moteurs). `favicon.ico` manquant reste demandé par défaut par de nombreux crawlers/navigateurs legacy qui ignorent le `<link rel="icon">` SVG.

**[RÉSOLU round 2b, élargi à 4 pages] P1-4 — Donner une meta description propre aux pages légales sans contenu dupliqué — critère de done : `mentions-legales`, `cgu`, `confidentialite` ont chacune une description unique, pas l'héritage du layout.**
Vérifié : les 3 pages n'exportent pas de champ `description` dans leur `metadata` (`src/app/mentions-legales/page.tsx`, `cgu/page.tsx`, `confidentialite/page.tsx`), donc elles héritent toutes de la description globale du layout — identique mot pour mot en SERP sur 3 URLs différentes. `divulgation/page.tsx`, lui, a bien sa propre description : à répliquer sur les 3 autres. Priorité basse (pages priority 0.3 dans le sitemap, faible valeur de citation) mais gratuit à corriger.

**[GATED — non scoré contre le pilote] P1-5 — Vérifier la propriété Google Search Console et Bing Webmaster Tools + soumettre le sitemap, et implémenter IndexNow — critère de done : balises `google-site-verification`/`msvalidate.01` présentes en prod, sitemap soumis dans les deux consoles, endpoint IndexNow actif côté @fullstack.**
Vérifié : `curl .../ | grep google-site-verification` → aucun résultat, aucune balise `msvalidate.01` non plus. Le code (`layout.tsx` L34-41) est prêt (conditionné à `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`) mais les variables d'environnement ne sont pas positionnées en prod. Aucun fichier/route IndexNow trouvé (`/indexnow.txt` → 404, aucun fichier `indexnow` dans `src/`). **Requiert un accès aux comptes Google Search Console / Bing Webmaster Tools de Thomas** : ce n'est pas un défaut de code, le coordinateur confirme ce point gated fondateur. Ne compte pas contre la note du pilote.

---

## Résiduels gated (hors code, non scorés contre le pilote)

Confirmés par le coordinateur comme hors périmètre code, re-vérifiés ici pour mémoire :

1. **GSC / Bing Webmaster Tools / IndexNow** (P1-5) : nécessite un accès au compte Thomas (variables d'environnement `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` + création de compte Bing Webmaster + soumission manuelle du sitemap). Le code est prêt côté `layout.tsx`, il ne manque que la configuration.
2. **Rendu social OG réel** (QA humaine) : les 3 `opengraph-image` renvoient bien `200 image/png` 1200×630 avec les meta tags corrects (vérifié en curl), mais le rendu visuel effectif sur Facebook Sharing Debugger et LinkedIn Post Inspector n'est pas vérifiable depuis cet environnement (pas d'accès à ces outils). À faire par un humain avant diffusion sociale à grande échelle.
3. **`Organization.logo` en SVG** (`src/lib/ai/jsonld.ts` L87, toujours `favicon.svg`) : Google recommande un raster pour l'éligibilité Knowledge Panel, mais c'est un arbitrage produit (créer/choisir un logo PNG dédié), pas un bug — laissé en l'état à la décision du fondateur.

Ces 3 points ne sont **pas comptés contre la note du pilote** (hors code, confirmé par le coordinateur) ; ils restent à traiter avant une mise à l'échelle GEO/SEO complète.

---

## Ce qui manque précisément pour 10/10

- [x] Reformuler la meta description accueil (P0-1) — **résolu round 2**, vérifié en direct (source unique `SITE_DESCRIPTION`)
- [x] Générer et brancher une image `og:image`/`twitter:image` 1200×630 par type de page (P0-2) — **résolu round 2**, vérifié 200 image/png sur home/offre/catégorie ; reste à valider visuellement sur Facebook Sharing Debugger + LinkedIn Post Inspector (hors périmètre outillage de cette session, à faire par un humain)
- [x] Corriger le statut HTTP 200 sur `notFound()` (P0-3) — **résolu round 2** via middleware, vérifié 404 réel sur `/offres/inexistant` et `/categories/inexistant`
- [x] Exposer `code_parrainage` dans le DOM + JSON-LD (P0-4) — **résolu round 2**, vérifié présent en texte visible et en `PropertyValue` JSON-LD sur `/offres/finary`
- [x] Capitaliser les 6 `motCle` de `CATEGORY_META` (P1-1) — **résolu round 2b**, vérifié sur les 6 slugs catégorie
- [x] Réécrire les 9 meta descriptions offre pour inclure « parrainage {Programme} » verbatim (P1-2) — **résolu round 2b**, vérifié sur les 9 slugs offre
- [x] Ajouter `favicon.ico` + `/icon` + `/apple-icon` (P1-3, volet code) — **résolu round 2b**, vérifié 200 sur les 3 routes ; `Organization.logo` en SVG reste **gated** (arbitrage produit, hors code)
- [x] Donner une meta description propre aux pages légales (P1-4) — **résolu round 2b**, vérifié sur `cgu`, `mentions-legales`, `confidentialite`, `divulgation` (4/4, au-delà des 3 initialement identifiées)
- [ ] **GATED** : positionner `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` en prod, soumettre le sitemap dans les deux consoles, implémenter IndexNow — nécessite le compte Thomas, non scoré contre le pilote
- [ ] **QA humaine hors outillage** : valider le rendu visuel des 3 `opengraph-image` sur Facebook Sharing Debugger + LinkedIn Post Inspector
- [x] Revalider le maillage interne après ces corrections : home → 6 catégories (grille + ancre `#categories`) → 9 offres (cartes + recherche) → offres proches (même catégorie) + fil d'Ariane retour ; profondeur actuelle = 2 clics depuis l'accueil, conforme (≤ 3) — inchangé depuis round 1, aucune régression détectée

---

## Points positifs déjà acquis (ne pas régresser)

- Sitemap : 20 URLs exactement (5 statiques + 6 catégories + 9 offres), `lastModified` dérivé de `date_verification` réelle, jamais `new Date()` — le P0 de l'audit précédent (`docs/seo/audit-technique.md`) est corrigé et vérifié en prod.
- Canonicals absolus présents et corrects sur les 16 pages testées (home, 9 offres, 6 catégories) — conforme à l'exigence Bing (pas de fallback implicite).
- Mot-clé exact « Parrainage {Programme} vérifié » en title ET en H1 sur les 9 pages offre ; mot-clé catégorie exact en title/H1 sur les 6 pages catégorie (casse à corriger, cf. P1-1, mais présence confirmée).
- robots.txt autorise explicitement les 19 crawlers IA documentés (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...) avec les mêmes exclusions ciblées que la règle générale (`/r/`, `/internal/`, `/lien-invalide`, `/rgpd/demande`) — bon alignement GEO, zéro sur-blocage.
- Redirection trailing slash propre (`/offres/finary/` → 308 → `/offres/finary`), pas de duplication d'URL.
- JSON-LD présent et structurellement correct sur les 3 types de page (Product/Offer + BreadcrumbList sur offre, ItemList + BreadcrumbList sur catégorie, Organization/WebSite/ItemList/FAQPage sur l'accueil) ; divulgation d'affiliation embarquée dans `disambiguatingDescription` (exigence @legal respectée dans le graphe, même si le code de parrainage n'y est pas encore — P0-4).

---

## Vérifié (G_PROOF)

Commandes réellement exécutées le 2026-07-20 contre https://parrainly.thomas-issa.workers.dev :
- `curl -sI /` , `curl -s /robots.txt`, `curl -s /sitemap.xml` (20 URLs comptées, dates lastmod lues)
- `curl -s /` , `/offres/finary`, `/categories/crypto`, `/categories/finance-personnelle` + grep title/meta description/canonical/H1
- Boucle sur les 9 pages offre (`finary, kraken, qonto, ramify, spiko, trade-republic, dougs, meria, revolut-business`) et les 6 pages catégorie : title/description/canonical extraits pour chacune
- `curl -s /api/v1/offres/finary` (code `7KGZAX` confirmé présent côté API) vs grep du HTML de `/offres/finary` (0 occurrence) et du bloc `<script type="application/ld+json">` (0 occurrence)
- `curl -o /dev/null -w "%{http_code}" /offres/inexistant` → 200, `/categories/inexistant` → 200, `/page-qui-n-existe-pas` → 404 (contrôle)
- `curl -s / | grep 'og:image\|twitter:image'` → aucun résultat ; `curl /favicon.ico` → 404 ; `curl /apple-touch-icon.png` → 404 ; `curl /og-image.png` → 404
- `curl -s / | grep google-site-verification` → aucun résultat ; `curl /indexnow.txt` → 404
- `curl -sI /offres/finary/` (trailing slash) → 308 vers `/offres/finary`
Fichiers lus : `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/offres/[slug]/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/lib/ai/jsonld.ts`, `src/lib/ai/site.ts`, `src/lib/ai/public-offre.ts`, `src/lib/offres.ts` (CATEGORY_META), `src/components/ui/DisclosureBanner.tsx`, `src/components/ui/OfferCard.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Header.tsx`, `src/app/mentions-legales/page.tsx`, `src/app/cgu/page.tsx`, `src/app/confidentialite/page.tsx`, `src/app/divulgation/page.tsx`.
Non vérifié (hors périmètre outillage disponible) : rendu réel dans Google Rich Results Test / Bing Webmaster Tools (pas d'accès aux consoles depuis cet environnement) ; test empirique de citation par une IA (propriété @geo, cf. `docs/geo/test-citation-ia.md`).

### Vérifié round 2 (re-score, ce jour, même URL live)

- `curl -s / | grep description` → nouvelle meta desc confirmée (« ...parrainage bancaire, investissement et crypto... statut à jour et date de contrôle sur chaque offre. », 149 caractères), identique en `og:description`
- `curl -s / | grep 'og:image\|twitter:image'` → 10 balises présentes (`og:image`, `og:image:width=1200`, `og:image:height=630`, `og:image:alt`, `og:image:type=image/png` + équivalents `twitter:image:*`)
- `curl -o /dev/null -w "%{http_code} %{content_type}" /opengraph-image` → `200 image/png` ; idem sur `/offres/finary/opengraph-image` et `/categories/crypto/opengraph-image` → `200 image/png` chacun
- `curl -s /offres/finary | grep -oE 'og:image[^>]*'` → image dédiée à l'offre (URL distincte de celle de l'accueil, confirmant un template par segment et pas une image générique réutilisée)
- `curl -o /dev/null -w "%{http_code}" /offres/inexistant` → **404** ; `/categories/inexistant` → **404** ; `/page-qui-n-existe-vraiment-pas-xyz123` → 404 (contrôle, inchangé) ; body de `/offres/inexistant` = template `not-found.tsx` générique (title « Parrainly · Le parrainage, vérifié avant d'être cité », `noindex`)
- `curl -s /offres/finary -o offre-finary-2.html && grep -c "7KGZAX" offre-finary-2.html` → 1 occurrence texte visible (« Code de parrainage : 7KGZAX. ») + confirmation dans le graphe JSON-LD (`grep -o '<script type="application/ld+json">.*</script>' | grep -o "7KGZAX"` → 3 occurrences, dont un `PropertyValue` `code_parrainage`)
- **Résiduel confirmé non corrigé** : `curl -s /offres/finary | grep description` → toujours `descriptionCourte` brute (« Suivi et analyse de l'ensemble du patrimoine... »), sans « parrainage Finary » — P1-2 reste ouvert, n'affecte pas la note P0

---

## Handoff → @fullstack (et @geo pour la vérification finale de la restitution IA)

- Fichier produit : `docs/audit/seo-audit-2.md`
- Décisions prises : **note finale 8,5/10** (round 2), les 4 P0 sont clos et re-vérifiés en direct sur le site live ; reformulation de la meta description accueil intégrée avec succès (`src/lib/ai/site.ts` comme source unique, confirmé) ; correctifs og:image et code_parrainage confirmés fonctionnels par segment
- **Résiduels (non bloquants)** : P1-2 (meta description des 9 pages offre toujours sans « parrainage {Programme} » verbatim, vérifié sur Finary), P1-1 (casse minuscule des 6 titles catégorie), P1-3 (favicon.ico/apple-touch-icon.png toujours 404, `Organization.logo` toujours en SVG), P1-4 (3 pages légales avec meta description dupliquée du layout), P1-5 (GSC/Bing Webmaster Tools non vérifiés, IndexNow non implémenté) — aucun testé à nouveau dans ce round 2 car non mentionné dans les correctifs annoncés, présumés encore ouverts sauf preuve contraire
- Points d'attention : valider visuellement les 3 og:image sur Facebook Sharing Debugger + LinkedIn Post Inspector (hors outillage curl) avant de considérer P0-2 définitivement clos côté rendu social ; référence SERP consultées = aucune (audit 100% code + curl réel, conforme au brief)
