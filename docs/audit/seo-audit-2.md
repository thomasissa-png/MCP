# Audit SEO technique — Parrainly LIVE (itération 2)

> Site audité : https://parrainly.thomas-issa.workers.dev (Cloudflare Workers/OpenNext, D1, 9 offres réelles).
> Angle : persona qui cherche « parrainage {programme} » + IA/AI Overviews qui consomme la structure indexable.
> Cet audit vérifie en réel (curl/grep) l'état du pilote, pas le code en abstrait. Session : 2026-07-20.

## Note : 6,5/10

**Justification double lecture :**
- **Persona (humain)** : les 9 pages offre portent le mot-clé exact « Parrainage {Programme} vérifié » en title ET en H1, canonicals absolus corrects, sitemap propre (20 URLs, `lastModified` stable et réel — le P0 de l'audit précédent est corrigé). C'est du solide.
- **IA visiteuse** : la structure JSON-LD existe (Product/Offer, BreadcrumbList, ItemList, FAQPage) mais **le code de parrainage lui-même reste invisible** dans le HTML et le JSON-LD des pages offre — l'IA ne peut toujours pas l'extraire de la page citable, seulement du miroir `/api/v1`. Sur l'angle strictement SEO (indexabilité, meta, social), deux bugs réels (soft 404, zéro image sociale) et une meta description bancale toujours en ligne tirent la note vers le milieu.

La base technique (canonicals, sitemap, robots) est bonne. Ce qui manque est de la finition (metadata sociale, cohérence de casse, statuts HTTP) et une correction copy déjà identifiée par le fondateur mais pas encore appliquée.

---

## Findings bloquants

### P0

**P0-1 — Reformuler la meta description de l'accueil (et son duplicata dans le hero) — critère de done : la nouvelle description ne contient plus « parrainage fintech » ni « sans lien mort », est ≤ 160 caractères, et est déployée en prod (vérifiable par `curl .../ | grep description`).**
Vérifié en direct : `<meta name="description" content="Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée."/>` — c'est exactement la formulation que le fondateur a qualifiée de bancale (T3), encore en ligne. Le même texte est dupliqué mot pour mot dans `SITE_DESCRIPTION` (`src/lib/ai/site.ts`), le hero de `page.tsx` (L64-66) et l'`openGraph.description` du layout : une seule correction dans `src/lib/ai/site.ts` + propagation suffit à corriger les 4 occurrences.
Reformulation proposée (158 caractères) :
> « 9 parrainages vérifiés à date : néobanque, investissement, crypto, compte pro (Trade Republic, Qonto, Kraken...). Statut et date de contrôle sur chaque offre. »
Pourquoi : remplace l'assimilation floue « parrainage fintech » par un chiffre concret (9) et une liste de catégories réelles ; supprime le gadget « sans lien mort » ; conserve la preuve de fraîcheur (statut + date de contrôle) qui est l'argument différenciant du produit.

**P0-2 — Ajouter une image sociale (`og:image` + `twitter:image`) sur toutes les pages, format 1200×630 — critère de done : chaque page (home, 9 offres, 6 catégories) expose une image testable OK sur Facebook Sharing Debugger et LinkedIn Post Inspector.**
Vérifié en direct : `curl .../ | grep 'og:image\|twitter:image'` → **zéro résultat**. Le layout définit `twitter: { card: 'summary_large_image' }` sans jamais fournir d'image : la carte sociale est cassée (un `summary_large_image` sans image tombe en aperçu vide ou dégradé selon la plateforme). Aucun fichier `og-image.png`/`opengraph-image` n'existe (`/og-image.png` → 404). Impact direct Bing (checklist §"Règle multi-moteurs") et partage LinkedIn/X, canal de distribution du pilote.

**P0-3 — Corriger le statut HTTP des pages offre/catégorie inexistantes (soft 404) — critère de done : `/offres/{slug-inexistant}` et `/categories/{slug-inexistant}` renvoient un status HTTP 404 réel, pas 200.**
Vérifié en direct :
```
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/offres/inexistant       → 200
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/categories/inexistant    → 200
curl -o /dev/null -w "%{http_code}" https://parrainly.thomas-issa.workers.dev/page-qui-n-existe-pas    → 404 (référence : le not-found.tsx global fonctionne, lui)
```
La page rendue contient bien `<meta name="robots" content="noindex"/>` (le `notFound()` de `src/app/offres/[slug]/page.tsx` et `categories/[slug]/page.tsx` déclenche le bon template), mais le code HTTP réel reste 200 sur l'environnement Cloudflare Workers (probable limite de l'adaptateur OpenNext sur les routes `force-dynamic`). Le `noindex` limite le risque d'indexation Google, mais Bing (crawl budget plus serré, cf. règle multi-moteurs) crawle ces URLs comme des pages valides et Search Console/Bing Webmaster Tools les remontera en anomalie « soft 404 », polluant le diagnostic de qualité du site. À signaler à @fullstack : vérifier si `NextResponse` avec status explicite est possible sur ces routes dynamiques dans l'adaptateur Cloudflare, sinon documenter la limite.

**P0-4 (coordination @geo, ne pas dupliquer le fix) — Exposer le code de parrainage dans le HTML indexable et le JSON-LD, pas seulement dans `/api/v1` — critère de done : le champ `code_parrainage` apparaît dans le DOM rendu de la page offre ET dans `offreJsonLd()`.**
Vérifié en direct : `curl .../offres/finary` puis grep du HTML → 0 occurrence de `7KGZAX` (le code réel renvoyé par `/api/v1/offres/finary`). Le builder `offreJsonLd()` (`src/lib/ai/jsonld.ts` L38-75) ne lit jamais `o.code_parrainage`, alors que `PublicOffre` le porte (`public-offre.ts` L33/71). C'est l'objectif n°1 du projet (T1, brief) : une IA qui lit la page rendue ou le graphe structuré ne récupère toujours pas le code. Propriété de correction = @geo/@ia (couche `src/lib/ai/*`), mais je le maintiens en P0 dans mon audit car il conditionne directement la requête cible « parrainage {programme} » que ce document SEO traite : sans le code dans le contenu indexable, aucune page offre ne peut servir de source complète à un AI Overview.

### P1

**P1-1 — Mettre en majuscule initiale les 6 titles de page catégorie — critère de done : chaque `<title>` catégorie commence par une majuscule, cohérent avec les title des pages offre.**
Vérifié : les 6 pages catégorie ont un title en minuscules (`<title>parrainage plateforme crypto · Parrainly</title>`, `<title>parrainage néobanque vérifié · Parrainly</title>`, etc.) alors que les 9 pages offre et l'accueil sont correctement capitalisés (`Parrainage Finary vérifié · Parrainly`). Origine : `CATEGORY_META.motCle` (`src/lib/offres.ts` L27+) est saisi en minuscules et injecté tel quel dans `generateMetadata` (`categories/[slug]/page.tsx` L24). Incohérence de casse visible en SERP, nuit au CTR et à la cohérence de marque.

**P1-2 — Injecter le mot-clé exact « parrainage {Programme} » dans la meta description des 9 pages offre — critère de done : chaque meta description contient la chaîne « parrainage {nom_programme} » verbatim.**
Vérifié : les 9 `<meta name="description">` des pages offre reprennent `descriptionCourte` telle quelle (ex. Finary : « Suivi et analyse de l'ensemble du patrimoine (comptes, immobilier, crypto, actions) dans une seule application. » — zéro occurrence de « parrainage » ou « Finary » associés). Le title porte le mot-clé, pas la meta description : Google/Bing peuvent réécrire le snippet SERP en piochant ailleurs, en particulier si l'intention de requête (« parrainage finary ») n'apparaît nulle part dans le extrait généré. Format proposé : `Parrainage {Programme} vérifié le {date} : {avantage_filleul}. {conditions courtes}` — garde `descriptionCourte` en complément, pas en remplacement intégral.

**P1-3 — Compléter le jeu de favicons et remplacer le logo `Organization` par un raster — critère de done : `favicon.ico` répond 200, `apple-touch-icon.png` dédié (PNG, pas SVG), `organizationJsonLd().logo` pointe vers un PNG/JPG ≥ 112×112.**
Vérifié : `curl -o /dev/null -w "%{http_code}" .../favicon.ico` → 404 ; `curl .../apple-touch-icon.png` → 404 (le head ne référence que `favicon.svg`, y compris pour `apple-touch-icon`). Le JSON-LD `Organization.logo` (`src/lib/ai/jsonld.ts` L87) pointe aussi vers `favicon.svg` : Google documente explicitement que le format vectoriel n'est pas garanti pour l'éligibilité au Knowledge Panel (checklist « Schema.org Organization.logo » de la règle multi-moteurs). `favicon.ico` manquant reste demandé par défaut par de nombreux crawlers/navigateurs legacy qui ignorent le `<link rel="icon">` SVG.

**P1-4 — Donner une meta description propre aux 3 pages légales sans contenu dupliqué — critère de done : `mentions-legales`, `cgu`, `confidentialite` ont chacune une description unique, pas l'héritage du layout.**
Vérifié : les 3 pages n'exportent pas de champ `description` dans leur `metadata` (`src/app/mentions-legales/page.tsx`, `cgu/page.tsx`, `confidentialite/page.tsx`), donc elles héritent toutes de la description globale du layout — identique mot pour mot en SERP sur 3 URLs différentes. `divulgation/page.tsx`, lui, a bien sa propre description : à répliquer sur les 3 autres. Priorité basse (pages priority 0.3 dans le sitemap, faible valeur de citation) mais gratuit à corriger.

**P1-5 — Vérifier la propriété Google Search Console et Bing Webmaster Tools + soumettre le sitemap, et implémenter IndexNow — critère de done : balises `google-site-verification`/`msvalidate.01` présentes en prod, sitemap soumis dans les deux consoles, endpoint IndexNow actif côté @fullstack.**
Vérifié : `curl .../ | grep google-site-verification` → aucun résultat, aucune balise `msvalidate.01` non plus. Le code (`layout.tsx` L34-41) est prêt (conditionné à `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`) mais les variables d'environnement ne sont pas positionnées en prod. Aucun fichier/route IndexNow trouvé (`/indexnow.txt` → 404, aucun fichier `indexnow` dans `src/`). Pour Bing, IndexNow compense un crawl moins fréquent que Google : sans lui, les mises à jour de fraîcheur (`date_verification`) mettent plus de temps à être recrawlées.

---

## Ce qui manque précisément pour 10/10

- [ ] Reformuler la meta description accueil (P0-1) et la propager dans `SITE_DESCRIPTION`, le hero, l'OG description (1 seule source à corriger : `src/lib/ai/site.ts`)
- [ ] Générer et brancher une image `og:image`/`twitter:image` 1200×630 par type de page (home générique, offre = template avec nom de programme, catégorie = template avec nom de catégorie) — tester Facebook Sharing Debugger + LinkedIn Post Inspector avant de considérer clos
- [ ] Faire remonter à @fullstack la question du status HTTP 200 sur `notFound()` en environnement Cloudflare Workers/OpenNext ; documenter la limite si non corrigeable côté adaptateur
- [ ] Coordonner avec @geo/@ia l'exposition de `code_parrainage` dans le DOM + JSON-LD (P0-4) — sans ça, la structure SEO reste optimisée pour une donnée que l'IA ne peut pas extraire
- [ ] Capitaliser les 6 `motCle` de `CATEGORY_META` (`src/lib/offres.ts`)
- [ ] Réécrire les 9 meta descriptions offre pour inclure « parrainage {Programme} » verbatim
- [ ] Ajouter `favicon.ico` + `apple-touch-icon.png` (PNG dédié) ; remplacer `Organization.logo` par un PNG/JPG
- [ ] Donner une meta description propre aux 3 pages légales restantes (`mentions-legales`, `cgu`, `confidentialite`)
- [ ] Positionner `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` en prod, soumettre le sitemap dans les deux consoles, implémenter IndexNow (endpoint côté @fullstack, notification à chaque changement de `date_verification`/`statut`)
- [ ] Revalider le maillage interne après ces corrections : home → 6 catégories (grille + ancre `#categories`) → 9 offres (cartes + recherche) → offres proches (même catégorie) + fil d'Ariane retour ; profondeur actuelle = 2 clics depuis l'accueil, conforme (≤ 3)

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

---

## Handoff → @fullstack (et @geo pour P0-4)

- Fichier produit : `docs/audit/seo-audit-2.md`
- Décisions prises : note 6,5/10 justifiée persona + IA ; reformulation de la meta description accueil fournie prête à intégrer (`src/lib/ai/site.ts`) ; 4 P0 et 5 P1 en verbe+objet+critère de done
- Points d'attention : P0-3 (soft 404 en 200) est probablement une limite de l'adaptateur Cloudflare Workers/OpenNext sur `notFound()` — à investiguer côté @fullstack avant de promettre un fix ; P0-4 (code de parrainage absent du HTML/JSON-LD) est piloté par @geo/@ia, je le maintiens dans mon audit car il verrouille l'objectif n°1 du projet, ne pas le corriger deux fois en parallèle ; références SERP consultées = aucune (pas de WebSearch concurrentiel dans cette itération, audit 100% code+curl réel sur demande explicite du brief)
