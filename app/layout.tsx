import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import NavBarMinimal from "@/components/NavBarMinimal";
import { Footer } from "@/components/Footer";
import DisclaimerBar from "@/components/DisclaimerBar";
import CookieBanner from "@/components/CookieBanner";
import PostHogProvider from "@/components/PostHogProvider";
import { Analytics } from '@vercel/analytics/react';
import NotificationContainer from "@/components/Notifications";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Invsty — L'investissement expliqué simplement",
  description: "Découvrez votre profil investisseur, suivez vos actifs et apprenez à investir intelligemment. Quiz personnalisé, allocations, alertes et pédagogie financière.",
  keywords: ["investissement", "éducation financière", "profil investisseur", "quiz", "allocation", "marchés financiers", "pédagogie"],
  authors: [{ name: "Invsty" }],
  creator: "Invsty",
  publisher: "Invsty",
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
    title: "Invsty — L'investissement expliqué simplement",
    description: "Découvrez votre profil investisseur, suivez vos actifs et apprenez à investir intelligemment.",
    url: "https://investy.app",
    siteName: "Invsty",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Invsty - Plateforme d'éducation financière",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invsty — L'investissement expliqué simplement",
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
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <PostHogProvider>
          <DisclaimerBar />
          <div className="min-h-screen flex flex-col">
            <NavBarMinimal />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <NotificationContainer />
          <CookieBanner />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
