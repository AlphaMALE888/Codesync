"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { PricingToggle, PricingPillar } from "./PricingToggle";
import { PricingCard } from "./PricingCard";
import { PricingComparison } from "./PricingComparison";
import { FaqSection } from "@/components/sections/faq/FaqSection";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { PricingPlan } from "@/data/types";
import { motion, AnimatePresence } from "@/lib/motion";

interface PricingViewProps {
  initialPillar?: PricingPillar;
  plans: PricingPlan[];
}

export function PricingView({ initialPillar = "grow", plans }: PricingViewProps) {
  const [activePillar, setActivePillar] = useState<PricingPillar>(initialPillar);

  const activePlans = plans.filter((p) => p.group === activePillar);

  return (
    <div className="pt-32 sm:pt-40 bg-canvas min-h-screen">
      {/* Header */}
      <Container>
        <div className="max-w-4xl mx-auto text-center pb-12 sm:pb-16 border-b border-hairline">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
            TRANSPARENT COMMERCIAL TERMS
          </span>
          <h1 className="font-display font-medium text-display-md sm:text-display-lg tracking-tight text-ink">
            Honest pricing. Zero surprises.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Every business has distinct requirements, market densities, and technical scopes. We provide clear, itemized quotations tailored to your exact outcomes.
          </p>

          {/* 3-Way Selector */}
          <div className="mt-10">
            <PricingToggle activePillar={activePillar} onChange={setActivePillar} />
          </div>
        </div>

        {/* Marquee Accent */}
        <div className="py-8">
          <DisplayMarquee text="Grow Retainers · Build Projects · Run Software Architecture" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="py-12 relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
            >
              {activePlans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>

      {/* Standards Comparison */}
      <PricingComparison />

      {/* Split FAQ Section */}
      <FaqSection id="faq" />

      {/* Final CTA */}
      <FinalCta />
    </div>
  );
}
