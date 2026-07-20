'use client';

/** Error boundary global (convention Next : un error.tsx par segment critique). */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-container flex-col items-center gap-lg px-md py-4xl text-center lg:px-xl">
      <h1 className="text-2xl font-bold text-content-primary">Une erreur est survenue</h1>
      <p className="max-w-xl text-content-secondary">
        Impossible d&apos;afficher cette page pour le moment. Réessayez dans quelques instants.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-lg py-sm font-medium text-content-inverse hover:bg-accent-hover"
      >
        Réessayer
      </button>
    </main>
  );
}
