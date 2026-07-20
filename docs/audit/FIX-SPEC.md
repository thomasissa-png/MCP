<!-- Spec de correction round 2 — 2026-07-20 — session principale (autopilot) -->
# Spec de correction — vers 10/10 (post-audit round 2)

Objectif : appliquer les correctifs des 7 audits (`docs/audit/*-audit-2.md`) pour atteindre 10/10.
Répartition par **ownership de fichiers** (zéro conflit : chaque fichier a UN seul agent).
Site live : https://parrainly.thomas-issa.workers.dev — après fix, la session redéploie et fait re-scorer.

## Décisions transverses (valent pour tous)

- **T1 (objectif n°1)** : le `code_parrainage` doit ressortir là où une IA le lit : **HTML rendu de la
  page offre + JSON-LD Offer**. Le code est déjà public (contrat `PublicOffre`, `/api/v1`, `llms.txt`) :
  l'exposer ne crée AUCUNE brèche (seule `url_parrainage` reste protégée). Verdict @geo/@ia : GO.
- **T2** : zéro « Thomas » / « Emmanuel » en client-facing. Formulation neutre de référence :
  « **l'éditeur du site** » (singulier) ou « **les opérateurs du registre** ». La divulgation
  d'affiliation est CONSERVÉE (on retire les prénoms, pas la relation d'affiliation).
- **T3 + UTF-8** : wording de référence pour toute description / hero / tagline = **tableau T3 de
  `docs/audit/copywriter-audit-2.md`**, appliqué à l'identique par @copywriter ET @ia (chaînes
  partagées, zéro divergence). Accents UTF-8 réels (é, è, à), zéro tiret cadratin client-facing.
- ANTI-TIMEOUT : Write/Edit d'abord, incrémental, sauver au fur et à mesure. Chaque agent lance
  `npx tsc --noEmit` sur ses fichiers si possible, NE COMMITE PAS (la session s'en charge).

---

## @ia — couche machine (src/lib/ai/*)  [réf : ia-audit-2.md, geo-audit-2.md]

Fichiers : `src/lib/ai/jsonld.ts`, `src/lib/ai/site.ts`, `src/app/llms.txt/route.ts`.
1. `offreJsonLd()` : exposer le code. Ajouter `additionalProperty: [{ '@type':'PropertyValue',
   name:'code_parrainage', value:o.code_parrainage }]` (si non nul) sur le Product ET/OU l'Offer, et
   préfixer la `description` de l'Offer par « Code de parrainage : {code}. » quand présent.
2. Corriger le contresens `priceValidUntil` = `date_verification` (une date de vérification PASSÉE
   n'est pas une date de validité de prix FUTURE). Remplacer par une représentation correcte de la
   fraîcheur : `dateModified: o.date_verification` sur le Product (garder `releaseDate`), et retirer
   `priceValidUntil` OU le remplacer par un `additionalProperty` `date_verification`.
3. `site.ts` : réécrire `SITE_DESCRIPTION` et `SITE_TAGLINE` avec les chaînes T3 de copywriter-audit-2
   (accents UTF-8), et **retirer les prénoms** (« Les liens exposés appartiennent à l'éditeur du site,
   qui perçoit un avantage… »). C'est la source unique de description consommée par le JSON-LD.
4. `llms.txt/route.ts` : (a) retirer les prénoms (T2) ; (b) **annoncer le champ `code_parrainage`**
   dans la description du miroir JSON (aujourd'hui `divulgation_affiliation`/`mention_risque` sont
   annoncés mais pas le code).
Critère 10/10 : `curl .../offres/finary` et le JSON-LD contiennent le code ; 0 prénom dans site.ts/llms.txt ; UTF-8 OK.

---

## @fullstack — page offre + composants  [réf : ia/design/ux/seo-audit-2.md]

Fichiers : `src/app/offres/[slug]/page.tsx`, `src/components/ui/CodeBadge.tsx` (NOUVEAU),
`src/app/categories/[slug]/page.tsx` (soft-404), `src/app/opengraph-image.tsx` (NOUVEAU),
`src/components/parrain/ParrainNav.tsx` (ou équivalent — greeting).
1. Créer `CodeBadge.tsx` : composant SSR qui affiche le **code de parrainage** en clair, lisible,
   copiable (bouton copier client léger optionnel), cohérent avec les tokens de `FreshnessBadge`.
   Si l'offre n'a pas de code (lien seul), ne pas afficher le badge.
2. Page offre : afficher `CodeBadge` avec `offre.codeParrainage` dans le bloc identité (zone 3),
   AU-DESSUS du pli, à côté de la fraîcheur. Le code doit être visible sans clic et présent dans le
   HTML SSR. Corriger aussi le T2 ligne ~134 « Ce que reçoit le parrain (Thomas ou Emmanuel) » →
   « Ce que reçoit l'éditeur du site ».
3. **CTA** (design P0-2) : remonter l'action primaire pour qu'elle ne soit plus en 5e position après
   3 bandeaux. Garder l'ordre légal divulgation-au-dessus-du-CTA, mais rendre le CTA + le code
   visuellement dominants (le persona doit voir code + action sans scroller loin).
4. **Soft-404** (seo P0-3) : `/offres/{slug-inconnu}` et `/categories/{slug-inconnu}` doivent renvoyer
   un vrai HTTP 404 (via `notFound()` correctement propagé), pas 200. Vérifier en `curl -o /dev/null -w '%{http_code}'`.
5. **og:image** (seo P0-2) : créer une image OG par défaut via `opengraph-image.tsx` (next/og
   `ImageResponse`, auto-contenu, texte marque). La brancher globalement (layout ou route). Vérifier
   `og:image` présent dans le HTML.
6. Zone privée : neutraliser le greeting « Bonjour {prénom} » (P2) — afficher un rôle neutre
   (« Bonjour » sans prénom, ou « Espace opérateur »), sans casser l'auth.
Critère 10/10 : code visible dans le HTML de la page offre, CTA remonté, 404 réels, og:image présent, 0 prénom.

---

## @copywriter — copy marketing  [réf : copywriter-audit-2.md]

Fichiers : `src/app/page.tsx` (home : hero L25 + FAQ L37), `src/lib/content/faq-enrichie.ts`
(8 occurrences), `src/app/layout.tsx` (metadata `description`/OG : importer et utiliser
`SITE_DESCRIPTION` depuis `@/lib/ai/site` au lieu de hardcoder — source unique).
1. Appliquer le tableau T2 (retrait prénoms → « l'éditeur du site » / « les opérateurs du registre »)
   sur ces fichiers, en conservant le sens de divulgation d'affiliation.
2. Appliquer le tableau T3 (hero, meta desc) — supprimer « parrainage fintech », « sans lien mort ni
   condition expirée » et les 4 variantes divergentes ; une seule description, alignée `site.ts`.
3. Zéro tiret cadratin client-facing.
Critère 10/10 : 0 prénom dans ces fichiers, copy juste et concrète pour le persona, description unique.

---

## @legal — pages à portée juridique  [réf : legal-audit-2.md]

Fichiers : `src/app/divulgation/page.tsx`, `src/app/mentions-legales/page.tsx`,
`src/app/confidentialite/page.tsx`, `src/components/ui/DisclosureBanner.tsx`,
`src/components/layout/Footer.tsx` (phrase de divulgation).
1. Divulgation / DisclosureBanner / Footer : appliquer les formulations conformes SANS prénoms de
   legal-audit-2 (« l'éditeur de ce site perçoit un avantage… »). Divulgation d'affiliation conservée.
2. `divulgation/page.tsx` : corriger l'incohérence relevée par @geo (le texte affirmait que le code est
   « indiqué sur la fiche ») — maintenant que le code EST affiché sur la page offre, la phrase devient
   vraie ; vérifier/ajuster la formulation en conséquence.
3. Mentions légales + confidentialité : c'est le point dur (éditeur professionnel identifiable, LCEN).
   **Décision fondateur standing : revue juridique reportée avant mise en ligne publique réelle**, et
   le pilote est non-public (workers.dev, non indexé). Donc pour le pilote : retirer les prénoms,
   utiliser le mécanisme `LEGAL_EDITOR_NAME` (déjà présent en mentions-légales) AUSSI en
   `confidentialite/page.tsx` (bug relevé : elle hardcode les prénoms), et changer le FALLBACK pour
   qu'il ne nomme AUCUNE personne physique (ex. « l'éditeur du site, identité définitive à préciser
   avant mise en ligne publique »). Laisser un commentaire code TODO clair : « raison sociale à poser
   via LEGAL_EDITOR_NAME avant lancement public (revue juridique finale) ».
Critère 10/10 (pilote) : 0 prénom, divulgation conforme conservée, mécanisme éditeur paramétrable, TODO raison sociale documenté.
