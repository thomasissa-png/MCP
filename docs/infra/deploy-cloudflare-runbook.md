# Runbook — Déploiement Parrainly sur Cloudflare Workers

> Cible : Cloudflare Workers (SSR Next.js 15 via `@opennextjs/cloudflare`) + base D1.
> Toute la config est dans le repo (`wrangler.jsonc`, `open-next.config.ts`, CI). Le build Worker est
> validé automatiquement à chaque push (`npm run cf-build` en CI). Ce runbook couvre **les 3 opérations
> qui exigent le compte Cloudflare de Thomas** (impossibles depuis l'environnement de dev, sans token).
>
> Auteur : @infrastructure (Phase B). Branche : `claude/parrainly-autopilot-phase-3-hva3pe`.

---

## Vue d'ensemble

| Étape | Qui | Nécessite le compte CF ? |
|-------|-----|--------------------------|
| Config repo (wrangler, OpenNext, CI, seed) | fait (@infrastructure) | non |
| 1. Créer la base D1 + coller son `database_id` | **Thomas** | oui |
| 2. Connecter le repo à Cloudflare Workers Builds | **Thomas** | oui |
| 3. Poser les secrets + vars, migrer, seed | **Thomas** | oui |

Prérequis Thomas : un compte Cloudflare, `git`, Node 20, le repo cloné, et **soit** le CLI wrangler
authentifié (`npx wrangler login`), **soit** un `CLOUDFLARE_API_TOKEN` (voir §5).

---

## 1. Créer la base D1 `parrainly-db` et coller son `database_id`

```bash
# Depuis la racine du repo, après `npx wrangler login`
npx wrangler d1 create parrainly-db
```

La commande affiche un bloc :

```
[[d1_databases]]
binding = "DB"
database_name = "parrainly-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"   <-- COPIER cette valeur
```

**Où la coller** : `wrangler.jsonc` à la racine, remplacer le placeholder :

```jsonc
"database_id": "REMPLACER_PAR_DATABASE_ID__voir_runbook_section_1"
//              ^-- coller ici le database_id renvoyé ci-dessus
```

Committer ce changement (le `database_id` D1 n'est pas un secret, il peut être versionné) :

```bash
git add wrangler.jsonc && git commit -m "infra: database_id D1 parrainly-db"
git push
```

> Le binding **doit** rester nommé `DB` : c'est le nom lu par `getDb()` dans `src/db/index.ts`
> (`getCloudflareContext().env.DB`). Ne pas renommer.

---

## 2. Connecter le repo à Cloudflare Workers Builds

Cloudflare Workers Builds construit et déploie automatiquement à chaque push (équivalent Pages/Vercel).

1. Dashboard Cloudflare → **Workers & Pages** → **Create** → onglet **Workers** → **Connect to Git**.
2. Autoriser l'app GitHub Cloudflare sur le repo **`thomasissa-png/mcp`**.
3. Sélectionner la branche de production. Pour le pilote : la branche courante
   `claude/parrainly-autopilot-phase-3-hva3pe` (ou `main` après merge — recommandé pour la prod).
4. Renseigner les paramètres de build :

   | Champ | Valeur |
   |-------|--------|
   | **Build command** | `npx opennextjs-cloudflare build` |
   | **Deploy command** | `npx opennextjs-cloudflare deploy` |
   | **Root directory** | `/` (racine) |
   | **Version / preview par PR** | activer (déploiement de preview par pull request) |

   Alternative (un seul champ « deploy command » qui build + deploy) : `npm run deploy`.

5. Cloudflare détecte `wrangler.jsonc` (nom du Worker = `parrainly`, entrée `.open-next/worker.js`,
   binding D1 `DB`, `assets`). Rien à ressaisir côté bindings : ils viennent de `wrangler.jsonc`.
6. Lancer le premier build. Il doit réussir (le build Worker est déjà vert en CI et en local).

> Le déploiement **n'est pas** géré par GitHub Actions (le workflow `.github/workflows/ci.yml` fait
> uniquement les gates qualité + la validation `cf-build`). C'est Workers Builds qui déploie.

---

## 3. Secrets, variables, migrations, seed

### 3.1 Variables NON secrètes

Déjà dans `wrangler.jsonc` → bloc `vars` (déployées avec le Worker). **À ajuster avant la prod** :

- `NEXT_PUBLIC_SITE_URL` : passer de `https://parrainly.com` au **domaine réel** servi par le Worker
  (indispensable pour les liens `/r/{token}`, le canonical et le JSON-LD). Si le domaine final diffère,
  éditer `wrangler.jsonc` puis `npm run cf-typegen` et committer.
- `MAILER_TRANSPORT` : laissé à `resend` (transport de prod). Le secret `RESEND_API_KEY` est requis (§3.2).
- `SOCLE_NON_PUBLIC_PROGRAMS` : vide pour le pilote (aucune offre masquée, décision Thomas #3).
  À figer à la revue juridique finale (arbitrage Trade Republic / Kraken).

### 3.2 Secrets (jamais dans le repo, jamais dans `vars`)

Poser via `wrangler secret put <NOM>` (invite interactive) **ou** dans le dashboard
(Workers → parrainly → Settings → Variables and Secrets → Encrypt).

| Secret | Obligatoire | Rôle |
|--------|:----------:|------|
| `INTERNAL_API_KEY` | **OUI** | Ferme les routes `/internal/*` (moteur d'arbitrage, job fraîcheur). **En prod, absente = routes fermées (401), MAIS le comportement fail-closed suppose la clé posée.** Générer une valeur aléatoire forte (`openssl rand -hex 32`). |
| `RESEND_API_KEY` | **OUI** (car `MAILER_TRANSPORT=resend`) | Envoi des magic links parrain via Resend. |
| `MAILER_FROM` | **OUI** (si Resend) | Adresse expéditrice vérifiée côté Resend (SPF/DKIM/DMARC configurés sur le domaine). |
| `AUTH_THOMAS_EMAIL` | recommandé | Email réel du compte Thomas (allowlist auth cercle fermé). Défaut `.test` sinon. |
| `AUTH_EMMANUEL_EMAIL` | recommandé | Email réel du compte Emmanuel (allowlist auth). Défaut `.test` sinon. |
| `POSTHOG_KEY` | optionnel | Analytics server-side. Absent = repli journalisation console. |
| `NEXT_PUBLIC_POSTHOG_KEY` | optionnel | Analytics client (chargé après consentement cookies). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optionnel | Mesure d'audience Plausible (après opt-in). |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | optionnel | Error tracking serveur + client. |
| `LEGAL_CONTACT_EMAIL` | **à figer revue juridique** | Contact légal (CGU, divulgation, mentions, confidentialité). Vide = lien vers `/rgpd/demande`. |
| `LEGAL_EDITOR_NAME` | **à figer revue juridique** | Éditeur / mentions légales. Vide = formulation factuelle pilote. |
| `LEGAL_PUBLICATION_DIRECTOR` | **à figer revue juridique** | Directeur de publication. |
| `LEGAL_HOST` | **à figer revue juridique** | Hébergeur (mentions légales). Renseigner « Cloudflare, Inc. » une fois en prod. |

Exemple :

```bash
openssl rand -hex 32 | npx wrangler secret put INTERNAL_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put MAILER_FROM
# ... etc
```

> Les seuils métier (`SOCLE_*`, `AUTH_*_TTL`, etc.) ont des défauts sûrs dans `wrangler.jsonc` : ne
> les redéclarer en secret que pour les surcharger. Liste complète des variables : `.env.example`.

### 3.3 Appliquer les migrations D1

Le schéma SQLite est **identique** dev/prod (mêmes fichiers `drizzle/*.sql`). Wrangler applique les
migrations depuis `migrations_dir: "drizzle"` (déclaré dans `wrangler.jsonc`) :

```bash
# Local (base D1 miniflare, pour tester) :
npm run d1:migrate:local     # = wrangler d1 migrations apply parrainly-db --local

# Production (base D1 réelle) :
npm run d1:migrate:remote    # = wrangler d1 migrations apply parrainly-db --remote
```

À faire **avant** le premier trafic. Pas de migration au cold start (Workers stateless) : c'est une
opération manuelle / pré-déploiement, une fois par changement de schéma.

### 3.4 Seed des 9 offres réelles

`scripts/seed.mjs` cible better-sqlite3 (dev only). Pour D1, on applique un **SQL de seed généré**
depuis `data/base-parrainage.json` (mêmes règles métier : divulgation, mention de risque, statut).

```bash
# 1. (Re)générer scripts/seed.sql avec les VRAIS emails parrain (allowlist auth) :
AUTH_THOMAS_EMAIL="thomas@exemple.com" AUTH_EMMANUEL_EMAIL="emmanuel@exemple.com" \
  npm run d1:gen-seed

# 2. Appliquer en prod (idempotent : ON CONFLICT DO UPDATE, quotas préservés) :
npm run d1:seed:remote       # = wrangler d1 execute parrainly-db --remote --file=./scripts/seed.sql
```

Résultat attendu : 9 offres, 9 liens (Emmanuel), 2 parrains (Thomas + Emmanuel). Ré-exécutable sans
effet de bord (les compteurs de quota et `date_dernier_tour` d'un lien existant ne sont jamais remis à zéro).

---

## 4. Vérifications post-déploiement

Sur `https://<domaine-prod>` :

- [ ] **`/api/health`** → `200`, `db: "ok"` (SELECT 1 sur D1). `degraded` si D1 injoignable (pas de crash).
- [ ] **`/r/{token}`** → une redirection réelle (302/307) vers l'URL de parrainage d'une offre `actif`
      après avoir généré un token (via une page offre ou l'API attribution). Token inconnu → `/lien-invalide`.
- [ ] **Canonical** présent et absolu sur les pages offre/catégorie (`<link rel="canonical">` = domaine prod).
- [ ] **JSON-LD** valide et présent sur les pages offre (schema.org, divulgation embarquée).
- [ ] **`url_parrainage` non vide** sur les 9 offres :
      `npx wrangler d1 execute parrainly-db --remote --command "SELECT COUNT(*) FROM offre WHERE url_parrainage IS NULL OR url_parrainage=''"` → **0**.
- [ ] **`/internal/*`** → `401` sans header `INTERNAL_API_KEY` (fail-closed).
- [ ] **Magic link** parrain : `/parrain/connexion` envoie bien un email (Resend) vers un compte de l'allowlist.

Monitoring recommandé : UptimeRobot/BetterStack sur `/api/health` (alerte downtime > 1 min), Cloudflare
Analytics + Workers Logs (`observability.enabled` déjà activé dans `wrangler.jsonc`), Sentry si DSN posé.

---

## 5. Alternative : deploy 100 % autopilote via `CLOUDFLARE_API_TOKEN`

Pour déployer **sans dashboard** (ou pour laisser @infrastructure piloter depuis une session dev), fournir
un token Cloudflare **scopé au seul projet Parrainly** (permissions minimales : `Workers Scripts:Edit`,
`D1:Edit`, `Workers Builds` si utilisé, `Account Settings:Read`). En variable d'environnement de session :

```bash
export CLOUDFLARE_API_TOKEN="…"          # jamais commité
export CLOUDFLARE_ACCOUNT_ID="…"
npm run deploy                            # opennextjs-cloudflare build && deploy
npm run d1:migrate:remote && npm run d1:seed:remote
```

Le même token permettrait d'ajouter un workflow GitHub Actions `deploy.yml`
(`cloudflare/wrangler-action`, preview par PR, prod sur merge `main`) avec le token en secret GitHub
Actions. Non activé pour l'instant : le deploy passe par Workers Builds (§2).

---

## 6. Limitation connue V1 — concurrence sur le quota (D1 sans transaction interactive)

D1 n'a **pas** de transaction interactive : un enchaînement « lire le quota → décider → écrire » n'est pas
sérialisé contre un écrivain concurrent (fenêtre de course possible, ex. double incrément de quota sous
forte concurrence — cf. `runAtomic()` / commentaire dans `src/db/index.ts`).

- **Impact réel V1** : négligeable. Cercle fermé Thomas & Emmanuel, trafic faible, quotas généreux (NULL/illimité
  par défaut sur les liens seedés).
- **Mitigation recommandée (non implémentée ici — hors périmètre @infrastructure, arbitrage @fullstack)** :
  remplacer le « lire→décider→écrire » par un **UPDATE conditionnel gardé** dans une seule requête atomique,
  `UPDATE lien_parrainage SET quota_utilise = quota_utilise + 1 WHERE id = ? AND (quota_max IS NULL OR quota_utilise < quota_max)`,
  puis vérifier `rowsAffected()` (déjà exposé par `src/db/index.ts`) : 0 ligne affectée = quota atteint, pas de
  double comptage. Alternative plus lourde : verrou applicatif via Durable Object. À trancher avant l'ouverture
  multi-parrains (V2), où la concurrence devient réelle.
```
