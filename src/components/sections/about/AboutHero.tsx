"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { motion } from "@/lib/motion";

export function AboutHero() {
  return (
    <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 bg-transparent border-b border-white/10 relative overflow-hidden">
      <Container>
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow className="text-accent-soft" withRule>COMPANY</Eyebrow>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heading level={1} className="mt-4 text-display-md sm:text-display-lg text-ink font-medium tracking-tight">
              A Lucknow team for marketing and software.
            </Heading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-lg sm:text-xl text-text-secondary max-w-3xl leading-relaxed"
          >
            CODESYNC combines performance digital marketing with in-house software engineering. Based in Lucknow, we build and run revenue-generating campaigns, modern web architectures, and custom enterprise software for ambitious businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <SplitArrowButton href="/contact" variant="solid-light">Book a free call</SplitArrowButton>
            <a
              href="#careers"
              className="text-sm font-medium text-text-secondary hover:text-accent-soft underline underline-offset-4 transition-colors min-h-[44px] inline-flex items-center"
            >
              Explore careers & culture
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
