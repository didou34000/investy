import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { theme } from "@/lib/theme";
import NavBarMinimal from "@/components/NavBarMinimal";
import { Footer } from "@/components/Footer";
import DisclaimerBar from "@/components/DisclaimerBar";
import CookieBanner from "@/components/CookieBanner";
import PostHogProvider from "@/components/PostHogProvider";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Investy — L'investissement expliqué simplement",
  description: "Découvrez votre profil investisseur, suivez vos actifs et apprenez à investir intelligemment. Quiz personnalisé, allocations, alertes et pédagogie financière.",
  keywords: ["investissement", "éducation financière", "profil investisseur", "quiz", "allocation", "marchés financiers", "pédagogie"],
  authors: [{ name: "Investy" }],
  creator: "Investy",
  publisher: "Investy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://investy.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Investy — L'investissement expliqué simplement",
    description: "Découvrez votre profil investisseur, suivez vos actifs et apprenez à investir intelligemment.",
    url: "https://investy.app",
    siteName: "Investy",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Investy - Plateforme d'éducation financière",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investy — L'investissement expliqué simplement",
    description: "Découvrez votre profil investisseur, suivez vos actifs et apprenez à investir intelligemment.",
    images: ["/og-cover.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased bg-background text-foreground`}> 
        <PostHogProvider>
          <DisclaimerBar />
          <div className="min-h-screen flex flex-col">
            <NavBarMinimal />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <CookieBanner />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
