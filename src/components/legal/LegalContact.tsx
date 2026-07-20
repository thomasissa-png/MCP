/**
 * Rend le moyen de contact legal SANS jamais afficher de crochet placeholder (garde-fou G15).
 *
 * - `LEGAL_CONTACT_EMAIL` defini -> lien mailto.
 * - sinon -> lien vers le formulaire /rgpd/demande (aucun email fictif, aucun crochet residuel).
 *
 * Valeur reelle a confirmer a la revue juridique finale (voir .env.example : LEGAL_CONTACT_EMAIL).
 */
import Link from 'next/link';
import { LEGAL_CONTACT_EMAIL } from '@/config/socle';

export function LegalContact({ className }: { className?: string }) {
  if (LEGAL_CONTACT_EMAIL) {
    return (
      <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className={className ?? 'text-accent underline'}>
        {LEGAL_CONTACT_EMAIL}
      </a>
    );
  }
  return (
    <Link href="/rgpd/demande" className={className ?? 'text-accent underline'}>
      notre formulaire de contact
    </Link>
  );
}
