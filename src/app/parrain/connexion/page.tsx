/**
 * /parrain/connexion — point d'entrée de l'espace parrain (spec auth). Carte de connexion centrée.
 * Si une session valide existe déjà, redirige directement vers le tableau de bord.
 */
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session-server';
import { ConnexionForm } from '@/components/parrain/ConnexionForm';

export const dynamic = 'force-dynamic';

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(returnTo && returnTo.startsWith('/parrain/') ? returnTo : '/parrain/tableau-de-bord');

  return (
    <main className="mx-auto flex max-w-container items-center justify-center px-md py-4xl lg:px-xl">
      <ConnexionForm returnTo={returnTo} />
    </main>
  );
}
