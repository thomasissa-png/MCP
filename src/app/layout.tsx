import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Parrainly · Le parrainage, vérifié avant d\'être cité',
    template: '%s · Parrainly',
  },
  description:
    "Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : date de contrôle, statut, conditions à jour.",
  applicationName: 'Parrainly',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'Parrainly',
    title: 'Parrainly · Le parrainage, vérifié avant d\'être cité',
    description:
      'Un registre qui vérifie les liens de parrainage fintech avant de les recommander, avec une date de contrôle sur chaque offre.',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1F3A5F' },
    { media: '(prefers-color-scheme: dark)', color: '#10151C' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
