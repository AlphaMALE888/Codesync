import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/legal";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | CODESYNC Digi Marketing Pvt. Ltd.",
  description:
    "Official privacy policy for Codesync Digi Marketing (OPC) Pvt Ltd outlining data protection, inquiry handling, cookies, analytics, and contact information.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

export default function PrivacyPage() {
  const page = getLegalPage("privacy");

  if (!page || page.status !== "published") {
    notFound();
  }

  return <LegalLayout page={page} />;
}
