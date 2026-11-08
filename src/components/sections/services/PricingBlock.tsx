"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { siteConfig } from "@/data/site";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { ServiceItem } from "@/data/types";
import { features } from "@/data/features";

interface PricingBlockProps {
  pricing: ServiceItem["pricing"];
  serviceName: string;
}

export function PricingBlock({ pricing, serviceName }: PricingBlockProps) {
  // If verified numbers are approved and feature flag enabled (Phase 8), render numbers.
  // Otherwise, strictly render the quote-first card per Phase 5 prompt instructions.
  const showNumbers = features.pricingNumbers && pricing.priceStatus === "verified" && pricing.fromPrice !== null;

  return (
    <section className="py-16 sm:py-24 bg-canvas border-b border-hairline">
      <Container>
        <div className="max-w-4xl mx-auto rounded-lg bg-white border border-hairline p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-hairline">
            <div>
              <Eyebrow className="text-accent text-xs">TRANSPARENT PRICING</Eyebrow>
              <Heading level={3} className="mt-3 text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                {showNumbers
                  ? `From ₹${pricing.fromPrice?.toLocaleString("en-IN")} / ${pricing.model}`
                  : "Scope-based honest quotation."}
              </Heading>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-mono shrink-0 self-start">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Hidden Fees</span>
            </div>
          </div>

          <div className="py-6">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Pricing depends on your goals and scope. Tell us what you need and we will send a clear quote.
            </p>
            {pricing.note && (
              <p className="mt-2 text-sm text-text-secondary/80 font-mono">
                Note: {pricing.note}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-hairline flex flex-wrap items-center gap-4 sm:gap-6">
            <SplitArrowButton href={`/contact?service=${encodeURIComponent(serviceName)}`}>
              Request a clear quote
            </SplitArrowButton>
            <Link
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-accent transition-colors min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Discuss on WhatsApp
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
