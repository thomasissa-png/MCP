/** /parrain/catalogue/{id}/validation — validation de conformité (US-07). SSR, session requise. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { offre } from '@/db/schema';
import { requireUser } from '@/lib/session-server';
import { ParrainNav } from '@/components/parrain/ParrainNav';
import { OffreValidationForm } from '@/components/parrain/OffreValidationForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Validation de conformité', robots: { index: false } };

export default async function ValidationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/parrain/catalogue/${id}/validation`);
  const row = db.select({ id: offre.id, nomProgramme: offre.nomProgramme, statut: offre.statut }).from(offre).where(eq(offre.id, id)).get();
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <ParrainNav nom={user.nom} />
      <Link href="/parrain/catalogue" className="text-sm text-content-secondary underline hover:text-content-primary">
        &lt; Retour au catalogue
      </Link>
      <h1 className="mb-sm mt-sm text-xl font-bold text-content-primary">Validation : {row.nomProgramme}</h1>
      <p className="mb-lg text-sm text-content-secondary">
        Une offre ne peut être activée qu&apos;avec une fiche de conformité renseignée (garde-fou légal).
      </p>
      <OffreValidationForm offreId={row.id} statut={row.statut} />
    </main>
  );
}
