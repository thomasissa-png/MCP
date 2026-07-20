import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Parrainly',
    template: '%s · Parrainly',
  },
  description:
    "Le registre de confiance du parrainage : des offres verifiees avant d'etre citees par les IA.",
  // theme-color light/dark — design-system.md §6
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1F3A5F' },
    { media: '(prefers-color-scheme: dark)', color: '#10151C' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
