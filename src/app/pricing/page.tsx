import { Metadata } from "next";
import { pricingPlans } from "@/data/pricing";
import { PricingView } from "@/components/sections/pricing/PricingView";
import { PricingPillar } from "@/components/sections/pricing/PricingToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/jsonld";
import { faqsData } from "@/data/faqs";
import { renderable } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing & Commercial Terms in Lucknow",
  description:
    "Transparent, scope-based pricing for Digital Marketing retainers, Business Websites, Mobile Apps, and Custom Software in Lucknow, UP.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing & Commercial Terms in Lucknow | CODESYNC",
    description:
      "Transparent, scope-based pricing for Digital Marketing retainers, Websites, and Custom Software.",
    url: "/pricing",
  },
};

interface PricingPageProps {
  searchParams?: {
    pillar?: string;
  };
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const pillarParam = searchParams?.pillar?.toLowerCase();
  const initialPillar: PricingPillar =
    pillarParam === "build" || pillarParam === "run" ? pillarParam : "grow";

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" },
  ]);

  const visibleFaqs = renderable(faqsData).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));
  const faqSchema = getFaqSchema(visibleFaqs);

  return (
    <>
      <JsonLd data={[breadcrumbs, faqSchema]} />
      <PricingView initialPillar={initialPillar} plans={pricingPlans} />
    </>
  );
}
