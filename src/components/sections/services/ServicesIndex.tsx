"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { PillarRail } from "./PillarRail";
import { PillarChapter } from "./PillarChapter";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { ServiceItem } from "@/data/types";

interface ServicesIndexProps {
  services: ServiceItem[];
}

export function ServicesIndex({ services }: ServicesIndexProps) {
  const [activePillar, setActivePillar] = useState<"grow" | "build" | "run">("grow");

  const growServices = services.filter((s) => s.pillar === "grow");
  const buildServices = services.filter((s) => s.pillar === "build");
  const runServices = services.filter((s) => s.pillar === "run");

  // ScrollSpy with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pillarId = entry.target.getAttribute("data-pillar") as "grow" | "build" | "run";
          if (pillarId) {
            setActivePillar(pillarId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll("[data-pillar]");
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-32 sm:pt-40 bg-canvas min-h-screen">
      {/* Overview Header */}
      <Container>
        <div className="max-w-4xl pb-12 sm:pb-16 border-b border-hairline">
          <Eyebrow>SERVICES</Eyebrow>
          <h1 className="mt-4 font-display font-medium text-display-md sm:text-display-lg tracking-tight text-ink">
            Grow. Build. Run.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed">
            Fourteen focused services across digital marketing, web & app engineering, and custom business software. Based in Lucknow, engineered for scalable commercial growth.
          </p>
          <div className="mt-8">
            <SplitArrowButton href="/contact">Book a free call</SplitArrowButton>
          </div>
        </div>

        {/* Index Layout: Desktop Sticky Left Rail + Pillar Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 pb-24">
          {/* Left Rail */}
          <div className="lg:col-span-3">
            <PillarRail activePillar={activePillar} onSelectPillar={setActivePillar} />
          </div>

          {/* Right Chapters */}
          <div className="lg:col-span-9 space-y-8">
            {/* 01 GROW (Light) */}
            <PillarChapter
              id="grow"
              number="01"
              title="Grow"
              subtitle="Digital Marketing"
              description="High-intent search capture, ROI-focused paid ads, and systematic brand visibility that drives verified inbound inquiries."
              services={growServices}
              theme="light"
            />

            {/* 02 BUILD (Dark) */}
            <PillarChapter
              id="build"
              number="02"
              title="Build"
              subtitle="Websites & Apps"
              description="High-speed business websites, e-commerce storefronts, and cross-platform mobile apps built with clean code and human-centered design."
              services={buildServices}
              theme="dark"
            />

            {/* 03 RUN (Light) */}
            <PillarChapter
              id="run"
              number="03"
              title="Run"
              subtitle="Business Software"
              description="Custom CRM, ERP, GST billing, and HRMS applications engineered to streamline operations, eliminate leakage, and scale workflows."
              services={runServices}
              theme="light"
            />
          </div>
        </div>
      </Container>

      {/* Closing CTA */}
      <FinalCta />
    </div>
  );
}
