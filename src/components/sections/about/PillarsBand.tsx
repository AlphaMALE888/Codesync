import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowUpRight } from "lucide-react";

const PILLARS = [
  {
    num: "01",
    name: "Grow",
    label: "Digital Marketing",
    desc: "Search engine optimization, Google Ads, Meta lead generation, and multi-channel content designed for measurable customer acquisition.",
    href: "/services#pillar-grow",
  },
  {
    num: "02",
    name: "Build",
    label: "Websites & Mobile Apps",
    desc: "High-speed business websites, e-commerce storefronts, and cross-platform Android & iOS apps engineered with clean code and high uptime.",
    href: "/services#pillar-build",
  },
  {
    num: "03",
    name: "Run",
    label: "Business Software",
    desc: "Custom CRM systems, ERP, GST billing, and HRMS platforms engineered to automate repetitive workflows and eliminate operational leakage.",
    href: "/services#pillar-run",
  },
];

export function PillarsBand() {
  return (
    <section className="py-16 sm:py-20 bg-surface-muted border-b border-hairline">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((p) => (
            <Link
              key={p.num}
              href={p.href}
              className="group p-6 sm:p-8 rounded-md bg-white border border-hairline/80 hover:border-accent/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold text-accent tracking-widest">
                    {p.num} {"//"} {p.name.toUpperCase()}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-ink group-hover:bg-accent group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>

                <h3 className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                  {p.label}
                </h3>

                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline/60 flex items-center gap-1 text-xs font-mono text-accent font-semibold tracking-wider uppercase">
                <span>Explore Capabilities</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
