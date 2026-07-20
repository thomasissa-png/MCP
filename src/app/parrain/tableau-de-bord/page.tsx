/**
 * /parrain/tableau-de-bord (US-05, wireframes.md écran 3, compositions §3).
 * Rendu : SSR (données session-dépendantes). Carte prime + bandeau coaching + liste des liens par offre.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/session-server';
import { getLiensForParrain, getPrimeEstimee, getAttributionsAConfirmer } from '@/lib/parrain';
import { ParrainNav } from '@/components/parrain/ParrainNav';
import { TrackOnMount } from '@/components/analytics/TrackOnMount';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tableau de bord parrain', robots: { index: false } };

export default async function DashboardPage() {
  const user = await requireUser('/parrain/tableau-de-bord');
  const [liens, prime, aConfirmer] = await Promise.all([
    getLiensForParrain(user.parrainId),
    getPrimeEstimee(user.parrainId),
    getAttributionsAConfirmer(user.parrainId),
  ]);

  const statutLabel: Record<string, string> = {
    actif: 'actif',
    en_pause: 'en pause',
    suspendu: 'suspendu',
    invalide: 'invalide',
  };

  return (
    <main className="mx-auto max-w-container px-md py-lg lg:px-xl">
      <TrackOnMount event="dashboard_parrain_vu" props={{ parrain_id: user.parrainId, nb_liens: liens.length }} />
      <ParrainNav nom={user.nom} />

      {/* Zone 2 — Carte prime estimée cumulée */}
      <section className="mx-auto mb-lg max-w-2xl rounded-lg border border-line bg-surface-card p-xl text-center shadow-card">
        <p className="text-sm text-content-secondary">Prime estimée cumulée</p>
        <p className="mt-xs font-mono text-4xl font-bold text-content-primary">
          {prime.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className="mt-xs text-sm text-content-tertiary">Mise à jour à chaque conversion confirmée</p>
      </section>

      {/* Zone 3 — Bandeau coaching (seulement si des conversions sont à confirmer) */}
      {aConfirmer.length > 0 ? (
        <section className="mb-lg flex flex-col items-start gap-sm rounded-lg border border-verified-border bg-verified-bg p-lg md:flex-row md:items-center md:justify-between">
          <p className="text-content-primary">
            Vous avez {aConfirmer.length} conversion{aConfirmer.length > 1 ? 's' : ''} à confirmer.
          </p>
          <Link href="/parrain/attributions" className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover">
            Voir mes attributions
          </Link>
        </section>
      ) : null}

      {/* Zone 4 — Liste des liens par offre */}
      <section>
        <h2 className="mb-sm text-lg font-bold text-content-primary">Mes liens</h2>
        {liens.length === 0 ? (
          <p className="rounded-lg border border-line bg-surface-card p-lg text-content-secondary">
            Vous n&apos;avez pas encore de lien enregistré.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-surface-muted text-left text-content-secondary">
                <tr>
                  <th className="p-md font-medium">Programme</th>
                  <th className="p-md font-medium">Statut</th>
                  <th className="p-md text-right font-medium">Quota utilisé</th>
                </tr>
              </thead>
              <tbody>
                {liens.map((l) => (
                  <tr key={l.offreId} className="border-t border-line">
                    <td className="p-md text-content-primary">
                      <Link href={`/parrain/catalogue/${l.offreId}`} className="hover:underline">{l.nomProgramme}</Link>
                    </td>
                    <td className="p-md text-content-secondary">
                      {statutLabel[l.lienStatut] ?? l.lienStatut}
                      {l.lienStatut === 'en_pause' && l.dateReinitialisation ? ` jusqu'au ${l.dateReinitialisation}` : ''}
                    </td>
                    <td className="p-md text-right font-mono text-content-secondary">
                      {l.quotaUtilise}/{l.quotaMax ?? '∞'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
