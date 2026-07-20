/**
 * Anti-abus en memoire (sliding window) : rate-limit + deduplication a court terme.
 *
 * Volontairement en memoire, sans dependance (Map + horodatages) : suffisant comme defense en
 * profondeur d'un endpoint public a faible trafic, cote Node (better-sqlite3) comme cote isolate
 * Cloudflare (protection best-effort par isolate). Aucun fire-and-forget, aucun appel reseau.
 *
 * Pour un durcissement multi-instances ulterieur, brancher un KV/Durable Object derriere la meme API.
 */
import type { NextRequest } from 'next/server';

/** Extrait une IP client best-effort (Cloudflare puis proxies standard). Fallback 'unknown'. */
export function getClientIp(req: NextRequest): string {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return (fwd.split(',')[0] ?? '').trim() || 'unknown';
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/* Rate limit (fenetre glissante par cle)                                       */
/* -------------------------------------------------------------------------- */

const hits = new Map<string, number[]>();

export type RateResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Enregistre un hit pour `key` et indique s'il depasse `max` sur la fenetre `windowSeconds`.
 * Purge paresseuse des horodatages hors fenetre.
 */
export function rateLimit(key: string, max: number, windowSeconds: number): RateResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const prev = hits.get(key) ?? [];
  const recent = prev.filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    const oldest = recent[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

/* -------------------------------------------------------------------------- */
/* Deduplication a court terme (memoise un resultat par cle sur une fenetre)     */
/* -------------------------------------------------------------------------- */

const dedupStore = new Map<string, { value: unknown; at: number }>();

/** Renvoie la valeur memoisee pour `key` si elle est encore dans la fenetre, sinon undefined. */
export function dedupGet<T>(key: string, windowSeconds: number): T | undefined {
  const entry = dedupStore.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > windowSeconds * 1000) {
    dedupStore.delete(key);
    return undefined;
  }
  return entry.value as T;
}

/** Memoise `value` pour `key` (horodatage courant). */
export function dedupSet<T>(key: string, value: T): void {
  dedupStore.set(key, { value, at: Date.now() });
}
