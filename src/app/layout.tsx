import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@/styles/globals.css";
import { SkipLink } from "@/components/ui/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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

export const metadata: Metadata = {
  title: "CODESYNC Digi Marketing | Lucknow Digital Marketing & Software Company",
  description: "Marketing that grows revenue. Software that moves business forward. Based in Lucknow, Uttar Pradesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(interBody.variable, interDisplay.variable)}>
      <body className="min-h-screen flex flex-col justify-between bg-canvas text-ink selection:bg-accent selection:text-white">
        <SmoothScroll>
          <SkipLink targetId="main" />
          <SiteHeader />
          <main id="main" className="flex-1 w-full pt-16 sm:pt-20">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
