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
import { PricingPreview } from "@/components/sections/pricing/PricingPreview";
import { FaqSection } from "@/components/sections/faq/FaqSection";
import { SelectedWork } from "@/components/sections/work/SelectedWork";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/lib/seo/jsonld";
import { faqsData } from "@/data/faqs";
import { renderable } from "@/lib/content";

export const metadata: Metadata = {
  title: "Digital Marketing & Software Company in Lucknow | CODESYNC",
  description:
    "Lucknow digital marketing and software company: local SEO, Google Ads, Meta Ads, websites, apps and CRM, ERP and billing software. Book a free call.",
};

export default function HomePage() {
  const homeFaqs = renderable(faqsData)
    .slice(0, 6)
    .map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <JsonLd schema={getFaqSchema(homeFaqs)} />
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

      {/* 10. Pricing Preview (Phase 8) */}
      <PricingPreview />

      {/* 11. FAQ Section (Phase 8) */}
      <FaqSection id="home-faq" limit={6} />

      {/* SLOT: InsightsGrid (Phase 9) */}

      {/* 10. Final Call to Action (Phase 4) */}
      <FinalCta />
    </>
  );
}
