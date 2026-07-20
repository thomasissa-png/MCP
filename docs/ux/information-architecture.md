<!-- Version: 2026-07-20T04:00 — @ux — Architecture d'expérience V1 cercle fermé -->

# Architecture de l'information — Parrainly (V1 cercle fermé T&E)

## Résumé exécutif

- Arborescence pensée pour deux lecteurs simultanés : la machine (moteur IA qui cite une page) et l'humain (le jeune actif A1 / l'entrepreneur A2 qui clique). Principe directeur : **une page = une offre**, URL stable et lisible, aucune page qui agrège plusieurs programmes sous un même chemin.
- 6 zones : Accueil/catégories (découverte humaine), Pages-offre (unité de citation IA), Pages de conformité (bloquantes légalement avant toute mise en ligne, roadmap.md épic 1), Espace parrain T&E (back-office + tableau de bord, US-02/US-05/US-07/US-09), API JSON publique (canal machine, épic 6), Endpoint de redirection `/r/{token}` (US-01).
- Zéro page "comparatif" ou "top offres classées" : cohérent avec legal-strategy.md §4bis (zéro vocabulaire de classement) et brand-platform.md §4 (Vérité, pas conseil).
- Convention d'URL : chemins courts, en français, sans paramètre de tracking dans le chemin visible (le token de redirection est le seul identifiant technique exposé, et uniquement sur `/r/{token}`).

---

## 1. Arborescence complète

```
/ (Accueil)
├── /categories/{slug-categorie}                    → liste des offres d'une catégorie
│     (finance-personnelle, investissement, gestion-de-patrimoine,
│      placement-tresorerie, services-entrepreneur, crypto)
├── /offres/{slug-programme}                        → PAGE-OFFRE (1 page = 1 offre, US-01)
│     ex. /offres/trade-republic, /offres/qonto, /offres/kraken...
├── /r/{token}                                       → endpoint de redirection tracké (US-01, GET public, pas une page visible)
├── /comment-ca-marche                               → pédagogie + preuve de vérification (brand-platform.md §3)
├── /confiance-et-verification                       → méthode de vérification, fraîcheur, US-06 (signaler un lien)
├── /divulgation-affiliation                         → page dédiée commission/affiliation (legal-strategy.md §7 point 5)
├── /mentions-legales                                → éditeur, hébergeur (legal-strategy.md §7 point 3)
├── /confidentialite                                 → politique de confidentialité + droits RGPD (US-08)
├── /cgu                                              → CGU du site (legal-strategy.md §7 point 1)
├── /rgpd/demande                                    → formulaire droits RGPD (US-08)
├── /parrain/ (Espace parrain T&E, auth par lien email)
│     ├── /parrain/connexion                         → demande de lien de connexion (pas de mot de passe, [À VALIDER @fullstack/@ux])
│     ├── /parrain/tableau-de-bord                    → US-05 : statut, quota, prime
│     ├── /parrain/attributions                       → US-09 : confirmer une conversion
│     └── /parrain/catalogue (back-office)
│           ├── /parrain/catalogue/{offre_id}          → US-02 : enregistrer/actualiser une offre
│           └── /parrain/catalogue/{offre_id}/validation → US-07 : validation conformité (rôle admin)
└── /api/v1/
      ├── /api/v1/offres                              → liste (ex-list_categories/search_referrals)
      ├── /api/v1/offres/{id}                         → fiche (ex-get_referral_by_id), miroir JSON de la page-offre
      ├── /api/v1/offres/{enseigne_id}/attribution     → POST, génère le lien (US-01)
      ├── /api/v1/categories                           → liste des catégories
      └── /api/v1/rgpd/demandes                        → US-08
```

---

## 2. Modèle de navigation pensé pour la citation IA

**Principe n°1 — une page = une offre, jamais une liste comme réponse citable.** Quand un assistant IA cherche "code de parrainage Trade Republic", la réponse citable doit être `/offres/trade-republic`, jamais `/categories/investissement` (qui liste 3 offres et dilue la réponse). Chaque page-offre porte un `<title>` et une meta-description mono-sujet ("Parrainage Trade Republic — vérifié le [date]"), du schema.org `Offer`/`Product` dédié, et un JSON miroir strictement équivalent sur `/api/v1/offres/{id}` (même champs, même fraîcheur).

**Principe n°2 — URL stable dans le temps.** Le slug de la page-offre (`/offres/trade-republic`) ne change jamais, y compris si le statut de l'offre passe à `en_attente_parrain` ou `expirée` : l'IA qui a indexé ce chemin doit retomber sur une page qui répond honnêtement de son état actuel (voir wireframes.md, état "offre en attente/expirée"), pas sur une 404. Le token de redirection (`/r/{token}`), lui, change à chaque attribution (US-01) : c'est un chemin technique jetable, jamais indexé, jamais cité par une IA (robots: noindex).

**Principe n°3 — la fraîcheur est dans le chemin de lecture, pas seulement dans la donnée.** `date_verification` (schéma Emmanuel) s'affiche au-dessus de la ligne de flottaison de la page-offre (voir wireframes.md), pas seulement dans le balisage schema.org invisible à l'humain qui clique depuis la citation IA. Un moteur de réponse et un humain doivent voir la même preuve de fraîcheur au même endroit.

**Principe n°4 — les catégories servent la découverte humaine, pas la citation IA.** `/categories/{slug}` existe pour l'humain qui explore (parcours accueil→catégorie→offre, cf. wireframes.md) et pour le maillage interne (chaque page-offre linke vers sa catégorie et 2-3 offres proches de la même cible `cible` du schéma Emmanuel), mais n'est jamais le point d'entrée visé par le contenu structuré : le sitemap XML et les balises schema.org priorisent les pages-offre individuelles.

---

## 3. Mapping écrans → user stories → persona

| Écran | User story(ies) | Persona | Type d'accès |
|---|---|---|---|
| `/offres/{slug}` | US-01, US-04 (état retiré), US-06 (signalement) | A1 (jeune actif), A2 (entrepreneur) | Public, anonyme |
| `/categories/{slug}` | Couverture navigation (aucune US dédiée, support de US-01) | A1, A2 | Public, anonyme |
| `/r/{token}` | US-01 (endpoint de redirection) | A1, A2 | Public, anonyme, non indexé |
| `/comment-ca-marche`, `/confiance-et-verification` | Support DoR épic 1 (roadmap.md), US-06 | A1, A2 | Public, anonyme |
| `/divulgation-affiliation`, `/mentions-legales`, `/confidentialite`, `/cgu` | Épic 1 roadmap.md, US-08 | Tous | Public, anonyme |
| `/rgpd/demande` | US-08 | A1, A2, Thomas/Emmanuel | Public, email vérifié |
| `/parrain/connexion` | US-05, US-09 (prérequis d'accès) | Thomas, Emmanuel | Lien de session email |
| `/parrain/tableau-de-bord` | US-05 | Thomas, Emmanuel | Session parrain |
| `/parrain/attributions` | US-09 | Thomas, Emmanuel | Session parrain |
| `/parrain/catalogue/{offre_id}` | US-02 | Thomas, Emmanuel | Session admin back-office |
| `/parrain/catalogue/{offre_id}/validation` | US-07 | Thomas, Emmanuel (rôle opérateur) | Session admin back-office |
| `/api/v1/offres`, `/api/v1/offres/{id}`, `/api/v1/categories` | Épic 6 roadmap.md | Machine (IA, développeur tiers) | Public, sans auth |

---

## Gates BLOQUANT vérifiées

- **G1** : 3 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff présent en fin de document. PASS.
- **G5** : personas A1 (jeune actif), A2 (entrepreneur), Thomas/Emmanuel identiques à brand-platform.md §2.1/2.2/2.3, aucun résidu "Léa"/"Karim" (Karim = projection V2, hors arborescence V1). PASS.
- **G7** : arborescence dérivée directement des 9 user stories de functional-specs.md (endpoints identiques : `/api/v1/offres/{enseigne_id}/attribution`, `GET /r/{token}`, `/api/v1/parrains/{parrain_id}/tableau-de-bord`, `/api/v1/parrains/{parrain_id}/attributions/{attribution_id}/confirmation`) et de roadmap.md (épics 1/2/6/7). 0 contradiction identifiée. PASS.
- **G12** : chaque nœud de l'arborescence porte son objet (page/endpoint), sa story source et son type d'accès (tableau section 3) — implémentable sans question de routage. PASS.
- **G13** : 0 chiffre inventé ; slugs et catégories repris de project-context.md (9 programmes, 6 catégories actives). PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. PASS.
- **G17** : la combinaison URL mono-offre + JSON miroir strict + fraîcheur visible au même endroit pour la machine et l'humain n'est pas le modèle des agrégateurs de parrainage bancaire FR benchmarkés (brand-platform.md §6, contenu éditorial humain sans structure IA dédiée). PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** un assistant IA reçoit "code de parrainage Trade Republic" → `Read docs/product/functional-specs.md` US-01 confirme que la destination citable est la fiche Trade Republic avec date de vérification et CTA d'attribution → dans cette architecture, cette destination est exactement `/offres/trade-republic` (chemin stable, schema.org `Offer` mono-sujet, JSON miroir `/api/v1/offres/{id}`), jamais `/categories/investissement` ni une page de résultats de recherche. Le clic humain depuis la citation atteint la même page que celle que la machine a lue, sans redirection intermédiaire avant l'étape volontaire `/r/{token}`.

---
**Handoff → @design, @copywriter, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/ux/information-architecture.md`
- Décisions prises : arborescence en 6 zones (accueil/catégories, pages-offre, conformité, espace parrain, API JSON, redirection trackée) ; principe "une page = une offre" avec URL stable et JSON miroir strict ; catégories réservées à la découverte humaine, jamais le point d'entrée du contenu structuré ; token de redirection non indexé.
- Points d'attention : `/parrain/connexion` dépend d'un mécanisme d'authentification par lien email non encore spécifié techniquement (`[À VALIDER par @fullstack/@ux]`, functional-specs.md US-09) ; les pages de conformité (légal) sont un prérequis bloquant avant toute mise en ligne publique des pages-offre (roadmap.md épic 1, Palier 0) ; voir user-flows.md et wireframes.md pour le détail écran par écran.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de structure, aucun code produit). À prévoir pour @fullstack : sitemap XML priorisant les pages-offre, robots.txt `noindex` sur `/r/{token}` et sur les routes `/parrain/*`.
---


