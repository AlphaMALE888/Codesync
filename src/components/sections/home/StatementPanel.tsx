"use client";

import React from "react";
import { cn } from "@/lib/cn";

export function StatementPanel() {
  return (
    <section className="w-full py-12 px-[clamp(8px,1.2vw,16px)] bg-transparent">
      <div
        className={cn(
          "relative w-full rounded-lg bg-surface-dark/55 text-on-dark overflow-hidden",
          "min-h-[70svh] p-8 sm:p-14 lg:p-20 flex flex-col justify-end border border-white/10 shadow-2xl"
        )}
      >
        {/* Subtle Directional Crimson/Charcoal Horizon Scrim (particles shine through) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 28%, rgba(165, 31, 61, 0.14) 0%, rgba(18, 18, 20, 0.1) 50%, rgba(9, 9, 11, 0.55) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Lower-Left Bold Manifesto Statement */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="type-label text-accent-soft tracking-widest text-xs font-mono block">
            THE CODESYNC COMMITMENT
          </span>
          <h2 className="type-h1 font-bold text-white tracking-tighter text-balance">
            We don&apos;t promise rankings. <br />
            <span className="text-text-secondary-on-dark">We build the work that earns them.</span>
          </h2>
          <p className="type-body text-text-secondary-on-dark max-w-xl text-sm sm:text-base pt-2 leading-relaxed">
            Sustainable growth comes from clear technical architecture, high-converting design,
            and ethical search marketing built to compound over time.
          </p>
        </div>
      </div>
    </section>
  );
}
