"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { ProcessArt } from "@/components/illustrations/ProcessArt";
import { motion, AnimatePresence } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface HowItWorksProps {
  process: { step: number; title: string; desc: string }[];
}

export function HowItWorks({ process }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps =
    process && process.length === 4
      ? process
      : [
          { step: 1, title: "Discover", desc: "Audit existing assets, analyze audience requirements, and establish clear technical benchmarks." },
          { step: 2, title: "Plan", desc: "Map strategic milestones, architectures, and deliverables before execution begins." },
          { step: 3, title: "Build", desc: "Develop and deploy according to rigorous engineering and creative standards." },
          { step: 4, title: "Launch & Scale", desc: "Test across all devices, deploy to production, and monitor performance compounding." },
        ];

  return (
    <section className="w-full py-20 sm:py-28 bg-surface-dark text-on-dark overflow-hidden border-b border-white/10">
      <Container>
        {/* Section Header */}
        <div className="mb-14 sm:mb-20 space-y-4">
          <Eyebrow className="text-accent-soft text-xs" withRule>
            HOW IT WORKS
          </Eyebrow>
          <Heading level={2} className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Predictable delivery from brief to results.
          </Heading>
        </div>

        {/* Process Layout: Diagram Card + Step Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Diagram Card */}
          <div className="lg:col-span-5 w-full order-1 lg:order-1">
            <div className="rounded-md border border-white/10 bg-surface-dark-2 p-8 sm:p-10 flex flex-col justify-between min-h-[340px] shadow-xl">
              <div>
                <span className="type-label text-accent-soft font-mono text-xs block mb-2">
                  ACTIVE PHASE // 0{activeStep}
                </span>
                <div className="font-display font-medium text-2xl text-white">
                  {steps.find((s) => s.step === activeStep)?.title} Stage
                </div>
              </div>

              <div className="py-6">
                <ProcessArt activeStep={activeStep} />
              </div>

              <p className="text-xs text-text-secondary-on-dark font-mono tracking-wider uppercase">
                Step {activeStep} of 4 · CODESYNC Delivery Framework
              </p>
            </div>
          </div>

          {/* Step Accordion List */}
          <div className="lg:col-span-7 space-y-4 order-2 lg:order-2">
            {steps.map((s) => {
              const isOpen = activeStep === s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={cn(
                    "cursor-pointer rounded-md border p-6 transition-all duration-300",
                    isOpen
                      ? "border-accent bg-surface-dark-2 shadow-lg"
                      : "border-white/10 bg-transparent hover:border-white/20"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveStep(s.step);
                    }
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "font-mono text-sm tracking-widest font-semibold transition-colors",
                          isOpen ? "text-accent-soft" : "text-white/40"
                        )}
                      >
                        0{s.step}
                      </span>
                      <span className="font-display font-medium text-xl sm:text-2xl text-white">
                        {s.title}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-mono text-sm transition-transform duration-300",
                        isOpen
                          ? "bg-accent text-white rotate-45"
                          : "bg-white/5 text-white/40"
                      )}
                    >
                      +
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 pt-4 border-t border-white/10 text-text-secondary-on-dark text-sm sm:text-base leading-relaxed">
                          {s.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
