"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { GrowArt } from "@/components/illustrations/GrowArt";
import { BuildArt } from "@/components/illustrations/BuildArt";
import { RunArt } from "@/components/illustrations/RunArt";
import { Reveal } from "@/components/ui/Reveal";
import { motion, AnimatePresence } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function CapabilityAccordion() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const capabilities = [
    {
      num: "001",
      name: "GROW",
      title: "Digital Marketing & Visibility",
      desc: "Attract high-intent local and regional enquiries with data-driven SEO, Google Ads, and Meta lead funnels.",
      services: [
        { label: "Local SEO & Google Business Profile", href: "/services/local-seo-google-business-profile" },
        { label: "SEO (Search Engine Optimization)", href: "/services/seo" },
        { label: "Google Ads & PPC Campaigns", href: "/services/google-ads-ppc" },
        { label: "Meta Ads & Lead Generation", href: "/services/meta-ads-lead-generation" },
        { label: "Social Media, Content & Bulk SMS", href: "/services/social-content-email-sms" },
      ],
      art: <GrowArt className="text-accent-soft max-w-[260px]" />,
    },
    {
      num: "002",
      name: "BUILD",
      title: "Websites & Mobile Apps",
      desc: "Fast, responsive web systems and iOS/Android applications engineered for conversion, speed, and clean code.",
      services: [
        { label: "Business Websites (WordPress/Custom)", href: "/services/business-websites" },
        { label: "E-Commerce Stores & Multi-Vendor", href: "/services/ecommerce-websites" },
        { label: "Mobile Apps (Android & iOS)", href: "/services/mobile-apps" },
        { label: "UI/UX & Brand Graphic Design", href: "/services/ui-ux-graphic-design" },
        { label: "Domain, Hosting & Maintenance", href: "/services/domain-hosting-maintenance" },
      ],
      art: <BuildArt className="text-accent-soft max-w-[260px]" />,
    },
    {
      num: "003",
      name: "RUN",
      title: "Business Software Solutions",
      desc: "Custom CRM, ERP, GST billing, and HRMS platforms that eliminate manual friction and connect your business.",
      services: [
        { label: "Custom CRM Platforms", href: "/services/crm" },
        { label: "ERP, GST Billing & POS Systems", href: "/services/erp-billing-gst" },
        { label: "HRMS & Automated Payroll", href: "/services/hrms-payroll" },
        { label: "Custom Software & API Integrations", href: "/services/custom-software" },
      ],
      art: <RunArt className="text-accent-soft max-w-[260px]" />,
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-surface-dark text-on-dark overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Narrative Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <Eyebrow className="text-accent-soft tracking-widest text-xs" withRule>
                WHAT WE DO
              </Eyebrow>
            </Reveal>

            <Reveal delay={0.1}>
              <Heading level={2} className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Grow. Build. Run.
              </Heading>
            </Reveal>

            <Reveal delay={0.15}>
              <Text variant="secondary-on-dark" className="text-base sm:text-lg leading-relaxed max-w-md">
                One Lucknow team for the marketing that brings enquiries and the software that handles them.
              </Text>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="pt-2">
                <SplitArrowButton
                  href="/services"
                  variant="solid-light"
                  size="lg"
                >
                  Explore all services
                </SplitArrowButton>
              </div>
            </Reveal>
          </div>

          {/* Right Modular Accordion Panels (7 Cols) */}
          <div className="lg:col-span-7 w-full">
            {/* Desktop Horizontal Accordion (hidden below lg) */}
            <div className="hidden lg:flex gap-3 h-[480px] w-full">
              {capabilities.map((item, idx) => {
                const isActive = activeTab === idx;

                return (
                  <motion.div
                    key={item.num}
                    onClick={() => setActiveTab(idx)}
                    layout
                    transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                    className={cn(
                      "relative rounded-md border overflow-hidden cursor-pointer select-none transition-colors duration-base",
                      isActive
                        ? "flex-1 bg-surface-dark-2 border-white/20 p-8 flex flex-col justify-between"
                        : "w-[72px] bg-white/5 hover:bg-white/10 border-white/10 flex flex-col items-center justify-between py-8"
                    )}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveTab(idx);
                      }
                    }}
                  >
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="flex flex-col justify-between h-full w-full"
                      >
                        {/* Header */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs text-accent-soft font-bold tracking-wider">
                              {item.num} {"//"} {item.name}
                            </span>
                            <Link
                              href="/services"
                              className="w-8 h-8 rounded-pill bg-white/10 hover:bg-accent flex items-center justify-center text-white transition-colors"
                              aria-label={`Explore ${item.title}`}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          </div>

                          <h3 className="font-display font-semibold text-2xl text-white tracking-tight mb-2">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-text-secondary-on-dark leading-relaxed max-w-lg mb-6">
                            {item.desc}
                          </p>

                          {/* Services List Links */}
                          <div className="space-y-1.5 border-t border-white/10 pt-4">
                            {item.services.map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                className="block text-xs font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all py-1"
                              >
                                &bull; {s.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Bottom SVG Line-Art */}
                        <div className="flex justify-end pt-4 opacity-75">
                          {item.art}
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <span className="font-mono text-xs text-white/60 font-bold tracking-wider">
                          {item.num}
                        </span>
                        <span
                          className="type-label font-bold text-xs tracking-widest text-white/80 [writing-mode:vertical-rl] rotate-180"
                        >
                          {item.name} &bull; {item.title}
                        </span>
                        <span className="w-2 h-2 rounded-pill bg-white/20" />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Vertical Accordion (visible below lg) */}
            <div className="lg:hidden space-y-4">
              {capabilities.map((item, idx) => {
                const isActive = activeTab === idx;

                return (
                  <div
                    key={item.num}
                    className="rounded-md border border-white/10 bg-surface-dark-2 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab(isActive ? -1 : idx)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-accent-soft font-bold">
                          {item.num}
                        </span>
                        <span className="font-display font-semibold text-lg text-white">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">{isActive ? "▲" : "▼"}</span>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-6 pt-1 space-y-4 border-t border-white/10"
                        >
                          <p className="text-xs sm:text-sm text-text-secondary-on-dark leading-relaxed">
                            {item.desc}
                          </p>

                          <div className="space-y-1.5 pt-2">
                            {item.services.map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                className="block text-xs font-medium text-white/80 hover:text-white py-1"
                              >
                                &bull; {s.label}
                              </Link>
                            ))}
                          </div>

                          <div className="pt-4 flex justify-center">
                            {item.art}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
