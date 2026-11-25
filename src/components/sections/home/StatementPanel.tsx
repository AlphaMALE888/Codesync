"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { CommitmentContent } from "./commitment/CommitmentContent";
import { LayeredArchitecture } from "./commitment/LayeredArchitecture";

export function StatementPanel() {
  return (
    <section
      id="commitment-section"
      aria-label="The CodeSync Commitment"
      className="w-full py-10 sm:py-12 px-[clamp(8px,1.2vw,16px)] bg-transparent"
    >
      <div
        className={cn(
          "relative w-full rounded-lg bg-[#080808]/90 text-on-dark overflow-hidden",
          "px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 xl:px-20",
          "border border-white/10 shadow-2xl"
        )}
      >
        {/* Subtle dark architectural ambient vignette keeping negative space rich and focused */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 64% 88%, rgba(112, 0, 24, 0.16) 0%, rgba(14, 14, 16, 0.25) 48%, rgba(8, 8, 8, 0.92) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Balanced Two-Column Editorial + Exploded 4-Layer Architectural Layout */}
        <div className="relative z-10 max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.15fr)] items-center gap-12 lg:gap-10 xl:gap-14">
          <CommitmentContent />
          <div className="w-full flex justify-center lg:justify-end">
            <LayeredArchitecture />
          </div>
        </div>
      </div>
    </section>
  );
}
