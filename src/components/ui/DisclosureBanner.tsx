/**
 * Bandeau de divulgation d'affiliation (design-system §3.1 disclosure-banner, wireframes.md zone 4).
 * TOUJOURS visible, jamais masqué ni en accordéon, placé AU-DESSUS du CTA (contrainte legal non négociable).
 * Fond distinct + bordure gauche accent pour être vu, sans être alarmiste.
 */
import Link from 'next/link';

export function DisclosureBanner({ nomProgramme }: { nomProgramme: string }) {
  return (
    <div className="rounded-md border border-line border-l-4 border-l-accent bg-surface-muted p-md text-sm text-content-secondary">
      <p>
        Lien de parrainage {nomProgramme} : l&apos;éditeur de ce site perçoit un avantage si vous
        l&apos;utilisez pour vous inscrire. Aucun frais supplémentaire pour vous. Non affilié officiellement à{' '}
        {nomProgramme}.{' '}
        <Link href="/divulgation" className="font-medium text-accent underline">
          Comment ça marche
        </Link>
      </p>
    </div>
  );
}
