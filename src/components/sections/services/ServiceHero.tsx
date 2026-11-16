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

interface ServiceHeroProps {
  service: ServiceItem;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 border-b border-white/10 bg-surface-dark/45 text-ink relative overflow-hidden">
      <Container className="relative z-10">
        <div className="max-w-4xl">
          {/* Pillar Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow className="text-accent-soft">
              {service.pillar.toUpperCase()} · SERVICE DETAIL
            </Eyebrow>
          </motion.div>

          {/* Service Name Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display font-medium text-display-sm sm:text-display-md text-white tracking-tight"
          >
            {service.name}
          </motion.h1>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-lg sm:text-xl leading-relaxed text-text-secondary-on-dark"
          >
            {service.summary}
          </motion.p>

          {/* Three Key Facts in Label Style */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 shrink-0 text-accent-soft" />
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  Timeline
                </span>
                <span className="text-sm font-medium text-ink">
                  {service.timeline || "Scope dependent"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 shrink-0 text-accent-soft" />
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  Pricing Mode
                </span>
                <span className="text-sm font-medium text-ink capitalize">
                  {service.pricing.model === "quote"
                    ? "Custom Quote"
                    : `${service.pricing.model} model`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0 text-accent-soft" />
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                  Delivery Team
                </span>
                <span className="text-sm font-medium text-ink">In-house Lucknow Team</span>
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
            <SplitArrowButton href="/contact" variant="solid-light">
              Book a free call
            </SplitArrowButton>
            <Link
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors min-h-[44px] text-white/85 hover:text-accent-soft"
            >
              <MessageSquare className="w-4 h-4 text-accent-soft" />
              WhatsApp us
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
