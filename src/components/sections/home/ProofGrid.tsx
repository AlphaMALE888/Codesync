"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { MetricCard } from "./MetricCard";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { proofData } from "@/data/proof";
import { testimonialsData } from "@/data/testimonials";
import { TrendingUp, Clock, Users, Quote } from "lucide-react";

export function ProofGrid() {
  const adProof = proofData.find((p) => p.id === "ad-launch");
  const seoProof = proofData.find((p) => p.id === "seo-timeframe");
  const teamProof = proofData.find((p) => p.id === "inhouse-presence");
  const quoteProof = testimonialsData[0]; // Mad House Creations verified review

  return (
    <section className="relative z-10 w-full py-16 sm:py-24 bg-canvas">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Card 1: Dark Metric Card (Span 4, Tall) */}
            <div className="md:col-span-4">
              <MetricCard tone="dark" className="h-full min-h-[220px]">
                <div className="flex items-center justify-between mb-8">
                  <span className="w-10 h-10 rounded-pill bg-white/10 flex items-center justify-center text-accent-soft">
                    <Clock className="w-5 h-5" />
                  </span>
                  <span className="type-label text-[11px] text-white/50 tracking-wider">
                    TIMING COMMITMENT
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-tabular">
                    <Counter to={48} displayValue="24–48" />{" "}
                    <span className="text-2xl font-normal text-white/70">hrs</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary-on-dark leading-relaxed">
                    {adProof?.caption || "Typical time to launch a new targeted campaign."}
                  </p>
                </div>
              </MetricCard>
            </div>

            {/* Card 2: Team Presence Card (Span 3) */}
            <div className="md:col-span-3">
              <MetricCard tone="light" className="h-full min-h-[220px]">
                <div className="flex items-center justify-between mb-8">
                  <span className="w-10 h-10 rounded-pill bg-surface-muted flex items-center justify-center text-accent">
                    <Users className="w-5 h-5" />
                  </span>
                  <span className="type-label text-[11px] text-text-secondary tracking-wider">
                    LOCAL EXPERTS
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold tracking-tight text-ink font-tabular">
                    <Counter to={100} suffix="%" />
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {teamProof?.caption || "In-house developers for fast technical fixes & support."}
                  </p>
                </div>
              </MetricCard>
            </div>

            {/* Card 3: Pale Radial Speed Metric Card (Span 2) */}
            <div className="md:col-span-2">
              <MetricCard tone="muted" className="h-full min-h-[220px] text-center items-center justify-center">
                <div className="w-12 h-12 rounded-pill border-2 border-dashed border-accent/40 flex items-center justify-center mb-3 text-accent">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-tabular">
                  {seoProof?.value || "8–12"}
                </div>
                <span className="type-label text-[10px] text-text-secondary block mt-1">
                  Weeks to SEO Gain
                </span>
              </MetricCard>
            </div>

            {/* Card 4: Verified Quote Card (Span 3) */}
            <div className="md:col-span-3">
              <MetricCard tone="light" className="h-full min-h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-6 h-6 text-accent opacity-60" />
                  <span className="type-label text-[10px] text-text-secondary tracking-wider">
                    VERIFIED REVIEW
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-ink leading-relaxed italic line-clamp-3">
                    &ldquo;{quoteProof?.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-hairline">
                    <div className="text-xs font-semibold text-ink">{quoteProof?.author}</div>
                    <div className="text-[11px] text-text-secondary">{quoteProof?.business}</div>
                  </div>
                </div>
              </MetricCard>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
