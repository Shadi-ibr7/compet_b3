import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";
import { GoogleTagManager, GoogleTagManagerNoScript, GoogleAnalytics } from '@/components/Analytics';
import ToastProvider from "@/components/Toast/ToastProvider";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";

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
      <body style={{ background: '#fefff3' }}>
        <GoogleTagManagerNoScript />
        <Providers>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 140px)' }}>
            {children}
          </main>
          <Footer />
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
