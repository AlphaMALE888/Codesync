"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

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
          "absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 rounded-lg",
          className
        )}
        aria-hidden="true"
      >
        {/* Restrained crimson aura centered tightly behind the right particle sphere */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle var(--hero-sphere-glow-r, 320px) at var(--hero-sphere-x, 73.5%) var(--hero-sphere-y, 63%), rgba(161, 38, 66, 0.24) 0%, rgba(100, 19, 38, 0.1) 52%, transparent 88%)",
          }}
        />

        {/* Subtle Film-Grain Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Directional Left Readability Scrim for Hero Copy & CTAs only */}
        <div className="absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-[#09090B]/80 via-[#09090B]/35 to-transparent" />
      </div>
    );
  }
);
