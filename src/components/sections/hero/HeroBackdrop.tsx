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

        {/* Subtle Film-Grain Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.028] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Directional Left Readability Scrim for Hero Copy & CTAs */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-[#080808]/88 via-[#080808]/45 to-transparent" />
      </div>
    );
  }
);
