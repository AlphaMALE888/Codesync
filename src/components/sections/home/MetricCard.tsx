"use client";

import React from "react";
import { cn } from "@/lib/cn";
import {
  setParticleFocusFromElement,
  clearParticleFocus,
} from "@/components/particles/particleState";

export interface MetricCardProps {
  children: React.ReactNode;
  tone?: "dark" | "light" | "muted";
  className?: string;
}

export function MetricCard({ children, tone = "light", className }: MetricCardProps) {
  const toneClass = {
    dark: "bg-surface-dark/88 text-on-dark border-accent/30 hover:border-accent-soft/60 shadow-lg",
    light: "bg-surface-dark/78 text-ink border-white/12 hover:border-accent-soft/45 shadow-md",
    muted: "bg-surface-dark-2/80 text-ink border-white/12 hover:border-accent-soft/45 shadow-md",
  }[tone];

  return (
    <div
      onMouseEnter={(e) => setParticleFocusFromElement(e.currentTarget, "attract", 0.75)}
      onMouseLeave={() => clearParticleFocus()}
      className={cn(
        "rounded-md p-6 sm:p-7 border flex flex-col justify-between transition-all duration-base hover:-translate-y-0.5",
        toneClass,
        className
      )}
    >
      {children}
    </div>
  );
}
