"use client";

import React, { useRef } from "react";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroPreviewCard } from "./HeroPreviewCard";
import { TrustRail } from "./TrustRail";
import { LineReveal } from "@/components/motion/LineReveal";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { TextLink } from "@/components/ui/TextLink";
import { Eyebrow } from "@/components/ui/Typography";
import { siteConfig } from "@/data/site";
import { motion } from "@/lib/motion";
import { useGSAPContext, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const copyBlockRef = useRef<HTMLDivElement>(null);
  const archBackRef = useRef<SVGGElement>(null);
  const archMidRef = useRef<SVGGElement>(null);
  const archFrontRef = useRef<SVGGElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  // Desktop GSAP ScrollTrigger Scroll Exit Choreography
  useGSAPContext(
    heroRef,
    () => {
      if (shouldReduceMotion || typeof window === "undefined") return;

      const mm = gsap.matchMedia();

      // Only on desktop (min-width: 768px)
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Copy block scrub
        if (copyBlockRef.current) {
          tl.to(
            copyBlockRef.current,
            {
              yPercent: -8,
              opacity: 0.4,
              ease: "none",
            },
            0
          );
        }

        // Layered Arches Parallax Depth
        if (archBackRef.current) {
          tl.to(archBackRef.current, { yPercent: -4, ease: "none" }, 0);
        }
        if (archMidRef.current) {
          tl.to(archMidRef.current, { yPercent: -9, ease: "none" }, 0);
        }
        if (archFrontRef.current) {
          tl.to(archFrontRef.current, { yPercent: -14, ease: "none" }, 0);
        }

        // Backdrop subtle scale
        if (backdropRef.current) {
          tl.to(backdropRef.current, { scale: 1.06, ease: "none" }, 0);
        }
      });
    },
    [shouldReduceMotion]
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className={cn(
        "relative w-full mx-auto px-[clamp(8px,1.2vw,16px)] pb-4",
        "min-h-[calc(100svh-16px)] h-auto md:h-[min(calc(100svh-16px),960px)] md:min-h-[620px]"
      )}
    >
      {/* Outer Rounded Hero Frame */}
      <div className="relative w-full min-h-full rounded-lg overflow-hidden flex flex-col justify-between p-5 sm:p-10 md:p-14 border border-white/10 shadow-2xl">
        {/* Layered Architectural Backdrop & Film-Grain */}
        <HeroBackdrop
          ref={backdropRef}
          archBackRef={archBackRef}
          archMidRef={archMidRef}
          archFrontRef={archFrontRef}
        />

        {/* Top Region: Floating Teaser Preview Card (Upper Right) */}
        <div className="w-full flex justify-end pt-12 sm:pt-8 pointer-events-auto">
          <HeroPreviewCard />
        </div>

        {/* Bottom Region: Copy Block & Trust Rail */}
        <div className="w-full space-y-8 sm:space-y-10">
          {/* Main Copy Block */}
          <div ref={copyBlockRef} className="max-w-4xl space-y-6">
            {/* Eyebrow Label */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0.7 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
            >
              <Eyebrow className="text-white tracking-widest text-[11px] sm:text-xs uppercase">
                {siteConfig.positioning}
              </Eyebrow>
            </motion.div>

            {/* Art-Directed Two-Line Staggered Mask Headline */}
            <LineReveal
              lines={[
                "Marketing that grows revenue.",
                "Software that moves business forward.",
              ]}
              className="text-white tracking-tighter"
              lineClassName={(idx) =>
                idx === 0
                  ? "type-h1 font-bold text-white text-balance"
                  : "type-h2 font-medium text-text-secondary-on-dark text-balance mt-1 sm:mt-2"
              }
            />

            {/* Supporting Value Proposition Sentence */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0.8 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
              className="type-body text-white/80 max-w-[54ch] leading-relaxed text-sm sm:text-base"
            >
              We help Lucknow businesses attract qualified leads with SEO, local SEO, Google Ads, Meta Ads and social media, 
              then build the websites, web apps and CRM software that turn demand into growth.
            </motion.p>

            {/* CTAs Row */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
            >
              <SplitArrowButton
                href="/contact#book-a-call"
                variant="solid-light"
                size="lg"
              >
                Book a free call
              </SplitArrowButton>

              <TextLink
                href={siteConfig.contact.whatsapp}
                external
                className="text-white hover:text-accent-soft text-sm sm:text-base font-medium"
              >
                WhatsApp us &rarr;
              </TextLink>
            </motion.div>
          </div>

          {/* Bottom Trust Rail */}
          <TrustRail />
        </div>
      </div>
    </section>
  );
}
