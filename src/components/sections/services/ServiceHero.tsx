"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { ServiceItem } from "@/data/types";
import { siteConfig } from "@/data/site";
import { motion } from "@/lib/motion";
import { MessageSquare, Clock, Users, Tag } from "lucide-react";
import { GrowArt } from "@/components/illustrations/GrowArt";
import { BuildArt } from "@/components/illustrations/BuildArt";
import { RunArt } from "@/components/illustrations/RunArt";

interface ServiceHeroProps {
  service: ServiceItem;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const isDark = service.pillar === "build" || service.pillar === "run";

  const renderArt = () => {
    switch (service.pillar) {
      case "grow":
        return <GrowArt className="w-48 h-48 sm:w-64 sm:h-64 text-accent opacity-30 sm:opacity-50" />;
      case "build":
        return <BuildArt className="w-48 h-48 sm:w-64 sm:h-64 text-accent-soft opacity-30 sm:opacity-50" />;
      case "run":
        return <RunArt className="w-48 h-48 sm:w-64 sm:h-64 text-accent opacity-30 sm:opacity-50" />;
    }
  };

  return (
    <section
      className={`pt-32 sm:pt-40 pb-16 sm:pb-24 border-b relative overflow-hidden ${
        isDark
          ? "bg-surface-dark text-white border-white/10"
          : "bg-canvas text-ink border-hairline"
      }`}
    >
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 max-w-3xl">
            {/* Pillar Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Eyebrow>{service.pillar.toUpperCase()} · SERVICE DETAIL</Eyebrow>
            </motion.div>

            {/* Service Name Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-display font-medium text-display-sm sm:text-display-md tracking-tight"
            >
              {service.name}
            </motion.h1>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-6 text-lg sm:text-xl leading-relaxed ${
                isDark ? "text-text-secondary-on-dark" : "text-text-secondary"
              }`}
            >
              {service.summary}
            </motion.p>

            {/* Three Key Facts in Label Style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t ${
                isDark ? "border-white/10" : "border-hairline"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4 h-4 shrink-0 ${isDark ? "text-accent-soft" : "text-accent"}`} />
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                    Timeline
                  </span>
                  <span className="text-sm font-medium">
                    {service.timeline || "Scope dependent"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Tag className={`w-4 h-4 shrink-0 ${isDark ? "text-accent-soft" : "text-accent"}`} />
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                    Pricing Mode
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {service.pricing.model === "quote"
                      ? "Custom Quote"
                      : `${service.pricing.model} model`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 shrink-0 ${isDark ? "text-accent-soft" : "text-accent"}`} />
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                    Delivery Team
                  </span>
                  <span className="text-sm font-medium">In-house Lucknow Team</span>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <SplitArrowButton href="/contact">Book a free call</SplitArrowButton>
              <Link
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors min-h-[44px] ${
                  isDark ? "text-white/80 hover:text-white" : "text-ink/80 hover:text-ink"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                WhatsApp us
              </Link>
            </motion.div>
          </div>

          {/* Right Vector Illustration */}
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end" aria-hidden="true">
            {renderArt()}
          </div>
        </div>
      </Container>
    </section>
  );
}
