"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { cn } from "@/lib/cn";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // e.g., -10 to +10 percentage shift
  className?: string;
  scrub?: number | boolean;
}

export function Parallax({
  children,
  speed = -5,
  className,
  scrub = 1,
}: ParallaxProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (prefersReducedMotion || !isDesktop || !targetRef.current) return;

    const el = targetRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub,
            onToggle: (self) => {
              if (self.isActive) {
                el.style.willChange = "transform";
              } else {
                el.style.willChange = "auto";
              }
            },
          },
        }
      );
    });

    return () => {
      ctx.revert();
      if (el) el.style.willChange = "auto";
    };
  }, [speed, scrub, prefersReducedMotion, isDesktop]);

  return (
    <div ref={targetRef} className={cn("w-full h-full", className)}>
      {children}
    </div>
  );
}
