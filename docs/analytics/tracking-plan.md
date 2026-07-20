<!-- Version: 2026-07-20T00:00 — @data-analyst — Plan de tracking Phase 0 (consolidation events + modèle d'attribution IA→conversion) -->

# Plan de tracking événementiel — Parrainage-IA

## Résumé exécutif

- 21 events consolidés depuis functional-specs.md (US-01 à US-08), 0 event manquant sur les 8 stories, propriétés enrichies (pas redéfinies) pour porter la détection d'origine IA.
- **Gap critique signalé à @product-manager** : aucun event de confirmation de conversion (`attribution_confirmee`) n'existe dans functional-specs.md, alors que c'est l'event qui alimente directement le NSM (kpi-framework.md §1). Proposé ci-dessous comme 22e event, à intégrer dans une future révision de US-01/US-03.
- **Modèle d'attribution IA→conversion** : token unique embarqué dans le corps du lien (pas en query param, résiste à la copie/troncature) + endpoint de redirection tracké + confirmation déclarative du parrain (faute de webhook enseigne). Limites documentées explicitement (§2.7).
- Stack recommandée : Plausible ou PostHog (privacy-first, cookieless possible) + table SQL propriétaire d'attribution (aucun outil du marché ne modélise nativement "parrain/rotation/conversion différée").
- RGPD : aligné legal-strategy.md §6a (base légale intérêt légitime/consentement, minimisation, conservation ≤ 13 mois pour le tracking d'attribution).

---

## 1. Tableau consolidé des events (source unique : functional-specs.md)

Naming conservé à l'identique de functional-specs.md (consolidation, pas redéfinition — protocole `.claude/agents/data-analyst.md`). Convention déjà conforme au principe `[objet]_[action]` en français, verbe/état passé.

| Event | Story | Déclencheur | Propriétés (payload) | Destination | KPI associé |
|---|---|---|---|---|---|
| `page_offre_vue` | US-01 | Chargement fiche enseigne | `enseigne_id, canal_source (page/API), referrer` **+ enrichi : `utm_source, utm_medium, session_id anonyme`** | Plausible/PostHog | Arbre §2 métrique 2 (clics attribués) |
| `lien_parrainage_demande` | US-01 | Clic "Obtenir mon lien" | `enseigne_id, session_id` | PostHog | Funnel intermédiaire |
| `lien_parrainage_genere` | US-01 | Attribution créée (201) | `enseigne_id, attribution_id` **+ enrichi : `origine_detectee, token`** | PostHog + table SQL Attribution | Base du NSM |
| `lien_parrainage_echec` | US-01 | Erreur génération (404/409/503) | `enseigne_id, type_erreur` | PostHog | Frein (taux d'échec) |
| `offre_indisponible_affichee` | US-01 | Pool vide/offre expirée affichée | `enseigne_id` | PostHog | Garde-fou disponibilité |
| `formulaire_soumission_vu` | US-02 | Chargement page soumission parrain | `enseignes_disponibles_count` | Plausible | Acquisition parrain |
| `lien_soumis` | US-02 | Soumission réussie (201) | `enseigne_id, parrain_id` | PostHog + table SQL Parrain | Activation parrain |
| `lien_soumission_echec` | US-02 | Erreur validation/format | `enseigne_id, type_erreur` | PostHog | Frein onboarding |
| `lien_valide_actif` | US-02 | Statut passe "actif" | `enseigne_id, parrain_id, delai_verification_jours` | PostHog + table SQL | Taille pool actif (arbre métrique 4) |
| `attribution_moteur_execute` | US-03 | Chaque exécution moteur | `offre_id, resultat, duree_ms` | Logs internes + PostHog (debug) | SLA technique (< 2s) |
| `attribution_parrain_exclu` | US-03 | Exclusion auto d'un parrain | `parrain_id, offre_id, raison` | Table SQL | Équité de rotation |
| `offre_expiree_auto` | US-04 | Job détecte expiration | `offre_id` | Table SQL | Taux de disponibilité |
| `offre_en_attente_parrain` | US-04 | Pool vide détecté | `offre_id` | Table SQL + alerte | Garde-fou disponibilité |
| `lien_invalide_detecte` | US-04 | Contrôle de lien échoué | `parrain_id, offre_id` | Table SQL | % de liens morts |
| `dashboard_parrain_vu` | US-05 | Chargement tableau de bord | `parrain_id, nb_liens` | PostHog | Rétention parrain |
| `dashboard_parrain_erreur` | US-05 | Échec chargement | `parrain_id` | PostHog | Frein technique |
| `lien_signale` | US-06 | Signalement enregistré | `attribution_id, offre_id` | Table SQL | % de liens morts (source demandeur) |
| `lien_priorite_reverification` | US-06 | Seuil de signalements atteint | `offre_id, parrain_id` | Table SQL + alerte | Latence de détection |
| `soumission_validee` | US-07 | Décision "valider" | `lien_id, enseigne_id, admin_id` | Table SQL (audit) | Délai moyen validation |
| `soumission_rejetee` | US-07 | Décision "rejeter" | `lien_id, enseigne_id, motif` | Table SQL (audit) | Qualité entrant parrain |
| `demande_rgpd_soumise` | US-08 | Formulaire soumis | `type_demande` | Table SQL (registre RGPD) | Conformité |
| `demande_rgpd_traitee` | US-08 | Demande clôturée | `type_demande, delai_traitement_jours` | Table SQL (registre RGPD) | Conformité |

**Propriétés enrichies (pas redéfinies)** : `origine_detectee`, `token`, `utm_source`/`utm_medium`, `session_id` ajoutés sur les events déjà définis par @product-manager pour rendre le NSM calculable — aucun renommage, aucune suppression de propriété existante.

---

## 2. Modèle d'attribution IA→conversion

### 2.1 Le problème (rappel)

Quand ChatGPT/Perplexity/Claude/Gemini restitue un lien de parrainage EDF dans sa réponse texte, la chaîne de clic classique (referrer HTTP fiable) est rompue dans plusieurs cas : Léa peut copier-coller le lien dans un nouvel onglet (referrer perdu), l'IA peut tronquer l'URL, ou la plateforme IA peut masquer le referrer par design (Google AI Mode utilise `noreferrer` — WebSearch §4, aucune analytics client ne peut le détecter). Sans mécanisme dédié, `origine_detectee` retomberait systématiquement sur "direct/inconnu", rendant le NSM incalculable.

### 2.2 Mécanisme concret retenu

1. **Token unique dans le corps de l'URL, pas en query param seul** : chaque lien exposé (page HTML ou API JSON, US-01 payload `lien_genere`) est de la forme `https://{domaine}/r/{token}`, où `token` = alias court (6-8 caractères alphanumériques, `[HYPOTHÈSE]` longueur à valider avec @ux pour minimiser le risque de faute de frappe en cas de retype manuel) dérivé de `attribution_id`. Le token est dans le CHEMIN de l'URL, pas seulement dans un paramètre `?utm=...` : un paramètre peut être supprimé par une plateforme qui reformate le lien, un chemin non.
2. **Endpoint de redirection tracké** : `/r/{token}` est notre propre serveur (pas un lien direct vers l'enseigne). Il journalise un nouvel event (§2.3), capture le referrer HTTP disponible à cet instant précis (potentiellement `chatgpt.com` — ChatGPT ajoute déjà `utm_source=chatgpt.com` depuis juin 2025 sur les liens qu'il restitue, WebSearch §4 de kpi-framework.md), puis exécute un 301 vers l'URL réelle de souscription de l'enseigne.
3. **Détection `origine_detectee`** : calculée à cet instant selon une cascade de signaux, du plus fiable au moins fiable : (a) referrer HTTP = domaine connu d'une plateforme IA → attribution directe ; (b) `utm_source` présent dans l'URL d'arrivée sur `page_offre_vue` (ex. `chatgpt.com`, déjà ajouté nativement par ChatGPT) → attribution directe ; (c) aucun signal mais session cohérente avec un usage impulsif isolé (une seule page vue, pas de navigation catalogue préalable) → `ia_non_identifiee` (probable mais non certain) ; (d) navigation multi-pages catalogue sans aucun signal → `direct/autre`.
4. **Confirmation de conversion** : c'est le maillon le plus fragile, traité §2.3.

### 2.3 Events proposés (nouveaux, à valider par @product-manager)

| Event proposé | Trigger | Propriétés | Justification |
|---|---|---|---|
| `lien_redirection_suivie` | Clic effectif sur `/r/{token}`, avant le 301 vers l'enseigne | `token, attribution_id, referrer_capture, origine_detectee, delai_depuis_generation_s` | **Manquant dans functional-specs.md.** `lien_parrainage_genere` (US-01) capture la GÉNÉRATION du lien, pas le clic réel dessus (qui peut survenir des heures après, depuis un autre appareil si copié). Sans cet event, impossible de mesurer le taux de clic depuis citation (benchmark SparkToro 12-18 %, kpi-framework.md §4). |
| `attribution_confirmee` | Le parrain déclare, ou l'enseigne confirme (selon le canal disponible programme par programme), que le filleul a effectivement souscrit et que la prime a été validée | `attribution_id, parrain_id, offre_id, delai_confirmation_jours, montant_commission, mode_confirmation (declaratif_parrain / webhook_enseigne)` | **Manquant dans functional-specs.md, c'est le gap le plus critique.** Sans cet event, le statut `confirmée` de l'Attribution (product-vision.md §3) n'a pas de trigger explicite documenté et le NSM n'est pas calculable. Signalé formellement à @product-manager pour intégration dans une révision de US-03/US-05 (le déclaratif se ferait probablement depuis le tableau de bord parrain, US-05). |

### 2.4 Table d'attribution (SQL propriétaire)

Aucun outil du marché (GA4, Plausible, PostHog) ne modélise nativement "parrain / rotation / conversion différée de plusieurs semaines / commission" — table dédiée obligatoire, alimentée par les events ci-dessus :

```sql
CREATE TABLE attribution (
  attribution_id       TEXT PRIMARY KEY,
  offre_id             TEXT NOT NULL,
  parrain_id           TEXT NOT NULL,
  token                TEXT UNIQUE NOT NULL,
  canal_source         TEXT NOT NULL,        -- page_web | api_json (US-01)
  origine_detectee     TEXT NOT NULL,        -- chatgpt | perplexity | gemini | claude | copilot | ia_non_identifiee | direct_autre
  date_generation      TIMESTAMPTZ NOT NULL, -- lien_parrainage_genere
  date_redirection     TIMESTAMPTZ,          -- lien_redirection_suivie (peut être NULL si jamais cliqué)
  referrer_redirection TEXT,
  statut               TEXT NOT NULL,        -- en_attente | confirmee | rejetee | expiree
  date_confirmation    TIMESTAMPTZ,          -- attribution_confirmee
  delai_confirmation_j INT,
  mode_confirmation    TEXT,                 -- declaratif_parrain | webhook_enseigne
  montant_commission   NUMERIC
);
```

### 2.5 Fenêtre de conversion

`[HYPOTHÈSE — à valider avec @product-manager/@legal]` : proposer une fenêtre de 60 jours entre `date_generation` et `date_confirmation` (délai plausible pour une souscription énergie/VPN/box + délai de validation de prime par l'enseigne), configurable par enseigne — ne pas coder en dur une valeur unique, cohérent avec le principe déjà appliqué au plafond par enseigne (product-vision.md §2). Une Attribution `en_attente` dont la fenêtre expire sans confirmation passe à `expiree` (n'alimente jamais le NSM).

### 2.6 Gestion de la copie manuelle et du "dernier clic" capté par la plateforme IA

- **Copie manuelle** : le token dans le chemin de l'URL survit à un copier-coller intégral (contrairement à un paramètre qui peut être retiré par un outil de nettoyage d'URL côté navigateur/plateforme). Si Léa retape le lien à la main (rare, mais possible si l'IA affiche le lien sans qu'il soit cliquable), une faute de frappe casse le token : accepter ce taux de perte, ne pas sur-ingénierer une résolution floue de token (risque de sécurité, un token approximatif pourrait rediriger vers la mauvaise Attribution).
- **Dernier clic capté par la plateforme IA elle-même** : si Léa reste dans l'interface de chat et que la plateforme IA logue elle-même le clic comme sortant vers notre domaine, nous n'avons aucune visibilité sur cette étape (pas d'accès aux données internes de ChatGPT/Perplexity). Notre seule fenêtre de mesure commence au moment où le `/r/{token}` est atteint sur NOTRE serveur.

### 2.7 Limites honnêtes (à ne jamais présenter comme résolues)

1. **Aucun webhook de confirmation de la part des enseignes** identifié à ce stade (legal-strategy.md ne mentionne aucun accès API accordé à un sous-affilié) : la confirmation reste **déclarative** (le parrain rapporte lui-même), avec un risque de sur-déclaration frauduleuse — mitigation proposée : plausibilité (confirmations déclarées ≤ redirections suivies dans la fenêtre) + audit ponctuel back-office (US-07).
2. **82 à 88 % des citations Perplexity ne génèrent aucun clic** (SparkToro, source kpi-framework.md §4) : même avec un tracking parfait, le volume mesurable restera structurellement faible au démarrage — ne pas interpréter un PCA-IA bas comme un échec du tracking, mais comme la réalité du canal.
3. **Google AI Mode masque le referrer par design** (`noreferrer`, WebSearch) : sur ce canal spécifique, seule la détection par token survit, `origine_detectee` y sera plus souvent `ia_non_identifiee` que nommément identifié.
4. **La fenêtre de conversion introduit un décalage temporel volontaire** : le NSM du mois M inclura des Attributions générées en M, M-1 ou M-2 selon la date de confirmation réelle — le dashboard doit toujours préciser "mois de confirmation", pas "mois de génération", pour éviter une lecture erronée par Thomas/Emmanuel.

---

## 3. Stack analytics recommandée

**Contexte** : budget analytics "à recommander" (project-context.md), maturité data = 0 (stade idée), trafic quasi nul au lancement. Décision : ne pas sur-outiller.

| Option | Avantages | Limites | Coût |
|---|---|---|---|
| **Plausible Analytics** (retenu pour le trafic web) | Privacy-first, cookieless (pas de bandeau consentement nécessaire pour le tracking d'audience de base, allège legal-strategy.md §7 point 4), simple, RGPD par design | Pas de funnel avancé ni de tracking d'events custom illimité en plan de base | `[HYPOTHÈSE]` ~9-19 $/mois pour < 10k pageviews (plan self-hosted possible gratuit hors hébergement) |
| **PostHog** (retenu pour les events produit + funnel) | Self-hostable (donnée reste chez nous, aligné minimisation RGPD), funnels/cohortes natifs, plan gratuit généreux au volume POC | Plus complexe à configurer que Plausible, self-host = charge infra | `[HYPOTHÈSE]` Gratuit jusqu'à 1M events/mois en cloud, ou self-host à coût infra uniquement |
| GA4 (écarté) | Gratuit, standard | Pas privacy-first par défaut (cookies, données transférées hors UE), inadapté à la posture "Sage/sobre" de brand-platform.md et à la minimisation RGPD visée | N/A |
| Mixpanel (écarté) | Funnels puissants | Plafond gratuit trop bas pour la marge de manœuvre POC, coût qui grimpe vite en marketplace deux faces | `[HYPOTHÈSE]` payant au-delà d'un seuil bas |

**Recommandation retenue** : Plausible (audience/pageviews, cookieless) + PostHog (events produit, funnels, cohortes) + **table SQL propriétaire d'attribution** (§2.4, hébergée avec le reste du backend, D1/Neon selon project-context.md stack). Aucun outil du marché ne remplace cette dernière : c'est la seule pièce qui porte la logique métier "parrain/rotation/commission différée".

---

## 4. Conformité RGPD du tracking

Aligné strictement sur legal-strategy.md §6a (tracking d'attribution) et §6b (KYC parrains, hors périmètre analytics mais table Attribution y fait référence pour `parrain_id`).

- **Base légale** : intérêt légitime pour la mesure d'audience agrégée et le tracking d'attribution non intrusif (pas de profilage individuel poussé) ; passage en consentement opt-in CNIL uniquement si un cookie tiers de traçage cross-site venait à être ajouté (non prévu dans la stack recommandée §3, Plausible et PostHog en mode cookieless/first-party évitent ce basculement).
- **Minimisation** : `session_id` anonyme uniquement côté demandeur (Léa), jamais couplé à une identité civile — cohérent avec US-01 critère 8 (aucune authentification requise) et US-08 (droit d'opposition, l'identifiant de session cesse d'être associé à de nouvelles Attributions sur demande).
- **Conservation** : ≤ 13 mois pour les données de mesure d'audience/tracking (recommandation CNIL reprise de legal-strategy.md §6a), sauf la table Attribution elle-même dont les lignes `confirmée` doivent être conservées selon l'obligation comptable/fiscale (10 ans, legal-strategy.md §6b) car elles servent de preuve de calcul de commission — distinction à documenter dans le registre de traitement (legal-strategy.md §6, garde-fou).
- **Droits RGPD (US-08)** : l'event `demande_rgpd_soumise`/`demande_rgpd_traitee` doit pouvoir déclencher, côté tracking, la désassociation immédiate du `session_id` de Léa (droit d'opposition) sans supprimer rétroactivement les Attributions déjà `confirmées` (nécessaires au calcul de commissions dues, US-08 critère 7) — aucune divergence avec ce que @product-manager a déjà spécifié.
- **Point de vigilance transmis à @legal** : la détection `origine_detectee` par referrer/UTM (§2.2) ne collecte aucune donnée d'identité, uniquement des métadonnées techniques de session — à confirmer que cela reste hors du périmètre "profilage" nécessitant un consentement explicite, cohérent avec la lecture actuelle de legal-strategy.md §6a mais à valider formellement avant mise en prod (pas de blocage, signalement).

---

## Hypothèses à valider

- `[HYPOTHÈSE]` Longueur du token (6-8 caractères) : à valider avec @ux, arbitrage lisibilité/risque de collision.
- `[HYPOTHÈSE]` Fenêtre de conversion de 60 jours : à valider avec @product-manager selon les délais réels de validation de prime par enseigne (variable par programme).
- `[À VALIDER par @product-manager]` Intégration formelle des events `lien_redirection_suivie` et `attribution_confirmee` dans une révision de functional-specs.md (US-01/US-03/US-05) — non codés en dur avant cette validation.
- `[HYPOTHÈSE]` Coûts Plausible/PostHog : ordres de grandeur non contractuels, à reconfirmer au moment du choix définitif d'hébergement avec @infrastructure.

---

## Gates BLOQUANT vérifiées

- **G1** : 4 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff structuré en fin de document. PASS.
- **G5** : personas Léa/Karim non redéfinis, references cohérentes avec brand-platform.md/functional-specs.md. PASS.
- **G7** : 0 contradiction — les 21 events sont repris à l'identique de functional-specs.md (Grep effectué, aucun renommage), la table SQL respecte les objets métier de product-vision.md §4, la posture RGPD reprend exactement legal-strategy.md §6a/§6b sans contredire les délais/bases légales déjà posés. PASS.
- **G12** : chaque event a trigger + propriétés + destination + KPI ; le mécanisme d'attribution a un schéma SQL exécutable + une cascade de détection explicite. PASS.
- **G13** : 0 chiffre inventé — coûts stack marqués `[HYPOTHÈSE]`, fenêtre de conversion et longueur de token marquées `[HYPOTHÈSE]`, benchmarks cités avec URL en kpi-framework.md. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. Seuls `[HYPOTHÈSE]`/`[À VALIDER]` subsistent. PASS.
- **G17** : le mécanisme de token dans le chemin + cascade de détection + confirmation déclarative avec plausibilité anti-fraude est calibré sur ce modèle marketplace précis (rotation, commission différée), pas un tracking plan générique copiable tel quel. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** dérouler le cas Léa/EDF de bout en bout sur le mécanisme d'attribution proposé.
`Read docs/product/functional-specs.md` (US-01 payload, lignes 47-56) + `Read docs/product/product-vision.md` (§3, ligne 43) : Léa demande "code de parrainage EDF" à ChatGPT → l'IA restitue `https://{domaine}/r/aZ3kQ1` (token dans le chemin, pas en query param) → Léa clique depuis l'interface ChatGPT → `lien_redirection_suivie` capture `referrer_capture = chatgpt.com` (ChatGPT ajoute déjà `utm_source=chatgpt.com` depuis juin 2025) → `origine_detectee = chatgpt` est fixé avec un niveau de confiance élevé → redirection 301 vers la page de souscription EDF → si Léa souscrit et que EDF valide la prime au parrain, celui-ci déclare la confirmation dans son tableau de bord (US-05) → `attribution_confirmee` (event proposé §2.3) fait passer l'Attribution à `confirmée` → elle est comptée dans le PCA-IA du mois de confirmation (kpi-framework.md §1.3). La chaîne est complète et implémentable, à la condition explicite que @product-manager valide l'ajout des 2 events proposés (§2.3) — sans eux, la dernière étape de la chaîne (confirmation) n'a aujourd'hui aucun déclencheur documenté dans functional-specs.md.

---
**Handoff → @fullstack, @infrastructure, @legal, @growth**
- Fichiers produits : `/home/user/MCP/docs/analytics/tracking-plan.md`
- Décisions prises : 21 events consolidés sans redéfinition ; 2 events proposés (`lien_redirection_suivie`, `attribution_confirmee`) à valider par @product-manager avant implémentation ; mécanisme d'attribution = token dans le chemin d'URL + endpoint de redirection tracké + confirmation déclarative du parrain (pas de webhook enseigne disponible) ; stack = Plausible + PostHog + table SQL propriétaire d'attribution ; RGPD aligné legal-strategy.md §6.
- Points d'attention : le gap sur `attribution_confirmee` est bloquant pour calculer le NSM en prod, à traiter en priorité avec @product-manager avant le développement de US-03/US-05 ; le token doit être dans le CHEMIN de l'URL, jamais uniquement en query param ; conservation différenciée entre données de tracking (13 mois) et lignes Attribution confirmées (10 ans, obligation comptable).
- **Actions infra requises** :
  - Variables d'environnement : `PLAUSIBLE_SITE_ID` (identifiant du site Plausible), `POSTHOG_API_KEY` (clé projet PostHog), `POSTHOG_HOST` (URL instance self-hostée ou cloud EU)
  - Packages : `posthog-js` (front), `posthog-node` (back, events serveur type `attribution_moteur_execute`)
  - Migration DB : créer la table `attribution` (schéma §2.4) dans la base retenue (D1/Neon selon project-context.md, migration à écrire par @fullstack)
  - Endpoint à créer : `GET /r/{token}` (redirection trackée, cf. §2.2) — priorité haute, c'est le socle technique de tout le modèle d'attribution
  - Futurs projets CF : `wrangler.toml` à compléter avec la route `/r/*` si hébergement Cloudflare confirmé par @infrastructure
---
