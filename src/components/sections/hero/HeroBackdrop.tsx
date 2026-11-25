"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { GrowthArrowScene } from "./GrowthArrowScene";

export interface HeroBackdropProps {
  className?: string;
}

export const HeroBackdrop = forwardRef<HTMLDivElement, HeroBackdropProps>(
  function HeroBackdrop({ className }, ref) {
    return (
      <div
        id="hero-backdrop"
        ref={ref}
        className={cn(
          "absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 rounded-lg bg-[#080808]",
          className
        )}
        aria-hidden="true"
      >
        {/* Subtle restrained crimson studio backlight tucked behind right sculpture */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 420px at 74% 62%, rgba(200, 16, 46, 0.14) 0%, rgba(111, 0, 24, 0.08) 45%, transparent 82%)",
          }}
        />

        {/* Interactive 3D Sculptural Growth Arrow Scene */}
        <GrowthArrowScene />

        {/* Directional Left Readability Scrim for Hero Copy & CTAs */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-[#080808]/88 via-[#080808]/45 to-transparent pointer-events-none" />
      </div>
    );
  }
);
