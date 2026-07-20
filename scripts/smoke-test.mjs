/**
 * Smoke test du socle demandeur (vague 2a). Demarre `next start`, execute des assertions reelles,
 * puis arrete le serveur. Sortie non nulle en cas d'echec.
 *
 * Couverture :
 *   1. /api/health -> 200 status ok, db up
 *   2. POST /internal/attribution-engine/select {REF-001} -> 200 + token + parrain
 *   3. GET /r/{token} -> 301 vers l'url_parrainage de l'offre + date_redirection ecrite en base
 *   4. GET /r/{token bidon} -> 404 (page generique)
 *   5. POST /internal/freshness-check/run -> 200 + compteurs (fail-safe, catalogue intact)
 *
 * Usage : npm run build && npm run db:seed && node scripts/smoke-test.mjs
 */
import { spawn } from 'node:child_process';
import Database from 'better-sqlite3';

const PORT = process.env.SMOKE_PORT ?? '3010';
const BASE = `http://127.0.0.1:${PORT}`;
const DB_FILE = (process.env.DATABASE_URL ?? 'file:./drizzle/local.db').replace(/^file:/, '');

let failures = 0;
function check(name, ok, detail = '') {
  const status = ok ? 'PASS' : 'FAIL';
  if (!ok) failures += 1;
  console.log(`  [${status}] ${name}${detail ? ` -> ${detail}` : ''}`);
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return true;
    } catch {
      // pas encore pret
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  // Capture stdout du serveur pour lire le lien magique emis par le mailer console (pilote).
  let serverLog = '';
  const server = spawn('npx', ['next', 'start', '-p', PORT], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });
  server.stdout.on('data', (d) => { serverLog += d.toString(); });
  server.stderr.on('data', (d) => { serverLog += d.toString(); });

  try {
    const up = await waitForServer();
    if (!up) {
      console.error('Serveur non demarre dans le delai imparti.');
      process.exit(1);
    }

    console.log('Smoke test — socle demandeur Parrainly\n');

    // 1) health
    const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
    check('health status ok', health.status === 'ok' && health.db === 'up', JSON.stringify(health));

    // 2) moteur d'arbitrage
    const selectRes = await fetch(`${BASE}/internal/attribution-engine/select`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ offre_id: 'REF-001', canal_source: 'api_json', origine_detectee: 'chatgpt' }),
    });
    const selectBody = await selectRes.json();
    const token = selectBody.token;
    check(
      'select REF-001 -> 200 + token + parrain',
      selectRes.status === 200 && typeof token === 'string' && token.length > 0 && !!selectBody.parrain_id,
      JSON.stringify(selectBody),
    );

    // 3) redirection 301 sur token valide
    const redir = await fetch(`${BASE}/r/${token}`, { redirect: 'manual' });
    const location = redir.headers.get('location');
    check(
      'GET /r/{token} -> 301 vers url_parrainage',
      redir.status === 301 && location === 'https://ref.trade.re/1dw9h6jf',
      `status=${redir.status} location=${location}`,
    );

    // 3bis) date_redirection ecrite en base
    const db = new Database(DB_FILE, { readonly: true });
    const row = db.prepare('SELECT attribution_id, date_redirection, statut FROM attribution WHERE token = ?').get(token);
    db.close();
    check(
      'attribution creee + date_redirection renseignee',
      !!row && row.date_redirection !== null,
      row ? `id=${row.attribution_id} date_redirection=${row.date_redirection}` : 'ligne absente',
    );

    // 4) token bidon -> redirection 307 vers la page stylee /lien-invalide (vague 2b)
    const bogus = await fetch(`${BASE}/r/ZZZbogusZZZ`, { redirect: 'manual' });
    const bogusLoc = bogus.headers.get('location') ?? '';
    check(
      'GET /r/{token bidon} -> 307 vers /lien-invalide',
      bogus.status === 307 && bogusLoc.endsWith('/lien-invalide'),
      `status=${bogus.status} location=${bogusLoc}`,
    );

    // 5) job fraicheur -> 200 + compteurs (catalogue intact au seuil par defaut)
    const fresh = await fetch(`${BASE}/internal/freshness-check/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    const freshBody = await fresh.json();
    check(
      'freshness-check -> 200 + compteurs',
      fresh.status === 200 && typeof freshBody.offres_expirees === 'number',
      JSON.stringify(freshBody),
    );

    // 6) auth magic-link : email non autorise -> 403
    const denied = await fetch(`${BASE}/api/v1/auth/magic-link`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'intrus@exemple.com' }),
    });
    check('magic-link email non autorise -> 403', denied.status === 403, `status=${denied.status}`);

    // 7) auth magic-link : email T&E autorise -> 200 + lien emis dans les logs
    const emmanuelEmail = process.env.AUTH_EMMANUEL_EMAIL ?? 'emmanuel@parrainly.test';
    const ask = await fetch(`${BASE}/api/v1/auth/magic-link`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: emmanuelEmail }),
    });
    check('magic-link email autorise -> 200', ask.status === 200, `status=${ask.status}`);

    // Recupere le token du lien magique depuis les logs du mailer console.
    let magicToken = null;
    for (let i = 0; i < 20 && !magicToken; i += 1) {
      const m = serverLog.match(/\/api\/v1\/auth\/verify\?token=([A-Za-z0-9]+)/);
      if (m) magicToken = m[1];
      else await new Promise((r) => setTimeout(r, 200));
    }
    check('lien magique emis (log mailer console)', !!magicToken, magicToken ? 'token capture' : 'token introuvable');

    // 8) verification du lien -> 307 vers le tableau de bord + cookie de session
    let sessionCookie = null;
    if (magicToken) {
      const verify = await fetch(`${BASE}/api/v1/auth/verify?token=${magicToken}`, { redirect: 'manual' });
      const setCookie = (verify.headers.getSetCookie ? verify.headers.getSetCookie() : [verify.headers.get('set-cookie') ?? '']).join(';');
      const cm = setCookie.match(/parrainly_session=([^;]+)/);
      if (cm) sessionCookie = `parrainly_session=${cm[1]}`;
      const loc = verify.headers.get('location') ?? '';
      check(
        'verify -> 307 tableau-de-bord + cookie session',
        verify.status === 307 && loc.includes('/parrain/tableau-de-bord') && !!sessionCookie,
        `status=${verify.status} loc=${loc} cookie=${!!sessionCookie}`,
      );
    }

    // 9) lien consomme (usage unique) -> 307 vers /parrain/verifier?error=consumed
    if (magicToken) {
      const reuse = await fetch(`${BASE}/api/v1/auth/verify?token=${magicToken}`, { redirect: 'manual' });
      const loc = reuse.headers.get('location') ?? '';
      check('lien magique usage unique -> error=consumed', loc.includes('error=consumed'), `loc=${loc}`);
    }

    // 10) confirmation d'une attribution (US-09) avec la session Emmanuel
    if (sessionCookie && selectBody.attribution_id) {
      const conf = await fetch(
        `${BASE}/api/v1/parrains/PAR-EMMANUEL/attributions/${selectBody.attribution_id}/confirmation`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', cookie: sessionCookie },
          body: JSON.stringify({ date_conversion_declaree: new Date().toISOString().slice(0, 10), montant_commission_declare: 35 }),
        },
      );
      const confBody = await conf.json();
      check(
        'confirmation US-09 -> 200 statut confirmee',
        conf.status === 200 && (confBody.statut === 'confirmee' || confBody.statut === 'en_verification_manuelle'),
        JSON.stringify(confBody),
      );

      // 11) protection : confirmer sous un autre parrain_id -> 403
      const forbidden = await fetch(
        `${BASE}/api/v1/parrains/PAR-THOMAS/attributions/${selectBody.attribution_id}/confirmation`,
        { method: 'POST', headers: { 'content-type': 'application/json', cookie: sessionCookie }, body: '{}' },
      );
      check('confirmation autre parrain -> 403', forbidden.status === 403, `status=${forbidden.status}`);
    }

    console.log(`\nResultat : ${failures === 0 ? 'TOUS LES CHECKS PASSENT' : `${failures} echec(s)`}`);
  } finally {
    server.kill('SIGTERM');
  }

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
