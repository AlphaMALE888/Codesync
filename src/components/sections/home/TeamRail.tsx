import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { TeamCard } from "./TeamCard";
import { teamData } from "@/data/team";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Quote } from "lucide-react";

export function TeamRail() {
  return (
    <section id="team-section" className="w-full py-20 sm:py-28 bg-transparent text-ink">
      <Container>
        {/* Header Block with "Our Story" link */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-4 max-w-xl">
              <Eyebrow className="text-accent-soft">THE COLLECTIVE</Eyebrow>
              <Heading level={2} className="text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Engineers, marketers & operators under one roof.
              </Heading>
              <Text variant="secondary" className="text-base sm:text-lg">
                Bridging the gap between software development and performance digital marketing with local Lucknow execution.
              </Text>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent-soft transition-colors pb-1 border-b border-white/20 hover:border-accent-soft shrink-0"
            >
              <span>Our story & leadership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Team Cards Grid / Horizontal Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* Editorial Quote Card (Span 4) */}
          <div className="lg:col-span-4 rounded-md border border-white/12 bg-surface-dark-2/85 p-8 flex flex-col justify-between shadow-lg">
            <Quote className="w-8 h-8 text-accent-soft opacity-80 mb-6" />
            <div className="space-y-4">
              <p className="font-display font-medium text-lg sm:text-xl text-ink leading-relaxed">
                &ldquo;Digital marketing brings the demand; solid software handles the business. We ensure neither side falls short.&rdquo;
              </p>
            </div>
            <div className="pt-6 border-t border-white/10 text-xs font-mono text-text-secondary">
              {"// CODESYNC CORE LEADERSHIP"}
            </div>
          </div>

          {/* Portrait Cards (Span 8: 3 Leaders across 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamData.slice(0, 3).map((member, idx) => (
              <Reveal key={member.id} delay={idx * 0.08}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
