"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ProjectItem } from "@/data/types";
import { MetricGrid } from "./MetricGrid";

interface CaseStudyCardProps {
  project: ProjectItem;
  featured?: boolean;
}

export function CaseStudyCard({ project, featured = false }: CaseStudyCardProps) {
  const primaryMedia = project.media?.[0];
  const primaryCategory = project.category?.[0] || "Case Study";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group relative flex flex-col rounded-md border border-hairline bg-white overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        featured ? "lg:col-span-2" : "col-span-1"
      }`}
    >
      {/* 16:10 Media Panel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
        {primaryMedia ? (
          <div className="relative w-full h-full">
            <Image
              src={primaryMedia.src}
              alt={primaryMedia.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:contrast-[1.04]"
            />
          </div>
        ) : (
          /* Subtle graphic fallback preventing layout shift */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-surface-muted to-[#DFE3E1] text-text-secondary select-none">
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary/70">
              {project.industry}
            </span>
            <span className="font-display font-medium text-lg text-ink/80 mt-2 text-center">
              {project.client.name}
            </span>
          </div>
        )}

        {/* Top Overlay Pills */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {/* Client Pill */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono tracking-wider text-ink border border-white/40 shadow-sm max-w-[200px] truncate">
            {project.client.name}
          </span>

          {/* Category Pill */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-ink/80 backdrop-blur-md text-[11px] font-mono tracking-wider text-white border border-white/10 shadow-sm">
            {primaryCategory}
          </span>
        </div>

        {/* Corner Hover Arrow Tile */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-ink border border-white/50 shadow-sm opacity-0 sm:opacity-100 transition-all duration-200 group-hover:bg-accent group-hover:text-white">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
        </div>
      </div>

      {/* Card Content & Metrics */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-display font-medium text-xl sm:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
            <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              {project.summary}
            </span>
          </h3>
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {project.challenge}
          </p>
        </div>

        {/* 2x2 Metric Grid or Deliverable Scope */}
        <div className="mt-4">
          <MetricGrid metrics={project.metrics} deliverables={project.deliverables} />
        </div>
      </div>
    </Link>
  );
}
