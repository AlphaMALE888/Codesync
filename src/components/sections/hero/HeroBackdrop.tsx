"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface HeroBackdropProps {
  className?: string;
  archBackRef?: React.RefObject<SVGGElement | null>;
  archMidRef?: React.RefObject<SVGGElement | null>;
  archFrontRef?: React.RefObject<SVGGElement | null>;
}

export const HeroBackdrop = forwardRef<HTMLDivElement, HeroBackdropProps>(
  function HeroBackdrop({ className, archBackRef, archMidRef, archFrontRef }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none -z-10 rounded-lg",
          className
        )}
        aria-hidden="true"
      >
        {/* Base Atmospheric Deep Forest Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C3829] via-[#162B20] to-[#0D1510]" />

        {/* Layered Awadhi Pointed-Arch Architectural Silhouettes */}
        <svg
          viewBox="0 0 1440 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full opacity-70"
        >
          <defs>
            <linearGradient id="archGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2F5A44" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#111A14" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="archGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3C6E54" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#111A14" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="archGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#49735A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0B130E" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Layer 1: Back Tall Arch Silhouette (Travels -4%) */}
          <g ref={archBackRef as any} className="will-change-transform">
            <path
              d="M720 120 C850 200 960 380 960 620 V960 H480 V620 C480 380 590 200 720 120 Z"
              fill="url(#archGradBack)"
              stroke="#49735A"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d="M1240 280 C1320 340 1400 480 1400 680 V960 H1080 V680 C1080 480 1160 340 1240 280 Z"
              fill="url(#archGradBack)"
              stroke="#49735A"
              strokeWidth="0.75"
              strokeOpacity="0.2"
            />
          </g>

          {/* Layer 2: Mid Offset Arch Silhouettes (Travels -9%) */}
          <g ref={archMidRef as any} className="will-change-transform">
            <path
              d="M320 240 C430 320 520 480 520 720 V960 H120 V720 C120 480 210 320 320 240 Z"
              fill="url(#archGradMid)"
              stroke="#49735A"
              strokeWidth="1.25"
              strokeOpacity="0.35"
            />
            <path
              d="M980 260 C1080 340 1160 500 1160 740 V960 H800 V740 C800 500 880 340 980 260 Z"
              fill="url(#archGradMid)"
              stroke="#49735A"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          </g>

          {/* Layer 3: Front Prominent Pointed Arch Geometry (Travels -14%) */}
          <g ref={archFrontRef as any} className="will-change-transform">
            <path
              d="M660 320 C760 390 840 540 840 760 V960 H480 V760 C480 540 560 390 660 320 Z"
              fill="url(#archGradFront)"
              stroke="#68A081"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          </g>
        </svg>

        {/* Static Film-Grain Overlay (SVG feTurbulence Noise at 6% Opacity) */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bottom Vignette for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-black/20" />
      </div>
    );
  }
);
