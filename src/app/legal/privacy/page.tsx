import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/legal";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Official privacy policy for Codesync Digi Marketing (OPC) Pvt Ltd outlining data protection, inquiry handling, cookies, analytics, and contact information.",
  alternates: {
    canonical: "/legal/privacy",
  },
  openGraph: {
    title: "Privacy Policy | CODESYNC",
    description:
      "Official privacy policy for Codesync Digi Marketing (OPC) Pvt Ltd in Lucknow, Uttar Pradesh.",
    url: "/legal/privacy",
  },
};

export default function PrivacyPage() {
  const page = getLegalPage("privacy");

  if (!page || page.status !== "published") {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/legal/privacy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <LegalLayout page={page} />
    </>
  );
}
