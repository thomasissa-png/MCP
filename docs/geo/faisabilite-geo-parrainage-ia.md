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
