import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { Check } from "lucide-react";

const STANDARD_STANDARDS = [
  {
    title: "Direct Access to Practitioners",
    desc: "You speak directly with the tech lead or digital marketer executing your work, never junior intermediaries.",
  },
  {
    title: "Clean Source Code & Asset Handover",
    desc: "Full ownership of website source files, ad creative assets, and admin credentials upon project completion.",
  },
  {
    title: "Production Testing & Cross-Device QA",
    desc: "Rigorous verification across desktop, tablet, and mobile devices before public launch.",
  },
  {
    title: "Transparent Reporting & Attribution",
    desc: "Regular monthly performance metrics, conversion tracking audits, and cost attribution.",
  },
];

export function PricingComparison() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-hairline">
      <Container>
        <div className="max-w-3xl mb-12">
          <Eyebrow className="text-accent text-xs">ENGAGEMENT STANDARDS</Eyebrow>
          <Heading level={2} className="mt-3 text-2xl sm:text-3xl text-ink font-medium tracking-tight">
            What every CODESYNC engagement includes.
          </Heading>
          <p className="mt-3 text-base text-text-secondary leading-relaxed">
            Regardless of whether you hire us for search optimization, website design, or enterprise software:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STANDARD_STANDARDS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-md bg-canvas border border-hairline flex items-start gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-medium text-lg text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
