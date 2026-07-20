/**
 * Helpers de session pour les Server Components de l'espace parrain.
 * Lit le cookie httpOnly puis valide la session en base (getSessionUser).
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionUser, type SessionUser } from '@/lib/auth';
import { SESSION_COOKIE } from '@/config/socle';

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return getSessionUser(store.get(SESSION_COOKIE)?.value);
}

/** Exige une session valide, sinon redirige vers la connexion (avec returnTo). */
export async function requireUser(returnTo: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/parrain/connexion?returnTo=${encodeURIComponent(returnTo)}`);
  return user;
}
