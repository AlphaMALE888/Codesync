import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { LeadershipCard } from "./LeadershipCard";
import { TextLeadershipRow } from "./TextLeadershipRow";
import { teamData } from "@/data/team";
import { renderable } from "@/lib/content";

export function LeadershipGrid() {
  const members = renderable(teamData);

  return (
    <section className="py-20 sm:py-28 bg-canvas border-b border-hairline">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Eyebrow withRule>LEADERSHIP</Eyebrow>
          <Heading level={2} className="mt-4 text-3xl sm:text-4xl text-ink font-medium tracking-tight">
            Practitioners leading every engagement.
          </Heading>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Our department heads in technology, operations, growth marketing, and web engineering actively architect and review client projects. Based in Lucknow, reachable in person.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {members.map((member) => (
            <LeadershipCard key={member.id} member={member} />
          ))}
        </div>

        {/* Text Leadership Row */}
        <TextLeadershipRow members={members} />
      </Container>
    </section>
  );
}
