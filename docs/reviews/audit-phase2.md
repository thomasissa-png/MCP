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

---
---

<!-- Version: 2026-07-20 (soir) — @reviewer — RE-VÉRIFICATION FINALE des itérations 10/10 -->

# Addendum — Re-vérification finale (2026-07-20)

## Verdict global re-noté : 9,7/10 — GO Phase 3 confirmé. Les 3 blockers de mise en ligne sont levés.

Re-vérification par Read/Grep réels des fichiers cités (pas sur parole). Résultat : 7 points sur 8 confirmés 10/10, code réellement en place. Un seul résidu réel : les screenshots de la page-offre Trade Republic sont PÉRIMÉS (ils précèdent le correctif Point 4, donc n'affichent pas le bandeau de risque que le code rend pourtant). Plus une coquille cosmétique légale non bloquante.

## Tableau des notes avant -> après

| # | Point | Avant | Après | Confirmé 10/10 ? | Résidu précis |
|---|---|---|---|---|---|
| 1 | Analytics | 7/10 | 10/10 | OUI | — |
| 2 | Légal | 7/10 | 10/10 | OUI (blockers levés) | Coquille cosmétique : bannière `LegalShell.tsx:14` évoque encore « champs entre crochets restent à compléter » alors qu'aucun crochet n'est rendu (replis factuels). Reformuler ou retirer la clause « entre crochets ». Non bloquant. |
| 3 | Sécurité backend | 8/10 | 10/10 | OUI | — |
| 4 | Frontend | 8/10 | 10/10 | OUI (code) | Code correct : Trade Republic déclenche le bandeau via sous-catégorie « courtage ». La preuve visuelle est portée par le Point 5 (screenshots périmés). |
| 5 | QA | 8/10 | 9/10 | NON | Screenshots `page-offre-trade-republic-*.png` (mobile ET desktop) PÉRIMÉS : ils ne montrent pas le bandeau ambre de risque que le code actuel rend en Zone 5. À régénérer pour prouver visuellement le correctif Point 4. Fichiers de test E2E US-02/05/07 + a11y + sécurité présents. |
| 6 | AEO | 9/10 | 10/10 | OUI | — |
| 7 | Auth + parrain | 9/10 | 10/10 | OUI | — |
| 8 | Infra | 9/10 | 10/10 | OUI (in-scope) | `deploy.yml` Cloudflare toujours absent mais légitimement différé (aucune cible CF provisionnée) : tâche de mise en ligne, pas un blocker Phase 3. |
| a11y | badge vérifié | 4,52:1 | 10/10 | OUI | verified-800 `#0A5449` en place (`globals.css:33`, 7,7:1). |

## Détail des re-vérifications (évidences réelles)

**1. Analytics 10/10** — Sink serveur réel `posthog-node` avec repli JSON stdout, jamais bloquant (`analytics.ts:14,66-80`). Client gaté sur consentement CNIL (`analytics-client.ts:49-50`). Les 3 events serveur autrefois déclarés-non-émis sont désormais émis dans de vrais chemins : `attribution_parrain_exclu` (`attribution.ts:185`), `lien_invalide_detecte` (`attribution.ts:254`), `session_parrain_expiree` (`auth.ts:157`). `lien_priorite_reverification` émis au seuil (`signalement/route.ts:68`). Events client instrumentés : `page_offre_vue` + `dashboard_parrain_vu` via `TrackOnMount`, `lien_parrainage_demande/genere/echec` + `offre_indisponible_affichee` (`OfferCta.tsx`), `dashboard_parrain_erreur` (`error.tsx`), `demande_rgpd_soumise` (`rgpd/demande/page.tsx`).

**2. Légal 10/10** — Tirets cadratins : 1 occurrence par fichier dans `docs/legal/textes/` et `fiches-conformite/`, TOUTES dans le commentaire d'en-tête `<!-- Version ... -->` (métadonnée interne non rendue). Corps rendu = 0. `10-handoff.md` créé et référencé (`00-index.md:36`). Email de contact configurable sans crochet (`LegalContact.tsx` : mailto si `LEGAL_CONTACT_EMAIL`, sinon lien vers `/rgpd/demande`). Mentions légales §1-3 configurables avec repli factuel (`mentions-legales/page.tsx:15-37`, `LEGAL_EDITOR_NAME/PUBLICATION_DIRECTOR/HOST`). Grep `\[.*à compléter\]` dans `src/` = 0 match.

**3. Sécurité 10/10** — `/internal/*` fail-closed en prod (`internal-auth.ts:18-21` : clé absente + prod -> 401). Rate-limit + 429 + `Retry-After` sur l'attribution publique (`attribution/route.ts:48-52`), dédup serveur attribution (`:59-83`) et signalement (`signalement/route.ts:45-54`). Seuils 100% configurables (`config/socle.ts:60-90`).

**4. Frontend 10/10 (code)** — `riskTextForOffre` (`offres.ts:81`) détecte l'investissement hors catégorie de tête via sous-catégorie/tags (`INVESTMENT_SIGNALS` inclut « courtage »). Trade Republic (« Finance personnelle » / « Néobanque & Courtage ») retourne donc le texte de risque investissement, rendu par `RiskBanner` (composant ambre visible, `page.tsx:112-116`). `[À VALIDER]` retiré (grep 0 dans `src/`).

**5. QA 9/10** — E2E `us-02/us-05/us-07`, `a11y.spec.ts` (axe-core), `security-internal.spec.ts` présents. Screenshots états CTA (`cta-empty-*`, `cta-error-*`) sur 3 devices présents. **Résidu** : `page-offre-trade-republic-mobile/desktop.png` lus visuellement — ils n'affichent PAS le bandeau ambre de risque, alors que le code actuel le rend. Screenshots périmés (capturés avant le correctif Point 4) : à régénérer pour prouver visuellement le bandeau Trade Republic.

**6. AEO 10/10** — `llms.txt` en UTF-8 accentué (`llms.txt/route.ts:29` : « néobanque », « investissement », « trésorerie »).

**7. Auth 10/10** — `middleware.ts` (racine) couvre `/parrain/:path*` + `/api/v1/admin/:path*` (matcher `:50-52`), pages publiques exemptées, 401 JSON sur API. Consommation token atomique (`auth.ts:118-121` : `UPDATE ... WHERE consumed_at IS NULL`, `changes !== 1` -> `consumed`). `session_parrain_expiree` émis.

**8. Infra 10/10** — Grep anti-placeholder FR ajouté à la CI (`ci.yml:47-50` : crochet + « à compléter/à remplir/à définir » -> exit 1). `deploy.yml` différé (aucune cible CF).

## Preuve visuelle (walkthrough screenshots)
Accueil (desktop/mobile) et page-offre Trade Republic lus. Rendu PRO, BRAND-ALIGNED (sceau vérifié cobalt/teal), AÉRÉ, hiérarchie claire, divulgation au-dessus du CTA, disclaimer risque en pied. Réserve unique : bandeau ambre Trade Republic absent des screenshots (périmés, cf. Point 5) — le code le rend.

## Vérifié (G_PROOF — Grep/Read de contrôle réels)
```
Grep "—" docs/legal/textes            -> 10 fichiers, 1 hit chacun, TOUS ligne 1 <!-- Version --> (non rendu). Corps=0
Grep "—" docs/legal/fiches-conformite -> 10 fichiers, 1 hit chacun, en-tête <!-- Version --> uniquement
Grep "\[.*à compléter\]" src/ (-i)    -> No matches found
Grep url_parrainage src/lib/ai        -> 1 hit = public-offre.ts:6 (commentaire de garde, jamais sérialisé)
Grep events serveur émis              -> attribution.ts:185 / attribution.ts:254 / auth.ts:157 / signalement/route.ts:68
Grep 429 + rateLimit                  -> attribution/route.ts:48,52 ; magic-link/route.ts:51
Read internal-auth.ts:18              -> IS_PRODUCTION && !clé -> return false (fail-closed)
Read middleware.ts:50-52              -> matcher ['/parrain/:path*','/api/v1/admin/:path*']
Read auth.ts:118-121                  -> UPDATE ... WHERE consumedAt IS NULL ; changes!==1 -> consumed (atomique)
Read offres.ts:46,81-90               -> INVESTMENT_SIGNALS['courtage'] -> Trade Republic déclenche RiskBanner
Read globals.css:33                   -> --color-verified-fg: #0A5449 (verified.800, 7,7:1)
Read ci.yml:47-50                     -> grep FR crochet/à compléter -> exit 1
Read screenshots page-offre-TR *      -> PÉRIMÉS : bandeau ambre absent alors que le code le rend
```

## Recommandation
**GO Phase 3.** Les 3 blockers stricts de mise en ligne sont levés (email placeholder, stub analytics, fail-open sécurité). Résidus non bloquants pour Phase 3 : (1) régénérer les screenshots page-offre Trade Republic (@qa) ; (2) reformuler la bannière `LegalShell.tsx:14` (@fullstack). À traiter avant mise en ligne publique, hors chemin critique Phase 3. Rappel des tâches de mise en ligne (déjà connues, non régressions) : renseigner `LEGAL_CONTACT_EMAIL`/éditeur/hébergeur, arbitrer CGU Trade Republic + Kraken (décision pilote #3), `deploy.yml` Cloudflare, test empirique de citation IA.
