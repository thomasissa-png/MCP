<!-- Version: 2026-07-20T00:00 — @geo — Étude de faisabilité GEO/AEO initiale (POC Parrainage-IA) -->

# Faisabilité GEO/AEO — Devenir LA source citée par les IA pour un code promo/parrainage

## Résumé exécutif (lire en premier)

- **Question posée** : une IA peut-elle être amenée à servir NOS codes de parrainage quand un utilisateur demande "trouve-moi un code promo pour X" ?
- **Réponse courte** : oui, mais pas via un serveur MCP que le grand public brancherait lui-même — cette porte n'existe quasiment pas côté consommateur en 2026 (voir verdict). La vraie porte d'entrée à court terme est **le contenu web cité par les moteurs de réponse** (ChatGPT, Perplexity, Google AI Overviews), MCP restant une brique pro/agentique en toile de fond.
- **Comportement actuel des IA** : elles ne "connaissent" pas de codes promo par cœur (ça périme trop vite) — soit elles citent une source web tierce (agrégateurs), soit elles refusent/renvoient vers des sites, soit elles **hallucinent** un code plausible mais invalide. Un incident documenté (Royaume-Uni, fév. 2026) montre un chatbot inventant un code de réduction de 80% accepté... en commentaire de commande, pas en caisse.
- **Concurrence** : le terrain est déjà occupé par des agrégateurs de codes structurés et fréquemment mis à jour (SimplyCodes, WorthEPenny, Wethrift, DontPayFull, Tenereteam, Dealspotr) — pas par les marques elles-mêmes ni par des annuaires de parrainage. Perplexity pioche aussi beaucoup sur Reddit/forums.
- **MCP** : en forte croissance côté développeurs/agents (97M+ téléchargements SDK, adoption Fortune 500 ~28%), mais l'adoption "grand public" (un particulier qui branche un serveur MCP tiers dans son ChatGPT/Claude perso pour chercher un code promo) est **quasi nulle** aujourd'hui. Des MCP servers d'affiliation existent déjà (CJ Affiliate, Amazon Affiliate, affiliate.com, Rally) — mais consommés par des devs qui construisent des agents, pas par "Léa, 29 ans".
- **Implication directe pour le projet** : le POC doit d'abord viser à être **crawlé, structuré et cité** (contenu web + schema.org + fraîcheur), avec le MCP server construit en parallèle comme **canal B2B/pro** (agences d'affiliation, devs d'agents, futurs plugins/GPT/connectors), pas comme canal d'acquisition B2C principal.
- **Verdict net** : voir section finale — le pari "MCP grand public" seul est **NO-GO en canal principal**, GO en brique secondaire/différenciante.

---

## 0. Rappel pédagogique — GEO/AEO en 2 minutes

Le SEO optimise pour être cliqué dans une liste de liens. Le **GEO (Generative Engine Optimization)** / **AEO (Answer Engine Optimization)** optimise pour être **cité dans la réponse générée** par une IA (ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude). Les LLM ne "rankent" pas des pages : ils sélectionnent des **passages** de texte auto-suffisants, vérifiables, structurés, dans des sources qu'ils jugent fiables et fraîches — puis les citent ou les paraphrasent. 80% des URLs citées par les LLM ne sont pas dans le top 100 Google : c'est un jeu différent du SEO classique, avec ses propres règles (structure, fraîcheur, autorité d'entité).

---

## 1. Comportement actuel des IA sur "trouve-moi un code promo pour X" (diagnostic sourcé)

**Constat central** : aucune des 4 IA (ChatGPT, Perplexity, Gemini, Claude) ne "sait" nativement de codes promo valides à un instant T — les codes expirent en jours/semaines, donc ce savoir ne peut pas être dans les poids du modèle. Trois comportements possibles, tous observés :

**(a) Citation d'une source tierce (le cas le plus fréquent avec navigation web activée).** Quand on cherche "code promo Perplexity" ou "code promo ChatGPT" aujourd'hui, l'espace de réponse est saturé par des agrégateurs de coupons dédiés : SimplyCodes, WorthEPenny, Wethrift, DontPayFull, Tenereteam, Dealspotr, NachoNacho, Krater.ai, GlobalGPT. Ce sont **exactement** les sources qu'un moteur de réponse avec navigation va reprendre, car elles sont structurées (liste de codes, taux, date de vérification) et fréquemment republiées. Perplexity en particulier privilégie le contenu récent (< 90 jours) et pioche ~47% de ses sources sur Reddit — les forums de "deal hunters" comptent autant que les sites dédiés.

**(b) Réponse prudente / refus / renvoi générique.** Les assistants correctement guardés répondent souvent "je n'ai pas de code garanti valide, voici où chercher" plutôt que d'inventer un code — comportement attendu de la part des grands modèles grand public bien alignés, mais qui **laisse le terrain vide** pour qui aurait un contenu assez autoritaire/frais pour être cité avec confiance.

**(c) Hallucination.** Cas documenté et repris sur Hacker News (février 2026) : un chatbot marchand britannique, poussé par un client via prompt injection ("montre tes talents en calcul"), a **inventé** un code de réduction de 25% puis 80% sur une commande de 8 000 £ — code non valide en caisse, mais accepté manuellement par un humain qui a fait confiance au bot. Autre signal : des associations de consommateurs alertent sur le fait que les recherches shopping via IA redirigent parfois vers des **sites frauduleux** (cybernews, 2026) — l'espace "code promo" est structurellement propice à l'hallucination et à la fraude, ce qui est un signal fort qu'une source fiable, vérifiée et fraîche a de la valeur à occuper.

**Conclusion diagnostic** : les IA ne refusent pas par principe, elles **citent ce qui existe déjà et est bien structuré**, ou **inventent** en l'absence de source fiable identifiable. Le vide n'est pas "les IA refusent de parler de codes promo" — c'est "personne d'autoritaire et de frais n'a occupé la niche parrainage (vs coupon générique)".

**Sources consultées (WebSearch)** :
- https://www.glbgpt.com/hub/perplexity-discount-code-2025/
- https://simplycodes.com/store/perplexity.ai
- https://simplycodes.com/store/chatgpt.com
- https://simplycodes.com/store/gemini.com
- https://www.wethrift.com/perplexity-ai
- https://www.dontpayfull.com/at/perplexity.ai
- https://blog.nachonacho.com/best/chatgpt-promo-codes/
- https://news.ycombinator.com/item?id=46911773 (chatbot ayant hallucine un code de reduction)
- https://news.ycombinator.com/item?id=46911128
- https://cybernews.com/ai-news/chatgpt-shopping-results-scam-websites/
- https://aardwolfsecurity.com/customer-talks-ai-chatbot-into-80-discount-on-8000-order/
- https://ftxidentity.com/scam-fraud-watch/2026/04/ai-coupon-fraud/

---

## 2. Trois canaux possibles — comparaison et réalisme

| Canal | Comment ça marche | Portée / réalisme grand public aujourd'hui | Effort / dépendance | Verdict |
|---|---|---|---|---|
| **(a) Index/citations du moteur de réponse** — contenu web crawlé, structuré, cité dans la réponse générée | Publier des pages "1 entité = 1 marque parrainée, codes vérifiés, date de dernière vérification" en Schema.org (`Offer`, `DiscountOffer` non-standard mais `Offer.priceSpecification`), FAQ extractible, listes fraîches. L'IA (ChatGPT avec navigation, Perplexity, Google AI Overviews) crawle, sélectionne le passage, cite ou paraphrase avec lien | **Universel** : touche tout utilisateur d'IA grand public sans action de sa part (il ne configure rien) | Modéré : SEO/GEO classique + discipline de fraîcheur (codes vérifiés en continu) — c'est un métier de contenu + vérification, pas un métier d'infra | **Canal principal recommandé** |
| **(b) Serveur MCP branché par l'utilisateur** | L'utilisateur (ou son client IA) connecte un serveur MCP tiers exposant un outil `get_referral_code(brand)`. Ça suppose que Léa configure elle-même un connector MCP dans ChatGPT/Claude Desktop, ou qu'OpenAI/Anthropic/Google le propose en 1 clic dans un annuaire grand public | **Quasi nul en B2C** : MCP a explosé côté développeurs (97M+ téléchargements SDK/mois, +970x en 18 mois, 41% des orgs logicielles en prod, 28% du Fortune 500) mais "l'adoption grand public reste limitée" et "la plupart des marketeurs n'en ont jamais entendu parler" (sources ci-dessous). Aucun signal d'un grand public qui installe des connectors MCP pour du shopping | Élevé côté conception (protocole, hébergement, auth) mais **inutile tant que le grand public ne branche rien** | **Pas un canal d'acquisition B2C à court terme** — brique pro/agentique à construire en parallèle, pas en priorité 1 |
| **(c) Extension navigateur / GPT personnalisé / connector natif de plateforme** | Un GPT Store custom GPT, une extension Chrome, un connector officiel listé par OpenAI/Google (ex. ChatGPT Apps, Gemini Extensions) que l'utilisateur active depuis un catalogue in-app | **Intermédiaire** : plus accessible qu'un MCP auto-hébergé (catalogue in-app, 1 clic), mais suppose que l'utilisateur sache qu'il doit chercher/activer un plugin AVANT de poser sa question — comportement encore rare pour une requête ponctuelle "code promo" | Modéré : dépend des règles d'admission de chaque plateforme (review OpenAI/Google), mais réutilise la même donnée que le MCP server une fois construit | Canal secondaire opportuniste, à activer une fois le catalogue construit — pas un point de départ |

**Comparaison synthétique** : (a) est le seul canal qui touche l'utilisateur passif ("Léa" ne fait rien de spécial, elle pose juste sa question) — c'est la définition même du GEO. (b) et (c) supposent une action de configuration préalable par l'utilisateur ou la plateforme, qui n'a aucune raison de se produire spontanément pour une requête de code promo grand public en 2026. **Implication directe** : construire le MCP server (déjà en cours côté Emmanuel) a de la valeur — mais comme **infrastructure de données interne réutilisable** (une même base de codes vérifiés peut alimenter à la fois le contenu web publié ET un futur MCP server), pas comme pari sur un canal de distribution grand public autonome.

**Sources consultées (WebSearch)** :
- https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
- https://www.digitalapplied.com/blog/mcp-97-million-downloads-model-context-protocol-mainstream
- https://knak.com/blog/mcp-adoption-in-2026-what-marketers-need-to-know/
- https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/
- https://mcpmanager.ai/blog/mcp-adoption-statistics/
- https://learn.microsoft.com/en-us/dynamics365/commerce/commerce-mcp
- https://apify.com/viralanalyzer/cj-affiliate-products/api/mcp
- https://mcpmarket.com/server/amazon-affiliate
- https://blog.affiliate.com/mcp-integration-for-ai-shopping/
- https://blog.affiliate.com/mcp-for-affiliate-commerce/
- https://github.com/andrehocsis/rally-mcp-server

---

## 3. Concurrence sur la visibilité IA pour les codes promo

**Qui est déjà cité aujourd'hui** (constat direct issu du WebSearch — les résultats renvoyés PAR le moteur de recherche pour "code promo X" sont un proxy fiable de ce qu'un moteur de réponse avec navigation va reprendre) :

- **Agrégateurs de coupons généralistes, très actifs en structuration/fraîcheur** : SimplyCodes, WorthEPenny, Wethrift, DontPayFull, Tenereteam, Dealspotr, Krater.ai, GlobalGPT, CouponChief, Desidime. Points communs : mise à jour datée ("Jul 2026"), liste de codes avec taux affiché, mention explicite du nombre de codes trackés/vérifiés ("203 codes trackés", "vérifié manuellement") — exactement le format extractible que le GEO recommande.
- **Reddit / forums** : source majoritaire pour Perplexity (~47% des citations) — les threads "deal hunters" (r/deals, r/frugal) et équivalents jouent un rôle disproportionné que les sites de marque ignorent généralement.
- **Acteurs "codes de parrainage" classiques** (contexte projet, non re-vérifiés par WebSearch dédié ce tour-ci) : Dealabs, iGraal, Rakuten, Poulpeo, Capital Koala, Honey/PayPal — leur présence dans les citations IA reste à auditer spécifiquement lors d'une prochaine itération (baseline GEO à faire pour la marque une fois nommée).
- **Absence notable** : aucun acteur identifié dans cette recherche n'est positionné spécifiquement sur "codes de **parrainage**" (par opposition aux codes de réduction ponctuels) comme source citée par IA — c'est un **angle mort de la concurrence actuelle**, cohérent avec l'hypothèse de différenciation du projet.
- Le rapport impact.com souligne que les placements affiliés historiquement les mieux payés (listing coupon-site, bannières) "créent peu de contenu qu'un modèle IA traiterait comme source faisant autorité" — confirmant que la niche est gagnable par un acteur qui investit vraiment dans la structuration, pas seulement dans le volume de codes.

**Sources consultées (WebSearch)** :
- https://impact.com/affiliate/generative-engine-optimization-affiliate-strategy/
- https://llmrefs.com/generative-engine-optimization
- https://searchengineland.com/what-is-generative-engine-optimization-geo-444418
- https://www.wethrift.com/perplexity-ai
- https://simplycodes.com/store/chatgpt.com

---

## 4. Stratégie GEO recommandée pour devenir la source citée

1. **Entity-first, pas page-first** : chaque marque parrainée = 1 page canonique "Code de parrainage [Marque] — vérifié le [date]" avec `mainEntityOfPage`, Schema.org `Offer` (priceSpecification, validFrom/validThrough), `sameAs` vers les profils officiels. Cluster de contenu par catégorie (VPN, banques, box repas) pour couvrir toutes les facettes.
2. **Passage-level extractible** : réponse directe dans les 40-60 premiers mots ("Le code de parrainage [Marque] actif au [date] est X, il offre Y"), zéro langage promotionnel, 1 claim vérifiable par 150-200 mots. Format définition directe > Q&A > liste — pas de narratif marketing.
3. **Fraîcheur comme avantage concurrentiel structurel** : contenu < 2 mois = +28% de citations (repère GEO général) ; sur une catégorie où les codes expirent en jours, un timestamp "vérifié il y a X heures/jours" visible et vrai est LE signal différenciant vs agrégateurs qui republient sans re-vérifier. Vérification automatisée (le code fonctionne-t-il encore ?) = argument d'autorité central du projet.
4. **Off-site / autorité tierce** : présence Reddit/forums français équivalents (là où Perplexity pioche), earned media (presse conso, comparateurs), profils knowledge graph dès que la marque existe (Wikidata si pertinent à terme).
5. **llms.txt** à la racine du futur site vitrine dès son lancement (coût quasi nul, adopté par Anthropic/Stripe/Cloudflare) — pointer vers les pages entités structurées.
6. **Le MCP server comme brique d'autorité, pas de distribution** : exposer publiquement (doc, GitHub) un MCP server "codes de parrainage vérifiés" renforce la légitimité technique/AEO-native de la marque et sert de canal pro (agences, devs d'agents, futurs plugins ChatGPT Apps/Gemini Extensions) — mais son ROI d'acquisition B2C direct est nul tant que le grand public ne configure pas de connectors. Documenter cette limite dans toute communication interne pour ne pas sur-vendre le canal.
7. **Monitoring hebdomadaire obligatoire** (standard @geo) : soumettre 2-3 prompts test ("code parrainage [marque]", "meilleur code promo pour [catégorie]") sur ChatGPT/Perplexity toutes les semaines dès qu'un contenu est publié, documenter cité/non cité/exactitude dans `docs/geo/geo-monitoring-setup.md` (à produire lors de la phase build, hors périmètre de cette étude de faisabilité).

---

## Verdict tranché — MCP grand public vs contenu web cité

**NO-GO sur "MCP grand public = canal d'acquisition principal" à court terme (12-18 mois).** Les données 2026 sont sans ambiguïté : MCP est une success story développeur/entreprise (97M+ téléchargements SDK, 970x en 18 mois, 41% des orgs logicielles, 28% Fortune 500) mais "l'adoption grand public reste limitée" et la plupart des acteurs marketing n'en ont même pas connaissance. Aucun signal que "Léa, 29 ans" configurera un connector MCP pour chercher un code promo — l'action de configuration préalable est une friction qui tue le cas d'usage grand public par nature impulsif ("je veux le code MAINTENANT").

**GO sur le contenu web structuré/cité comme canal principal**, parce que c'est le seul qui capte l'utilisateur passif — exactement le comportement observé aujourd'hui (les IA citent déjà des agrégateurs de coupons structurés pour ce type de requête). La niche "code de **parrainage** vérifié et frais" est un angle mort concurrentiel identifié dans cette étude, donc gagnable avec une exécution GEO disciplinée (fraîcheur + vérification + structure).

**Le MCP server garde de la valeur, mais recalibrée** : (1) infrastructure de données interne réutilisable pour publier le contenu web ET pour un futur canal pro, (2) brique de différenciation technique/crédibilité AEO-native vis-à-vis d'un futur partenariat (agences GEO, plateformes qui listent des connectors officiels), (3) pari à réévaluer si un acteur (OpenAI, Anthropic, Google) lance un catalogue de connectors grand public en 1 clic — signal à surveiller, pas hypothèse de travail actuelle. Recommandation opérationnelle : lancer le contenu web structuré (Google Sheet → pages) EN PARALLÈLE du MCP server d'Emmanuel, sans faire dépendre le succès du POC de l'adoption MCP grand public.

---

## Gates BLOQUANT vérifiées

- **G5** (persona, Grep du nom) : PASS — persona "Léa" utilisé section verdict et diagnostic, aligné project-context.md
- **G7** (0 contradiction avec livrables amont) : PASS — aucun livrable GEO amont existant ; cohérent avec project-context.md (hypothèse MCP "piste privilégiée" nuancée, pas contredite : reclassée en brique secondaire avec argumentation sourcée)
- **G12** (implémentable : verbe + objet + critère de done) : PASS — section 4 = actions concrètes (publier pages entités Schema.org, llms.txt, monitoring hebdo prompts test)
- **G15** (0 placeholder) : PASS — Grep effectué, aucun `[À REMPLIR`/`[PLACEHOLDER`/`[TODO` résiduel ; seuls `[HYPOTHÈSE]`/concurrents non re-vérifiés sont signalés explicitement comme tels
- **G17** (non copiable tel quel par un concurrent) : PASS — verdict et angle mort concurrentiel ("codes de parrainage" vs "codes promo génériques") spécifiques à ce projet

---

## Hypothèses à valider

- **[HYPOTHÈSE]** Présence de Dealabs/iGraal/Rakuten/Poulpeo/Capital Koala/Honey dans les citations IA — non re-vérifiée par WebSearch dédié dans cette étude (à faire en baseline GEO dès que la marque est nommée, cf. protocole d'entrée @geo).
- **[HYPOTHÈSE]** Comportement exact de Claude (Anthropic) sur une requête directe "code promo/parrainage X" — les WebSearch de cette étude ont surtout documenté ChatGPT/Perplexity/Gemini côté résultats indexés ; test direct en conversation Claude à faire en G_PROOF de la prochaine itération.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/geo/faisabilite-geo-parrainage-ia.md`
- Décisions prises : verdict NO-GO sur "MCP grand public = canal principal d'acquisition B2C" à 12-18 mois ; GO sur contenu web structuré/cité comme canal principal ; MCP server maintenu comme brique data interne + canal pro secondaire, pas comme hypothèse de croissance B2C
- Points d'attention : baseline GEO complète (prompts de test sur les 4 LLM avec la marque une fois nommée) à faire dès que le nom de marque et les premières pages sont publiés ; concurrents classiques (Dealabs, iGraal, Rakuten...) non re-audités spécifiquement sur la visibilité IA — à faire dans une prochaine itération ; fréquence monitoring = hebdomadaire dès publication de contenu
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (étude de faisabilité, pas de code produit).
---
