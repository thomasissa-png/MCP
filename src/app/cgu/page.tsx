/** Conditions Générales d'Utilisation (docs/legal/textes/01). Rendu statique. */
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell } from '@/components/legal/LegalShell';
import { LegalContact } from '@/components/legal/LegalContact';

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function CguPage() {
  return (
    <LegalShell title="Conditions Générales d'Utilisation">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes CGU régissent l&apos;accès et l&apos;utilisation du site Parrainly. Le site a pour objet
          de référencer des fiches informatives sur des programmes de parrainage proposés par des tiers
          (établissements bancaires, plateformes d&apos;investissement, plateformes crypto, services aux
          entreprises) et de mettre à disposition les liens de parrainage personnels de l&apos;éditeur. En
          consultant le site, l&apos;utilisateur accepte sans réserve les présentes CGU.
        </p>
      </section>
      <section>
        <h2>2. Nature exacte du site (V1)</h2>
        <p>
          Le site est un catalogue de fiches informatives présentant des programmes de parrainage tiers, assorti
          des liens de parrainage personnels détenus par l&apos;éditeur. Le site n&apos;est pas une place de
          marché ouverte à des parrains tiers, n&apos;est pas un établissement financier ni un statut réglementé,
          et ne fournit pas de conseil personnalisé ni de recommandation adaptée à la situation individuelle de
          l&apos;utilisateur. Il se limite à un rôle d&apos;apporteur d&apos;affaires ou indicateur non régulé :
          les fiches sont descriptives, sans classement ni conseil.
        </p>
      </section>
      <section>
        <h2>3. Accès au site</h2>
        <p>
          L&apos;accès au site est libre et gratuit. L&apos;espace parrain est réservé à l&apos;éditeur en V1,
          non ouvert au public.
        </p>
      </section>
      <section>
        <h2>4. Contenu des fiches et absence de conseil</h2>
        <p>
          Chaque fiche présente le nom du programme, une description, l&apos;avantage pour le filleul,
          l&apos;avantage pour le parrain, les conditions et un lien. Ces informations sont fournies à titre
          informatif, sur la base des conditions communiquées par chaque programme au moment de la vérification.
          Le site ne garantit pas l&apos;exactitude permanente des avantages annoncés, la disponibilité continue
          du lien, ni l&apos;éligibilité de l&apos;utilisateur. Toute décision de souscription appartient
          entièrement à l&apos;utilisateur, qui doit se référer aux conditions du programme tiers avant toute
          inscription.
        </p>
      </section>
      <section>
        <h2>5. Divulgation de la relation d&apos;affiliation</h2>
        <p>
          L&apos;éditeur perçoit un avantage personnel pour chaque inscription validée via les liens présentés.
          Cette relation est divulguée sur la page{' '}
          <Link href="/divulgation" className="text-accent underline">Comment ça marche</Link>, qui fait partie
          intégrante des présentes CGU par référence.
        </p>
      </section>
      <section>
        <h2>6. Responsabilité</h2>
        <p>
          Le site agit uniquement en qualité de relais d&apos;information et de mise à disposition d&apos;un lien
          vers un programme tiers. L&apos;éditeur ne saurait être tenu responsable des décisions prises par
          l&apos;utilisateur, des modifications ou suppressions des programmes tiers, ni de tout préjudice
          résultant de l&apos;utilisation d&apos;un service tiers (notamment les pertes sur produits
          d&apos;investissement ou crypto-actifs, qui comportent des risques).
        </p>
      </section>
      <section>
        <h2>7. Droit applicable et litiges</h2>
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution
          amiable, les tribunaux français compétents seront saisis.
        </p>
      </section>
      <section>
        <h2>8. Contact</h2>
        <p>Pour toute question, contactez-nous via <LegalContact />.</p>
      </section>
    </LegalShell>
  );
}
