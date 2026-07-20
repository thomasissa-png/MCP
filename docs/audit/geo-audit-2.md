# Audit GEO/AEO — Parrainly pilote LIVE (session 2)

> Auditeur : @geo. Cible : https://parrainly.thomas-issa.workers.dev. Double lecture : persona (jeune actif/entrepreneur qui veut un code/lien fiable tout de suite) + IA visiteuse (assistant qui doit extraire code, lien, divulgation, date sans deviner).

---

## Note : 5/10 — probabilité d'être cité AVEC le bon code restitué

Le socle AEO est solide (JSON-LD Product/Offer, `llms.txt`, `robots.txt` pro-crawlers, FAQPage, fraîcheur exposée) : sur la citabilité générale de Parrainly, ce serait un 8/10. Mais la note demandée porte spécifiquement sur T1 (« les codes doivent ressortir ») et là, le verdict est net : **le code n'existe nulle part dans ce qu'un crawler texte reçoit en réponse HTTP standard**, ni dans le HTML rendu serveur, ni dans le JSON-LD, ni même dans le parcours interactif complet (le bouton CTA génère un *lien* de redirection, jamais le code brut). Seul le miroir JSON `/api/v1/offres` (pointé par `llms.txt`) l'expose. Un objectif n°1 du fondateur qui repose sur un unique canal non garanti (convention `llms.txt` récente, non universellement honorée par les crawlers IA) justifie une note pénalisée malgré un socle par ailleurs mature.

---

## Findings P0 (bloquants pour T1)

**P0-1 — Exposer `code_parrainage` en texte visible dans le HTML de chaque page-offre. Critère de done : le code apparaît en clair dans le DOM serveur (pas seulement après clic JS), pour les 9 offres actives.**
Vérifié : 0 occurrence de `7KGZAX` (code Finary) dans `offre-finary.html` (snapshot complet lu, y compris le bloc SSR `S:2`). Le composant `OfferCta` (`src/components/offre/OfferCta.tsx`) ne reçoit même pas `code_parrainage` en prop : il POST `/api/v1/offres/{id}/attribution` et affiche un `lien_genere` (lien de redirection trackée), jamais le code brut. Conséquence : même un utilisateur (ou un agent IA qui simule un clic) qui va au bout du parcours interactif n'obtient jamais la chaîne de caractères du code, seulement un lien. Or 3 des 9 requêtes de monitoring déjà actées dans `monitoring-citations.md` (§2, lignes 2-3-7) sont formulées « **code** parrainage {enseigne} », pas « lien ». Un modèle qui lit la page rendue pour répondre à cette requête précise n'a rien à restituer.

**P0-2 — Ajouter `code_parrainage` au graphe JSON-LD `Offer` (`src/lib/ai/jsonld.ts`, fonction `offreJsonLd`), via un `additionalProperty` (`PropertyValue` : `name: "code_parrainage"`, `value`). Critère de done : chaque `Offer` JSON-LD servable porte le code quand `code_parrainage` est non nul en DB.**
Vérifié : `offreJsonLd` (lignes 38-75) construit `description`, `disambiguatingDescription`, `priceValidUntil`, mais aucun champ ne reprend `o.code_parrainage` alors que le type `PublicOffre` le porte déjà (`public-offre.ts` ligne 33). C'est le canal le plus fiable pour Google AI Overviews et pour tout modèle entraîné à parser Schema.org : plus fiable que compter sur l'adoption de `llms.txt` par un crawler donné.

**Argumentation du verdict (tranché) : oui, il faut exposer le code en HTML + JSON-LD.**
Le raisonnement de gouvernance déjà tranché dans `geo-strategy.md` §3 (« ne jamais exposer `url_parrainage`, le lien d'affiliation personnel brut ») **ne s'applique pas** au `code_parrainage` : ce sont deux objets distincts. `url_parrainage` est protégé parce que l'exposer casserait l'attribution `/r/{token}` et la rotation V2 (raison produit valide). `code_parrainage` n'a jamais été soumis à cette contrainte : il est déjà volontairement public dans le contrat `PublicOffre` (`public-offre.ts`, commentaire de gouvernance ligne 13-14, l'exclusion ne vise que `url_parrangement`/`source`/`notes`) et déjà diffusé sans restriction via `/api/v1/offres` et `llms.txt`. L'exposer aussi en HTML/JSON-LD n'ouvre donc aucune brèche de gouvernance nouvelle : ça ferme un trou entre deux canaux qui exposent déjà la même donnée à des degrés différents. Et comme l'objectif n°1 du fondateur est explicitement que l'IA restitue le code (pas seulement le lien), le laisser dépendre d'un seul canal (l'API, via `llms.txt`, une convention non contraignante pour les crawlers) est le risque le plus élevé du dossier, pas une prudence.
Nuance à consigner (hors périmètre @geo, à signaler à @ia/@fullstack) : le parcours produit actuel ne délivre le code brut nulle part, y compris côté utilisateur humain, uniquement un lien généré. Si certains programmes fonctionnent par saisie manuelle de code (la FAQ `/divulgation` le confirme elle-même, cf. P1-2 ci-dessous), c'est un manque produit au-delà du seul GEO.

---

## Findings P1

**P1-1 — Corriger l'incohérence FAQ/réalité sur `/divulgation` : la question « Un programme utilise-t-il un lien ou un code de parrainage ? » répond « le mode utilisé (lien, code, ou les deux) est indiqué sur la fiche du programme concerné », alors qu'aucune fiche n'affiche de code (cf. P0-1). Critère de done : soit la réponse est corrigée pour ne pas promettre un affichage qui n'existe pas, soit P0-1 est livré en premier et rend la réponse vraie.**
Un passage FAQ inexact est un risque de citation directe : un modèle qui cite cette réponse FAQPage (`faqPageJsonLd`, très extractible en JSON-LD) énoncerait une affirmation vérifiable et fausse tant que P0-1 n'est pas fait. Score claim actuel sur la grille (vérifiabilité/précision/extractibilité) : 1/3 (extractible et précis, mais non vérifiable en l'état, le fait ne se recoupe pas sur la page qu'elle désigne).

**P1-2 — Neutraliser les noms propres dans les surfaces citables structurées (T2), qui sont exactement celles auditées ici : `disambiguatingDescription`/`description` du JSON-LD `Offer` (via `divulgation_affiliation` : « Parrainly perçoit un avantage personnel (Thomas ou Emmanuel) »), `llms.txt` (`site.ts` L25, `route.ts` L29), `FAQPage` de `/divulgation` (au moins 12 occurrences « Thomas ou Emmanuel »/« Thomas ou à Emmanuel » dans le texte des réponses). Critère de done : 0 occurrence de « Thomas »/« Emmanuel » dans ces 3 surfaces, remplacées par une formulation neutre, divulgation d'affiliation conservée intacte.**
Ce point est nominalement piloté par @copywriter/@legal (T2 transverse), mais il traverse directement mon périmètre : ce sont précisément les champs que les modèles restituent tels quels (`disambiguatingDescription` est le champ conçu pour être cité mot pour mot). Tant que non corrigé, toute citation IA du mécanisme de divulgation nommera Thomas et Emmanuel, contraire à la décision fondateur. Je ne retouche pas ces fichiers (hors mandat), je signale l'exposition GEO du problème.

**P1-3 — Uniformiser la date de fraîcheur affichée en HTML avec celle du JSON-LD.** La page Finary affiche « Vérifié le 15/07/2026 » en HTML et `priceValidUntil: "2026-07-15"` en JSON-LD (cohérent, bien fait). Point de vigilance seulement pour Spiko : `date_verification` = 2026-07-18 dans le miroir JSON (plus récent que Finary), à revérifier après chaque cycle de vérification manuelle que le HTML et le `priceValidUntil` restent synchrones (déjà couvert par le pré-requis `monitoring-citations.md` §5, pas une régression détectée ici, juste un point à garder sous surveillance vu que c'est structurellement la même donnée DB des deux côtés).

---

## Ce qui va déjà bien (pour ne pas tout repeindre en rouge)

- `robots.ts` autorise explicitement 19 crawlers IA nommés (`AI_CRAWLERS`), avec `allow: '/'` général : aucun blocage involontaire.
- `llms.txt` généré dynamiquement depuis la DB, explique clairement la préférence « miroir JSON plutôt que HTML » et liste les 9 offres + catégories à jour.
- `offreJsonLd` embarque déjà `priceValidUntil`, `releaseDate`, `disambiguatingDescription` (divulgation) et `mainEntityOfPage` est tranché (à implémenter, `geo-strategy.md` §5) : la fraîcheur et la divulgation sont déjà résolues, seul le code manque.
- `FAQPage` déjà en place sur `/divulgation` (17 paires Q/R) et sur l'accueil : bon format d'extraction, un des plus denses du dossier.
- Chapô factuel présent sur `/divulgation` (premier paragraphe définitionnel avant tout Q/R).

---

## Checklist pour 10/10

1. `code_parrainage` visible en texte clair dans le HTML SSR de chaque page-offre servable (composant dédié, pas seulement après clic JS). Owner : @fullstack.
2. `code_parrainage` ajouté en `additionalProperty` (`PropertyValue`) dans `offreJsonLd`. Owner : @ia/@fullstack.
3. Réponse FAQ `/divulgation` sur « lien ou code » corrigée pour être vraie au moment de la publication (P1-1). Owner : @copywriter, validation @geo.
4. T2 (noms propres) neutralisé dans `disambiguatingDescription`, `llms.txt`, FAQ `/divulgation` (P1-2). Owner : @copywriter/@legal, @geo revérifie l'effet citation après coup.
5. `mainEntityOfPage` implémenté sur chaque page-offre (déjà tranché `geo-strategy.md` §5, non encore vérifié comme fait dans le code lu ce jour : `offreJsonLd` ne le contient toujours pas). Owner : @ia/@fullstack.
6. FAQ spécifique par offre (2-3 Q/R, ex. « Le code de parrainage {Programme} expire-t-il ? ») étendue à `offres/[slug]/page.tsx`, cf. `geo-strategy.md` §6 action 1, toujours non fait dans le code lu. Owner : @copywriter/@fullstack.
7. Re-test des 3 prompts de monitoring contenant le mot « code » (Trade Republic, Revolut Business, Kraken, cf. `monitoring-citations.md` §2) après livraison des points 1-2, pour confirmer que le code apparaît désormais dans une réponse IA simulée (WebSearch de recoupement). Owner : @geo.

---

## Cohérence avec les livrables GEO existants

Aucune contradiction avec `geo-strategy.md` ni `monitoring-citations.md` : ce document prolonge la table §3 de `geo-strategy.md` (qui documentait déjà `offreJsonLd` sans lister le manque de code, angle non traité par la Phase 3) et active immédiatement 2 des 9 requêtes de monitoring (celles contenant explicitement « code ») comme critère de validation post-fix. La règle de gouvernance `url_parrainage` jamais exposé (`geo-strategy.md` §3, `public-offre.ts`) est explicitement confirmée et non remise en cause : seul `code_parrainage`, déjà public par contrat, est concerné.

---

### Vérifié (G_PROOF)

- `Read /home/user/MCP/docs/audit/AUDIT-BRIEF.md` : contexte, exigences T1/T2/T3, emplacements des noms propres.
- `Read` snapshots : `.../scratchpad/audit/offre-finary.html` (intégral, y compris bloc SSR `S:2` et scripts de streaming), `.../scratchpad/audit/api-offres.json` (9 offres, `code_parrainage` confirmé présent pour chacune, ex. Finary `7KGZAX`), `.../scratchpad/audit/llms.txt`, `.../scratchpad/audit/divulgation.html` (chapô + 17 Q/R + JSON-LD FAQPage).
- `Read /home/user/MCP/src/lib/ai/site.ts`, `/home/user/MCP/src/app/llms.txt/route.ts`, `/home/user/MCP/src/lib/ai/jsonld.ts`, `/home/user/MCP/src/lib/ai/public-offre.ts`, `/home/user/MCP/src/app/robots.ts`, `/home/user/MCP/src/components/offre/OfferCta.tsx`, `/home/user/MCP/src/app/offres/[slug]/page.tsx` : confirmé 0 occurrence de `code_parrainage`/`7KGZAX` dans le rendu HTML, le JSON-LD, et le flux interactif `OfferCta` (qui renvoie un `lien_genere`, pas un code).
- `Read /home/user/MCP/docs/geo/geo-strategy.md` : confirmé absence de recommandation existante sur l'exposition du code (angle nouveau de cet audit), confirmé la règle de gouvernance `url_parrainage` (distincte de `code_parrainage`) et le statut « tranché mais pas encore implémenté » de `mainEntityOfPage`.
- `Read /home/user/MCP/docs/geo/monitoring-citations.md` : confirmé 3/9 requêtes de monitoring formulées avec le mot « code » (Trade Republic, Revolut Business, Kraken), réutilisées comme critère de re-test post-fix (checklist point 7).

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/audit/geo-audit-2.md`
- Décisions prises : verdict tranché OUI sur l'exposition de `code_parrainage` en HTML + JSON-LD (P0-1, P0-2), argumenté par la distinction avec `url_parrainage` (protégé, non concerné) ; note 5/10 justifiée par un socle AEO mature mais un objectif n°1 fondateur non atteint sur le canal HTML/JSON-LD
- Points d'attention : ne pas modifier `url_parrainage`/gouvernance miroir (hors périmètre, déjà tranché) ; P0-1/P0-2 à confier à @ia/@fullstack ; P1-1 (FAQ inexacte) à @copywriter avant ou en même temps que P0-1 pour éviter une affirmation fausse publiée ; P1-2 (T2 noms propres dans le JSON-LD/llms.txt/FAQ) recoupe le mandat @copywriter/@legal déjà identifié dans `AUDIT-BRIEF.md`, signalé ici car il traverse des champs GEO-critiques ; re-tester les 3 prompts « code » du monitoring après livraison
---
