/**
 * Helpers E2E partages : capture du lien magique (mailer console -> log serveur), connexion parrain,
 * acces lecture a la DB E2E pour les assertions d'etat (attribution creee, date_redirection, etc.).
 */
import { readFileSync } from 'node:fs';
import Database from 'better-sqlite3';
import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

const SERVER_LOG = process.env.PARRAINLY_SERVER_LOG ?? 'e2e-server.log';
const DB_FILE = (process.env.DATABASE_URL ?? 'file:./drizzle/test-e2e.db').replace(/^file:/, '');

export const EMMANUEL_EMAIL = 'emmanuel@parrainly.test';
export const THOMAS_EMAIL = 'thomas@parrainly.test';
export const REF_TRADE_REPUBLIC = 'REF-001';

/** Ouvre la DB E2E en lecture seule (assertions d'etat, jamais d'ecriture depuis les tests). */
export function openDb(): Database.Database {
  return new Database(DB_FILE, { readonly: true });
}

/** Lit le dernier token de lien magique emis dans les logs serveur (mailer console). */
function lastMagicToken(): string | null {
  let log = '';
  try {
    log = readFileSync(SERVER_LOG, 'utf-8');
  } catch {
    return null;
  }
  const matches = [...log.matchAll(/\/api\/v1\/auth\/verify\?token=([A-Za-z0-9]+)/g)];
  const last = matches.at(-1);
  return last ? (last[1] ?? null) : null;
}

/** Demande un lien magique et renvoie le token capture dans le log (poll jusqu'a apparition). */
export async function requestMagicToken(request: APIRequestContext, email: string): Promise<string> {
  const before = lastMagicToken();
  const res = await request.post('/api/v1/auth/magic-link', { data: { email } });
  expect(res.status(), 'demande de lien magique acceptee').toBe(200);

  for (let i = 0; i < 40; i += 1) {
    const token = lastMagicToken();
    if (token && token !== before) return token;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('Lien magique introuvable dans les logs serveur.');
}

/** Extrait la valeur du cookie de session depuis les en-tetes Set-Cookie d'une reponse verify. */
function sessionCookieFrom(headers: { name: string; value: string }[]): string | null {
  for (const h of headers) {
    if (h.name.toLowerCase() === 'set-cookie') {
      const m = h.value.match(/parrainly_session=([^;]+)/);
      if (m) return m[1] ?? null;
    }
  }
  return null;
}

/**
 * Connexion parrain complete (demande -> capture -> verify) et renvoie la valeur du cookie de session.
 * Le cookie prod est `Secure` : on l'extrait de la reponse et on l'injecte manuellement (http local),
 * plutot que de dependre du stockage navigateur d'un cookie Secure sur http.
 */
export async function loginParrain(request: APIRequestContext, email: string): Promise<string> {
  const token = await requestMagicToken(request, email);
  const verify = await request.get(`/api/v1/auth/verify?token=${token}`, { maxRedirects: 0 });
  expect(verify.status(), 'verify redirige (307)').toBe(307);
  const cookie = sessionCookieFrom(verify.headersArray());
  expect(cookie, 'cookie de session pose par verify').toBeTruthy();
  return cookie as string;
}
