"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface HeroPreviewCardProps {
  className?: string;
}

export function HeroPreviewCard({ className }: HeroPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("hidden md:block select-none", className)}
    >
      <Link
        href="/services"
        className={cn(
          "group block w-[240px] sm:w-[260px] p-5 rounded-md",
          "bg-surface-dark-2/80 backdrop-blur-md border border-white/15",
          "text-on-dark shadow-xl transition-all duration-base ease-out-custom",
          "hover:-translate-y-1 hover:border-accent-soft hover:bg-surface-dark-2/95",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-accent-soft">
            <ArchMotif size="sm" />
            <span className="type-label font-bold text-[11px] tracking-wider text-white">
              GROW &bull; BUILD &bull; RUN
            </span>
          </div>

          <span
            className={cn(
              "w-7 h-7 rounded-pill bg-white/10 flex items-center justify-center text-white",
              "transition-all duration-fast ease-out-custom group-hover:bg-accent group-hover:rotate-45"
            )}
            aria-hidden="true"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <p className="text-xs text-text-secondary-on-dark leading-relaxed group-hover:text-white transition-colors duration-fast">
          Marketing, websites and business software from one Lucknow team.
        </p>
      </Link>
    </motion.div>
  );
}
