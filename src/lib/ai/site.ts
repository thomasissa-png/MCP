/**
 * Identite AEO/GEO de Parrainly + constantes partagees par la couche IA-lisible.
 *
 * Cette couche (src/lib/ai/*) est la propriete @ia : elle produit la donnee structuree consommee
 * par les assistants IA (JSON-LD, miroir JSON, robots, sitemap, llms.txt). Les route handlers
 * Next (@fullstack) ne font que la brancher, sans logique metier propre.
 *
 * Aucune donnee inventee : l'identite ci-dessous reprend brand-platform.md (nom, promesse, tagline)
 * et project-context.md (registre en cercle ferme edite par ses operateurs, verticales fintech reelles).
 */
import { SITE_URL } from '@/config/socle';

/** URL de base publique, sans slash final (compose les URLs canoniques JSON-LD / sitemap). */
export const BASE_URL = SITE_URL.replace(/\/+$/, '');

/** Compose une URL absolue a partir d'un chemin relatif (toujours 1 seul slash de jointure). */
export function absUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${p}`;
}

export const SITE_NAME = 'Parrainly';
export const SITE_TAGLINE = "Le parrainage, vérifié avant d'être cité.";
export const SITE_DESCRIPTION =
  "Parrainly est un registre qui vérifie chaque lien de parrainage bancaire, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur et crypto avant de le recommander, avec une date de contrôle sur chaque offre. Les liens exposés appartiennent à l'éditeur du site, qui perçoit un avantage du programme si vous les utilisez.";

/**
 * Crawlers d'assistants IA / moteurs de reponse explicitement autorises (robots.txt).
 * Chaque entree = un user-agent reel documente par son operateur en 2026. On les autorise
 * explicitement car Parrainly est un canal d'acquisition GEO/AEO-first : etre lu et cite par
 * ces agents est l'objectif, pas un risque.
 */
export const AI_CRAWLERS: readonly string[] = [
  'GPTBot', // OpenAI — entrainement / indexation
  'OAI-SearchBot', // OpenAI — index de recherche ChatGPT
  'ChatGPT-User', // OpenAI — navigation a la demande d'un utilisateur
  'ClaudeBot', // Anthropic — indexation
  'anthropic-ai', // Anthropic — acces modele
  'Claude-Web', // Anthropic — navigation Claude
  'Claude-User', // Anthropic — navigation a la demande d'un utilisateur
  'PerplexityBot', // Perplexity — index
  'Perplexity-User', // Perplexity — navigation a la demande d'un utilisateur
  'Google-Extended', // Google — Gemini / AI Overviews (jeton distinct de Googlebot)
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl (corpus reutilise par de nombreux modeles)
  'Amazonbot', // Amazon / Alexa
  'Bytespider', // ByteDance / Doubao
  'Meta-ExternalAgent', // Meta AI
  'cohere-ai', // Cohere
  'DuckAssistBot', // DuckDuckGo AI
  'YouBot', // You.com
  'MistralAI-User', // Mistral (Le Chat) navigation a la demande
];

/** Chemins jamais indexables : redirection trackee, back-office, pages sans valeur de citation. */
export const DISALLOWED_PATHS: readonly string[] = [
  '/r/', // redirection trackee /r/{token} — usage machine, pas une page de contenu
  '/internal/', // routes back-office / moteur d'arbitrage (@fullstack, fige)
  '/lien-invalide', // page generique d'echec de redirection
  '/rgpd/demande', // formulaire RGPD, aucune valeur de citation
];
