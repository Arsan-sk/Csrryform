import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PublicChrome } from "@/components/layout/PublicChrome";
import siteData from "@/data/site.json";
import contactData from "@/data/contact.json";
import navData from "@/data/navigation.json";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-custom",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: siteData.seo.defaultTitle,
    template: siteData.seo.titleTemplate,
  },
  description: siteData.seo.defaultDescription,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://carryform.in"
  ),
  openGraph: {
    type: "website",
    siteName: siteData.brand,
    title: siteData.seo.defaultTitle,
    description: siteData.seo.defaultDescription,
    images: siteData.seo.ogImage ? [{ url: siteData.seo.ogImage }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.seo.defaultTitle,
    description: siteData.seo.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F0E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col bg-ivory text-espresso antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PublicChrome
          contact={contactData}
          navItems={navData}
          brandName={siteData.brand}
          descriptor={siteData.descriptor}
          tagline={siteData.tagline}
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
