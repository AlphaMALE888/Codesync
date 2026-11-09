import { Metadata } from "next";
import { pricingPlans } from "@/data/pricing";
import { PricingView } from "@/components/sections/pricing/PricingView";
import { PricingPillar } from "@/components/sections/pricing/PricingToggle";

export const metadata: Metadata = {
  title: "Pricing & Engagement | CODESYNC Lucknow",
  description:
    "Transparent, scope-based pricing for Digital Marketing retainers, Business Websites, Mobile Apps, and Custom Software in Lucknow.",
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

  return <PricingView initialPillar={initialPillar} plans={pricingPlans} />;
}
