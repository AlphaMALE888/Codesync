"use client";

import React from "react";
import { ServiceItem } from "@/data/types";
import { ServiceRow } from "./ServiceRow";
import { setActiveServicePillar } from "@/components/particles/particleState";

interface PillarChapterProps {
  id: "grow" | "build" | "run";
  number: string;
  title: string;
  subtitle: string;
  description: string;
  services: ServiceItem[];
  theme?: "light" | "dark";
}

export function PillarChapter({
  id,
  number,
  title,
  subtitle,
  description,
  services,
}: PillarChapterProps) {
  const pillarIdx = id === "grow" ? 0 : id === "build" ? 1 : 2;

  return (
    <section
      id={`pillar-${id}`}
      data-pillar={id}
      onMouseEnter={() => setActiveServicePillar(pillarIdx)}
      className="py-12 sm:py-16 rounded-lg my-8 transition-colors bg-surface-dark/75 text-ink p-6 sm:p-12 border border-white/12 shadow-xl"
    >
      {/* Chapter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm tracking-widest text-accent-soft font-semibold">
              {number}
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-text-secondary">
              {subtitle}
            </span>
          </div>

          <h2 className="font-display font-medium text-display-sm sm:text-display-md text-ink tracking-tight">
            {title}
          </h2>

          <p className="mt-2 text-base max-w-xl text-text-secondary">
            {description}
          </p>
        </div>

        <div className="shrink-0 font-mono text-xs text-accent-soft uppercase tracking-widest">
          {services.length} Capabilities
        </div>
      </div>

      {/* Services List */}
      <div className="mt-6 divide-y divide-transparent">
        {services.map((service, idx) => (
          <ServiceRow
            key={service.slug}
            service={service}
            index={idx}
            theme="dark"
          />
        ))}
      </div>
    </section>
  );
}
