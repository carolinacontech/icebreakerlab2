import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { IceCrackProvider } from "@/components/IceCrack";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "The Icebreakerlab | Websites & SEO that break the ice",
  description:
    "Premium digital agency specialized in high-converting landing pages and websites fully optimized for SEO and Google. We break the communication barriers between great businesses and their audience.",
  keywords: [
    "web agency",
    "landing pages",
    "SEO",
    "web design",
    "optimized websites",
    "Google ranking",
    "The Icebreakerlab",
    "digital strategy",
  ],
  authors: [{ name: "The Icebreakerlab" }],
  creator: "The Icebreakerlab",
  // icebreakerlab.com todavía no es nuestro (está a la venta), así que el
  // sitio se anuncia con su dominio real hasta que se adquiera.
  metadataBase: new URL("https://icebreakerlab.vercel.app"),
  // docs/01: canonical autorreferencial en el HTML
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://icebreakerlab.vercel.app",
    siteName: "The Icebreakerlab",
    title: "The Icebreakerlab | Websites & SEO that break the ice",
    description:
      "We build websites that rank on Google and convert visitors into clients.",
    images: [
      {
        url: "/images/hero/hero-aurora.png",
        width: 1200,
        height: 630,
        alt: "The Icebreakerlab — Websites & SEO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Icebreakerlab | Websites & SEO",
    description:
      "Premium agency specialized in landing pages and websites optimized for Google.",
    images: ["/images/hero/hero-aurora.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Verificación de dominio de Pinterest
  verification: {
    other: {
      "p:domain_verify": "a8cf3b0b066661eba013ace3c784c71d",
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          <IceCrackProvider>{children}</IceCrackProvider>
        </SmoothScroll>
        <ChatBot />
      </body>
    </html>
  );
}
