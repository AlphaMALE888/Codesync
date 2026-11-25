import React from "react";
import { Container } from "@/components/layout/Container";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { SelectedWorkGrid } from "./SelectedWorkGrid";
import { Reveal } from "@/components/ui/Reveal";
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
    <section
      id="work-section"
      className="py-20 sm:py-28 bg-transparent border-b border-white/10 overflow-hidden"
    >
      {/* Marquee Heading */}
      <div className="mb-12">
        <DisplayMarquee text="Selected Work · Client Outcomes · Verified Systems" />
      </div>

      <Container>
        {/* 3-Card Grid with Scroll-Triggered Fade-In */}
        <SelectedWorkGrid projects={projects} />

        {/* View All Work Button */}
        <Reveal delay={0.18} className="mt-12 text-center">
          <SplitArrowButton href="/work" variant="solid-light">View all work</SplitArrowButton>
        </Reveal>
      </Container>
    </section>
  );
}
