/**
 * /parrain/verifier — landing d'erreur du lien magique (spec auth §2 écran B, §3 états 7/8/9).
 * La vérification réussie est gérée par /api/v1/auth/verify (qui pose le cookie puis redirige) ;
 * cette page n'affiche que les 3 variantes d'erreur, avec un CTA unique de renvoi.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { MAGIC_LINK_TTL_MINUTES } from '@/config/socle';

export const metadata: Metadata = { title: 'Vérification du lien', robots: { index: false } };

const INVALID: { title: string; detail?: string } = { title: "Ce lien de connexion n'est pas valide." };
const MESSAGES: Record<string, { title: string; detail?: string }> = {
  expired: {
    title: 'Ce lien de connexion a expiré.',
    detail: `Les liens de connexion sont valables ${MAGIC_LINK_TTL_MINUTES} minutes.`,
  },
  consumed: {
    title: 'Ce lien a déjà été utilisé.',
    detail: 'Chaque lien de connexion ne fonctionne qu\'une seule fois.',
  },
  invalid: INVALID,
};

export default async function VerifierPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const msg = MESSAGES[error ?? 'invalid'] ?? INVALID;

  return (
    <main className="mx-auto flex max-w-container items-center justify-center px-md py-4xl lg:px-xl">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface-card p-xl text-center shadow-card">
        <span className="mb-md inline-flex items-center gap-xs rounded-full border border-stale-border bg-stale-bg px-sm py-2xs text-xs font-medium text-stale-fg">
          Lien non valide
        </span>
        <h1 className="text-lg font-bold text-content-primary">{msg.title}</h1>
        {msg.detail ? <p className="mt-sm text-sm text-content-secondary">{msg.detail}</p> : null}
        <Link
          href="/parrain/connexion"
          className="mt-lg inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover"
        >
          Recevoir un nouveau lien
        </Link>
      </div>
    </main>
  );
}
