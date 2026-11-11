import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/legal";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RefundPage() {
  const page = getLegalPage("refund-cancellation");

  // In accordance with Phase 9 rules: routes with status 'awaiting-client-text' return 404
  if (!page || page.status !== "published") {
    notFound();
  }

  return <LegalLayout page={page} />;
}
