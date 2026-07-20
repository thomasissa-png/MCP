<!-- Version: 2026-07-20 — @legal — P1-c : textes juridiques prêts à intégrer (blocker mise en ligne publique) -->

# Index des textes juridiques — Parrainly (checklist legal-strategy.md §7)

## Résumé exécutif — risques en 5 points (pour Thomas/Emmanuel, non-juristes)

1. **Ces textes sont des drafts de référence, pas un avis juridique formé.** Avant toute mise en ligne publique réelle, faire relire par un avocat spécialisé droit bancaire/financier + droit de la consommation les points marqués `[À VÉRIFIER PAR UN JURISTE]` (nombreux sur ce projet car le secteur fintech/crypto est une zone de frontière fine, cf. `legal-strategy.md`).
2. **Le vrai point dur n'est pas ces textes mais les CGU des 9 programmes** (dossier `docs/legal/fiches-conformite/`) : Trade Republic et Kraken **interdisent explicitement** la diffusion publique du lien (confirmé par recherche cette session, sources en tête de chaque fiche). Publier leur fiche en l'état expose T&E à la perte de la prime, voire à la clôture du compte.
3. **Kraken et Meria sont bien agréés MiCA/PSCA en 2026** (bonne nouvelle, vérifié cette session, cf. `docs/legal/statut-psca-kraken-meria.md`) : le risque pénal de promotion d'un prestataire non autorisé ne se pose pas. Le risque qui demeure est la clause de diffusion publique (point 2).
4. **La divulgation d'affiliation doit être présente PARTOUT** : dans la donnée brute (JSON/texte source, fichier 08), sur chaque page, et dans les mentions légales. Sans cela, risque DGCCRF (jusqu'à 75 000 €) pour pratique commerciale trompeuse.
5. **Le copy financier/crypto est encadré strictement** (fichier 06) : zéro promesse de rendement, mention de risque visible, zéro vocabulaire de classement. À faire respecter par @copywriter sur CHAQUE fiche avant publication, pas seulement au lancement.

## Correspondance avec la checklist legal-strategy.md §7 (11 items)

| # checklist | Item | Fichier / emplacement |
|---|---|---|
| 1 | CGU du site | `01-cgu.md` |
| 2 | Politique de confidentialité | `02-politique-confidentialite.md` |
| 3 | Mentions légales | `03-mentions-legales.md` |
| 4 | Bandeau cookies conforme CNIL | `04-bandeau-cookies.md` |
| 5 | Page "Divulgation affiliation / Comment ça marche" | `05-divulgation-affiliation.md` |
| 6 | Fiche de conformité CGU par programme (9 programmes) | `docs/legal/fiches-conformite/` (dossier séparé, 9 fichiers) |
| 7 | Mentions de risque produits financiers/crypto | `06-mentions-risque-financier-crypto.md` |
| 8 | Mention "non affilié officiellement" | `07-mention-non-affilie.md` |
| 9 | Divulgation embarquée dans la donnée (texte/JSON) | `08-divulgation-embarquee-donnee.md` |
| 10 | Checklist CGU développeur par plateforme IA | `09-checklist-cgu-plateformes-ia.md` |
| 11 | Statut PSCA/agrément Kraken et Meria | `docs/legal/statut-psca-kraken-meria.md` (dossier séparé) |

## Ce qui reste bloquant après ce livrable

- **Trade Republic et Kraken** : clause de diffusion publique explicitement violée par le modèle actuel (site public cité par IA). Voir fiches de conformité correspondantes pour le détail et les options d'atténuation. Décision produit à trancher par Thomas/Emmanuel avant mise en ligne de ces 2 fiches précisément.
- Structure juridique porteuse du site (personnes physiques T&E vs société à créer) `[À VALIDER]` — impacte la rédaction finale des mentions légales (`03-mentions-legales.md`, champs à compléter).
- Validation avocat sur la qualification indicateur/IOBSP-CIF (frontière fine, non tranchée par la doctrine, cf. `legal-strategy.md` §2).

---
**Handoff → voir `10-handoff.md` en fin de dossier pour le handoff consolidé complet.**
