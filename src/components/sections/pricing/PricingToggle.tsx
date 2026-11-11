"use client";

import React from "react";
import { motion } from "@/lib/motion";

export type PricingPillar = "grow" | "build" | "run";

interface PricingToggleProps {
  activePillar: PricingPillar;
  onChange: (pillar: PricingPillar) => void;
}

const PILLARS: { id: PricingPillar; label: string; sub: string }[] = [
  { id: "grow", label: "Grow", sub: "Monthly Marketing" },
  { id: "build", label: "Build", sub: "Websites & Mobile Apps" },
  { id: "run", label: "Run", sub: "Business Software" },
];

export function PricingToggle({ activePillar, onChange }: PricingToggleProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      const nextIndex = (index + 1) % PILLARS.length;
      onChange(PILLARS[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      const prevIndex = (index - 1 + PILLARS.length) % PILLARS.length;
      onChange(PILLARS[prevIndex].id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Tablist Pill */}
      <div
        role="tablist"
        aria-label="Service pricing categories"
        className="relative inline-flex p-1.5 rounded-full bg-surface-muted border border-hairline w-full max-w-xl"
      >
        {PILLARS.map((p, idx) => {
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(p.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="relative z-10 flex-1 py-3 px-3 rounded-full text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer min-h-[44px]"
            >
              {isActive && (
                <motion.div
                  layoutId="pricing-active-pill"
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-white rounded-full shadow-sm border border-hairline/60"
                />
              )}
              <div className="relative z-10">
                <span className={`block font-display font-medium text-sm sm:text-base ${isActive ? "text-ink" : "text-text-secondary"}`}>
                  {p.label}
                </span>
                <span className={`hidden sm:block text-[11px] font-mono ${isActive ? "text-accent font-semibold" : "text-text-secondary/60"}`}>
                  {p.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Honest Scope Note */}
      <p className="mt-4 text-xs font-mono text-text-secondary text-center">
        Prices depend on scope. We will review your goals and send a transparent quote.
      </p>
    </div>
  );
}
