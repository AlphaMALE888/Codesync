import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Check } from "lucide-react";

interface AudienceBlockProps {
  audience: string[];
}

export function AudienceBlock({ audience }: AudienceBlockProps) {
  if (!audience || audience.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-transparent border-b border-white/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="AUDIENCE"
              title="Who this is built for."
              intro="Clear alignment on business models, operational scales, and industry sectors that extract the highest return."
            />
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {audience.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 sm:p-6 rounded-md bg-surface-dark-2/85 border border-white/12 hover:border-accent-soft/45 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-accent-soft flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-mono text-xs text-text-secondary block mb-1">
                    TARGET 0{idx + 1}
                  </span>
                  <p className="font-display font-medium text-base text-ink leading-snug">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
