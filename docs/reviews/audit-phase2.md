<!-- Version: 2026-07-20 — @reviewer — AUDIT PHASE 2 (scorecard /10 par point clé, demande fondateur) -->

# Audit Phase 2 (autopilot) Parrainly — scorecard /10

## Verdict global : 8/10 — GO Phase 3 / NO-GO mise en ligne publique (3 blockers)

Le socle est un vrai V1 fidèle aux specs : posture factuelle tenue (zéro « meilleur »/promesse de rendement dans le rendu), divulgation d'affiliation au-dessus du CTA, différenciateur AEO/GEO livré (miroir JSON, JSON-LD, llms.txt, API v1), lien de parrainage personnel jamais exposé, personas obsolètes (Léa, Karim) purgés du code.

## Vérifié (G_PROOF — Grep de contrôle réels)
```
Grep "—" src/app                     -> 23 fichiers, TOUS en commentaires JSX/JSDoc (non rendus)
Grep -i "meilleur|rendement garanti" src -> 3 hits, TOUS en disclaimer/négation
Grep "Léa|Karim" src                 -> 0 match (personas obsolètes purgés)
Grep "url_parrainage" src/lib/ai     -> 1 hit = commentaire de garde (jamais sérialisé)
```

## Scorecard (trié par priorité, plus urgent en haut)

| Prio | Point | Note | Écarts pour 10/10 | Agent |
|---|---|---|---|---|
| 1 | P1-b Analytics | 7/10 | Sink réel (PostHog serveur/Plausible client), events client instrumentés, 3 events déclarés non émis, dédup+seuil signalement, `lien_priorite_reverification` | @data-analyst + @fullstack |
| 2 | P1-c Légal | 7/10 | Email de contact rendu = placeholder `[à compléter]` (G15, blocker mise en ligne), réf morte `10-handoff.md`, tirets cadratins des drafts .md | @legal + @fullstack |
| 3 | Socle backend | 8/10 | Fail-closed `/internal` en prod (actuellement fail-open si clé absente), rate-limit sur attribution publique (épuisement quota T&E), dédup signalement US-06 crit.7 | @fullstack + @infrastructure |
| 4 | Socle frontend | 8/10 | Email de contact, bandeau risque Trade Republic (`[À VALIDER]`, produit d'investissement), décompte zones accueil vs compositions | @fullstack + @design + @legal |
| 5 | QA | 8/10 | E2E US-02/05/07, tests sécurité (fail-closed, anti-abus), screenshots états CTA (empty/error), a11y | @qa |
| 6 | Auth + parrain | 9/10 | `middleware.ts` (défense en profondeur), consommation token atomique, émettre `session_parrain_expiree` | @fullstack |
| 7 | Couche AEO | 9/10 | `llms.txt` en UTF-8 accentué, confirmer exclusions robots/sitemap | @geo/@ia |
| 8 | Infra | 9/10 | Grep anti-placeholder FR (`\[.*à compléter\]`) dans la CI, `deploy.yml` Cloudflare | @infrastructure |

## 3 blockers stricts AVANT mise en ligne publique (pas avant Phase 3)
1. Placeholder « [adresse email de contact à compléter] » rendu sur `cgu` et `divulgation` (G15).
2. Analytics stub `console.log` : le NSM (PCA-IA) n'est pas mesurable dans un outil requêtable.
3. Sécurité : `/internal/*` fail-open en prod + endpoint d'attribution public sans rate-limit.

## Détail des notes

**1. Analytics 7/10** — Documents excellents (27 events, resync propre). Code faible : `src/lib/analytics.ts` = stub console, ~14/27 events émis, tous les events client absents, 3 events du type `SocleEvent` jamais émis (`attribution_parrain_exclu`, `lien_invalide_detecte`, `session_parrain_expiree`).

**2. Légal 7/10** — 11/11 textes + 9/9 fiches, sources en tête, verdicts TR/Kraken documentés. Écarts : email placeholder rendu (`cgu/page.tsx:79`, `divulgation/page.tsx:50`), réf `10-handoff.md` absente (`00-index.md:36`), 32 tirets cadratins dans les drafts .md.

**3. Infra 9/10** — Tailwind fidèle aux tokens (3 tiers), CI complète (typecheck/lint/anti-placeholder/build/unit/e2e). Écarts : grep anti-placeholder ne couvre pas le FR, pas de `deploy.yml`.

**4. Backend 8/10** — Arbitrage FIFO déterministe atomique, freshness fail-safe, seuils 100% configurables. Écarts sécurité : fail-open `/internal` (renvoie true si clé absente), attribution publique sans rate-limit (dédup double-clic seulement côté client), signalement sans dédup.

**5. Frontend 8/10** — 10 zones, divulgation avant CTA, RiskBanner conditionnel (ambre jamais rouge), CTA 5 états, persona A1/A2. Screenshots PRO/BEAU/BRAND-ALIGNED. Écarts : email placeholder visible, bandeau risque TR absent (Finance perso hors `RISK_CATEGORIES` alors que courtage/ETF/PEA).

**6. AEO 9/10** — Le plus solide. `url_parrainage` jamais exposé, divulgation+risque embarqués dans JSON + JSON-LD, llms.txt depuis DB. Écart : llms.txt normalisé ASCII.

**7. Auth 9/10** — Magic-link robuste (usage unique, expiration, allowlist T&E avant génération, hash SHA-256, cooldown), cookie httpOnly/secure/sameSite=strict, IDOR bloqué (403 cross-parrain). Écarts : pas de `middleware.ts`, consommation token non atomique, `session_parrain_expiree` non émis.

**8. QA 8/10** — Unit (arbitrage/freshness/auth/conversion) + E2E (US-01/06/09/auth). Écarts : pas d'E2E US-02/05/07, pas de tests sécurité (non implémentés), états CTA non capturés, pas d'a11y.

## Angles morts (objectif 6 mois)
- Test empirique de citation IA jamais exécuté (trou hérité 6/6) : le différenciateur AEO n'a de valeur que vérifié en conditions réelles. À planifier Phase 3.
- Arbitrage juridique Trade Republic / Kraken (diffusion publique) reporté à la revue finale par décision pilote #3.

---
**Handoff → @orchestrator** — GO Phase 3 / NO-GO mise en ligne. Itérations à lancer par priorité (voir scorecard). Anti-abus de l'attribution publique = risque d'épuisement du quota T&E (fondation du modèle de rotation), à traiter.
