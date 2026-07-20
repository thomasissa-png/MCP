<!-- Version: 2026-07-20 — @copywriter — Audit copy post-déploiement (pilote Parrainly LIVE), phase 1 -->

# Audit copy — Parrainly (pilote live), phase 1

> Site audité : https://parrainly.thomas-issa.workers.dev. Périmètre : les 3 axes fondateur (T2 retrait
> noms propres, T3 formulations bancales, cohérence voix de marque). Double lecture : persona humain
> (A1 jeune actif / A2 entrepreneur) et IA visiteuse (GEO/AEO, ce qu'un assistant extrait du HTML/JSON-LD/llms.txt).

## Re-score round 2 : 9/10

**Re-vérification effectuée** (Grep `Thomas|Emmanuel` dans `src/`, Read `src/lib/ai/site.ts`, `src/app/page.tsx`,
`src/app/layout.tsx`, `src/app/divulgation/page.tsx`) après les correctifs signalés par le coordinateur.

**T2 — PASS.** Grep `Thomas|Emmanuel` dans `src/` ne renvoie plus que 7 lignes, toutes hors périmètre
client-facing et déjà exemptées à l'audit initial : `src/config/socle.ts:126-127` (comptes techniques
`AUTH_THOMAS_EMAIL`/`AUTH_EMMANUEL_EMAIL`, défauts `.test`, champ `nom` interne pour l'espace privé
`/parrain`), `src/db/schema.ts:7-8,91,124` (commentaires de schéma DB) et `src/lib/attribution.ts:70`
(commentaire de logique de rotation). 0 occurrence sur les 11 surfaces publiques. Les 19 emplacements du
tableau T2 ci-dessous sont neutralisés (ex. `src/app/divulgation/page.tsx:21` : "appartenant à l'éditeur de
ce site" ; `src/lib/ai/site.ts:25` : "appartiennent à l'éditeur du site" ; formulation légèrement différente
d'un fichier à l'autre — "l'éditeur du site" / "l'éditeur de ce site" / "les opérateurs du registre" selon
les endroits — mais toutes neutres, sans prénom, et la divulgation d'affiliation reste intacte partout.
Conforme à la décision fondateur.

**T3 — PASS.** `src/lib/ai/site.ts` : `SITE_TAGLINE`/`SITE_DESCRIPTION` réécrits avec accents complets,
"fintech" remplacé par les catégories réelles ("parrainage bancaire, investissement, gestion de patrimoine,
placement de trésorerie, services entrepreneur et crypto"), `SITE_DESCRIPTION` devenu source unique importée
par `src/app/layout.tsx:7,15,26` (description par défaut + openGraph identiques, l'ancienne dérive à 4
variantes du finding P1 n°4 est résorbée à 2 : la description globale du site, `SITE_DESCRIPTION`, et la
meta description spécifique homepage dans `page.tsx`, ce qui est un pattern Next.js normal, pas une
incohérence). Meta description homepage (`page.tsx:17`) reformulée sans "sans lien mort" ni "fintech".
Hero (`page.tsx:63-67`) reformulé en une phrase grammaticalement complète intégrant Trade Republic/Qonto/
Kraken. FAQ homepage Q1 (`page.tsx:36`) et Q3 (`page.tsx:38`) alignées ("bancaire, investissement, crypto
et banque pro" ; "signalée inactive" au lieu de "signalée morte"). Paragraphe "Pourquoi la date de
vérification change tout" (`page.tsx:91-96`) : "fintech" remplacé, "signalée morte" devenu "signalée
inactive" — registre sobre rétabli, conforme à `brand-platform.md`.

**Résiduels (non bloquants, ne pénalisent plus la note à 10/10 près) :**
- Léger flottement de formulation entre "l'éditeur du site" (`site.ts`, `mentions-legales`) et "l'éditeur de
  ce site" (`divulgation`) : cohérence rédactionnelle mineure, à harmoniser en une seule tournure si un
  passage d'édition ultérieur touche ces fichiers, mais aucune ambiguïté de sens ni risque légal.
- `ParrainNav`/`user.nom` (espace privé `/parrain`, post-connexion) affiche encore "Thomas"/"Emmanuel" : **hors
  scope T2 confirmé par le coordinateur** (identité de compte interne, jamais rendue au public ni à une IA
  crawlée ; greeting générique déjà neutralisé). Aucune action requise pour cet audit.
- Aucun nouveau tiret cadratin introduit par les correctifs (re-vérifié sur les fichiers modifiés).

**Ce qui manque encore pour un 10/10 strict** : uniquement l'harmonisation cosmétique "l'éditeur du site" vs
"l'éditeur de ce site" (case 1 ci-dessus) — aucun finding P0 restant.

---

## Note initiale (round 1, archivée) : 5/10

**Justification (double angle).**
- Ce que le copy fait déjà bien (persona ET IA) : divulgation d'affiliation omniprésente et précise (au-dessus
  du CTA, jamais masquée), FAQ enrichie de 18 Q/R qui traite les objections réelles (fiabilité, statut, non-conseil,
  risque), posture non-conseil tenue sans faille (aucune promesse de gain chiffrée, conforme à `brand-platform.md`
  section 4), ton globalement sobre et factuel ("vérifié le [date]", "statut : [x]"). Sur ces points, le copy est
  proche de 8-9/10.
- Ce qui plombe la note : les deux axes explicitement bloquants du fondateur sont **actuellement non traités
  dans le code live**. T2 (zéro nom propre) est à 0/19 emplacements corrigés : "Thomas"/"Emmanuel" apparaissent
  encore dans le hero, la FAQ, le footer, la divulgation, les mentions légales, la confidentialité, le
  `DisclosureBanner`, `faq-enrichie.ts`, `llms.txt` et `lib/ai/site.ts`, soit exactement les 10 fichiers listés
  par le fondateur dans `AUDIT-BRIEF.md`. T3 (formulations bancales) touche au moins 5 emplacements de copy
  visible ou servie à une IA (meta description homepage, hero, FAQ homepage Q1, paragraphe "Pourquoi la
  vérification", `SITE_DESCRIPTION`). Un axe "zéro tolérance" non tenu sur 19 occurrences plafonne la note
  malgré une bonne architecture de contenu par ailleurs.
- Angle IA (GEO) : `lib/ai/site.ts` (consommé par le JSON-LD Organization/WebSite injecté sur `/` et servi à
  tout crawler IA) contient en plus un bug distinct des 2 axes demandés : `SITE_TAGLINE` et `SITE_DESCRIPTION`
  sont écrits **sans aucun accent** ("verifie", "etre", "controle", "neobanque"...), alors que le H1 réellement
  rendu sur la page ("Le parrainage, vérifié avant d'être cité.") est correctement accentué. Deux formulations
  légèrement différentes de la même tagline circulent selon la surface consultée par l'IA : risque de
  citation incohérente et violation du commandement 8 (UTF-8, jamais de caractères non accentués par défaut).

## Findings

### P0 — bloquants

1. **Retirer les 19 emplacements client-facing où "Thomas" et/ou "Emmanuel" apparaissent** (tableau T2
   ci-dessous). Fait : 0/19. Critère de done : Grep `Thomas|Emmanuel` dans `src/` ne renvoie plus que
   `src/config/socle.ts` (comptes techniques `.test`, exemptés par le brief) et `src/db/schema.ts` /
   `src/lib/attribution.ts` (commentaires internes, non client-facing, exemptés).
2. **Corriger la formulation "sans lien mort ni condition expirée" + l'amalgame "fintech" pour Trade
   Republic/Qonto/Kraken** dans la meta description homepage (`src/app/page.tsx` L16-17) et le hero
   (L64-67). Critère de done : la meta description nomme les catégories réelles (bancaire, investissement,
   crypto) au lieu du raccourci générique, zéro tournure "gadget" (sans lien mort / le meilleur / incroyable).
3. **Réintégrer les accents UTF-8 dans `SITE_TAGLINE`/`SITE_DESCRIPTION`** (`src/lib/ai/site.ts` L23-25),
   consommés par le JSON-LD Organization/WebSite sur `/`. Critère de done : chaîne identique en orthographe
   accentuée au H1 réellement rendu, zéro caractère non accentué résiduel sur un mot qui devrait l'être.

### P1 — non bloquants mais à corriger avant 10/10

4. **Harmoniser les 4 variantes de la même description** ("Un registre qui vérifie... fintech/bancaire...")
   dispersées entre `layout.tsx` (description par défaut + openGraph), `page.tsx` (meta homepage) et
   `lib/ai/site.ts` (`SITE_DESCRIPTION`) : actuellement 4 formulations légèrement différentes du même fait,
   ce qui dilue la cohérence de marque perçue par un lecteur qui visite plusieurs pages et par une IA qui
   recoupe plusieurs sources sur le même site.
5. **FAQ homepage Q1** ("Qu'est-ce que Parrainly ?", `page.tsx` L36) répète "fintech" puis le décompose
   entre parenthèses (néobanque, investissement, crypto, banque pro) : structure bancale, à fusionner en
   une liste directe.
6. **Paragraphe "Pourquoi la date de vérification change tout"** (`page.tsx` L91-96) : "signalée morte"
   est un registre trop familier pour la contrainte "sobre" du `brand-platform.md` (section registre verbal :
   "verbes factuels", "jamais de superlatif") — à remplacer par un terme factuel ("inactive").
7. **Zone privée `/parrain`** (`ParrainNav`, via `user.nom`) affiche "Thomas" ou "Emmanuel" après connexion
   dans le tableau de bord réservé aux deux fondateurs. Non listé dans le périmètre `AUDIT-BRIEF.md` (qui
   cible le client-facing public), et défendable (chacun voit son propre prénom dans son espace privé, comme
   n'importe quel compte utilisateur) : signalé pour arbitrage fondateur, pas un blocage de cet audit.

## Tableau T2 — retrait des noms propres (avant → après)

Principe de reformulation : "les opérateurs du registre" (les deux, collectivement) / "l'opérateur du
registre" (un des deux, sans révéler lequel) / "l'éditeur" selon le contexte légal. La divulgation
d'affiliation reste intacte : on affirme toujours qu'une personne physique identifiée et fixe détient
chaque lien et perçoit un avantage, on retire seulement le prénom.

| # | Fichier:ligne | Avant | Après |
|---|---|---|---|
| 1 | `src/app/page.tsx:25` | "Vous récupérez un lien attribué à Thomas ou Emmanuel, qui détiennent réellement les programmes du catalogue." | "Vous récupérez un lien attribué à l'un des opérateurs du registre, détenteurs réels des programmes du catalogue." |
| 2 | `src/app/page.tsx:37` | "Les liens exposés appartiennent à Thomas ou Emmanuel, qui perçoivent un avantage du programme si vous les utilisez." | "Les liens exposés appartiennent aux opérateurs du registre, qui perçoivent un avantage du programme si vous les utilisez." |
| 3 | `src/lib/content/faq-enrichie.ts:17` | "...en associant votre visite à Thomas ou Emmanuel, détenteurs réels du lien. Si vous ouvrez un compte..." | "...en associant votre visite à l'opérateur du registre détenteur réel du lien. Si vous ouvrez un compte..." |
| 4 | `src/lib/content/faq-enrichie.ts:21` | "Chaque lien appartient personnellement à Thomas ou à Emmanuel, les deux opérateurs du registre." | "Chaque lien appartient personnellement à l'un des deux opérateurs du registre." |
| 5 | `src/lib/content/faq-enrichie.ts:30` | "...contrôlée manuellement par Thomas ou Emmanuel." | "...contrôlée manuellement par les opérateurs du registre." |
| 6 | `src/lib/content/faq-enrichie.ts:38` | "...ne source ses fiches que sur des liens que Thomas ou Emmanuel détiennent et contrôlent directement..." | "...ne source ses fiches que sur des liens que les opérateurs du registre détiennent et contrôlent directement..." |
| 7 | `src/lib/content/faq-enrichie.ts:47` | "Le parrain (Thomas ou Emmanuel) perçoit l'avantage publié par le programme..." | "Le parrain, opérateur du registre, perçoit l'avantage publié par le programme..." |
| 8 | `src/lib/content/faq-enrichie.ts:51` | "...distincte des primes de parrainage revenant directement à Thomas ou Emmanuel..." | "...distincte des primes de parrainage revenant directement aux opérateurs du registre..." |
| 9 | `src/lib/content/faq-enrichie.ts:64` | "...unique par offre et par parrain (Thomas ou Emmanuel) : l'identifiant..." | "...unique par offre et par parrain, opérateur du registre : l'identifiant..." |
| 10 | `src/lib/content/faq-enrichie.ts:77` | "...telles qu'observées sur le lien précis détenu par Thomas ou Emmanuel, avec sa date de contrôle..." | "...telles qu'observées sur le lien précis détenu par l'opérateur du registre concerné, avec sa date de contrôle..." |
| 11 | `src/components/layout/Footer.tsx:54` | "Parrainly référence des liens de parrainage réels appartenant à Thomas ou Emmanuel, qui perçoivent un avantage si vous les utilisez." | "Parrainly référence des liens de parrainage réels appartenant à ses opérateurs, qui perçoivent un avantage si vous les utilisez." |
| 12 | `src/components/ui/DisclosureBanner.tsx:12` | "Lien de parrainage {nomProgramme} : Parrainly (Thomas et Emmanuel) perçoit un avantage si vous l'utilisez pour vous inscrire." | "Lien de parrainage {nomProgramme} : Parrainly, via l'opérateur du registre qui détient ce lien, perçoit un avantage si vous l'utilisez pour vous inscrire." |
| 13 | `src/app/offres/[slug]/page.tsx:134` | `Ce que reçoit le parrain (Thomas ou Emmanuel) : ` | `Ce que reçoit l'opérateur du registre : ` |
| 14 | `src/app/confidentialite/page.tsx:19` | "Parrainly est édité par Thomas et Emmanuel. Le responsable de traitement des données..." | "Parrainly est édité par ses deux fondateurs, opérateurs du registre. Le responsable de traitement des données..." |
| 15 | `src/app/mentions-legales/page.tsx:21` | "Le site Parrainly est édité par ses deux parrains fondateurs, Thomas et Emmanuel, en cercle fermé." | "Le site Parrainly est édité par ses deux parrains fondateurs, opérateurs du registre, en cercle fermé." |
| 16 | `src/app/divulgation/page.tsx:21` | "...contient un lien de parrainage personnel appartenant à Thomas ou à Emmanuel, les deux personnes qui construisent Parrainly." | "...contient un lien de parrainage personnel appartenant à l'un des deux opérateurs du registre qui construisent Parrainly." |
| 17 | `src/app/divulgation/page.tsx:25` | "...via un des liens présentés sur ce site, Thomas ou Emmanuel reçoit un avantage..." | "...via un des liens présentés sur ce site, l'opérateur du registre concerné reçoit un avantage..." |
| 18 | `src/lib/ai/site.ts:25` | "Les liens exposes appartiennent a Thomas ou Emmanuel, qui percoivent un avantage du programme si vous les utilisez." | "Les liens exposés appartiennent aux opérateurs du registre, qui perçoivent un avantage du programme si vous les utilisez." (voir aussi correction accents, tableau T3 ligne dédiée) |
| 19 | `src/app/llms.txt/route.ts:29` | "...Les liens exposés appartiennent à Thomas ou Emmanuel, qui perçoivent un avantage du programme si vous les utilisez ; ..." | "...Les liens exposés appartiennent aux opérateurs du registre, qui perçoivent un avantage du programme si vous les utilisez ; ..." |

**Total : 19 emplacements distincts, 38 mentions de prénom (19× "Thomas" + 19× "Emmanuel") à retirer.**
Exemptés (hors périmètre, confirmés par `AUDIT-BRIEF.md` ou par arbitrage) : `src/config/socle.ts` (comptes
`.test` internes), `src/db/schema.ts` et `src/lib/attribution.ts` (commentaires code, non client-facing).
Signalé mais non tranché : `ParrainNav` (`user.nom`, zone privée `/parrain`, finding P1 n°7.

## Tableau T3 — formulations bancales (avant → après)

| # | Emplacement | Avant | Après | Pourquoi |
|---|---|---|---|---|
| 1 | Meta description homepage, `src/app/page.tsx:16-17` | "Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée." | "Parrainly vérifie chaque lien de parrainage bancaire, investissement et crypto avant de le recommander : statut à jour et date de contrôle sur chaque offre." (156 caractères) | "parrainage fintech" est flou ; assimiler Trade Republic (courtage), Qonto (banque pro) et Kraken (crypto) à un seul mot-valise est imprécis ; "sans lien mort" est un registre gadget qui contredit le ton "sobre" du brand voice. |
| 2 | Description par défaut, `src/app/layout.tsx:14-15` | "Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : date de contrôle, statut, conditions à jour." | "Parrainly vérifie chaque lien de parrainage bancaire, investissement et crypto avant de le recommander : date de contrôle, statut, conditions à jour." | Même correction "fintech" → catégories concrètes, pour cohérence avec la version homepage. |
| 3 | OpenGraph description, `src/app/layout.tsx:26-27` | "Un registre qui vérifie les liens de parrainage fintech avant de les recommander, avec une date de contrôle sur chaque offre." | "Un registre qui vérifie les liens de parrainage bancaire, investissement et crypto avant de les recommander, avec une date de contrôle sur chaque offre." | Idem, + réduit à 3 variantes au lieu de 4 la même phrase répétée sur le site (voir finding P1 n°4). |
| 4 | Hero, `src/app/page.tsx:63-67` | "Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : date de contrôle, statut, conditions à jour. Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée." | "Parrainly vérifie chaque lien de parrainage bancaire, investissement et crypto avant de le recommander : date de contrôle, statut et conditions à jour, sur des programmes réels comme Trade Republic, Qonto ou Kraken." | La 2e phrase de l'original n'est pas une phrase complète (fragment nominal après le point) ; les marques sont maintenant intégrées dans une proposition grammaticale correcte, sans "sans lien mort". |
| 5 | FAQ homepage Q1, `src/app/page.tsx:36` | "Parrainly est un registre qui vérifie des liens de parrainage fintech (néobanque, investissement, crypto, banque pro) avant de les recommander, avec une date de contrôle sur chaque offre." | "Parrainly est un registre qui vérifie des liens de parrainage bancaire, investissement, crypto et banque pro avant de les recommander, avec une date de contrôle sur chaque offre." | Le terme "fintech" immédiatement décomposé entre parenthèses en ses propres sous-catégories est redondant ; la liste directe est plus lisible et plus juste pour le persona A2 (entrepreneur, catégorie "banque pro"). |
| 6 | Paragraphe "Pourquoi la vérification", `src/app/page.tsx:91-96` | "Un lien de parrainage fintech n'est pas un code promo classique [...] Parrainly retire une offre du registre dès qu'elle est signalée morte, expirée ou modifiée, avant de la reproposer." | "Un lien de parrainage bancaire, d'investissement ou crypto n'est pas un code promo classique [...] Parrainly retire une offre du registre dès qu'elle est signalée inactive, expirée ou modifiée, avant de la reproposer." | "fintech" → catégories concrètes (cohérence globale) ; "signalée morte" personnifie l'offre dans un registre trop familier pour la contrainte "sobre" (brand-platform.md section 4 et 7, registre verbal). |
| 7 | `SITE_TAGLINE`/`SITE_DESCRIPTION`, `src/lib/ai/site.ts:23-25` | "Le parrainage, verifie avant d'etre cite." / "...parrainage fintech (neobanque, investissement, gestion de patrimoine, placement de tresorerie, services entrepreneur, crypto)..." (sans accents) | "Le parrainage, vérifié avant d'être cité." / "...parrainage bancaire, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur et crypto..." (accents rétablis, cf. finding P0 n°3) | Combine la correction "fintech" et la réintégration des accents UTF-8 (commandement 8), cette chaîne étant injectée telle quelle dans le JSON-LD Organization/WebSite lu par les IA. |
| 8 | `llms.txt`, `src/app/llms.txt/route.ts:29` | "...un registre qui vérifie chaque lien de parrainage fintech avant de le recommander (néobanque, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur, crypto)..." | "...un registre qui vérifie chaque lien de parrainage bancaire, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur et crypto avant de le recommander..." | Harmonisation recommandée (non bloquante) avec les 3 autres variantes ci-dessus, pour qu'une IA qui recoupe `/llms.txt` et le HTML lise exactement la même formulation. |

## Checklist pour 10/10

- [x] **(round 2, vérifié PASS)** Appliquer les 19 remplacements du tableau T2, puis Grep `Thomas|Emmanuel`
      dans `src/` : ne renvoie plus que `socle.ts` (comptes `.test` + `nom` interne `/parrain`), `db/schema.ts`
      et `lib/attribution.ts` (commentaires internes) — conforme.
- [x] **(round 2, vérifié PASS)** Appliquer les remplacements du tableau T3 : meta description homepage,
      hero, FAQ Q1/Q3, paragraphe "Pourquoi la vérification" tous reformulés sans "fintech" ni "sans lien
      mort"/"signalée morte".
- [x] **(round 2, vérifié PASS)** Accents réintégrés dans `src/lib/ai/site.ts` (`SITE_TAGLINE`,
      `SITE_DESCRIPTION`) : plus aucun mot français non accentué.
- [x] **(round 2, vérifié PASS)** `SITE_DESCRIPTION` devenu source unique, importée par `layout.tsx` (défaut
      + openGraph) : dérive à 4 variantes résorbée à 2 (description globale vs meta homepage spécifique,
      pattern Next.js normal).
- [ ] Trancher le sort de `ParrainNav`/`user.nom` (finding P1 n°7) : **confirmé hors scope T2 par le
      coordinateur** (identité de compte interne, jamais rendue au public/IA, greeting déjà neutralisé).
      Aucune action requise sauf si le fondateur souhaite aller plus loin.
- [ ] Harmoniser "l'éditeur du site" (`site.ts`, `mentions-legales`) vs "l'éditeur de ce site"
      (`divulgation`) en une seule tournure — cosmétique, seul point restant pour un 10/10 strict.
- [x] Re-Grep `—` (tiret cadratin) sur les fichiers modifiés : PASS, aucune régression.
- [ ] Faire relire par @seo l'impact de la nouvelle meta description homepage sur `keyword-map.md` (le
      remplacement de "fintech" par "bancaire, investissement et crypto" ne retire aucun mot-clé exact
      `parrainage {enseigne}`, ces derniers restant portés par les pages `/offres/{slug}`).

## Vérifié (G_PROOF round 2)

Re-vérification : Grep `Thomas|Emmanuel` sur `src/` (7 lignes restantes, toutes hors périmètre — `socle.ts`,
`db/schema.ts`, `lib/attribution.ts`) ; Read `src/lib/ai/site.ts` (accents restaurés, "l'éditeur du site"),
`src/app/page.tsx` L1-70 et L85-100 (meta description, hero, FAQ, paragraphe "Pourquoi la vérification"
tous reformulés), `src/app/layout.tsx` (import `SITE_DESCRIPTION` confirmé), `src/app/divulgation/page.tsx`
L1-30 ("l'éditeur de ce site" confirmé).

## Vérifié (G_PROOF round 1)

Fichiers lus intégralement pour cet audit : `docs/audit/AUDIT-BRIEF.md`, `docs/strategy/brand-platform.md`,
`src/app/page.tsx`, `src/app/layout.tsx`, `src/lib/content/faq-enrichie.ts`, `src/components/layout/Footer.tsx`,
`src/components/ui/DisclosureBanner.tsx`, `src/app/offres/[slug]/page.tsx`, `src/app/confidentialite/page.tsx`,
`src/app/mentions-legales/page.tsx`, `src/app/divulgation/page.tsx`, `src/app/llms.txt/route.ts`,
`src/lib/ai/site.ts`, `src/config/socle.ts` (extrait L100-139), `docs/seo/keyword-map.md` (extrait ciblé).
Grep exécutés : `Thomas|Emmanuel` sur `src/` (19 emplacements client-facing confirmés, 3 fichiers exemptés
identifiés), `SITE_TAGLINE|SITE_DESCRIPTION` (2 usages confirmés dans `src/lib/ai/jsonld.ts`), `\.nom|Bonjour|Bienvenue`
sur `src/app/parrain` (confirmation de l'affichage `user.nom` post-connexion, finding P1 n°7).
`docs/seo/keyword-map.md` confirme que les mots-clés exacts `parrainage {enseigne}` sont portés par les
pages `/offres/{slug}`, pas par la meta description homepage : la reformulation T3 proposée ne retire aucun
mot-clé bloquant.

---
**Handoff → @orchestrator (round 2)**
- Fichiers produits : `/home/user/MCP/docs/audit/copywriter-audit-2.md` (mis à jour, note round 2 : 9/10)
- Décisions confirmées : T2 et T3 tous deux PASS en production, 0 nom propre sur les 11 surfaces publiques,
  0 formulation bancale résiduelle, accents et source unique `SITE_DESCRIPTION` conformes.
- Résiduels non bloquants : légère variation "l'éditeur du site" / "l'éditeur de ce site" (cosmétique,
  à harmoniser si un futur passage touche ces fichiers) ; `ParrainNav`/`user.nom` confirmé hors scope par
  le coordinateur, aucune action requise.
- Aucune régression : tiret cadratin toujours absent du texte client-facing rendu.

---
**Handoff → @orchestrator (round 1, archivé)**
- Fichiers produits : `/home/user/MCP/docs/audit/copywriter-audit-2.md`
- Décisions prises : formulation neutre retenue "les opérateurs du registre" / "l'opérateur du registre" pour
  T2 (19 emplacements, 38 mentions de prénom) ; remplacement du terme "fintech" par les catégories réelles
  ("bancaire, investissement et crypto") pour T3 (8 emplacements) ; suppression de "sans lien mort" et
  "signalée morte" (registre gadget incompatible avec le ton "sobre" de `brand-platform.md`) ; correction
  distincte des accents manquants dans `src/lib/ai/site.ts` (P0, hors périmètre T2/T3 initial mais bloquant
  pour la cohérence GEO).
- Points d'attention : `ParrainNav`/`user.nom` (zone privée `/parrain`) affiche encore "Thomas"/"Emmanuel"
  après connexion, hors périmètre strict du brief mais à trancher par le fondateur ; 4 variantes légèrement
  différentes de la même description "Parrainly vérifie..." dispersées entre `layout.tsx`, `page.tsx` et
  `site.ts`, à harmoniser en une formulation canonique par longueur de surface ; @seo à consulter pour
  confirmer que le remplacement de "fintech" dans la meta description homepage ne casse aucun mot-clé de
  `keyword-map.md` (vérifié : aucun mot-clé exact `parrainage {enseigne}` ne dépend de cette chaîne).
---
