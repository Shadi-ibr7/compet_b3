import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";
import { GoogleTagManager, GoogleTagManagerNoScript, GoogleAnalytics } from '@/components/Analytics';

export const metadata: Metadata = {
  title: "Molty - Votre partenaire pour le commerce local",
  description: "Découvrez Molty, votre plateforme pour le commerce local et les opportunités professionnelles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <GoogleTagManager />
        <GoogleAnalytics />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
