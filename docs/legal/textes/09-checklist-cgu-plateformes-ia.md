<!-- Version: 2026-07-20 — @legal — Texte 9/11 checklist §7 (item 10) : Checklist CGU développeur par plateforme IA -->

# Checklist CGU développeur : plateformes IA (revue trimestrielle)

**Usage interne** (pas client-facing) : document de veille, à revoir a minima chaque trimestre, et systématiquement avant toute intégration technique nouvelle (API, plugin, MCP en V1.5).

Repris et opérationnalisé depuis `legal-strategy.md` §5 et `conformite-parrainage-ia.md` §3.

## Checklist par plateforme

| Plateforme | Règle identifiée | Statut de conformité Parrainly | Date de dernière vérification | Action si non conforme |
|---|---|---|---|---|
| OpenAI (ChatGPT) | App Developer Terms + App submission guidelines : interdiction de chercher à influencer le modèle pour se faire préférer à d'autres apps/sources, ou de dénigrer des concurrents | Conforme dans son principe : contenu factuel, sourcé, vérifiable (fraîcheur des codes via `date_verification`), pas de technique manipulatoire | 2026-07-20 (WebSearch session `legal-strategy.md`) | Revoir la structuration si une technique d'optimisation agressive est envisagée (cloaking, keyword stuffing) |
| Perplexity | Intègre déjà publicité et affiliation dans ses propres résultats (signal de tolérance sectorielle) ; pas de politique anti-manipulation spécifique identifiée pour les sources tierces à ce jour | `[À VÉRIFIER / VEILLE]` : pas de règle bloquante identifiée | 2026-07-20 | Revérifier au prochain trimestre (politique évolutive) |
| Google (AI Overviews / Gemini) | Pas de CGU spécifique identifiée sur la citation de sources d'affiliation tierces lors de cette recherche | `[À VÉRIFIER / VEILLE]` : absence de règle documentée ne signifie pas absence de risque futur | 2026-07-20 | Revérifier au prochain trimestre |
| Anthropic (Claude) | Pas de CGU spécifique identifiée sur la citation de sources d'affiliation tierces lors de cette recherche | `[À VÉRIFIER / VEILLE]` | 2026-07-20 | Revérifier au prochain trimestre |

## Principe transversal retenu pour la V1 cercle fermé

Aucune plateforme IA n'autorise le spam ou la manipulation du classement des sources. Le modèle défendable pour Parrainly est celui d'une source **structurée, vérifiée et transparente** (fraîcheur des codes, divulgation embarquée, cf. `08-divulgation-embarquee-donnee.md`), pas celui d'une source qui tente de forcer sa citation par des techniques agressives.

## Nature du risque (à traiter comme business autant que juridique)

`[À VÉRIFIER PAR UN JURISTE]` : la nature exacte du risque (contractuel via CGU d'adhésion développeur vs risque business pur de déréférencement, sans recours judiciaire possible en pratique) reste incertaine. Recommandation opérationnelle : traiter tout signal de non-conformité comme un risque business majeur (perte du canal principal de distribution), pas seulement comme une question juridique théorique.

## Prochaine revue

Prochaine échéance de revue trimestrielle : **[À PLANIFIER, 3 mois après la mise en ligne publique]**. Owner : @legal, avant toute intégration technique nouvelle (API publique, plugin, MCP V1.5).

---
**Sources** : OpenAI App Developer Terms / App submission guidelines (repris de `docs/legal/conformite-parrainage-ia.md` §3 et `docs/legal/legal-strategy.md` §5). Perplexity/Google/Anthropic : absence de CGU spécifique constatée lors des recherches des sessions précédentes, non recherché à nouveau cette session (pas de changement de méthodologie signalé).
