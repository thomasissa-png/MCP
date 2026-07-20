<!-- Version: 2026-07-20 - @legal - Texte 10/10 dossier textes : handoff consolidé du dossier -->

# Handoff consolidé - Dossier textes juridiques Parrainly

## Résumé exécutif : risques en 5 points (pour Thomas/Emmanuel, non-juristes)

1. **Ces 10 fichiers sont des drafts de référence, pas un avis juridique formé.** Faire valider par un avocat (droit bancaire/financier + consommation) les points marqués `[À VÉRIFIER PAR UN JURISTE]` avant toute mise en ligne publique réelle.
2. **3 blockers stricts avant mise en ligne** (repris de l'audit qualité) : email de contact encore en placeholder sur les pages rendues, structure juridique porteuse du site non tranchée (personne physique vs société, impacte `03-mentions-legales.md`), fiches Trade Republic et Kraken non résolues (clause de diffusion publique).
3. **Rien dans ce dossier ne doit être publié sans la vérification directe des CGU des 9 programmes** par Thomas/Emmanuel connectés à leur compte (voir `docs/legal/fiches-conformite/`), ce dossier `textes/` se limite aux textes génériques du site.
4. **Les champs entre crochets ne sont pas des données inventées** : ce sont des marqueurs explicites de ce qui reste à compléter par Thomas/Emmanuel ou par les agents techniques (@fullstack, @infrastructure). Aucune valeur de contact, de raison sociale ou de date n'a été fixée arbitrairement.
5. **Ce dossier doit être revu à chaque changement de modèle économique** (ouverture V2 marketplace, ajout d'un flux de paiement, ajout d'un nouveau programme) : la structure retenue (SaaS-catalogue V1) n'est pas celle d'une marketplace, les CGU devront être étendues (voir `02-politique-confidentialite.md` §"Ce qui n'est PAS couvert").

## Statut du dossier (10 fichiers)

| Fichier | Objet | Statut |
|---|---|---|
| `00-index.md` | Index et mapping checklist §7 (11 items) | Prêt, référence ce fichier |
| `01-cgu.md` | CGU du site | Draft prêt, email + structure juridique à compléter |
| `02-politique-confidentialite.md` | Politique de confidentialité RGPD | Draft prêt, email + hébergeur à compléter |
| `03-mentions-legales.md` | Mentions légales (LCEN) | Draft prêt, bloquant : décision structure juridique |
| `04-bandeau-cookies.md` | Bandeau + politique cookies CNIL | Prêt, implémentation technique à la charge de @fullstack |
| `05-divulgation-affiliation.md` | Page "Comment ça marche" | Prêt côté fond, forme à retravailler par @copywriter |
| `06-mentions-risque-financier-crypto.md` | Gabarits de mention de risque par catégorie | Prêt, arbitrage Trade Republic en attente |
| `07-mention-non-affilie.md` | Gabarit non-affiliation par fiche | Prêt |
| `08-divulgation-embarquee-donnee.md` | Divulgation embarquée dans la donnée (JSON) | Prêt côté texte, champs JSON à valider par @ia |
| `09-checklist-cgu-plateformes-ia.md` | Veille CGU développeur plateformes IA | Usage interne, revue trimestrielle |

## Ce qui reste bloquant (repris de `00-index.md`)

- Email de contact réel à fixer par Thomas/Emmanuel puis rendu par @fullstack (actuellement placeholder sur les pages).
- Structure juridique porteuse du site (personnes physiques vs société à créer), impacte directement `03-mentions-legales.md` et le régime fiscal des commissions.
- Validation avocat sur la qualification indicateur/IOBSP-CIF et sur les points marqués `[À VÉRIFIER PAR UN JURISTE]`.
- Arbitrage produit sur les fiches Trade Republic et Kraken (voir `docs/legal/fiches-conformite/`), décision à prendre par Thomas/Emmanuel.

---
**Handoff -> @fullstack** (implémentation des pages) et @infrastructure (CSP, bandeau cookies, CI anti-placeholder)
- Fichiers produits : les 10 fichiers de `docs/legal/textes/` (00 à 09) + ce handoff.
- Décisions prises : conformité RGPD basée sur le flux de données réel V1 (tracking d'attribution uniquement) ; classification indicateur non régulé (non tranchée jurisprudentiellement, `[À VÉRIFIER PAR UN JURISTE]`) ; posture "risque limité" (pas de LLM propriétaire exposé côté légal, hors périmètre AI Act haut risque).
- Points d'attention : ne PAS lever les 3 blockers listés ci-dessus sans validation Thomas/Emmanuel ; le champ email de contact doit rester configurable (pas de valeur en dur dans le code) tant qu'aucune adresse réelle n'est fournie ; consulter `docs/legal/fiches-conformite/00-index.md` avant de publier les fiches Trade Republic et Kraken.
