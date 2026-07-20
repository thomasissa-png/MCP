/** Page 404 générique (offre/catégorie inconnue). */
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-container flex-col items-center gap-lg px-md py-4xl text-center lg:px-xl">
      <h1 className="text-2xl font-bold text-content-primary">Page introuvable</h1>
      <p className="max-w-xl text-content-secondary">
        La page ou l&apos;offre que vous cherchez n&apos;existe pas ou a été retirée du registre.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
