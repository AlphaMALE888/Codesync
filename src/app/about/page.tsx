import { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { PillarsBand } from "@/components/sections/about/PillarsBand";
import { VisionSplit } from "@/components/sections/home/VisionSplit";
import { LeadershipGrid } from "@/components/sections/about/LeadershipGrid";
import { ProcessAccordion } from "@/components/sections/home/ProcessAccordion";
import { FeatureStrip } from "@/components/sections/home/FeatureStrip";
import { TrustStrip } from "@/components/sections/about/TrustStrip";
import { TestimonialCarousel } from "@/components/sections/home/TestimonialCarousel";
import { CareersBand } from "@/components/sections/about/CareersBand";
import { CompanyDetails } from "@/components/sections/about/CompanyDetails";
import { FinalCta } from "@/components/sections/home/FinalCta";

export const metadata: Metadata = {
  title: "About CODESYNC | Lucknow Digital Marketing and Software",
  description:
    "Learn about CODESYNC Digi Marketing (OPC) Pvt Ltd in Lucknow. Combining performance digital marketing with in-house software development.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-canvas">
      {/* 1. Intro Hero */}
      <AboutHero />

      {/* 2. What We Do: Pillars Band */}
      <PillarsBand />

      {/* 3. Our Story and Vision (guarded by features.vision) */}
      <VisionSplit />

      {/* 4. Leadership */}
      <LeadershipGrid />

      {/* 5. How We Work: Process Accordion */}
      <ProcessAccordion />

      {/* 6. Our Approach: Feature Strip */}
      <FeatureStrip />

      {/* 7. Clients and Trust (renders only if verified items exist) */}
      <TrustStrip />

      {/* 8. Experiences: Testimonial Carousel */}
      <TestimonialCarousel />

      {/* 9. Careers */}
      <CareersBand />

      {/* 10. Company Details */}
      <CompanyDetails />

      {/* 11. Final CTA */}
      <FinalCta />
    </main>
  );
}
