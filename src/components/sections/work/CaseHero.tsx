"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { ProjectItem } from "@/data/types";
import { motion } from "@/lib/motion";

interface CaseHeroProps {
  project: ProjectItem;
}

export function CaseHero({ project }: CaseHeroProps) {
  const primaryMedia = project.media?.[0];
  const primaryCategory = project.category?.[0] || "Case Study";

  return (
    <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 bg-surface-dark/55 text-white border-b border-white/10 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Metadata & Title */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Label Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <Eyebrow className="text-accent-soft">{primaryCategory}</Eyebrow>
              {project.year && (
                <span className="font-mono text-xs text-white/50 tracking-wider">
                  / {project.year}
                </span>
              )}
            </motion.div>

            {/* Title (2-3 lines) */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-display font-medium text-display-sm sm:text-display-md tracking-tight leading-tight text-white"
            >
              {project.summary}
            </motion.h1>

            {/* One explanatory sentence */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-base sm:text-lg text-text-secondary-on-dark leading-relaxed"
            >
              {project.challenge}
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <SplitArrowButton href="/contact">Discuss a similar project</SplitArrowButton>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual in Rounded Frame */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] rounded-md overflow-hidden border border-white/10 bg-surface-dark-2 shadow-2xl"
            >
              {primaryMedia ? (
                <Image
                  src={primaryMedia.src}
                  alt={primaryMedia.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-surface-dark-2 to-[#1E2022]">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent-soft block mb-2">
                    {project.client.name}
                  </span>
                  <span className="font-display font-medium text-xl text-white">
                    {project.industry}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
