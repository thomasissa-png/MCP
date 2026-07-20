<!-- Version: 2026-07-20 — @seo — Phase 3 (stratégie SEO Parrainly) -->
# Stratégie SEO — Parrainly

> Cadrage : `docs/geo/test-citation-ia.md` (test empirique, cœur de toute décision ci-dessous). Thèse validée : les agrégateurs de parrainage structurés captent 9/9 requêtes d'intention « parrainage {enseigne} » ; les comparateurs captent l'intention générique « meilleure {catégorie} » (0 agrégateur de parrainage cité). Coordination obligatoire avec `@geo` : zéro cannibalisation, cf. §5.

## 1. Priorité stratégique : l'intention « parrainage {enseigne} »

Le terrain défendable de Parrainly n'est pas la comparaison bancaire (terrain saturé par des incumbents SEO massifs, hors périmètre) mais l'intention où la citation IA a déjà démontré qu'elle allait chercher une source structurée. **Les 9 pages `/offres/{slug}` sont l'actif prioritaire**, avant toute page catégorie ou tout contenu éditorial additionnel. Conséquence de priorisation :
1. Les 9 pages offre doivent être 100% conformes (title/H1/P1 + JSON-LD + fraîcheur datée) avant tout investissement dans du contenu de blog ou des pages piliers.
2. Les 6 pages catégorie viennent ensuite : rôle de maillage, pas de conquête frontale (cf. §3).
3. Aucun contenu visant « meilleure néobanque », « comparatif banque en ligne » etc. n'est recommandé au pilote (hors stratégie de la marque, posture non-conseil, et terrain non gagnable court terme).

## 2. Gap vs les incumbents (analyse interne, non client-facing)

Les agrégateurs observés dans le test empirique (incumbent dominant présent sur 9/9 programmes, deuxième acteur sur 8/9, plus une dizaine d'acteurs récurrents sur 3+ programmes, cf. `test-citation-ia.md` §6) partagent des faiblesses structurelles observées lors du test :
- **Fraîcheur non datée ou non vérifiable** : aucun des agrégateurs cités n'affiche de date de dernière vérification opposable sur la page elle-même. Parrainly l'affiche systématiquement (`FreshnessBadge`, champ `date_verification`, cf. `audit-technique.md` §2).
- **Divulgation d'affiliation faible ou absente** : la plupart des agrégateurs ne formalisent pas la relation commerciale de façon structurée (JSON-LD ou bloc visible au-dessus du CTA). Parrainly l'embarque à la fois dans le JSON-LD (`disambiguatingDescription`) et dans le HTML visible (`DisclosureBanner`), cf. `docs/legal/legal-strategy.md`.
- **Un statut d'offre binaire ou absent** (actif/mort non affiché explicitement) contre un statut à 3 états chez Parrainly (actif, en attente, retiré) avec retrait automatique.
- **Format généraliste multi-enseignes** (parrainage toutes catégories confondues, souvent hors-verticale fintech spécifiquement) contre un catalogue borné et vérifié fintech chez Parrainly, cohérent avec la promesse de marque.

**Angle différenciant à exploiter (repris du handoff `test-citation-ia.md` §8, coordination `@geo`)** : fraîcheur vérifiée datée + divulgation structurée, pas la simple présence sur le mot-clé. C'est un avantage de structure de données (JSON-LD `Product`/`Offer` avec `priceValidUntil`, `disambiguatingDescription`), pas un avantage de volume de contenu : Parrainly ne peut pas rivaliser en nombre de pages avec des incumbents installés depuis plus longtemps, il peut rivaliser en qualité de signal machine-readable.

## 3. Maillage : catégorie capte l'amont, offre capte l'intention transactionnelle

Le test empirique montre que l'intention générique ne convertit pas en citation d'agrégateur de parrainage (constat n°3). Les pages catégorie ne doivent donc pas tenter de gagner « meilleure néobanque » : leur rôle est de capter un visiteur en phase de découverte de verticale (via recherche directe « parrainage néobanque » ou clic interne) et de le **rabattre** vers la page offre pertinente. Règle de maillage (déjà posée par l'architecture Phase 2, à densifier) :
- Chaque page catégorie liste ses offres actives avec lien direct (`OfferCard`, déjà en place, cf. `src/app/categories/[slug]/page.tsx`).
- Chaque page offre affiche des « Offres proches » de la même catégorie (déjà en place, `src/app/offres/[slug]/page.tsx` zone 9) : maillage remontant catégorie ↔ offre bidirectionnel confirmé dans le code.
- La homepage liste les 6 catégories ET les 9 offres sur une seule page (déjà en place) : profondeur de clic maximale = 1 depuis l'accueil pour toute offre, aucune page à plus de 2 clics. Conforme à l'exigence topical map (profondeur ≤ 3).

## 4. Topical map simplifiée (adaptée au catalogue fermé, pas un cocon éditorial classique)

Parrainly n'est pas un blog : c'est un registre de fiches transactionnelles. La topical map se limite donc à la structure réelle du catalogue plutôt qu'à des piliers éditoriaux inventés (zéro invention de contenu hors catalogue) :

```
Parrainly (accueil, hub)
├── Finance personnelle (catégorie) → Trade Republic (offre)
├── Investissement (catégorie) → Ramify (offre)
├── Gestion de patrimoine (catégorie) → Finary (offre)
├── Placement trésorerie (catégorie) → Spiko (offre)
├── Services entrepreneur (catégorie) → Qonto, Revolut Business, Dougs (offres)
└── Crypto (catégorie) → Kraken, Meria (offres)
```

Ce rattachement catégorie ↔ programme est aligné sur la source d'autorité `docs/legal/fiches-conformite/00-index.md` (mapping 9/9 identique à `docs/copy/fiches-categories.md`), correction du checkpoint @reviewer (`docs/reviews/checkpoint-phase3.md`, G7). `[HYPOTHÈSE]` un même programme pourrait relever de plusieurs catégories selon le produit exact (ex. Finary, suivi patrimoine vs investissement) : à confirmer par Emmanuel/`@fullstack` lors de l'extraction technique de la base réelle (`data/base-parrainage-emmanuel-v3.xlsx`, illisible par les outils texte, limite déjà signalée par `@copywriter`), qui reste la source de vérité DB.

**Pas de cluster « article de blog »** au pilote : la mécanique de contenu récurrent obligatoire (commandement 5) est traitée au niveau de la **fraîcheur des fiches**, pas d'un blog. Le contenu qui se régénère en continu, ce n'est pas un article, c'est la date de vérification et le statut de chaque offre, recalculés par `/internal/freshness-check/run` (déjà en place, cf. `audit-technique.md` §4). C'est la bonne substitution pour ce modèle : le signal de fraîcheur EST le mécanisme de contenu récurrent GEO-pertinent, pas une addition de blog qui diluerait le budget de crawl sur un catalogue de 9 pages.

## 5. Coordination @geo (zéro cannibalisation)

- **@seo** possède l'intention transactionnelle « parrainage {enseigne} » / mots-clés catégorie (ce document + `keyword-map.md`).
- **@geo** possède l'angle de citation (structure JSON-LD, `llms.txt`, mode browsing des assistants, cf. `test-citation-ia.md` §5 et §8).
- Aucun chevauchement : le SEO cible le classement/l'indexation classique (Google/Bing organique), le GEO cible la citation par les moteurs de réponse IA sur la même URL. Une seule URL par offre sert les deux objectifs simultanément (pas de doublon de page ni de contenu dupliqué entre un besoin SEO et un besoin GEO).

## 6. Priorisation d'exécution (ordre recommandé à @fullstack)

1. Corriger title/H1/P1 des pages catégorie pour intégrer le mot-clé exact (`audit-technique.md` §2, correction Bing-critique).
2. Ajouter `alternates.canonical` explicite sur les 4 types de page (accueil, offre, catégorie, légales) (`audit-technique.md` §2).
3. Stabiliser `lastModified` du sitemap pour les pages non-offre (`audit-technique.md` §3, actuellement régénéré à chaque requête, signal de spam pour Bing).
4. Ajouter une image OG 1200×630 par type de page + logo `Organization` en PNG (`audit-technique.md` §5).
5. Densifier le maillage interne (liens contextuels enseigne → catégorie dans le corps de texte des pages offre, au-delà du fil d'Ariane déjà présent).

## 7. Ce qui n'est PAS recommandé (et pourquoi)

- **Pas de contenu comparatif « meilleure néobanque »** : terrain saturé (constat n°3), et contraire à la posture non-conseil de la marque (`legal-strategy.md`, `brand-platform.md`).
- **Pas de programmatic SEO générique** (pages générées en masse sur des variantes artificielles) : le catalogue est fermé à 9 programmes réels au pilote (cf. `project-context.md` « V1 = cercle fermé »), toute page générée sans offre réelle derrière violerait la règle zéro-invention et la promesse de vérification.
- **Pas de blog éditorial au pilote** : substitué par la fraîcheur recalculée des fiches (§4), qui sert mieux la thèse GEO du projet qu'un contenu générique difficile à différencier des incumbents.

---

## Gates BLOQUANT vérifiées

- **G1** : 7 sections, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : arbitrage explicite sur l'objection implicite « pourquoi pas un blog » et « pourquoi pas viser meilleure néobanque » (§7). PASS.
- **G7** : aligné `test-citation-ia.md` (constats 1-3), `brand-platform.md` (posture non-conseil), `legal-strategy.md` (divulgation), `docs/geo/faisabilite-geo-parrainage-ia.md` (contenu web structuré = canal principal). PASS.
- **G12** : §6 fournit un ordre d'exécution verbe+objet+référence directement transmissible à @fullstack. PASS.
- **G13** : 1 hypothèse marquée explicitement (§4, rattachement catégorie↔programme), 0 métrique de trafic inventée. PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence. PASS.
- **G17** : stratégie fondée sur un test empirique daté et un audit de code réel, non copiable sans les deux. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** recoupement direct avec `docs/geo/test-citation-ia.md` (11 requêtes WebSearch réelles, 2026-07-20) pour les constats §1/§2/§3 ; recoupement avec `src/app/categories/[slug]/page.tsx` et `src/app/offres/[slug]/page.tsx` (Read direct) pour confirmer que le maillage catégorie↔offre décrit en §3 existe déjà dans le code (`OfferCard`, section « Offres proches »).

---
**Handoff → @fullstack, @geo**
- Fichiers produits : `/home/user/MCP/docs/seo/seo-strategy.md`
- Décisions prises : priorité absolue aux 9 pages offre sur l'intention « parrainage {enseigne} » ; catégories en rôle de maillage uniquement (pas de conquête « meilleure X ») ; pas de blog au pilote, la fraîcheur recalculée des fiches remplace le contenu récurrent ; ordre d'exécution technique en §6 transmis à @fullstack.
- Points d'attention : rattachement catégorie↔programme en §4 marqué `[HYPOTHÈSE]`, à confirmer lors de l'extraction du xlsx ; coordination @geo sur l'angle de citation (zéro cannibalisation confirmée en §5).
---
