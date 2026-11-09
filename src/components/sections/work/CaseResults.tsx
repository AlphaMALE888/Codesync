import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { TrendingUp, Award, BarChart3, Target } from "lucide-react";
import { ProjectItem } from "@/data/types";

interface CaseResultsProps {
  metrics: ProjectItem["metrics"];
}

const icons = [TrendingUp, Target, BarChart3, Award];

export function CaseResults({ metrics }: CaseResultsProps) {
  const verifiedMetrics = metrics.filter((m) => m.verified);

  // If no verified outcomes exist, hide the section completely per Content Status Rule
  if (verifiedMetrics.length === 0) {
    return null;
  }

  const items = verifiedMetrics.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-hairline">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Large Value Statement */}
          <div className="lg:col-span-5 space-y-4">
            <Eyebrow className="text-accent text-xs">MEASURABLE OUTCOMES</Eyebrow>
            <Heading level={2} className="text-ink text-3xl sm:text-4xl tracking-tight leading-tight">
              Verified outcomes, delivered through discipline.
            </Heading>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
              Every key result reflects measured commercial impact verified across analytics tracking, conversion tag logs, and client operations.
            </p>
          </div>

          {/* Right Column: Up to 4 Icon-led Points */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((m, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-md bg-canvas border border-hairline/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl sm:text-3xl font-medium text-ink tabular-nums">
                      {m.value}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-medium text-base text-ink">
                      {m.label}
                    </h4>
                    {m.period && (
                      <span className="text-xs font-mono text-text-secondary block mt-1">
                        Timeline: {m.period}
                      </span>
                    )}
                    {m.source && (
                      <span className="text-[11px] font-mono text-text-secondary/70 block mt-0.5">
                        Source: {m.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
