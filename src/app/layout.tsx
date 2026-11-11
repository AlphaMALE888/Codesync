import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@/styles/globals.css";
import { SkipLink } from "@/components/ui/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/analytics/Analytics";
import { getOrganizationSchema, getLocalBusinessSchema } from "@/lib/seo/jsonld";
import { cn } from "@/lib/cn";

const interBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const interDisplay = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdmlko.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Digital Marketing & Software Company in Lucknow | CODESYNC",
    template: "%s | CODESYNC",
  },
  description:
    "Marketing that grows revenue. Software that moves business forward. Search optimization, PPC, custom business software and web development in Lucknow, UP.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Digital Marketing & Software Company in Lucknow | CODESYNC",
    description:
      "Marketing that grows revenue. Software that moves business forward. Verified digital marketing, web apps, and CRM systems in Lucknow, UP.",
    url: siteUrl,
    siteName: "CODESYNC",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing & Software Company in Lucknow | CODESYNC",
    description:
      "Marketing that grows revenue. Software that moves business forward. Based in Lucknow, UP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html lang="en" className={cn(interBody.variable, interDisplay.variable)}>
      <head>
        <JsonLd data={[organizationSchema, localBusinessSchema]} />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-canvas text-ink selection:bg-accent selection:text-white">
        <SmoothScroll>
          <SkipLink targetId="main" />
          <SiteHeader />
          <main id="main" className="flex-1 w-full pt-16 sm:pt-20">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
