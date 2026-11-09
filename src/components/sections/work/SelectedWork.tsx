import React from "react";
import { Container } from "@/components/layout/Container";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { CaseStudyCard } from "./CaseStudyCard";
import { getRenderableProjects } from "@/lib/content";
import { features } from "@/data/features";

export function SelectedWork() {
  // If work feature is disabled or no approved projects exist, cleanly hide
  if (!features.work) {
    return null;
  }

  const projects = getRenderableProjects().slice(0, 3);
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 bg-canvas border-b border-hairline overflow-hidden">
      {/* Marquee Heading */}
      <div className="mb-12">
        <DisplayMarquee text="Selected Work · Client Outcomes · Verified Systems" />
      </div>

      <Container>
        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <CaseStudyCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Work Button */}
        <div className="mt-12 text-center">
          <SplitArrowButton href="/work">View all work</SplitArrowButton>
        </div>
      </Container>
    </section>
  );
}
