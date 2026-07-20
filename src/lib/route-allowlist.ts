/**
 * Allowlist des slugs publics valides — EDGE-SAFE (aucun import DB, utilisable en middleware).
 *
 * Dérivée du seed `data/base-parrainage.json` (source unique du cercle fermé), pas de la DB : le
 * middleware s'exécute sur l'edge, sans binding D1. Sert au soft-404 (seo P0-3) — un slug hors liste
 * est renvoyé en vrai HTTP 404 par le middleware AVANT le rendu de la page (le notFound() côté page,
 * lui, streame et retombe en HTTP 200 « soft 404 » : limitation Next.js core sur les routes dynamiques).
 *
 * [CAVEAT] Cercle fermé, 9 programmes / 6 catégories stables. Toute offre ajoutée hors seed (API admin)
 * doit être ajoutée au seed pour que sa page publique soit servie. Voir docs/dev-decisions.md.
 */
import seed from '../../data/base-parrainage.json';
import { slugify } from './slug';

const programmes = (seed as { Programmes: { nom_programme: string; categorie: string }[] }).Programmes ?? [];

export const VALID_OFFRE_SLUGS: ReadonlySet<string> = new Set(
  programmes.map((p) => slugify(p.nom_programme)),
);

export const VALID_CATEGORY_SLUGS: ReadonlySet<string> = new Set(
  programmes.map((p) => slugify(p.categorie)),
);
