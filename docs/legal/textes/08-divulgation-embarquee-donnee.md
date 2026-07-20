<!-- Version: 2026-07-20 — @legal — Texte 8/11 checklist §7 (item 9) : Divulgation embarquée dans la donnée retournée (texte/JSON) -->

# Divulgation embarquée dans la donnée : gabarits techniques

**Destinataires** : @ia (structuration des données consommées par les assistants IA), @fullstack (implémentation HTML/JSON).

**Objectif** (rappel `legal-strategy.md` §3) : maximiser la probabilité qu'un assistant IA (ChatGPT, Claude, Perplexity, Gemini) reprenne la mention de divulgation dans sa réponse, en l'intégrant directement dans le texte brut consommé par le modèle, plutôt qu'en dépendant d'un bandeau visuel que le modèle ne "voit" pas.

## A. Gabarit texte brut (à intégrer dans le contenu HTML visible ET dans le flux JSON structuré)

> "Lien de parrainage [NOM DU PROGRAMME] : Parrainly perçoit un avantage personnel (Thomas ou Emmanuel) si vous l'utilisez pour vous inscrire."

Version crypto (à combiner avec la mention de risque, `06-mentions-risque-financier-crypto.md`) :

> "Lien de parrainage [NOM DU PROGRAMME] : Parrainly perçoit un avantage personnel si vous l'utilisez. Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier."

## B. Champ JSON dédié (proposition de schéma pour @ia, en complément du schéma existant `data/base-parrainage.json`)

```json
{
  "id": "REF-001",
  "nom_programme": "Trade Republic",
  "...": "...(champs existants inchangés)",
  "divulgation_affiliation": "Lien de parrainage Trade Republic : Parrainly perçoit un avantage personnel (Thomas ou Emmanuel) si vous l'utilisez pour vous inscrire.",
  "mention_risque": "Investir comporte des risques de perte en capital.",
  "mention_non_affiliation": "Parrainly n'est pas affilié officiellement à Trade Republic."
}
```

`[À VALIDER PAR @ia]` : nom exact des champs à ajouter au schéma `Schema_MCP` de `base-parrainage.json` (20 champs actuels). Ce document propose 3 champs supplémentaires (`divulgation_affiliation`, `mention_risque`, `mention_non_affiliation`), calculables dynamiquement depuis les gabarits ci-dessus plutôt que stockés en dur ligne par ligne (éviter la dérive de cohérence si le texte légal change).

## C. Placement HTML sur la page-offre

La mention de divulgation doit apparaître **avant le bouton/lien cliquable vers le programme tiers**, jamais seulement en bas de page ou dans un tooltip caché. Conforme à `legal-strategy.md` §3 point 2 (divulgation sur la page source, condition nécessaire indépendante du canal IA).

## D. Limite documentée (à ne pas présenter comme une garantie totale)

`[À VÉRIFIER PAR UN JURISTE]` : aucune doctrine ou jurisprudence en 2026 ne tranche la responsabilité de l'éditeur de la donnée-source quand un assistant IA tronque ou omet la mention lors de sa reformulation. La position de ce document reste celle de `legal-strategy.md` §3 : documenter l'effort de divulgation (mention systématique dans la donnée ET sur la page) pour établir la bonne foi, sans certitude de couverture totale en cas de troncature par le modèle tiers.

---
**Sources** : mécanisme de divulgation embarquée repris de `docs/legal/legal-strategy.md` §3 (loi n° 2023-451, directive Omnibus (UE) 2019/2161) ; schéma technique de référence `data/base-parrainage.json` (onglet Schema_MCP, 20 champs).
