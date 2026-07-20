/** Politique de confidentialité RGPD (docs/legal/textes/02). Rendu statique. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell } from '@/components/legal/LegalShell';
import { LegalContact } from '@/components/legal/LegalContact';
import { absUrl } from '@/lib/ai/site';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  alternates: { canonical: absUrl('/confidentialite') },
};

export default function ConfidentialitePage() {
  return (
    <LegalShell title="Politique de confidentialité">
      <section>
        <h2>1. Qui sommes-nous</h2>
        <p>
          Parrainly est édité par Thomas et Emmanuel. Le responsable de traitement des données collectées sur le
          site est cette même entité, à confirmer selon la structure juridique retenue.
        </p>
      </section>
      <section>
        <h2>2. Quelles données nous collectons (V1)</h2>
        <p>
          En V1, une seule catégorie de données personnelles est traitée : les données de suivi
          d&apos;attribution, c&apos;est-à-dire l&apos;information technique permettant de relier le clic sur un
          lien de parrainage à une conversion éventuelle. Concrètement : un identifiant unique inclus dans
          l&apos;URL de redirection, l&apos;horodatage du clic, éventuellement une adresse IP tronquée et des
          informations techniques du navigateur.
        </p>
        <p>
          Ce que nous ne collectons pas en V1 : pas de compte utilisateur requis côté demandeur, pas
          d&apos;identité civile, pas de coordonnées bancaires de tiers.
        </p>
      </section>
      <section>
        <h2>3. Pourquoi nous traitons ces données</h2>
        <ul>
          <li>
            Identifiant de suivi : mesurer l&apos;efficacité de la citation par un assistant IA et
            l&apos;attribution de la conversion. Base légale : intérêt légitime (art. 6.1.f RGPD).
          </li>
          <li>
            Cookies de mesure d&apos;audience non essentiels : statistiques de navigation. Base légale :
            consentement (art. 6.1.a RGPD), recueilli via le bandeau cookies.
          </li>
        </ul>
        <p>
          Aucune décision automatisée à effet juridique n&apos;est prise sur la base de ces données (pas de
          scoring, pas de recommandation personnalisée).
        </p>
      </section>
      <section>
        <h2>4. Durée de conservation</h2>
        <p>
          Les données de mesure d&apos;audience et de tracking sont conservées 13 mois maximum, conformément à la
          recommandation de la CNIL, sauf obligation légale contraire.
        </p>
      </section>
      <section>
        <h2>5. Destinataires des données</h2>
        <p>
          Les données peuvent être traitées par nos sous-traitants techniques (hébergeur, outil de mesure
          d&apos;audience). Aucune donnée n&apos;est vendue à des tiers.
        </p>
      </section>
      <section>
        <h2>6. Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
          d&apos;opposition et de portabilité. Pour l&apos;exercer, utilisez le{' '}
          <Link href="/rgpd/demande" className="text-accent underline">formulaire dédié</Link> ou contactez-nous.
          Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
        </p>
      </section>
      <section>
        <h2>7. Cookies</h2>
        <p>
          Les cookies strictement nécessaires (session technique, redirection) sont exemptés de consentement.
          Les cookies de mesure d&apos;audience non essentiels ne sont déposés qu&apos;après votre accord positif
          via le bandeau cookies. Le consentement est renouvelé au-delà de 6 mois.
        </p>
      </section>
      <section>
        <h2>8. Contact et réclamation</h2>
        <p>
          Pour exercer vos droits ou toute réclamation, contactez-nous via <LegalContact />. Autorité de
          contrôle : CNIL, 3 Place de Fontenoy, 75007 Paris.
        </p>
      </section>
    </LegalShell>
  );
}
