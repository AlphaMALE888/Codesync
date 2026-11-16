import React from "react";
import { Container } from "@/components/layout/Container";
import { Code, ShieldCheck, PhoneCall, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function FeatureStrip() {
  const items = [
    {
      icon: <Code className="w-6 h-6 text-accent-soft" strokeWidth={1.5} />,
      title: "In-House Developers",
      desc: "Fast technical fixes, clean code, and zero outsourcing delays.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-accent-soft" strokeWidth={1.5} />,
      title: "Transparent Strategy",
      desc: "Clear weekly reporting, honest timelines, and no false guarantees.",
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-accent-soft" strokeWidth={1.5} />,
      title: "Built for Calls & Sales",
      desc: "Targeted campaigns focused on generating real qualified inquiries.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent-soft" strokeWidth={1.5} />,
      title: "Local Lucknow Team",
      desc: "Deep on-ground understanding of Lucknow and Uttar Pradesh markets.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-surface-dark-2/60 text-on-dark border-y border-white/10">
      <Container>
        <Reveal>
          {/* Top All-Caps Stance Statement */}
          <div className="pb-12 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="type-label tracking-widest text-accent-soft font-bold text-xs sm:text-sm">
              NO GUARANTEED RANKINGS. JUST THE WORK THAT EARNS THEM.
            </span>
            <span className="font-mono text-xs text-white/50">
              {"// CODESYNC OPERATING PRINCIPLES"}
            </span>
          </div>
        </Reveal>

        {/* 4-Column Feature Row */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.08}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary-on-dark leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
