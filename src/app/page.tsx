import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero/Hero";

export const metadata: Metadata = {
  title: "Digital Marketing & Software Company in Lucknow | CODESYNC",
  description:
    "Lucknow digital marketing and software company: local SEO, Google Ads, Meta Ads, websites, apps and CRM, ERP and billing software. Book a free call.",
};

export default function HomePage() {
  return (
    <>
      {/* Phase 3 Hero Experience */}
      <Hero />

      {/* Phase 4 HomeSectionsSlot: ProofGrid, Capabilities, Approach, Process, Team, Experiences, FinalCta */}
    </>
  );
}
