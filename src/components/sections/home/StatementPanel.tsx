"use client";

import React, { useRef } from "react";
import { StatementArt } from "@/components/illustrations/StatementArt";
import { useGSAPContext, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

export function StatementPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Desktop Scroll-Triggered Subtle Scale Scrub
  useGSAPContext(
    panelRef,
    () => {
      if (shouldReduceMotion || typeof window === "undefined") return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (svgRef.current && panelRef.current) {
          gsap.fromTo(
            svgRef.current,
            { scale: 0.9 },
            {
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: panelRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    [shouldReduceMotion]
  );

  return (
    <section className="w-full py-12 px-[clamp(8px,1.2vw,16px)] bg-canvas">
      <div
        ref={panelRef}
        className={cn(
          "relative w-full rounded-lg bg-surface-dark text-on-dark overflow-hidden",
          "min-h-[70svh] p-8 sm:p-14 lg:p-20 flex flex-col justify-end border border-white/10 shadow-2xl"
        )}
      >
        {/* Upper-Right Scaled Concentric Arches */}
        <div className="absolute -top-12 -right-12 sm:top-0 sm:right-0 w-[320px] sm:w-[480px] lg:w-[600px] pointer-events-none">
          <StatementArt ref={svgRef} />
        </div>

        {/* Lower-Left Bold Manifesto Statement */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="type-label text-accent-soft tracking-widest text-xs font-mono block">
            THE CODESYNC COMMITMENT
          </span>
          <h2 className="type-h1 font-bold text-white tracking-tighter text-balance">
            We don&apos;t promise rankings. <br />
            <span className="text-white/60">We build the work that earns them.</span>
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
