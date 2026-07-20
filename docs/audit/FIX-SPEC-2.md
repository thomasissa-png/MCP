<!-- Spec de polish round 2b — 2026-07-20 — session principale -->
# Spec polish (vers 10/10) — résiduels seo / ux / design

Contexte : round 2 déjà appliqué (T1/T2/T3 done, vérifiés live). Re-scores : ia 10, copywriter 9→10 (wording harmonisé par la session), geo 9, ux 8,5, seo 8,5, design 8, legal 7 (gated fondateur). Cette spec vise les résiduels CODE de seo/ux/design. Live : https://parrainly.thomas-issa.workers.dev. Ne pas committer (session s'en charge). Lancer tsc+lint+build en fin.

## @fullstack — résiduels techniques (fichiers listés, périmètre strict)

### SEO (8,5 → 10)
1. `src/app/offres/[slug]/page.tsx` `generateMetadata` : la `description` doit porter le mot-clé
   « parrainage {Programme} » en tête (verbatim keyword-map), pas la `descriptionCourte` brute. Ex.
   `Parrainage ${nom} : code et avantages vérifiés à date. ${descriptionCourte}` (garder < 160 car).
2. `src/app/categories/[slug]/page.tsx` `generateMetadata` : titles en casse propre + mot-clé
   « parrainage » présent (pas de minuscule brute). Vérifier le H1 aussi.
3. Favicons : `favicon.ico` et `apple-touch-icon.png` renvoient 404 aujourd'hui. Ajouter via
   conventions Next App Router (`src/app/icon.png` + `src/app/apple-icon.png`, ou un `favicon.ico`
   dans `src/app/`). Vérifier que les `<link>` correspondants sont rendus et 200.
4. Pages légales `cgu`, `mentions-legales`, `confidentialite`, `divulgation` : ajouter un
   `export const metadata` avec une `description` PROPRE à chaque page (aujourd'hui elles héritent la
   description homepage = duplication). 1 phrase factuelle par page.

### UX (8,5 → 10)
5. `src/app/offres/[slug]/page.tsx` : exposer le miroir JSON en `<head>` de la page offre via
   `alternates: { types: { 'application/json': <url_api> } }` dans `generateMetadata` (rend
   `<link rel="alternate" type="application/json" href=".../api/v1/offres/{id}">`) — aide un agent IA
   à trouver la donnée structurée depuis la page.

### DESIGN (8 → 10)
6. **Harmoniser l'échelle des H1** : le H1 page-offre (`text-xl md:text-2xl`) est nettement plus petit
   que le H1 accueil. Aligner sur une échelle cohérente (monter le H1 offre, ex. `text-2xl md:text-3xl`)
   sans casser la mise en page.
7. **Focus ring accessible sur fond accent** : garantir un anneau `focus-visible` à contraste suffisant
   sur les CTA/liens posés sur fond accent (ajouter `ring-offset` + couleur d'anneau contrastée). Cible
   WCAG 2.4.7 / 1.4.11.
8. **Distinguer visuellement les bandeaux divulgation vs risque** : ils se ressemblent trop (teintes
   proches) juste avant le CTA. Donner au `RiskBanner` une identité visuelle nettement distincte du
   `DisclosureBanner` (bordure/teinte/icône) pour que l'oeil les sépare.

Critères 10/10 : (seo) meta desc offre avec mot-clé + titles catégorie propres + favicons 200 + meta
légales uniques ; (ux) `<link rel=alternate application/json>` présent sur page offre ; (design) H1
cohérents + focus ring visible sur accent + bandeaux divulgation/risque nettement distincts.

Note : verticaux gated hors code (à ne PAS traiter ici, remontés au fondateur) — GSC/Bing/IndexNow
(compte Thomas), rendu social OG (QA humaine), raison sociale LCEN (@legal), captures responsive/dark
(proxy bloque Playwright dans l'env). Ne pas tenter, les documenter suffit.
