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
  // Verification de propriete pour Google Search Console et Bing Webmaster Tools.
  // Sur un sous-domaine *.workers.dev la verification DNS est impossible : on passe par
  // la balise meta. Poser les tokens en secret/var (GOOGLE_SITE_VERIFICATION,
  // BING_SITE_VERIFICATION) puis redeployer suffit a verifier la propriete, sans changer le code.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
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
