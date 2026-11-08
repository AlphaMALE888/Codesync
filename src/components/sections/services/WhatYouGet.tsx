import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckCircle2 } from "lucide-react";

interface WhatYouGetProps {
  includes: string[];
  deliverables: string[];
}

export function WhatYouGet({ includes, deliverables }: WhatYouGetProps) {
  // Use includes or deliverables, max 4 items for the feature strip
  const items = includes.length >= 4 ? includes.slice(0, 4) : includes;

  return (
    <section className="py-16 sm:py-24 bg-canvas border-b border-hairline">
      <Container>
        <SectionHeader
          eyebrow="INCLUSIONS & DELIVERABLES"
          title="What you get."
          intro="Concrete, verified deliverables included with this engagement — zero vague filler."
        />

        {/* 4 -> 2 -> 1 Responsive Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-md bg-white border border-hairline hover:border-accent/30 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-wider text-accent font-semibold">
                    0{idx + 1}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-accent/60" />
                </div>
                <h3 className="font-display font-medium text-base sm:text-lg text-ink leading-snug">
                  {item}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Additional deliverables if present */}
        {deliverables && deliverables.length > 0 && (
          <div className="mt-8 p-6 rounded-md bg-white border border-hairline">
            <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-3">
              Standard Tangible Deliverables
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((del, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <span className="text-accent font-mono text-xs pt-0.5">•</span>
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
