import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MietAnalyzer - Mietvertrag kostenlos prüfen | Free Rental Contract Checker",
  description: "Mietvertrag auf illegale Klauseln prüfen in 30 Sekunden. KI-Analyse nach BGB & BGH. Check your German rental contract for illegal clauses. Free AI tool for tenants.",
  keywords: "mietvertrag prüfen, mietvertrag kostenlos prüfen, mietvertrag illegal klauseln, rental contract checker Germany, check mietvertrag online, BGB mietrecht, Mietrecht 2026, Mietvertrag analysieren, illegal clauses Germany",
  openGraph: {
    title: "MietAnalyzer - Mietvertrag kostenlos prüfen | Free German Rental Contract Checker",
    description: "Mietvertrag auf illegale Klauseln prüfen in 30 Sekunden. KI-Analyse basierend auf BGB. Check your German rental contract for illegal clauses. Free tool.",
    url: "https://mietanalyzer.com",
    siteName: "MietAnalyzer",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MietAnalyzer - Free German Rental Contract Checker",
    description: "Check your Mietvertrag for illegal clauses in 30 seconds. Free AI analysis based on BGB law.",
  },
  alternates: {
    canonical: "https://mietanalyzer.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1MXDZRSLMJ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1MXDZRSLMJ');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}