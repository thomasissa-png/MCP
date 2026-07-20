/** Mentions légales (docs/legal/textes/03, art. 6-III LCEN). Rendu statique. */
import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal/LegalShell';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales">
      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          Le site Parrainly est édité par Thomas [nom à compléter] et Emmanuel [nom à compléter]. Le site étant
          à visée commerciale (perception de commissions de parrainage), une déclaration d&apos;activité est
          requise. Adresse et contact : [à compléter].
        </p>
      </section>
      <section>
        <h2>2. Directeur de la publication</h2>
        <p>[Nom à compléter selon la structure juridique retenue.]</p>
      </section>
      <section>
        <h2>3. Hébergement</h2>
        <p>Hébergeur : [à compléter selon le choix d&apos;infrastructure]. Adresse et contact : [à compléter].</p>
      </section>
      <section>
        <h2>4. Nature du site et absence de statut réglementé</h2>
        <p>
          Le site Parrainly référence des programmes de parrainage tiers et met à disposition les liens de
          parrainage personnels de son éditeur. Le site n&apos;est ni un établissement de crédit, ni un
          prestataire de services d&apos;investissement, ni un intermédiaire en opérations de banque et services
          de paiement, ni un conseiller en investissements financiers, ni un prestataire de services sur
          crypto-actifs. Il agit en qualité d&apos;apporteur d&apos;affaires ou indicateur non régulé au sens du
          droit commun.
        </p>
      </section>
      <section>
        <h2>5. Non-affiliation officielle aux marques citées</h2>
        <p>
          Parrainly n&apos;est affilié officiellement à aucun des programmes présentés (Trade Republic, Qonto,
          Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko). Les liens présentés sont des liens de
          parrainage personnels détenus par l&apos;éditeur, pas des partenariats commerciaux formalisés.
        </p>
      </section>
      <section>
        <h2>6. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu éditorial du site est la propriété de l&apos;éditeur, sauf mention
          contraire. Les marques et logos des programmes tiers cités appartiennent à leurs titulaires respectifs
          et sont utilisés à titre purement descriptif, sans intention de confusion.
        </p>
      </section>
      <section>
        <h2>7. Droit applicable</h2>
        <p>Le site est soumis au droit français.</p>
      </section>
      <section>
        <h2>8. Contact</h2>
        <p>Pour toute question : [adresse email de contact à compléter].</p>
      </section>
    </LegalShell>
  );
}
