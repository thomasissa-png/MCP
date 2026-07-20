/** /parrain/attributions (US-09). Liste des conversions à confirmer + modal. SSR, session requise. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/session-server';
import { getAttributionsAConfirmer } from '@/lib/parrain';
import { formatDateFr } from '@/lib/format';
import { ParrainNav } from '@/components/parrain/ParrainNav';
import { AttributionsList } from '@/components/parrain/AttributionsList';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mes attributions', robots: { index: false } };

export default async function AttributionsPage() {
  const user = await requireUser('/parrain/attributions');
  const rows = await getAttributionsAConfirmer(user.parrainId);
  const items = rows.map((r) => ({
    attributionId: r.attributionId,
    nomProgramme: r.nomProgramme,
    dateRedirection: r.dateRedirection ? formatDateFr(r.dateRedirection.toISOString().slice(0, 10)) : null,
  }));

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <ParrainNav />
      <Link href="/parrain/tableau-de-bord" className="text-sm text-content-secondary underline hover:text-content-primary">
        &lt; Retour au tableau de bord
      </Link>
      <h1 className="mb-lg mt-sm text-xl font-bold text-content-primary">Conversions à confirmer</h1>
      <AttributionsList parrainId={user.parrainId} items={items} />
    </main>
  );
}
