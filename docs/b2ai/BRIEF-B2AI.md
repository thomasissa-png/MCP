<!-- Brief exploration stratégique B2AI — 2026-07-20 — session principale -->
# Brief — Exploration stratégique « B2AI »

> Question posée par le fondateur (Thomas) après la livraison du pilote Parrainly.
> Chaque agent répond aux 3 questions ci-dessous DE SA LENTILLE, puis on synthétise.

## Cadrage « B2AI » (interprétation à valider dans vos réponses)

Ni B2C ni B2B classique : **construire des produits/actifs conçus pour être consommés et cités par les
IA** (assistants, agents, moteurs de réponse). Les IA deviennent le canal de distribution ET, de plus en
plus, l'acheteur/agent qui agit. Parrainly est notre PREMIER cas concret : un registre de données
(codes/liens de parrainage vérifiés) servi en priorité aux IA (JSON-LD, `/api/v1`, `/llms.txt`, codes
extractibles), pour être la source citée quand quelqu'un demande un code à ChatGPT/Perplexity/Claude.

Si vous pensez que le cadrage « B2AI » est faux, mal nommé ou trop large, DITES-LE (first-principles).

## État actuel (base sur laquelle on construit)

- **Parrainly** est LIVE (pilote non-public) : https://parrainly.thomas-issa.workers.dev — 9 offres
  fintech réelles (cercle fermé), stack Cloudflare Workers + D1 + Next.js.
- Couche AEO/GEO posée : JSON-LD, `/llms.txt`, API JSON v1, robots.txt pro-crawlers, divulgation
  embarquée, date de vérification par offre, codes extractibles par une IA (vérifié).
- Décisions structurantes déjà prises : **MCP grand public abandonné** (adoption quasi nulle) ; canal
  principal = **contenu web structuré et cité** ; modèle = commission sur primes de parrainage, cercle
  fermé T&E en V1, marketplace multi-parrains en V2 ; éditeur = société en attente de création.
- G_PROOF distribution = point zéro (0/11 citations à J0, cause = non-indexation, site tout juste
  déployé). La thèse « les IA citent les sources structurées » est étayée mais pas encore prouvée sur
  NOTRE domaine.

## Contexte à lire (grounding, ne pas tout relire — cibler)

- `project-context.md` (identité, décisions fondateur #1→#4, base réelle)
- `docs/project-synthesis.md` (verdict GO POC, kill point désintermédiation)
- `docs/reviews/` (elon-audit : insight 10x, kill points, H1/H2/H3)
- `docs/geo/geo-strategy.md` + `docs/geo/faisabilite-geo-parrainage-ia.md`
- `docs/ia/architecture-mcp-parrainage-ia.md` (archi multi-canaux, API pivot)
- `docs/strategy/brand-platform.md`

## Les 3 questions (répondre aux 3, de votre lentille)

1. **Est-ce intéressant ?** Le B2AI (tel que cadré, ou reformulé par vous) est-il une vraie direction
   stratégique 10x, ou un effet de mode ? Verdict tranché + argument. Rappel commandement 5 : verdict
   fondé sur la VALEUR (utilisateur / défendabilité / timing), pas sur le ROI/payback court terme.
2. **Comment ajouter les bonnes briques APRÈS ce sujet ?** Sur la base Parrainly, quelles briques
   concrètes ajouter ensuite (techniques, produit, distribution, données) et dans quel ORDRE (par
   dépendances, mindset IA). Verbe + objet + critère de done.
3. **Quels AUTRES sujets B2AI pourraient être intéressants ET rentables pour nous ?** Short-list d'idées
   (au-delà du parrainage), chacune avec : la valeur pour qui, pourquoi une IA la consommerait/citerait,
   comment ça se monétise, et le niveau de défendabilité. Pas d'invention de chiffres (marquer
   `[HYPOTHÈSE]`), calibrer sur nos moyens réels (équipe 2 + agents IA).

## Livrable par agent

Fichier : `docs/b2ai/<agent>-b2ai.md`. Structure : Q1 verdict / Q2 briques ordonnées / Q3 short-list
sujets. + bloc « Vérifié (G_PROOF) » (reads + WebSearch réels) + Handoff. Français, zéro tiret cadratin
en client-facing (ici doc interne, mais restez sobres). ANTI-TIMEOUT : Write le squelette d'abord.
Terminez par un résumé (verdict Q1 en 1 ligne + vos 3 meilleures idées Q3).
