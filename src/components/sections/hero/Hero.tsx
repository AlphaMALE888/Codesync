"use client";

import React, { useRef } from "react";
import { HeroBackdrop } from "./HeroBackdrop";
import { TrustRail } from "./TrustRail";
import { LineReveal } from "@/components/motion/LineReveal";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { TextLink } from "@/components/ui/TextLink";
import { Eyebrow } from "@/components/ui/Typography";
import { siteConfig } from "@/data/site";
import { motion } from "@/lib/motion";
import { useGSAPContext, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const copyBlockRef = useRef<HTMLDivElement>(null);
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

        // Backdrop subtle scale
        if (backdropRef.current) {
          tl.to(backdropRef.current, { scale: 1.04, ease: "none" }, 0);
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
        "relative w-full mx-auto px-[clamp(8px,1.2vw,16px)] pb-6 sm:pb-8 flex flex-col",
        "h-auto min-h-[calc(100svh-80px)] md:min-h-[min(calc(100svh-104px),760px)]"
      )}
    >
      {/* Outer Rounded Hero Frame */}
      <div className="relative w-full flex-1 rounded-lg flex flex-col justify-between gap-6 sm:gap-8 px-5 pt-7 pb-5 sm:px-10 sm:pt-9 sm:pb-6 md:px-14 md:pt-11 md:pb-8 border border-white/10 shadow-2xl overflow-clip bg-[#080808]">
        {/* Atmospheric Obsidian Studio Backdrop & Sculptural 3D Growth Arrow */}
        <HeroBackdrop ref={backdropRef} />

        {/* Main Copy Block */}
        <div id="hero-copy-block" ref={copyBlockRef} className="relative z-10 max-w-4xl space-y-5 sm:space-y-6">
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

        {/* Dedicated non-overlapping mobile 3D stage below CTAs */}
        <div
          id="hero-mobile-stage"
          className="md:hidden h-[270px] sm:h-[290px] w-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Bottom Trust Rail */}
        <div className="relative z-10 w-full">
          <TrustRail />
        </div>
      </div>
    </section>
  );
}
