/**
 * Coquille commune des pages de conformité. Rend un titre, une note de version provisoire et le corps.
 * Les textes intégrés proviennent de docs/legal/textes/ (rédigés par @legal). Certains champs restent
 * marqués « à compléter » : ce sont de vraies décisions en attente (identité éditeur, hébergeur), pas
 * des inventions. Une bannière provisoire l'indique clairement.
 */
import type { ReactNode } from 'react';

export function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-md py-2xl lg:px-xl">
      <div className="mb-lg rounded-md border border-attention-border bg-attention-bg p-md text-sm text-attention-fg">
        Version provisoire : textes en cours de validation juridique avant mise en ligne publique. Les
        champs entre crochets restent à compléter (identité de l&apos;éditeur, hébergeur).
      </div>
      <h1 className="mb-lg text-2xl font-bold text-content-primary">{title}</h1>
      <div className="flex flex-col gap-lg text-content-secondary [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-content-primary [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-lg [&_li]:mt-2xs">
        {children}
      </div>
    </main>
  );
}
