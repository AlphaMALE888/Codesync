"use client";

import React from "react";
import { motion } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ProjectItem } from "@/data/types";
import { CaseStudyCard } from "./CaseStudyCard";

interface SelectedWorkGridProps {
  projects: ProjectItem[];
}

export function SelectedWorkGrid({ projects }: SelectedWorkGridProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {projects.map((project) => (
          <CaseStudyCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 28, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{
            duration: 0.65,
            delay: Math.min(idx, 5) * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full"
        >
          <CaseStudyCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
