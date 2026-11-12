"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { ProcessArt } from "@/components/illustrations/ProcessArt";
import { Reveal } from "@/components/ui/Reveal";
import { motion, AnimatePresence } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ProcessAccordion() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      name: "01",
      title: "Discover",
      timeHint: "Week 1",
      desc: "We analyze your business, target audience, local competitors, service offer, and commercial growth goals to align on clear scope.",
    },
    {
      num: 2,
      name: "02",
      title: "Plan",
      timeHint: "Week 1–2",
      desc: "We define the sitemap, messaging hierarchy, service positioning, and technical roadmap before any design or code begins.",
    },
    {
      num: 3,
      name: "03",
      title: "Build",
      timeHint: "Week 2–3",
      desc: "We design and build your responsive pages, web apps, forms, and analytics tracking, sharing live progress updates as we go.",
    },
    {
      num: 4,
      name: "04",
      title: "Launch",
      timeHint: "Launch Day",
      desc: "We run quality checks across all devices, deploy to production, verify live form delivery, and monitor real customer enquiries.",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-surface-dark text-on-dark overflow-hidden border-t border-white/10">
      <Container>
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 sm:mb-20 space-y-4">
            <Eyebrow className="text-accent-soft text-xs" withRule>
              HOW WE WORK
            </Eyebrow>
            <Heading level={2} className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              A clear path from brief to launch.
            </Heading>
          </div>
        </Reveal>

        {/* Two-Column Process Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Diagram Card (Span 5) */}
          <div className="lg:col-span-5 w-full">
            <Reveal>
              <div className="rounded-md border border-white/10 bg-surface-dark-2 p-8 sm:p-10 flex flex-col justify-between min-h-[340px] shadow-xl">
                <div>
                  <span className="type-label text-accent-soft font-mono text-xs block mb-2">
                    ACTIVE STAGE // 0{activeStep}
                  </span>
                  <div className="font-display font-bold text-2xl text-white">
                    {steps.find((s) => s.num === activeStep)?.title} Phase
                  </div>
                </div>

                <div className="py-6">
                  <ProcessArt activeStep={activeStep} />
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary-on-dark border-t border-white/10 pt-4">
                  <span>Transparent 4-Stage Method</span>
                  <span className="font-mono text-white/80">{steps.find((s) => s.num === activeStep)?.timeHint}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Process Accordion Rows (Span 7) */}
          <div className="lg:col-span-7 w-full space-y-3">
            {steps.map((step) => {
              const isOpen = activeStep === step.num;

              return (
                <div
                  key={step.num}
                  className={cn(
                    "rounded-md border transition-all duration-base overflow-hidden",
                    isOpen
                      ? "bg-surface-dark-2 border-white/20 shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                  onMouseEnter={() => setActiveStep(step.num)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(step.num)}
                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span
                        className={cn(
                          "font-mono font-bold text-sm sm:text-base transition-colors",
                          isOpen ? "text-accent-soft" : "text-white/40"
                        )}
                      >
                        {step.name}
                      </span>
                      <span className="font-display font-semibold text-lg sm:text-xl text-white tracking-tight">
                        {step.title}
                      </span>
                    </div>

                    <CategoryPill variant={isOpen ? "dark" : "outline"}>
                      {step.timeHint}
                    </CategoryPill>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-text-secondary-on-dark leading-relaxed border-t border-white/10">
                          {step.desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Closing Line & CTA */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-text-secondary-on-dark font-medium">
                Every project is delivered with weekly tracking and direct developer communication.
              </span>
              <SplitArrowButton href="/contact#book-a-call" variant="solid-light" size="md">
                Plan your project
              </SplitArrowButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
