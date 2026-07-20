<!-- Version: 2026-07-20T00:00 — @data-analyst — KPI Framework Phase 0 (NSM définitif + arbre de métriques marketplace à rotation) -->

# KPI Framework — Parrainage-IA

## Résumé exécutif

- NSM définitif : **Parrainages Confirmés d'origine IA (PCA-IA) par mois**, version resserrée du provisoire de project-context.md (ajout du critère "origine IA détectée", indispensable car le canal actuel `page_web`/`api_json` de functional-specs.md ne distingue pas une visite venue d'une citation IA d'une visite directe au catalogue).
- Arbre à 5 métriques d'entrée couvrant tout le funnel : citation → clic attribué → lien généré → conversion confirmée → disponibilité du pool.
- Métriques déclinées par face (Léa / Karim) + 2 garde-fous de fraîcheur (liens morts, latence de détection), alignés brand-platform.md (preuve "Fraîcheur") et US-04/US-06.
- Cibles chiffrées : 2 benchmarks sourcés (WebSearch, cette session) utilisables comme point de repère, le reste marqué `[À DÉFINIR APRÈS POC]` — trafic attendu actuel = 0 (stade idée), toute cible de conversion serait inventée (G13).
- Gap détecté et signalé à @product-manager : functional-specs.md ne contient AUCUN event de confirmation de conversion (`attribution_confirmee`) alors que c'est l'événement qui alimente directement le NSM — traité en détail dans tracking-plan.md §2.

---

## 1. KPI North Star définitif

### 1.1 Le provisoire, challengé

Version project-context.md : "nombre de parrainages confirmés attribués à une réponse IA / mois". Le principe est bon (valeur réelle, pas de vanité) mais la formule manque un élément opérationnel : **rien dans le modèle de données (Attribution, product-vision.md §4) ne code aujourd'hui "attribué à une réponse IA"** — le seul champ disponible est `canal_source` (`page_web` | `api_json`, US-01 payload), qui dit COMMENT la requête est arrivée techniquement, pas SI elle vient d'une citation IA. Une visite directe au catalogue (Léa tape l'URL sans passer par une IA) passerait aussi par `page_web`.

**Correction apportée** : ajouter une propriété dérivée `origine_detectee` (voir tracking-plan.md §1) calculée à la génération du lien à partir du referrer/UTM capturés sur `page_offre_vue`. C'est ce qui rend le NSM mesurable, pas juste désirable.

### 1.2 Définition précise

**Parrainages Confirmés d'origine IA (PCA-IA)** : nombre d'Attributions passées au statut `confirmée` sur le mois, dont l'Attribution est rattachée à une session dont l'origine détectée est une plateforme de réponse IA (ChatGPT, Perplexity, Gemini, Claude, Copilot) plutôt qu'un accès direct/autre canal.

### 1.3 Formule de calcul

```
PCA-IA (mois M) = COUNT(
  Attribution
  WHERE statut = "confirmée"
  AND date_confirmation ∈ mois M
  AND origine_detectee ∈ {chatgpt, perplexity, gemini, claude, copilot, ia_non_identifiee}
)
```

`ia_non_identifiee` = detection heuristique positive (mention explicite "code de parrainage EDF" dans un paramètre de requête interne, session sans referrer mais token cliqué dans une fenêtre de temps cohérente avec une réponse IA) sans plateforme formellement identifiée — cf. limites de l'attribution en tracking-plan.md §2.4.

### 1.4 Fréquence de mesure

- **Mensuelle** (fréquence nominale du NSM, alignée sur le cycle de versement de commission).
- **Hebdomadaire** en dashboard Ops pendant le POC (volumes faibles, besoin de réagir vite à un premier signal — cf. protocole trafic < 1000 visiteurs/mois, `.claude/agents/data-analyst.md` Escalade).

### 1.5 Pourquoi ce n'est pas une vanity metric

1. **Déclenche une action financière réelle** : une Attribution `confirmée` = commission calculée (product-vision.md §3) et prime versée à Karim. Ce n'est pas un proxy, c'est directement corrélé au chiffre d'affaires.
2. **Capture les deux faces** : impossible d'augmenter le NSM sans (a) que l'IA cite réellement une fiche ET (b) qu'un parrain réel absorbe la conversion dans son quota. Un NSM qui n'augmente que côté trafic (ex. `page_offre_vue`) serait de la vanité ; celui-ci exige la boucle complète.
3. **Valide la thèse centrale du projet** : brand-platform.md positionne la marque comme "la source que les IA citent" — le PCA-IA est la seule métrique qui prouve que cette citation se traduit en valeur, pas seulement en visibilité (le risque identifié par @growth §3.3 et repris par @reviewer comme trou n°1 : G_PROOF empirique de distribution non exécuté).
4. **Actionnable par tous les agents aval** : @geo/@seo agissent sur le taux de citation (input metric 1), @growth sur le volume de clics attribués (input metric 2), @fullstack/@ux sur le taux de conversion clic→lien (input metric 3), @data-analyst/@ia sur la disponibilité du pool (input metric 4/5).

---

## 2. Arbre de métriques

```
                     PCA-IA (NSM, mensuel)
                              |
   ┌───────────────┬──────────────────┬───────────────────┬────────────────────┐
   |               |                  |                    |                    |
1. Taux de     2. Clics         3. Taux de           4. Taille et         5. Taux de
   citation IA    attribués         conversion            fraîcheur du         disponibilité
                  depuis IA         clic→confirmée        pool de parrains     du catalogue
```

| # | Métrique d'entrée | Définition | Formule | Owner |
|---|---|---|---|---|
| 1 | Taux de citation IA | % de requêtes-test (prompts type "code de parrainage EDF") où une IA cite une fiche du registre | `COUNT(prompts-test avec citation) / COUNT(prompts-test envoyés)` — mesuré par audit manuel/outil de citation tracking, pas par un event produit (l'IA est hors de notre système) | @geo / @seo |
| 2 | Clics attribués depuis IA | Volume de `page_offre_vue` avec `origine_detectee` ≠ direct/autre, par semaine | `COUNT(page_offre_vue WHERE origine_detectee = IA)` | @growth |
| 3 | Taux de conversion clic → confirmée | % des sessions d'origine IA qui aboutissent à une Attribution confirmée | `COUNT(Attribution confirmée, origine IA) / COUNT(page_offre_vue, origine IA)` | @product-manager / @fullstack (funnel produit) |
| 4 | Taille et remplissage du pool de parrains actifs | Nombre de parrains au statut `actif` par offre / cible de pool (cf. métriques par face §3) | `COUNT(Parrain actif, offre X) / pool_cible(offre X)` | @data-analyst / @ia |
| 5 | Taux de disponibilité du catalogue | % du temps où une offre n'est PAS au statut "en attente de parrain" (US-04) | `1 − (durée cumulée statut "en attente de parrain" / durée totale de la période)` | @data-analyst / @fullstack |

### Sous-métriques (2e niveau, actionnables directement)

- **Sous 1** : taux de citation par enseigne (identifie les fiches à prioriser en GEO), fraîcheur perçue par l'IA (date de dernière vérification citée ou non dans la réponse).
- **Sous 2** : répartition par plateforme IA (`origine_detectee`), taux de clic depuis citation (benchmark sourcé §4).
- **Sous 3** : taux d'échec de génération de lien (`lien_parrainage_echec` / `lien_parrainage_demande`), taux de signalement de lien mort (`lien_signale` / Attribution générées).
- **Sous 4** : équité de rotation (écart entre parrains sur le nombre d'attributions reçues sur une période — cf. §3), délai moyen de validation d'une soumission (US-02/US-07).
- **Sous 5** : nombre d'offres en rupture cumulées par mois, délai moyen de retour en disponibilité.

---

## 3. Métriques par face (marketplace deux faces)

### 3.1 Côté demandeur (Léa)

| Métrique | Définition | Formule | Owner |
|---|---|---|---|
| Taux de citation IA par enseigne | Cf. arbre #1, décliné par enseigne | Voir §2 | @geo |
| Clics attribués (volume + %) | Cf. arbre #2 | Voir §2 | @growth |
| Taux de conversion lien généré → confirmée | Sur la seule cohorte de liens générés (isole la partie "après clic", hors visibilité IA) | `COUNT(confirmée) / COUNT(lien_parrainage_genere)` | @product-manager |
| Temps de génération de lien | SLA produit (US-01 : < 2s) | p50/p95 de la durée entre `lien_parrainage_demande` et `lien_parrainage_genere`/`echec` | @fullstack |
| Taux de signalement de lien mort | Qualité perçue par le demandeur | `COUNT(lien_signale) / COUNT(lien_parrainage_genere)` | @data-analyst |

### 3.2 Côté parrain (Karim)

| Métrique | Définition | Formule | Owner |
|---|---|---|---|
| Parrains actifs par offre | Volume du pool disponible | `COUNT(Parrain statut=actif, offre X)` | @data-analyst |
| Taux de remplissage du pool | Cf. arbre #4 | `parrains actifs / pool_cible` — `pool_cible` `[À DÉFINIR APRÈS POC]` (dépend du plafond par enseigne, lui-même `[À VALIDER]` en product-vision.md §2) | @product-manager |
| Équité de rotation | Dispersion des attributions entre parrains d'un même pool (protège la promesse "Équité", brand-platform.md §4) | Coefficient de variation (écart-type / moyenne) du nombre d'attributions reçues par parrain sur 30 jours glissants ; alerte si > seuil `[À DÉFINIR APRÈS POC]` | @data-analyst |
| Délai moyen de validation de soumission | Vitesse d'entrée dans la rotation | Moyenne de `delai_verification_jours` (event `lien_valide_actif`) | @product-manager |
| Prime moyenne versée / parrain / mois | Valeur perçue par Karim | `SUM(montant_commission) / COUNT(parrains actifs ayant reçu ≥ 1 confirmation)` | @data-analyst |
| Taux de suspension anti-fraude | Santé du pool | `COUNT(Parrain statut=suspendu sur la période) / COUNT(Parrain actif début période)` | @legal / @data-analyst |

### 3.3 Garde-fous de fraîcheur (transversaux)

| Métrique | Définition | Formule | Seuil d'alerte | Action recommandée |
|---|---|---|---|---|
| % de liens morts | Part du catalogue actif signalée ou détectée invalide | `COUNT(lien_invalide_detecte, période) / COUNT(liens actifs)` | `[À DÉFINIR APRÈS POC]` (pas de baseline avant premières données réelles) | Prioriser la re-vérification manuelle (US-06 critère 2), alerter @growth si concentré sur une enseigne (risque de saturation, cf. legal-strategy.md §4) |
| Latence de détection | Temps entre la mort réelle d'un lien et son passage au statut "invalide" | p50/p95 de (`date_statut_invalide` − `date_dernier_signalement_ou_controle`) | `[À DÉFINIR APRÈS POC]` — dépend du seuil de re-tentatives non chiffré (functional-specs.md US-04 critère 2, marqué `[À VALIDER]`) | Si latence croissante, revoir la fréquence du job de fraîcheur (US-04) avant d'ajouter des enseignes |

---

## 4. Cibles chiffrées

**Principe (G13)** : aucune cible n'est inventée. Deux benchmarks sourcés cette session servent de points de repère externes ; ils ne sont PAS des objectifs internes tant que le POC n'a pas produit sa propre baseline (protocole Escalade `.claude/agents/data-analyst.md` : trafic attendu < 1000 visiteurs/mois → pas de cible statistique fiable avant données réelles).

| Métrique | Référence externe sourcée | Application au projet |
|---|---|---|
| Taux de conversion clic → conversion (référence générique parrainage e-commerce) | Médiane 2026 : 3 à 5 % (top quartile jusqu'à 8-9 % selon secteur), sur 3 200 sites Shopify/WooCommerce, Q1 2026 — [ReferralCandy, Referral Program Benchmarks 2026](https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025) | `[HYPOTHÈSE — repère externe, pas une cible]` : notre entonnoir est plus long (citation IA → clic → lien → souscription externe chez l'enseigne, hors de notre contrôle), donc probablement inférieur au 3-5 % on-site classique. Pas de cible chiffrée avant première cohorte réelle. |
| Taux de clic depuis une citation IA | SparkToro (janv. 2026) : seulement 12 à 18 % des citations Perplexity génèrent un clic réel (82-88 % des citations = 0 visite) — [Foundry CRO, Track AI Search Referrals 2026](https://foundrycro.com/blog/tracking-ai-search-referrals/) | Confirme que le vrai goulot d'étranglement du NSM est probablement §2 (clic depuis citation), pas §3 (conversion après clic). Priorité GEO/UX à documenter dans le handoff : maximiser la probabilité que le lien soit ce qui est repris textuellement (voir tracking-plan.md §2, divulgation embarquée + token dans le texte). |
| Part de trafic IA par plateforme | ChatGPT = 76,85 % du trafic référent IA global (avril 2026), avant Gemini (9,0 %), Perplexity (7,7 %), Copilot (3,8 %), Claude (2,7 %) — [Foundry CRO, Track AI Search Referrals 2026](https://foundrycro.com/blog/tracking-ai-search-referrals/) | Prioriser la fiabilité de la détection `origine_detectee` sur ChatGPT en premier (volume dominant) ; ChatGPT ajoute déjà `utm_source=chatgpt.com` depuis juin 2025 (même source), ce qui facilite structurellement notre détection sur ce canal précis — voir tracking-plan.md §2.2. |

**Cibles internes** (PCA-IA absolu, taux de remplissage du pool, taux de disponibilité, seuils d'alerte fraîcheur) : `[À DÉFINIR APRÈS POC]`. Recommandation : fixer la première cible chiffrée après 4-6 semaines de données réelles issues du test de distribution Temps 0 (`docs/project-synthesis.md`), pas avant.

---

## Hypothèses à valider

- `[À DÉFINIR APRÈS POC]` Toutes les cibles internes (PCA-IA absolu par mois, taux de remplissage de pool par enseigne, seuils d'alerte fraîcheur/équité) : aucune donnée de trafic réel disponible au moment de ce livrable (stade idée, 0 visiteur).
- `[À VALIDER]` `pool_cible` par enseigne (§3.2) dépend directement du plafond par enseigne, lui-même non chiffré tant que la fiche de conformité légale par programme n'est pas produite (product-vision.md §2, legal-strategy.md §4/§7 point 6).
- `[HYPOTHÈSE]` Le référentiel externe ReferralCandy (référence generic e-commerce) et SparkToro (référence Perplexity spécifique) sont utilisés comme repères de calibration, pas comme cibles projet — à documenter explicitement auprès de Thomas pour éviter toute confusion en dashboard exec.

---

## Gates BLOQUANT vérifiées

- **G1** : 4 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré en fin de document. PASS.
- **G5** : personas Léa/Karim identiques à project-context.md/brand-platform.md (Grep cohérent, aucune redéfinition). PASS.
- **G7** : 0 contradiction — NSM aligné sur project-context.md (KPI provisoire repris et précisé, pas contredit) ; arbre de métriques aligné product-vision.md §2/§3 (rotation, commission à la confirmation) et functional-specs.md (events sources identiques) ; garde-fous alignés brand-platform.md §3 (preuve Fraîcheur) et legal-strategy.md §6a (tracking d'attribution). PASS.
- **G12** : chaque métrique a définition + formule + owner ; le NSM a fréquence + formule + justification anti-vanité. PASS.
- **G13** : 0 chiffre inventé — 2 benchmarks sourcés avec URL (§4), toutes les cibles internes non sourcées marquées `[À DÉFINIR APRÈS POC]`/`[À VALIDER]`. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[À VALIDER]`, `[HYPOTHÈSE]`, `[À DÉFINIR APRÈS POC]` subsistent (annotations autorisées). PASS.
- **G17** : la combinaison NSM corrigé par `origine_detectee` + arbre calé sur les objets métier exacts (Attribution/Parrain/Offre) + garde-fous de fraîcheur sourcés sur ce projet précis n'est pas réutilisable telle quelle par un concurrent sans son propre modèle de rotation. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler le cas Léa/EDF pour vérifier que le NSM est effectivement calculable de bout en bout.
`Read docs/product/functional-specs.md` (US-01 payload + events, lignes 47-65) : Léa demande "code de parrainage EDF" à ChatGPT → clic sur le lien cité → `page_offre_vue` capture le referrer (ChatGPT ajoute `utm_source=chatgpt.com` depuis juin 2025, source WebSearch §4) → `origine_detectee = chatgpt` est dérivable de ce referrer → `lien_parrainage_genere` crée l'Attribution avec `attribution_id` → SI Léa souscrit réellement chez EDF et que la prime est validée, l'Attribution passe à `confirmée` (product-vision.md §3) → elle est comptée dans PCA-IA du mois car `origine_detectee = chatgpt`. Chaîne complète sans étape manquante, SOUS RÉSERVE que l'event de confirmation (`attribution_confirmee`) soit ajouté aux specs : il n'existe pas encore dans functional-specs.md, gap traité et proposé en tracking-plan.md §2.3.

---
**Handoff → @fullstack, @geo, @seo, @growth, @product-manager**
- Fichiers produits : `/home/user/MCP/docs/analytics/kpi-framework.md`
- Décisions prises : NSM définitif = "Parrainages Confirmés d'origine IA (PCA-IA) par mois" (précision du provisoire par ajout du critère `origine_detectee`, mesure mensuelle/hebdo POC) ; arbre à 5 métriques d'entrée ; métriques par face + garde-fous fraîcheur ; aucune cible interne chiffrée avant données réelles.
- Points d'attention : gap critique signalé à @product-manager, l'event de confirmation de conversion n'existe pas dans functional-specs.md alors qu'il alimente directement le NSM (voir tracking-plan.md §2.3) ; `pool_cible` par enseigne dépend du plafond `[À VALIDER]` non encore chiffré par @legal/@product-manager ; benchmarks externes (ReferralCandy, SparkToro) à ne jamais présenter comme des cibles internes en dashboard exec.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de cadrage analytics, aucun code produit). Actions futures pour @fullstack/@infrastructure détaillées dans tracking-plan.md (table SQL Attribution, endpoint de redirection trackée).
---
