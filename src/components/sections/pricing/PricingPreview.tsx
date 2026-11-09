import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const PILLARS_PREVIEW = [
  {
    group: "GROW",
    title: "Digital Marketing Retainers",
    desc: "Targeted Google & Meta Ads, Local SEO, and brand content campaigns with rapid 24–48 hour deployment.",
    link: "/pricing?pillar=grow",
  },
  {
    group: "BUILD",
    title: "Websites & Mobile Apps",
    desc: "Responsive corporate websites, e-commerce stores, and cross-platform mobile apps built with clean code.",
    link: "/pricing?pillar=build",
  },
  {
    group: "RUN",
    title: "Custom Business Software",
    desc: "Bespoke CRM pipelines, multi-branch ERP, and GST billing applications engineered around your exact workflows.",
    link: "/pricing?pillar=run",
  },
];

export function PricingPreview() {
  return (
    <section className="py-20 sm:py-28 bg-canvas border-b border-hairline">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <Eyebrow className="text-accent text-xs">TRANSPARENT QUOTING</Eyebrow>
            <Heading level={2} className="mt-4 text-3xl sm:text-4xl text-ink font-medium tracking-tight">
              Clear quotes, no surprises.
            </Heading>
            <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
              We price every engagement around verified business goals and scope. No generic artificial markups, no hidden recurring fees.
            </p>
          </div>

          <div className="shrink-0">
            <SplitArrowButton href="/pricing">View pricing overview</SplitArrowButton>
          </div>
        </div>

        {/* 3 Group Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS_PREVIEW.map((item) => (
            <Link
              key={item.group}
              href={item.link}
              className="group p-6 sm:p-8 rounded-md bg-white border border-hairline hover:border-accent/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold text-accent tracking-widest">
                    {item.group}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-ink group-hover:bg-accent group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>

                <h3 className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-hairline/60 flex items-center justify-between text-xs font-mono text-text-secondary">
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Scope-Based Quote
                </span>
                <span className="group-hover:text-ink transition-colors">Explore Plans</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
