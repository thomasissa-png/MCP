<!-- Version: 2026-07-20 — @geo — Stratégie GEO opérationnelle (Phase 3, exploitation de la couche AEO Phase 2) -->
# Stratégie GEO — Parrainly

> Ce document exploite une couche AEO déjà posée en Phase 2 par @ia (JSON-LD, miroir JSON `/api/v1/offres`, `/llms.txt`, `robots.ts` pro-crawlers). Il ne redemande rien à construire côté données : il indique comment publier, entretenir et mesurer du contenu qui exploite ce qui existe déjà.

---

## 0. GEO en 3 paragraphes (pour qui découvre le sujet)

Le SEO optimise pour être cliqué dans une liste de liens. Le GEO (Generative Engine Optimization, parfois appelé AEO, Answer Engine Optimization) optimise pour être **cité dans la réponse générée** par un assistant IA (ChatGPT, Perplexity, Gemini, Claude). Un moteur de réponse ne classe pas des pages : il sélectionne des **passages de texte** autonomes, vérifiables et structurés, dans des sources qu'il juge fiables et fraîches, puis les cite ou les paraphrase.

Concrètement pour Parrainly : quand un utilisateur demande à son assistant IA « code parrainage Qonto », l'assistant (en mode connecté/browsing, cf. §2) va chercher une source qui répond directement, avec une donnée datée et une structure machine-readable. Le test empirique réalisé le 2026-07-20 (`docs/geo/test-citation-ia.md`) confirme que ce comportement existe déjà : sur les 9 programmes du pilote, la surface citée est dominée par des agrégateurs de parrainage structurés, pas par les sites officiels des programmes.

La bonne nouvelle pour Parrainly : la structure technique qui permet d'être cité (JSON-LD, miroir JSON, `llms.txt`, autorisation explicite des crawlers IA) est déjà en place dans le code. Ce document explique comment produire et entretenir le contenu qui s'appuie dessus.

---

## 1. Verdict et angle de différenciation

**Le canal existe** (thèse validée, `test-citation-ia.md` §7) : sur 9/9 requêtes d'intention « parrainage {enseigne} », des agrégateurs structurés sont cités. Parrainly ne crée pas un comportement, il prend une place dans un comportement établi.

**Le terrain est occupé.** Un incumbent (1parrainage.com) apparaît sur les 9/9 requêtes testées, un second (parrainage.co) sur 8/9. Avant de pousser du volume, Parrainly doit dépasser leur standard de citabilité actuel sur le terrain qu'ils occupent moins bien : la fraîcheur vérifiée et la divulgation.

**Standard de citabilité observé chez les incumbents** (WebSearch de recoupement, 2026-07-20, sur les pages Qonto et Trade Republic) :
- Titre daté au **mois** (« Code Parrainage Qonto, 160€ offerts, Mars 2026 », « Parrainage Trade Republic, Action Offerte, Juillet 2026 ») : signal de fraîcheur au niveau du titre, mais pas de date exacte structurée en donnée machine-readable.
- Contenu orienté conversion : témoignages, comparatif de formules, tableau de bord de parrain, sans divulgation d'affiliation formalisée ni distinction claire entre donnée vérifiée et donnée republiée.
- Aucune structure `Offer`/`priceValidUntil` détectée : la fraîcheur est un argument texte, pas une donnée exploitable par un modèle pour dater sa réponse.

**Différenciation Parrainly, déjà câblée dans le code (à ne pas édulcorer côté contenu)** :
1. **Date de vérification exacte, exposée en JSON-LD** (`priceValidUntil` sur l'`Offer`, `releaseDate` sur le `Product`) et affichée à l'écran (`FreshnessBadge`) : plus précis que « Juillet 2026 » en titre de page.
2. **Divulgation d'affiliation embarquée dans l'objet JSON lui-même** (`disambiguatingDescription`, champ `divulgation_affiliation` du miroir), restituable telle quelle par un modèle qui cite Parrainly. Aucun incumbent identifié ne structure cette information en donnée, elle est diluée dans du texte de page quand elle existe.
3. **Statut explicite par offre** (`actif` / `en_attente_*` / `retiré`) : une offre non servable n'apparaît ni dans le miroir JSON ni dans le catalogue public. Un modèle qui interroge `/api/v1/offres` ne peut pas restituer une offre morte, contrairement à un agrégateur qui republie sans re-vérifier.

Ces trois points sont l'angle à répéter dans tout contenu produit : ne jamais dire « meilleure offre » ou « offre exclusive » (langage promotionnel filtré par les modèles, cf. §3), toujours dire « vérifié le [date], statut [statut] ».

---

## 2. Où se joue la citation : mode connecté, pas mémoire paramétrique

Data-point du test empirique (§5) : en réponse paramétrique (sans recherche), un modèle décrit le mécanisme général d'un programme sans citer de source datée. En mode connecté/browsing, il remonte l'écosystème d'agrégateurs structurés. **Conséquence directe** : la stratégie GEO de Parrainly ne vise pas à « entrer dans les poids » d'un modèle (impossible et sans intérêt pour une donnée qui périme en semaines), elle vise l'**indexation et la structure machine-readable** consommée au moment de la requête. C'est exactement ce que la couche AEO existante fournit (JSON-LD par page, miroir JSON stable, `llms.txt`, crawlers IA explicitement autorisés dans `robots.ts`).

---

## 3. Inventaire de la couche AEO existante et comment l'exploiter

| Brique (fichier) | Ce qu'elle fait déjà | Ce que le contenu doit faire pour l'exploiter |
|---|---|---|
| `src/lib/ai/jsonld.ts` : `offreJsonLd` (Product/Offer) | Injecte `priceValidUntil`/`releaseDate` (fraîcheur), `disambiguatingDescription` (divulgation), `availability` par page-offre | Toujours renseigner `date_verification`, `conditions`, `avantage_filleul` en DB : ce sont ces champs qui alimentent la description JSON-LD citable. Un champ vide = un passage moins citable |
| `organizationJsonLd` / `webSiteJsonLd` | Identité d'entité (nom, description, slogan) au niveau du site | Ne pas changer `SITE_DESCRIPTION` sans repasser par @creative-strategy (cohérence entité canonique) |
| `faqPageJsonLd` (utilisé sur l'accueil, `FAQ` dans `page.tsx`) | 5 paires Q/R structurées en `FAQPage`, format le plus extractible après la définition directe | Étendre le motif à chaque page-offre à terme (FAQ spécifique par enseigne, ex. « Le code de parrainage Qonto expire-t-il ? »), cf. §6 action 2 |
| `itemListJsonLd` | Liste structurée du catalogue (accueil) et par catégorie | Rien à faire côté contenu, la liste reflète la DB automatiquement |
| `breadcrumbJsonLd` | Fil d'Ariane structuré par page | Rien à faire, déjà systématique |
| `/api/v1/offres` (+ `/{id}`, `/categories`) | Miroir JSON stable, uniquement offres `actif`, `url_parrainage` jamais exposé, divulgation et mention de risque embarquées | C'est la source que `llms.txt` pointe en priorité : ne jamais publier une info sur une page qui ne soit pas d'abord vraie en DB (le miroir doit rester la source de vérité, le HTML en est la vitrine) |
| `/llms.txt` (`src/app/llms.txt/route.ts`) | Généré depuis la DB, décrit Parrainly, pointe vers le miroir JSON et liste les offres/catégories en temps réel | Aucune action de contenu requise (auto-généré), à revérifier après tout changement de catalogue majeur |
| `robots.ts` + `AI_CRAWLERS` (19 user-agents) | Autorise explicitement GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. | Rien à faire côté contenu ; point de vigilance infra si un nouveau crawler IA notable apparaît (signal à faire remonter à @ia) |
| `/divulgation` (page dédiée) | Explique la méthode de vérification | Bon candidat pour une extension `FAQPage`/`Article` dense en definitions (cf. §6 action 3) |

**Point de gouvernance à ne jamais casser** : `url_parrainage` (lien d'affiliation personnel) n'est exposé nulle part dans le miroir ni le JSON-LD (`url_offre`, la page canonique, sert de lien actionnable). Ceci protège à la fois l'attribution `/r/{token}` et la rotation V2. Aucun contenu futur ne doit demander à exposer le lien brut pour « faciliter » la citation : ce serait un recul produit, pas un gain GEO.

---

## 4. Structure de contenu citable (niveau passage)

Chaque bloc de texte destiné à être cité doit respecter, dans l'ordre :

1. **Réponse directe dans les 40 à 60 premiers mots.** Format definition directe, le plus efficace, avant Q&A, avant liste, avant comparatif, jamais de narratif. Exemple de structure (à personnaliser par offre, ne jamais copier tel quel) :
   > « Le parrainage [Programme] vérifié le [date] par Parrainly donne au filleul [avantage_filleul] sous condition de [1 condition clé]. Statut : [actif/en attente]. »
2. **1 claim vérifiable pour 150 à 200 mots.** Un claim = une donnée qui existe en base et peut être recoupée (date, montant, condition), jamais une opinion ou un superlatif.
3. **Zéro langage promotionnel.** Les mots filtrés par les modèles lors de la sélection de passage : « meilleur », « exclusif », « incontournable », « révolutionnaire ». Le ton de marque de Parrainly (`brand-voice`, ton fiable/direct/sobre) est déjà aligné avec cette contrainte GEO, pas de tension à arbitrer avec @copywriter.
4. **Grille de scoring avant publication** (inclusion si ≥ 2/3) :
   - **Vérifiabilité** : la donnée a une source nommée (date_verification, statut en DB) ou un fait recoupable, pas une estimation.
   - **Précision** : « vérifié le 14/07/2026 » plutôt que « récemment vérifié » ; « 9 programmes actifs » plutôt que « large catalogue ».
   - **Extractibilité** : le passage répond à une question implicite en une phrase autonome, sans dépendre du paragraphe précédent.

**Application aux pages existantes** : la page-offre (`/offres/{slug}`) respecte déjà ce patron dans sa Zone 6 (« Fraîcheur : Vérifié le [date] par Parrainly. Statut actuel : [statut] »). C'est le gabarit à répliquer pour tout contenu additionnel (articles de catégorie, pages guides).

---

## 5. Entity-first : Parrainly comme entité canonique

Les modèles évaluent la confiance au niveau de l'entité, pas de la page isolée. État actuel :
- **1 page = 1 entité canonique** : chaque page-offre porte un `@id` unique (`{url_offre}#product`, `{url_offre}#offer`), déjà conforme.
- **`mainEntityOfPage` non détecté** dans `jsonld.ts` : à ajouter par @ia/@fullstack sur `WebPage` ou directement en top-level du graphe de chaque page-offre, pointant vers `url_offre`. Action de faible effort, gain de cohérence du graphe.
- **`sameAs` absent** : Parrainly n'a, à ce stade, aucun profil externe (pas de fiche Wikidata, pas de profil LinkedIn/Crunchbase d'entreprise). Normal pour un projet en cercle fermé T&E (`project-context.md`). **Ne pas créer de profils factices** : à instruire seulement si Parrainly ouvre en V2 (marketplace multi-parrains) et gagne une existence institutionnelle. Statut : différé, pas un manque à corriger maintenant.
- **Cluster de contenu par catégorie** : les 6 catégories (finance personnelle, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur, crypto) sont déjà des pages dédiées (`/categories/{slug}`) avec `ItemList` + `BreadcrumbList`. C'est la structure de cluster attendue, rien à ajouter côté architecture.

---

## 6. Actions de contenu priorisées (verbe + objet + critère de done)

1. **Étendre le motif FAQ de l'accueil à chaque page-offre** (owner : @copywriter pour le texte, @fullstack pour le rendu `faqPageJsonLd` déjà existant). 2 à 3 questions par offre maximum, spécifiques (« Le parrainage [Programme] est-il cumulable avec une autre offre ? », « Que se passe-t-il si le parrainage [Programme] est retiré du registre ? »). Critère de done : chaque page-offre servable injecte un bloc `FAQPage` en plus du `Product`/`Offer` existant.
2. **Documenter la méthode de vérification en contenu extractible sur `/divulgation`** (owner : @copywriter). Convertir la page actuelle en definitions directes + `FAQPage` : « Comment Parrainly vérifie une offre » en 40 à 60 mots, puis détail. Critère de done : passage `definition directe` identifiable en tête de page, `FAQPage` injecté.
3. **Ne jamais publier une page-offre sans `date_verification` renseignée.** Owner : opérationnel (Thomas/Emmanuel lors de la vérification manuelle). Critère de done : 0 offre `actif` avec `date_verification` nulle en DB (vérifiable par requête, cf. `monitoring-citations.md` §5).
4. **Maillage catégorie vers offre pour capter l'amont générique.** Le test empirique montre que Parrainly ne gagne pas frontalement « meilleure néobanque » (terrain des comparateurs, `test-citation-ia.md` §4). Owner : @seo (lead sur ce maillage, coordination anti-cannibalisation), @geo valide la structure citable des pages de catégorie qui servent de relais. Critère de done : chaque page de catégorie contient au moins 1 passage définition directe expliquant la catégorie avant la liste d'offres (aujourd'hui la page catégorie n'a qu'un `meta.description`, pas de paragraphe H1 substantiel, cf. `categories/[slug]/page.tsx`).
5. **`mainEntityOfPage`** : ajouter au graphe JSON-LD des pages-offres (owner : @ia/@fullstack, hors périmètre contenu). Signalé ici pour tenue du handoff, pas un livrable @geo.

---

## 7. Patterns par plateforme (à garder en tête, pas une segmentation de contenu séparée)

- **ChatGPT** (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User` déjà autorisés) : privilégie des sources autoritaires et un contenu de type encyclopédique long-form. La page-offre actuelle (identité → divulgation → risque → conditions → fraîcheur) correspond à ce patron.
- **Perplexity** (`PerplexityBot`, `Perplexity-User` autorisés) : contenu récent (fraîcheur < 90 jours) et forums/Reddit pèsent lourd dans ses citations (environ 47% de ses sources selon la littérature GEO générale). Parrainly n'a pas de présence Reddit à ce stade : signal à instruire par @growth/@social si Perplexity devient un canal mesuré comme faible dans le monitoring (cf. `monitoring-citations.md`).
- **Google AI Overviews** (`Google-Extended` autorisé) : s'appuie largement sur le top 10 organique classique, donc directement dépendant du travail SEO en parallèle (cf. anti-cannibalisation §8).
- **Claude** (`ClaudeBot`, `anthropic-ai`, `Claude-Web`, `Claude-User` autorisés) : privilégie des sources structurées et sourcées, cohérent avec le format JSON-LD dense déjà en place. Le data-point direct du test empirique (§5) confirme ce comportement pour ce projet précisément.

---

## 8. Anti-cannibalisation avec @seo

Pas de conflit de mots-clés à arbitrer à ce stade : GEO et SEO ciblent la même intention (« parrainage {enseigne} »), le contenu structuré JSON-LD sert les deux canaux simultanément (un passage extractible pour un modèle est aussi un passage bien structuré pour Google AI Overviews). Point de vigilance unique : le maillage catégorie → offre (action 4, §6) est piloté par @seo, @geo valide seulement que la structure reste citable (définition directe en tête de page catégorie). Aucun livrable @seo n'a été édité par ce document (`docs/copy/homepage-copy.md` explicitement hors périmètre de cette intervention).

---

## Gates vérifiées

- **G1** : 8 sections traitées, aucune < 2 lignes.
- **G3** : bloc Handoff structuré en fin de document.
- **G5** : personas A1/A2 (`project-context.md`) référencés via les intentions testées, pas de nom de persona générique réintroduit (Léa obsolète, non utilisé ici).
- **G7** : aucune contradiction avec `test-citation-ia.md`, `faisabilite-geo-parrainage-ia.md`, ni avec la couche AEO réelle lue dans `src/lib/ai/*` et `src/app/*` (0 recommandation de recréer une brique existante).
- **G12** : actions §6 formulées en verbe + objet + owner + critère de done.
- **G13** : 0 chiffre inventé ; les données incumbents (§1) sont sourcées par WebSearch daté du jour, marquées comme telles.
- **G15** : 0 placeholder résiduel.
- **G17** : la table §3 (mapping fichier réel → action de contenu) et les actions §6 sont spécifiques au code de Parrainly (chemins de fichiers réels), non copiables tel quel par un tiers.

---

### Vérifié (G_PROOF)
- `Read /home/user/MCP/src/lib/ai/jsonld.ts` : confirmé `priceValidUntil`, `disambiguatingDescription`, `faqPageJsonLd` déjà implémentés (lignes 38-129).
- `Read /home/user/MCP/src/app/page.tsx` : confirmé `faqPageJsonLd(FAQ)` déjà injecté sur l'accueil (ligne 49), absent des pages-offres individuelles (`offres/[slug]/page.tsx` n'injecte que `offreJsonLd` + `breadcrumbJsonLd`, lignes 52-61).
- `WebSearch` (2026-07-20) « 1parrainage.com Qonto parrainage code page structure » et « parrainage.co Trade Republic parrainage date mise à jour » : confirmé titres datés au mois (« Juillet 2026 »), absence de structure `Offer`/date exacte détectée dans les résultats retournés, cohérent avec l'angle de différenciation §1.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/geo/geo-strategy.md`, `/home/user/MCP/docs/geo/monitoring-citations.md`
- Décisions prises : LLM prioritaires = les 4 déjà crawlés (ChatGPT, Perplexity, Google AI Overviews, Claude), aucun classement forcé (les 19 crawlers `AI_CRAWLERS` restent tous autorisés) ; format prioritaire = définition directe + FAQPage par offre ; claim de différenciation = date de vérification exacte + divulgation embarquée (déjà en JSON-LD, à ne pas édulcorer côté contenu) ; baseline documentée dans `test-citation-ia.md` (pré-existant, réutilisé sans re-duplication)
- Points d'attention : ne pas exposer `url_parrainage` sous prétexte GEO (gouvernance miroir déjà tranchée par @ia, cf. §3) ; extension FAQ par offre et enrichissement `/divulgation` nécessitent @copywriter + @fullstack, pas @geo seul ; maillage catégorie→offre (§6 action 4) à coordonner avec @seo (pas de conflit de mots-clés identifié, juste une dépendance d'exécution) ; `docs/copy/homepage-copy.md` non touché (réservé @seo ce run)
---
