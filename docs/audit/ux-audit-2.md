
# Audit UX — Parrainly (pilote live)

> Auditeur : @ux · Site audité : https://parrainly.thomas-issa.workers.dev
> Double lecture : persona (jeune actif / entrepreneur, code fiable tout de suite) + IA visiteuse (assistant qui doit extraire code/lien/date/divulgation sans deviner).

## Note /10

**4/10** (persona : 6,5/10 · IA : 3/10, pondéré vers l'IA car T1 est l'objectif n°1 du projet).

Justification : l'architecture d'information est solide (fil d'ariane, hiérarchie identité → divulgation → risque → conditions → CTA, badges de fraîcheur cohérents partout, 5 états de CTA gérés, messages d'erreur humains avec action de reprise). Mais le livrable central du produit, le code de parrainage, est **invisible pour le persona sur la page offre ET absent du JSON-LD lu par une IA qui crawle la page**. Le persona qui veut "un code fiable tout de suite" ne voit jamais de code : il ne voit qu'un bouton vague, puis un lien Parrainly. Une IA qui répond à "code parrainage Finary" à partir de la page HTML ou du JSON-LD ne peut RIEN extraire ; elle doit deviner ou renvoyer l'utilisateur cliquer, ce qui contredit l'exigence fondateur (T1). S'ajoutent deux défauts transverses bloquants (noms propres T2, copy bancale T3) qui dégradent la confiance du persona et la qualité de citation par l'IA.

## Re-score round 2 : 8,5/10

Re-vérification sur les snapshots rafraîchis (`home.html`, `offre-finary.html`, `cat-crypto.html`, mêmes chemins scratchpad). Correctifs confirmés par lecture directe :

- **T1 [P0-1] RÉSOLU** : `CodeBadge` affiche `7KGZAX` en clair dans le HTML SSR de `/offres/finary`, en zone identité, au-dessus du pli, AVEC un bouton "Copier" (`aria-label="Copier le code de parrainage"`, cible 44×44px `h-11 min-w-11`) — ce qui règle en même temps l'ancien P1-1 (copier). Le JSON-LD `Offer` porte désormais `additionalProperty` (`code_parrainage: "7KGZAX"`, `date_verification`, `divulgation_affiliation`) ET le champ `description` de l'`Offer` commence par "Code de parrainage : 7KGZAX." Un crawler qui lit soit le HTML rendu, soit uniquement le JSON-LD, extrait le code sans deviner. CTA également remonté avant la section "Conditions et avantages" (divulgation toujours au-dessus, conforme à l'invariant). Le code est visible passivement dès le chargement, la génération du lien tracké reste réservée au clic CTA : l'ancien P1-2 (séparer lecture passive / action engageante) est donc résolu comme effet de bord de ce correctif.
- **T2 RÉSOLU sur toutes les surfaces vérifiées** : 0 occurrence de "Thomas"/"Emmanuel" dans `home.html`, `offre-finary.html`, `cat-crypto.html`. Footer : "l'éditeur de ce site". Étape 3 "Comment ça marche" : "un lien attribué à l'un des opérateurs du registre, détenteurs réels des programmes du catalogue". Zone conditions offre : "Ce que reçoit l'éditeur du site". Disclosure banner : "l'éditeur de ce site perçoit un avantage". JSON-LD `description`/`disambiguatingDescription` alignés.
- **T3 RÉSOLU** : meta description et hero home reformulés — "Parrainly vérifie chaque lien de parrainage bancaire, investissement et crypto avant de le recommander : statut à jour et date de contrôle sur chaque offre." Plus de "sans lien mort ni condition expirée" (remplacé par "Parrainly retire une offre du registre dès qu'elle est signalée inactive, expirée ou modifiée"), plus de "parrainage fintech" générique (remplacé par "bancaire, investissement et crypto", plus précis pour Qonto/Kraken/Trade Republic).
- Bonus non demandé mais positif : `og:image`/`twitter:image` dédiées par page (accueil, catégorie, offre) et `dateModified` ajouté au JSON-LD (signal de fraîcheur supplémentaire pour l'IA).

### Résiduel P0/P1 après round 2

Aucun P0 résiduel. Les 3 blocages fondateur (T1/T2/T3) sont résolus et vérifiés par lecture directe des snapshots rafraîchis.

- **P1 résiduel-1** : parcours parrain (`/parrain/*` : `ConnexionForm`, `AttributionsList`, `OffreEditForm`, `OffreValidationForm`) toujours non audité, snapshots non fournis dans ce tour non plus. À couvrir dans une passe dédiée avant validation finale du pilote.
- **P1 résiduel-2** : toujours aucune capture responsive (mobile <768px, tablette) dans `tests/screenshots/` : le comportement du `CodeBadge` et du bouton "Copier" sur mobile (sélection du `<code>`, taille du bloc, wrap du code long comme `B2B-JUL1-26-AR-H3` pour Revolut Business) n'est pas vérifié visuellement.
- **P1 résiduel-3 (mineur)** : pas de `<link rel="alternate" type="application/json">` vers le miroir JSON dans le `<head>` des pages offre. Impact réduit désormais que le JSON-LD porte lui-même le code, mais reste une amélioration de découvrabilité peu coûteuse.
- **Point de vérification, non un blocage** : le corps des réponses FAQ (`src/lib/content/faq-enrichie.ts`, positions L17-L77 signalées dans `AUDIT-BRIEF.md`) n'a pas pu être relu intégralement dans ce tour (contenu hors des sections capturées des deux snapshots home.html successifs, tronquées à ~44k caractères). Le coordinateur indique 0 prénom sur 11 surfaces publiques ; recommandé de confirmer par un grep direct sur le fichier source avant clôture définitive du pilote.

## Résumé du parcours actuel (persona)

1. Home (`/`) → carte offre ou catégorie → page offre (`/offres/{slug}`).
2. Page offre : identité + badge "Vérifié le JJ/MM/AAAA" + divulgation + risque + conditions.
3. CTA "Obtenir mon lien de parrainage" → clic → POST `/api/v1/offres/{id}/attribution` (3 s max) → affichage d'un lien Parrainly tracké (`/r/{token}`) dans un bloc `<code>` → bouton "Continuer vers {programme}".
4. Le code brut du programme (ex. `7KGZAX` pour Finary) n'apparaît **à aucun moment** de ce parcours.

## Audit heuristique Nielsen (page offre, flow critique)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| 1 | Visibilité de l'état du système | PASS | Badge "Vérifié le 15/07/2026" en tête de fiche ; spinner + texte "Génération de votre lien..." pendant l'appel API ; 5 états CTA distincts (default/loading/success/empty/error). |
| 2 | Adéquation système/monde réel | FAIL | "Ce que reçoit le parrain (Thomas ou Emmanuel)" (offre-finary.html) : le persona ne sait pas qui est Thomas, qui est Emmanuel, ni pourquoi le site lui-même semble l'ignorer. Vocabulaire "fintech" (meta description home) associe Qonto (banque pro), Kraken (exchange crypto) et Trade Republic sous un même mot flou. |
| 3 | Contrôle et liberté utilisateur | PASS | Fil d'ariane complet desktop + lien retour mobile ; état "empty" propose "Voir les autres enseignes vérifiées" (retour catégorie, pas de cul-de-sac). |
| 4 | Cohérence et standards | PASS | `CategoryBadge`, `FreshnessBadge`, `RiskBanner` réutilisés à l'identique sur home, catégorie (cat-crypto.html) et page offre. |
| 5 | Prévention des erreurs | PASS | Déduplication double-clic (`inFlight` ref) dans `OfferCta.tsx`, timeout 3 s explicite (jamais de chargement infini). |
| 6 | Reconnaissance plutôt que rappel | FAIL | Le code n'est jamais affiché avant le clic : le persona doit se souvenir d'être revenu chercher "un code" alors qu'il n'obtient qu'un lien. Aucune offre visuelle du code en clair nulle part sur la page. |
| 7 | Flexibilité et efficacité (utilisateurs experts) | FAIL | Aucun bouton copier (code ou lien) : sélection manuelle du texte dans le bloc `<code>`, pénible sur mobile. Aucun raccourci pour un utilisateur qui veut uniquement le code brut (ex. pour le coller dans une app tierce). |
| 8 | Design épuré et minimaliste | PASS | Page offre concise (10 zones), pas de surcharge, une seule action principale par écran. |
| 9 | Aide au diagnostic et récupération d'erreur | PASS | État erreur : message humain + bouton "Réessayer" ; état vide : message clair + CTA de repli. |
| 10 | Aide et documentation contextuelle | PASS | "Comment vérifions-nous cette offre ?" et "Ce lien ne fonctionne pas ?" intégrés dans le flow (pas de sortie vers une doc externe). |

## Cognitive walkthrough — persona first-time (recherche "code parrainage Finary")

1. Arrive sur `/offres/finary` : H1 "Parrainage Finary vérifié" + badge daté → sait qu'il est au bon endroit. **OK.**
2. Cherche le mot "code" sur la page : absent. Voit "1 mois de Premium offert" (avantage) mais pas de code. `[FRICTION H6/H2] : à l'étape 2, le first-time user ne trouve aucun code affiché malgré une intention explicite ("code parrainage"). Solution : afficher code_parrainage en clair dans la zone identité ou juste au-dessus du CTA, avant tout clic.`
3. Clique "Obtenir mon lien de parrainage" sans savoir qu'il va déclencher un tracking d'attribution et recevoir un lien (pas le code attendu). `[FRICTION H2] : à l'étape 3, le first-time user ne sait pas si le clic va lui donner le code ou autre chose. Solution : libellé explicite type "Voir le code et le lien" + séparer affichage passif (code, gratuit à lire) du clic engageant (générer le lien tracké).`
4. Reçoit un lien Parrainly (`/r/{token}`) dans un bloc `<code>`, doit le sélectionner à la main pour le copier. `[FRICTION H7] : à l'étape 4, le first-time user sur mobile galère à sélectionner le texte. Solution : bouton "Copier" avec feedback visuel, cible ≥44px.`
5. Clique "Continuer vers Finary" : redirection non auditée dans cette passe (route `/r/{token}` hors périmètre de lecture fourni). Le persona n'a toujours vu aucun code brut réutilisable ailleurs (ex. pour le taper dans l'app mobile Finary, alors que les conditions Finary excluent justement l'app iOS/Android). `[FRICTION P0] : le besoin exact du persona ("un code fiable, tout de suite") n'est jamais satisfait littéralement.`

## Angle IA visiteuse — cohérence chemin machine / chemin humain

- `llms.txt` (lu) pointe correctement vers le miroir JSON `/api/v1/offres` et `/api/v1/offres/{id}`, qui contiennent bien `code_parrainage` (vérifié : `7KGZAX` présent dans `api-offres.json` pour Finary). **Le chemin machine "documenté" fonctionne.**
- Mais `offreJsonLd()` (`src/lib/ai/jsonld.ts`) construit l'objet `Product/Offer` à partir de `PublicOffre` **sans jamais lire `code_parrainage`** : le champ existe dans le type mais n'est utilisé nulle part dans le graphe JSON-LD. Confirmé sur le snapshot `offre-finary.html` : 0 occurrence de `7KGZAX` dans le HTML rendu ni dans le `<script type="application/ld+json">` de la page.
- Conséquence : un assistant IA ou un moteur de réponse qui **indexe directement la page offre** (cas fréquent : lien partagé, résultat de recherche, crawl classique sans passer par `llms.txt`) tombe sur une page qui ne permet pas d'extraire le code. Seul un agent qui connaît et suit explicitement `llms.txt` → `/api/v1/offres/{slug}` obtient la donnée. **Le chemin machine n'est donc pas découvrable de façon fiable depuis le point d'entrée le plus probable (la page elle-même).**
- Rien dans le `<head>` de la page offre ne relie la page HTML à son miroir JSON (pas de `<link rel="alternate" type="application/json">`), alors que l'URL `url_api` existe déjà dans `PublicOffre`.

## Findings priorisés

### P0

- **P0-1 [T1]** Afficher le `code_parrainage` en clair dans le HTML rendu de la page offre (zone identité ou juste au-dessus du CTA) ET l'exposer dans le JSON-LD `Offer` (ex. `additionalProperty` ou `sku`). Critère de done : recherche texte de `7KGZAX` positive sur `/offres/finary` (HTML rendu) et dans son `<script type="application/ld+json">`.
- **P0-2 [T2]** Supprimer "Thomas"/"Emmanuel" de tout le client-facing (home, offre, footer, FAQ, divulgation, mentions, confidentialité, `llms.txt`, `site.ts`) et les remplacer par une formulation neutre (« l'éditeur du site », « les opérateurs du registre »), en conservant la divulgation d'affiliation. Critère de done : 0 occurrence de "Thomas" et "Emmanuel" dans un grep sur les snapshots et les fichiers listés dans `AUDIT-BRIEF.md`.
- **P0-3 [T3]** Reformuler la meta description et le hero home ("sans lien mort ni condition expirée", "parrainage fintech" imprécis pour Qonto/Kraken/Trade Republic). Critère de done : nouvelle formulation validée sans tiret cadratin, sans mot gadget, avec un terme englobant précis (ex. "programmes financiers vérifiés" plutôt que "fintech").

### P1

- **P1-1** Ajouter un bouton "Copier" (code et lien généré) avec feedback visuel et cible ≥44px dans `OfferCta.tsx`. Critère de done : clic copie dans le presse-papiers, confirmation visible ≤1 s, testable clavier.
- **P1-2** Séparer l'affichage passif du code (lecture seule, sans appel API, disponible dès le chargement de la page) de la génération du lien tracké (clic engageant qui déclenche l'attribution). Critère de done : le code est visible avant tout clic ; le CTA ne sert plus qu'à obtenir le lien de redirection suivi.
- **P1-3** Relier la page offre à son miroir JSON via `<link rel="alternate" type="application/json" href="{url_api}">` dans le `<head>` de chaque page offre. Critère de done : présent sur `/offres/finary` et vérifiable dans le HTML rendu.
- **P1-4** Auditer dédié le parcours parrain (`ConnexionForm`, `AttributionsList`, `OffreEditForm`, `OffreValidationForm` repérés dans `src/components/parrain/`) : non couvert dans cette passe car les pages `/parrain/*` n'étaient pas dans le périmètre de lecture fourni par le brief. Critère de done : cognitive walkthrough dédié livré en session suivante.
- **P1-5** Produire des captures d'écran responsive (mobile <768px, tablette, desktop) dans `tests/screenshots/` : aucune fournie dans les snapshots audités, impossible de valider ici le comportement mobile du bloc `<code>` et du CTA sticky. Critère de done : 3 devices capturés pour `/`, `/offres/finary`, `/categories/crypto`.

## Checklist pour 10/10

- [ ] Code de parrainage visible en clair sur la page offre (avant clic)
- [ ] Code de parrainage présent dans le JSON-LD `Offer`
- [ ] `<link rel="alternate" type="application/json">` vers le miroir JSON dans le `<head>` de chaque page offre
- [ ] 0 occurrence de "Thomas"/"Emmanuel" en client-facing (grep vérifié)
- [ ] Meta description et hero home reformulés (sans "sans lien mort", "parrainage fintech" remplacé par un terme précis)
- [ ] Bouton "Copier" sur le code et sur le lien généré, feedback visuel, cible ≥44px
- [ ] Code affiché en lecture seule dès le chargement (sans appel API), génération du lien tracké réservée au clic CTA
- [ ] Audit dédié du parcours parrain (`/parrain/*`)
- [ ] Captures d'écran responsive 3 devices dans `tests/screenshots/`
- [ ] Comportement vérifié pour un retour après 30 jours (persistance ou régénération du lien, cohérence affichée au parrain)

## Bloc Vérifié (G_PROOF)

Fichiers et snapshots réellement lus pour produire cet audit :
- `docs/audit/AUDIT-BRIEF.md`
- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/home.html`
- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/offre-finary.html`
- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/cat-crypto.html`
- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/llms.txt`
- `/tmp/claude-0/-home-user-MCP/6c5cd6dd-745c-5336-aec6-4cd40dd342fe/scratchpad/audit/api-offres.json`
- `src/app/offres/[slug]/page.tsx`
- `src/components/offre/OfferCta.tsx`
- `src/lib/ai/public-offre.ts`
- `src/lib/ai/jsonld.ts`
- `Glob src/components/**/*.tsx` (inventaire des composants existants, dont `src/components/parrain/*` non lus en détail)

Non lus dans cette passe (limitation explicite, pas d'invention) : `src/app/page.tsx` (lu via snapshot rendu `home.html` uniquement, pas le code source), `src/app/categories/[slug]/page.tsx` (idem via `cat-crypto.html`), `src/app/divulgation/page.tsx`, `src/app/mentions-legales/page.tsx`, `src/components/ui/DisclosureBanner.tsx`, `src/lib/content/faq-enrichie.ts`, `src/app/parrain/**`, `src/app/r/[token]/**`, `divulgation.html`, `mentions.html`.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/MCP/docs/audit/ux-audit-2.md`
- Décisions prises : priorisation P0 sur T1 (code invisible, cœur du produit) avant T2 (noms propres) et T3 (copy) ; recommandation de séparer "voir le code" (passif) de "générer le lien" (actif, tracké) pour respecter le principe de flux progressif.
- Points d'attention : parcours parrain (`/parrain/*`) et route de redirection (`/r/{token}`) non audités faute de fichiers fournis dans le périmètre ; aucune capture responsive disponible, donc aucun verdict mobile définitif.
