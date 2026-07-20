/**
 * /parrain/catalogue (US-02, back-office). Liste des 9 offres avec statut, fraîcheur, actions.
 * Rendu : SSR, session requise.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/session-server';
import { getAllOffres } from '@/lib/offres';
import { formatDateFr } from '@/lib/format';
import { ParrainNav } from '@/components/parrain/ParrainNav';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Catalogue', robots: { index: false } };

export default async function CataloguePage() {
  const user = await requireUser('/parrain/catalogue');
  const offres = await getAllOffres();

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <ParrainNav nom={user.nom} />
      <h1 className="mb-lg text-xl font-bold text-content-primary">Catalogue des offres</h1>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-muted text-left text-content-secondary">
            <tr>
              <th className="p-md font-medium">Programme</th>
              <th className="p-md font-medium">Statut</th>
              <th className="p-md font-medium">Vérifié le</th>
              <th className="p-md font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offres.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="p-md font-medium text-content-primary">{o.nomProgramme}</td>
                <td className="p-md text-content-secondary">{o.statut}</td>
                <td className="p-md font-mono text-content-secondary">{formatDateFr(o.dateVerification)}</td>
                <td className="p-md">
                  <div className="flex gap-md">
                    <Link href={`/parrain/catalogue/${o.id}`} className="text-accent underline">Modifier</Link>
                    <Link href={`/parrain/catalogue/${o.id}/validation`} className="text-accent underline">Valider</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
