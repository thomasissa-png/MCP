<!-- Version: 2026-07-20 — @seo — Phase 3 (audit technique SEO, code réel Next.js 15) -->
# Audit technique SEO — Parrainly

> Audit réalisé par lecture directe du code (`Read`/`Grep`/`Bash`) sur `src/app/`, `src/lib/ai/`, `next.config.ts`, `package.json`. Site non déployé (`project-context.md`) : aucune donnée Search Console/Bing Webmaster Tools disponible, aucune métrique de trafic. Cet audit porte exclusivement sur le code source réel, zéro projection.

## 1. Méthode et périmètre

Fichiers audités : `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/offres/[slug]/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/lib/ai/jsonld.ts`, `src/lib/ai/site.ts`, `src/lib/offres.ts` (CATEGORY_META), `src/lib/slug.ts`, `next.config.ts`, `package.json`, pages légales (`cgu`, `confidentialite`, `mentions-legales`, `divulgation`, `rgpd/demande`, `lien-invalide`) et back-office (`parrain/*`). Stack confirmée : Next.js `^15.1.6` (App Router) `[NOTE : project-brief mentionne 15.5, `package.json` pin `^15.1.6` — la plage caret autorise jusqu'à <16.0.0, version exacte installée non vérifiable sans `node_modules`]`.

## 2. Métadonnées par route

| Route | Title | Description | Canonical | OpenGraph | Mot-clé exact en title/H1/P1 |
|---|---|---|---|---|---|
| `/` (layout+page) | Défaut layout : "Parrainly · Le parrainage, vérifié avant d'être cité" | Surchargée en page.tsx (factuelle) | **Absent** | Statique (layout), non surchargée par page | Marque oui, pas de mot-clé transactionnel (attendu, page hub) |
| `/offres/[slug]` | `generateMetadata` : `"{nomProgramme} : parrainage vérifié"` | `descriptionCourte` (champ DB) | **Absent** | **Non surchargé** : hérite du OG statique de la homepage (titre/description homepage sur toutes les pages offre) | Title OK. **H1 = `{offre.nomProgramme}` seul, sans le mot "parrainage"** : keyword exact absent du H1 |
| `/categories/[slug]` | `generateMetadata` : `{meta.nom}` seul (ex. `"Crypto"`) | `CATEGORY_META.description` (ex. `"Exchanges, staking, produits Web3."`) | **Absent** | **Non surchargé**, idem hérite de la homepage | **FAIL** : ni title, ni H1, ni description ne contiennent le mot "parrainage" |
| `/cgu`, `/confidentialite`, `/mentions-legales` | Title court, correct | Absente | Absent | Hérité homepage | N/A (pages de conformité) |
| `/divulgation` | Title + description propres | Présente | Absent | Hérité homepage | N/A |
| `/rgpd/demande` | **Aucune `export const metadata`** | Absente | Absent | Hérité homepage | N/A, mais absence de `robots: { index: false }` explicite (voir §6) |
| `/lien-invalide` | Title + `robots: { index: false, follow: false }` | Présente | Absent | Hérité homepage | Correct, page d'échec technique |
| `/parrain/*` (back-office) | Titles propres, `robots: { index: false }` sur les 5 pages | N/A | Absent | Hérité homepage | Correct, déjà noindexé |

**Findings actionnables** :
1. **Ajouter `alternates: { canonical: absUrl(path) }` sur les 4 générateurs de métadonnées (`layout.tsx`, `page.tsx`, `offres/[slug]/page.tsx`, `categories/[slug]/page.tsx`)**, critère de fait : chaque route publique retourne une URL canonique absolue explicite dans sa balise `<link rel="canonical">`. Bloquant pour Bing (pas de fallback intelligent, cf. contrainte multi-moteurs).
2. **Surcharger `openGraph.title`/`openGraph.description` dans `generateMetadata` de `offres/[slug]/page.tsx` et `categories/[slug]/page.tsx`**, critère : chaque partage social d'une fiche offre affiche le nom du programme, pas le titre de la homepage.
3. **Réécrire `CATEGORY_META` (title + description) en reprenant tel quel le mot-clé principal défini par `keyword-map.md` §3 pour chaque catégorie** (source unique de vérité, ex. Crypto → `parrainage plateforme crypto`, Investissement → `parrainage plateforme d'investissement`, etc. — pas un format générique recalculé côté code type `"Parrainage {catégorie}"`, qui entrerait en contradiction avec les mots-clés spécifiques déjà tranchés), critère : Grep du mot-clé principal exact de `keyword-map.md` §3 positif sur chacune des 6 pages catégorie (title + description).
4. **Modifier le H1 de `offres/[slug]/page.tsx`** de `{offre.nomProgramme}` vers `Parrainage {offre.nomProgramme} vérifié` (ou formulation équivalente sans superlatif), critère : Grep "parrainage" positif sur le H1 des 9 pages offre, cohérent avec le title déjà conforme.
5. **Modifier le H1 de `categories/[slug]/page.tsx`** de `{data.categorie}` vers le mot-clé principal exact de la catégorie défini par `keyword-map.md` §3 (même source unique qu'au point 3, ex. Crypto → H1 `Parrainage plateforme crypto`), même critère.
6. **Ajouter `robots: { index: false }` à `export const metadata` de `rgpd/demande/page.tsx`**, critère : défense en profondeur (le disallow robots.txt seul n'empêche pas une désindexation si la page était déjà indexée par un lien externe).

## 3. Sitemap et robots

`src/app/sitemap.ts` (route dynamique, `dynamic = 'force-dynamic'`) :
- Pages offre (`offrePages`) : `lastModified` = `date_verification` réelle de chaque offre. **Correct**, signal de fraîcheur fiable exploitable par Bing.
- Pages statiques (accueil, divulgation, mentions légales, CGU, confidentialité) ET pages catégorie : `lastModified: now` (horodatage de la requête, recalculé à **chaque appel du sitemap** puisque `force-dynamic`). **FAIL Bing-critique** : un sitemap qui change de date à chaque crawl sans changement de contenu réel est un signal de spam explicitement identifié comme tel (cf. contrainte multi-moteurs de ce document).
  - Correction recommandée : figer `lastModified` des pages statiques sur une date de déploiement/contenu réelle (variable d'environnement de build ou date de dernière modification du fichier source), et pour les pages catégorie, dériver `lastModified` du **max des `date_verification` des offres de la catégorie** (donnée déjà disponible, cohérente avec le principe déjà appliqué aux pages offre).

`src/app/robots.ts` :
- Règle `*` (tout robot, y compris Bingbot implicitement) : `allow: '/'`, `disallow` sur `/r/`, `/internal/`, `/lien-invalide`, `/rgpd/demande`. **Correct.**
- 19 crawlers IA explicitement autorisés (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.), conforme à la posture AEO/GEO-first du projet, **zéro blocage de bot IA** : conforme à la règle "ne pas bloquer par défaut". PASS.
- `sitemap: absUrl('/sitemap.xml')` bien déclaré. PASS.

## 4. Structured data (JSON-LD) présente

Builders dans `src/lib/ai/jsonld.ts`, injectés côté serveur :

| Type schema.org | Page | Statut |
|---|---|---|
| `Organization` | Accueil | Présent, mais `logo` pointe vers `favicon.svg` (**SVG**). Google recommande un raster (PNG/JPG/WebP) pour l'éligibilité Knowledge Panel ; SVG n'est pas garanti pris en compte par tous les valideurs. **Finding** : produire un `logo.png` carré ≥ 112×112 px et le référencer dans `organizationJsonLd()`. |
| `WebSite` | Accueil | Présent, `inLanguage: fr-FR` correct. |
| `ItemList` | Accueil (catalogue complet) + catégorie (offres de la catégorie) | Présent, correct. |
| `FAQPage` | Accueil | Présent, 5 questions, cohérent avec `homepage-copy.md`. |
| `Product` + `Offer` | Page offre (si `servable`) | Présent. Divulgation d'affiliation et mention de risque embarquées dans `disambiguatingDescription`/`description` (exigence @legal respectée). **Nuance factuelle** : `Offer` ne porte ni `price` ni `priceCurrency` (cohérent, ce n'est pas un produit commercial), donc la fiche restera valide en Rich Results Test mais **non éligible au rich snippet "prix"** de Google : comportement attendu, à ne pas interpréter comme une erreur. |
| `BreadcrumbList` | Page offre + catégorie | Présent et correct. |

**Finding complémentaire (E-E-A-T, non bloquant)** : aucun schema `Person` pour Thomas/Emmanuel (les deux détenteurs de liens nommés dans le copy et la divulgation). Ajouter un schema `Person` (ou `sameAs`/`author` sur `Organization`) renforcerait le signal d'auteur identifié déjà présent dans le texte (`DisclosureBanner`, "Thomas ou Emmanuel"), cohérent avec la posture de transparence de la marque. Recommandation non bloquante, à arbitrer avec `@geo`.

## 5. Assets manquants (OG, favicon, social)

`public/` ne contient que `favicon.svg` et `site.webmanifest` : **aucune image OG n'existe sur le projet**, à aucune taille.
- **FAIL** : aucun `openGraph.images` ni `twitter.images` configuré nulle part (`layout.tsx` définit `twitter: { card: 'summary_large_image' }` sans image associée : ce type de carte nécessite une image, son absence dégrade l'aperçu sur X/LinkedIn en fallback texte).
- **Finding** : produire une image OG 1200×630 par type de page (homepage générique, gabarit offre avec nom de programme, gabarit catégorie), les référencer dans `openGraph.images`/`twitter.images`, puis tester avec Facebook Sharing Debugger et LinkedIn Post Inspector avant mise en ligne (conforme à la checklist multi-moteurs). Ceci alimente directement le signal social valorisé par Bing (coordination `@social` requise, cf. handoff).
- **Finding favicon** : `apple: [{ url: '/favicon.svg' }]` (layout.tsx) pointe vers un SVG pour l'icône Apple ; iOS/Safari attend historiquement un PNG (`apple-touch-icon.png`, 180×180). Produire ce fichier et le référencer.

## 6. Core Web Vitals (leviers Next.js)

- **Rendu** : toutes les routes de contenu (`/`, `/offres/[slug]`, `/categories/[slug]`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`) sont en `export const dynamic = 'force-dynamic'` : SSR complet à chaque requête (HTML servi avant JS, conforme à l'exigence Bing "rendu JS faible = SSR/SSG obligatoire sur les pages critiques"). **Aucune page critique n'est en CSR pur** : PASS structurel.
- **Finding TTFB/LCP** : `force-dynamic` signifie qu'une requête DB est refaite à chaque affichage, sans aucun cache, alors que le contenu (statut, `date_verification`) ne change qu'à l'exécution de `/internal/freshness-check/run`. Recommandation : passer les pages offre et catégorie en **ISR** (`revalidate` en secondes, ou `revalidatePath` déclenché depuis `/internal/freshness-check/run` après un changement réel de statut) pour servir du HTML mis en cache entre deux vérifications, sans perdre la fraîcheur affichée (le champ `date_verification` reste correct puisqu'il vient de la donnée, pas du moment de rendu). Levier LCP direct sur les 9+6 pages à plus fort enjeu de citation.
- **Images** : aucun usage de `next/image` détecté (Grep `next/image` sur `src/` : 0 résultat) ; cohérent, aucune image n'est actuellement utilisée sur le site (catalogue textuel). **Finding préventif** : dès qu'un logo d'enseigne ou une image de catégorie sera introduit, l'usage de `next/image` doit être **obligatoire** (pas de `<img>` brut), pour préserver LCP/CLS.
- **Fonts** : aucun `next/font` ni `@font-face` détecté dans `globals.css`/`layout.tsx` : le site utilise la pile de polices système. **Point positif à préserver** : zéro requête de police externe, zéro risque de CLS lié au chargement de police. Ne pas introduire de police custom sans passer par `next/font` (auto-hébergement, `font-display: swap`).
- **En-têtes** (`next.config.ts`) : en-têtes de sécurité de base présents (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Aucun en-tête de cache HTTP explicite (`Cache-Control`) configuré pour les assets statiques : non bloquant tant que `next/image` n'est pas utilisé, à revisiter à l'introduction d'assets.

## 7. Maillage interne (état réel du code)

- Accueil → 6 catégories (grille `Link`) et 9 offres (`CatalogueSearch`) sur une seule page : profondeur 1 clic depuis l'accueil pour toute offre. PASS.
- Page catégorie → liste ses offres actives (`OfferCard`) : lien direct catégorie → offre. PASS.
- Page offre → section "Offres proches" (3 offres de la même catégorie, zone 9) : lien remontant offre → offre de la même catégorie, maille la profondeur latérale. PASS.
- Fil d'Ariane (`Breadcrumb` + `breadcrumbJsonLd`) présent sur offre et catégorie, absent sur l'accueil (normal, racine). PASS.
- **Aucun lien contextuel dans le corps de texte** des pages offre vers la page catégorie parente au-delà du fil d'Ariane et du badge (`CategoryBadge`, probablement non cliquable, non vérifié composant par composant) : opportunité de maillage supplémentaire signalée dans `seo-strategy.md` §6 point 5, non bloquante.

## 8. Checklist multi-moteurs Google + Bing

| Item | Statut | Référence |
|---|---|---|
| robots.txt par bot | PASS | §3 |
| Canonicals explicites absolus | **FAIL** | §2 finding 1 |
| Sitemap `lastModified` stable et réel | **PARTIEL** (offres OK, statiques/catégories FAIL) | §3 |
| noindex sur pages sans valeur | **PARTIEL** (back-office + `/lien-invalide` OK, `/rgpd/demande` sans meta noindex) | §2 finding 6 |
| IndexNow | **ABSENT** | Aucune implémentation trouvée (`Grep "indexnow"` sur `src/` : 0 résultat). Recommandation à `@fullstack` : endpoint de notification IndexNow déclenché à chaque publication/mise à jour de fiche (`/internal/freshness-check/run` est le point d'accroche naturel). |
| Bing Webmaster Tools vérifié + sitemap soumis | N/A (site non déployé) | Action post-déploiement, hors code |
| Mot-clé exact en title/H1/P1 | **PARTIEL** (title offre OK, H1 offre/catégorie FAIL, title/description catégorie FAIL) | §2 |
| Favicon complet + balises head | **FAIL** (SVG seul, pas d'ICO/PNG apple-touch-icon) | §5 |
| og:image 1200×630 par page | **FAIL** (aucune image OG n'existe) | §5 |
| twitter:card | **PARTIEL** (type déclaré, aucune image/texte associé) | §5 |
| `Organization.logo` en homepage | **PARTIEL** (présent mais en SVG, pas en raster) | §4 |

Signaux sociaux (facteur de ranking direct Bing) et backlinks .edu/.gov : hors périmètre code, nécessitent une coordination `@social` (contenu partageable, image OG prête) et `@growth` (acquisition de liens) une fois le site déployé.

---

## 9. Synthèse des findings actionnables (ordre de priorité)

1. `alternates.canonical` explicite sur les 4 types de route (§2.1) — P0 Bing.
2. `lastModified` du sitemap stable sur pages statiques/catégories (§3) — P0 Bing (signal de spam actuel).
3. Mot-clé principal exact de `keyword-map.md` §3 dans title/H1/description des 6 pages catégorie (source unique, pas de format générique) + mot-clé "parrainage" dans le H1 des 9 pages offre (§2.3-5) — P0 Bing.
4. Image OG 1200×630 par gabarit de page + `twitter.images` (§5) — P1 (social + Bing).
5. `openGraph` surchargé par page offre/catégorie (§2.2) — P1 (qualité de partage, actuellement toutes les fiches partagent l'OG de la homepage).
6. Logo `Organization` en raster PNG (§4) — P1 (Knowledge Panel Google).
7. ISR/`revalidate` sur pages offre et catégorie au lieu de `force-dynamic` (§6) — P1 (LCP/TTFB).
8. IndexNow (§8) — P1 (Bing, compense un crawl moins fréquent).
9. `robots: { index: false }` sur `/rgpd/demande` (§2.6), apple-touch-icon PNG (§5) — P2.
10. Schema `Person` Thomas/Emmanuel (§4) — P2, E-E-A-T.

---

## Gates BLOQUANT vérifiées

- **G1** : 9 sections, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : conflit potentiel SEO/perf (ISR vs fraîcheur affichée en `force-dynamic`) tranché en §6 avec justification (le champ `date_verification` reste correct indépendamment du mode de rendu). PASS.
- **G7** : cohérent avec `keyword-map.md` (mots-clés recommandés identiques, y compris la correction Crypto `parrainage plateforme crypto`) et `seo-strategy.md` (priorisation des pages offre). Correction 2026-07-20 : §2 findings 3/5 réécrits pour renvoyer explicitement au mot-clé principal de `keyword-map.md` §3 (source unique) au lieu d'un format générique `"Parrainage {catégorie}"` qui contredisait les mots-clés catégorie déjà tranchés. PASS.
- **G12** : chaque finding formulé en verbe + objet + critère de fait vérifiable (§2, §5, §6, §9). PASS.
- **G13** : 1 hypothèse marquée (§1, version Next.js exacte non vérifiable), 0 métrique de trafic inventée, 0 mot-clé recalculé en doublon avec `keyword-map.md` (référence directe, pas de reformulation concurrente). PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence. PASS.
- **G17** : audit fondé sur lecture directe du code réel (chemins de fichiers cités systématiquement), non générique, non reproductible sur un autre projet sans le même code. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :**
- `grep -rn "alternates" src/app src/lib` : 0 occurrence, confirme l'absence totale de canonical explicite (finding §2.1).
- `grep -rn "next/image" src/` : 0 occurrence, confirme l'absence d'usage `next/image` (§6).
- `grep -n "next/font" src/app/layout.tsx` + `grep -n "@font-face" src/app/globals.css` : 0 occurrence chacun, confirme l'absence de police custom (§6).
- `find public -maxdepth 2 -type f` : `favicon.svg`, `site.webmanifest` uniquement, confirme l'absence de toute image OG (§5).
- Lecture directe de `src/app/sitemap.ts` : `lastModified: now` confirmé littéralement sur `staticPages` et `categoryPages` (lignes 19-33), `date_verification` réelle confirmée sur `offrePages` (ligne 37).
- Lecture directe de `src/app/offres/[slug]/page.tsx` ligne 82 : `<h1>{offre.nomProgramme}</h1>` confirmé sans le mot "parrainage".
- Lecture directe de `src/lib/offres.ts` lignes 23-30 (`CATEGORY_META`) : aucune des 6 descriptions ne contient le mot "parrainage".
- Re-vérification 2026-07-20 : `grep -n "Parrainage {catégorie}" docs/seo/audit-technique.md` : 2 occurrences (finding §2.3 et gate G7), toutes deux dans une négation explicite (« pas un format générique ... type `"Parrainage {catégorie}"` ») citée uniquement pour documenter le format écarté, plus aucune occurrence en tant que prescription active. `grep -c "keyword-map.md" docs/seo/audit-technique.md` : 6 occurrences (findings §2.3, §2.5, §9, gate G7 x2, plus la présente ligne), confirme que `keyword-map.md` §3 est bien la référence unique désormais citée partout où un mot-clé catégorie est prescrit.

---
**Handoff → @fullstack (technique), @social (assets OG), @geo (schema Person, coordination citation)**
- Fichiers produits : `/home/user/MCP/docs/seo/audit-technique.md`
- Décisions prises : priorisation P0/P1/P2 en §9, aucun correctif appliqué directement au code (hors périmètre agent SEO, à charge de `@fullstack`).
- Points d'attention : le sitemap régénère `lastModified: now` à chaque requête sur les pages non-offre (signal de spam Bing, correction §3 prioritaire) ; toutes les pages offre/catégorie héritent actuellement de l'OpenGraph de la homepage (aucune image ni titre spécifique), impact direct sur les signaux sociaux valorisés par Bing ; coordination `@social` nécessaire dès que les images OG existent pour les tester (Facebook Debugger, LinkedIn Inspector) avant mise en ligne.
---
