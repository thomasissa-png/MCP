<!-- Version: 2026-07-20 — @legal — Texte 6/11 checklist §7 (item 7) : Mentions de risque produits financiers/crypto, gabarits par catégorie -->

# Mentions de risque obligatoires — gabarits par catégorie

**Usage** : ces gabarits doivent apparaître sur chaque fiche produit de la catégorie concernée, de façon visible (pas en petite police/pied de page noyé). Voir `legal-strategy.md` §4bis pour la justification réglementaire complète.

## Catégorie "Investissement" (Ramify) et "Gestion de patrimoine" (Finary)

> **Investir comporte des risques de perte en capital.** Les performances passées ne préjugent pas des performances futures. La prime de parrainage est un avantage de bienvenue, distinct de la performance du produit financier souscrit.

**Interdictions absolues sur ces fiches** : aucune formulation suggérant un rendement garanti ou une promesse de gain ("gagnez X%", "rendement assuré", "placement sûr"). Aucun vocabulaire de classement ("le meilleur", "notre choix n°1", "recommandé pour vous").

## Catégorie "Placement trésorerie" (Spiko)

> **Investir comporte des risques de perte en capital.** Les fonds monétaires ne sont pas garantis en capital malgré leur faible volatilité habituelle. Le rendement affiché (`avantage_filleul`) dépend de la campagne en cours et peut évoluer.

Note spécifique Spiko : le champ `avantage_filleul` actuel ("+0,7 point de rendement pendant 6 mois") doit toujours être présenté avec la mention "selon campagne en cours" (déjà présent dans `notes` de `base-parrainage.json`), jamais comme un taux garanti à vie.

## Catégorie "Crypto" (Kraken, Meria)

> **Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier, y compris à la baisse.** Investir dans un crypto-actif comporte un risque de perte totale du capital. La prime de parrainage ne compense ni ne couvre ce risque.

**Interdictions absolues sur ces fiches** : aucune suggestion que la prime "compense" le risque, aucune promesse de gain sur la valeur de l'actif lui-même, aucun vocabulaire de classement ("le meilleur exchange crypto").

## Catégorie "Finance personnelle" (Trade Republic, néobanque/courtage)

> Note : Trade Republic combine un compte rémunéré (produit bancaire, risque limité) et du courtage en actions/ETF (produit d'investissement, risque de perte en capital). **`[À VALIDER par @product-manager/@legal]`** : la classification retenue par le checkpoint Phase 1 (`checkpoint-specs-phase1.md` point 7) est "pas de bandeau risque par défaut" pour Finance personnelle. **Recommandation de ce document : appliquer la mention "Investir comporte des risques de perte en capital" sur la fiche Trade Republic dès que la fiche mentionne les fonctionnalités actions/ETF/plans d'investissement programmés** (présentes dans `description_courte` : "actions, ETF, plans d'investissement programmés"), pas seulement sur le compte rémunéré. À trancher avant mise en ligne de cette fiche précisément.

## Catégorie "Services entrepreneur" (Qonto, Revolut Business, Dougs)

Pas de mention de risque financier obligatoire (produits bancaires/comptables professionnels, pas des produits d'investissement). Mention standard de non-affiliation suffit (voir `07-mention-non-affilie.md`).

## Règle transversale (toutes catégories financières/crypto)

1. La mention de risque doit être visible **dès la première vue de la fiche**, pas seulement accessible en cliquant sur "en savoir plus" (source ARPP/Clinique Juridique, citée dans `legal-strategy.md` §4bis).
2. Chaque fiche reste descriptive du programme de parrainage (montant, conditions), jamais du produit financier comme placement à recommander.
3. `[À VÉRIFIER PAR UN JURISTE]` : opportunité du "certificat de l'influence responsable en finance" AMF/ARPP pour Thomas/Emmanuel si le volume de contenu financier grandit (mentionné dans `legal-strategy.md` §4bis, non traité ici faute de pertinence à ce stade V1).

---
**Sources** : recommandation ARPP "Publicité financière" et "Crypto-actifs" V2 ; `docs/legal/legal-strategy.md` §4bis (WebSearch ARPP, Clinique Juridique, Anyti.me finfluenceurs).
