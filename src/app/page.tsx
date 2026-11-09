import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero/Hero";
import { ProofGrid } from "@/components/sections/home/ProofGrid";
import { CapabilityAccordion } from "@/components/sections/home/CapabilityAccordion";
import { VisionSplit } from "@/components/sections/home/VisionSplit";
import { FeatureStrip } from "@/components/sections/home/FeatureStrip";
import { StatementPanel } from "@/components/sections/home/StatementPanel";
import { ProcessAccordion } from "@/components/sections/home/ProcessAccordion";
import { TeamRail } from "@/components/sections/home/TeamRail";
import { TestimonialCarousel } from "@/components/sections/home/TestimonialCarousel";
import { SelectedWork } from "@/components/sections/work/SelectedWork";
import { FinalCta } from "@/components/sections/home/FinalCta";

export const metadata: Metadata = {
  title: "Digital Marketing & Software Company in Lucknow | CODESYNC",
  description:
    "Lucknow digital marketing and software company: local SEO, Google Ads, Meta Ads, websites, apps and CRM, ERP and billing software. Book a free call.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Experience (Phase 3) */}
      <Hero />

      {/* 2. Proof Metrics Cluster (Phase 4) */}
      <ProofGrid />

      {/* 3. Selected Work (Phase 6, gated by features.work) */}
      <SelectedWork />

      {/* 3. Capabilities Accordion: Grow / Build / Run (Phase 4) */}
      <CapabilityAccordion />

      {/* 4. Vision Split: Founder & Manifesto (Phase 4, conditional on features.vision) */}
      <VisionSplit />

      {/* 5. Approach Feature Strip (Phase 4) */}
      <FeatureStrip />

      {/* 6. Cinematic Statement Reset (Phase 4) */}
      <StatementPanel />

      {/* 7. Process Accordion: Discover / Plan / Build / Launch (Phase 4) */}
      <ProcessAccordion />

      {/* 8. Team Collective Rail (Phase 4) */}
      <TeamRail />

      {/* 9. Experiences / Testimonials Carousel (Phase 4) */}
      <TestimonialCarousel />

      {/* SLOT: PricingPreview (Phase 8) */}

      {/* SLOT: FAQSection (Phase 8) */}

      {/* SLOT: InsightsGrid (Phase 9) */}

      {/* 10. Final Call to Action (Phase 4) */}
      <FinalCta />
    </>
  );
}
