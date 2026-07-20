/** /parrain/catalogue/{id} — édition d'une offre (US-02). SSR, session requise. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { offre } from '@/db/schema';
import { requireUser } from '@/lib/session-server';
import { ParrainNav } from '@/components/parrain/ParrainNav';
import { OffreEditForm } from '@/components/parrain/OffreEditForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Modifier une offre', robots: { index: false } };

export default async function OffreEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/parrain/catalogue/${id}`);
  const row = db.select().from(offre).where(eq(offre.id, id)).get();
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <ParrainNav nom={user.nom} />
      <Link href="/parrain/catalogue" className="text-sm text-content-secondary underline hover:text-content-primary">
        &lt; Retour au catalogue
      </Link>
      <h1 className="mb-lg mt-sm text-xl font-bold text-content-primary">{row.nomProgramme}</h1>
      <OffreEditForm
        offreId={row.id}
        nomProgramme={row.nomProgramme}
        urlParrainage={row.urlParrainage}
        codeParrainage={row.codeParrainage ?? ''}
        conditions={row.conditions ?? ''}
        statut={row.statut}
      />
    </main>
  );
}
