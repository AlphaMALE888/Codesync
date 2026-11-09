"use client";

import React from "react";
import { ProjectItem } from "@/data/types";
import { CaseStudyCard } from "./CaseStudyCard";
import { motion, AnimatePresence } from "@/lib/motion";

interface WorkGridProps {
  projects: ProjectItem[];
}

export function WorkGrid({ projects }: WorkGridProps) {
  if (projects.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-hairline rounded-md bg-canvas">
        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block mb-2">
          PORTFOLIO ARCHIVE
        </span>
        <h3 className="font-display font-medium text-xl text-ink">
          No case studies currently published in this category.
        </h3>
        <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
          We only publish verified work with formal client authorization. Check back soon for newly authorized case studies.
        </p>
      </div>
    );
  }

  const shouldFeatureFirst = projects.length >= 5;

  return (
    <div className="relative min-h-[400px]">
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, idx) => {
            const isFeatured = shouldFeatureFirst && idx === 0;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
              >
                <CaseStudyCard project={project} featured={isFeatured} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
