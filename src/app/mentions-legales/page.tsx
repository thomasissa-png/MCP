/** Mentions légales (docs/legal/textes/03, art. 6-III LCEN). Rendu statique. */
import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal/LegalShell';
import { LegalContact } from '@/components/legal/LegalContact';
import { LEGAL_EDITOR_NAME, LEGAL_PUBLICATION_DIRECTOR, LEGAL_HOST } from '@/config/socle';
import { absUrl } from '@/lib/ai/site';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    "Mentions légales de Parrainly : éditeur, directeur de la publication et hébergeur du site, conformément à l'article 6-III de la LCEN.",
  alternates: { canonical: absUrl('/mentions-legales') },
};

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales">
      <section>
        <h2>1. Éditeur du site</h2>
        {/* Décision fondateur (2026-07-20) : l'éditeur sera une société, dont la création est en attente.
            Dès son immatriculation, poser sa dénomination sociale dans LEGAL_EDITOR_NAME (var/secret) puis
            redéployer suffit à basculer cette page en mentions complètes — aucun changement de code requis.
            Pilote non-public (workers.dev, non indexé) : le fallback ci-dessous ne nomme volontairement
            aucune personne physique tant que la société n'est pas immatriculée (cf. docs/audit/legal-audit-2.md). */}
        <p>
          {LEGAL_EDITOR_NAME
            ? `Le site Parrainly est édité par ${LEGAL_EDITOR_NAME}.`
            : "Le site Parrainly est édité en cercle fermé, dans l'attente de la constitution de la société éditrice, dont la dénomination sociale et les coordonnées complètes seront précisées avant la mise en ligne publique."}{' '}
          Le site étant à visée commerciale (perception de commissions de parrainage), une déclaration
          d&apos;activité est requise. Les coordonnées complètes de l&apos;éditeur sont précisées lors de la mise
          en ligne publique. Pour toute question, contactez-nous via <LegalContact />.
        </p>
      </section>
      <section>
        <h2>2. Directeur de la publication</h2>
        <p>
          {LEGAL_PUBLICATION_DIRECTOR
            ? `La direction de la publication est assurée par ${LEGAL_PUBLICATION_DIRECTOR}.`
            : "La direction de la publication est assurée par l'éditeur de ce site."}
        </p>
      </section>
      <section>
        <h2>3. Hébergement</h2>
        <p>
          {LEGAL_HOST
            ? `Le site est hébergé par ${LEGAL_HOST}.`
            : "Le site est hébergé sur une infrastructure cloud. Les coordonnées de l'hébergeur sont précisées lors de la mise en ligne publique."}
        </p>
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
        <p>Pour toute question, contactez-nous via <LegalContact />.</p>
      </section>
    </LegalShell>
  );
}
