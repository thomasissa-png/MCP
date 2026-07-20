/**
 * Autorisation des routes internes /internal/* (moteur d'arbitrage, job de fraicheur).
 *
 * Regime de securite :
 *   - Cle `INTERNAL_API_KEY` definie -> l'appel DOIT presenter le header `x-internal-key` correspondant.
 *   - Cle absente + PROD -> FAIL-CLOSED : acces refuse (401). Une route interne ne doit jamais etre
 *     ouverte en production sans cle (contrainte audit Phase 2, point 3 blocker).
 *   - Cle absente + DEV -> permissif (facilite le smoke test), avec un warning explicite.
 */
import type { NextRequest } from 'next/server';
import { INTERNAL_API_KEY, IS_PRODUCTION } from '@/config/socle';

export function isInternalAuthorized(req: NextRequest): boolean {
  if (INTERNAL_API_KEY) {
    return req.headers.get('x-internal-key') === INTERNAL_API_KEY;
  }
  // Cle absente : fail-closed en prod, permissif documente en dev.
  if (IS_PRODUCTION) {
    // eslint-disable-next-line no-console
    console.error('[internal] INTERNAL_API_KEY absente en production : acces refuse (fail-closed).');
    return false;
  }
  // eslint-disable-next-line no-console
  console.warn('[internal] INTERNAL_API_KEY non definie : route interne ouverte (dev uniquement).');
  return true;
}
