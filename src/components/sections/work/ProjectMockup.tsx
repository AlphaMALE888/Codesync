"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useGSAPContext } from "@/lib/gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

interface ProjectMockupProps {
  imageSrc?: string;
  imageAlt?: string;
  urlLabel?: string;
}

export function ProjectMockup({
  imageSrc,
  imageAlt = "Project System Mockup",
  urlLabel = "cdmlko.com/systems",
}: ProjectMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAPContext(
    containerRef,
    () => {
      if (prefersReducedMotion || !containerRef.current || !imageRef.current) return;

      // Desktop parallax scroll scrub
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    [prefersReducedMotion]
  );

  return (
    <section ref={containerRef} className="py-16 sm:py-24 bg-canvas border-b border-hairline overflow-hidden">
      <Container>
        {/* Centered Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block mb-2">
            SYSTEM ARCHITECTURE & INTERFACE
          </span>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink tracking-tight">
            Production Interface & Deliverable
          </h2>
        </div>

        {/* Browser Window Frame (1200px max) */}
        <div className="max-w-6xl mx-auto rounded-lg overflow-hidden border border-hairline shadow-2xl bg-white">
          {/* Chrome Bar */}
          <div className="bg-[#EBEBE8] px-4 py-3 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#E06C75]/60" />
              <div className="w-3 h-3 rounded-full bg-[#E5C07B]/60" />
              <div className="w-3 h-3 rounded-full bg-[#98C379]/60" />
            </div>

            {/* Address Pill */}
            <div className="px-6 py-1 rounded-sm bg-white/80 border border-hairline text-xs font-mono text-text-secondary truncate max-w-[260px] sm:max-w-md">
              {urlLabel}
            </div>

            <div className="w-10 sm:w-16" />
          </div>

          {/* Screenshot Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-surface-muted">
            <div ref={imageRef} className="relative w-full h-[106%] -top-[3%]">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#F2F2F0] to-[#E5E5E2] text-center">
                  <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">
                    SYSTEM INTERFACE PREVIEW
                  </span>
                  <span className="font-display font-medium text-lg text-ink/70 mt-2">
                    Verified Digital Deliverable
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
