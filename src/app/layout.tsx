import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "@/styles/globals.css";
import { SkipLink } from "@/components/ui/SkipLink";
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
      <body className="min-h-screen bg-canvas text-ink selection:bg-accent selection:text-white">
        <SkipLink targetId="main" />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
