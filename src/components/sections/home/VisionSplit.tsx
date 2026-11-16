"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Typography";
import { features } from "@/data/features";
import { MediaSlot } from "@/components/ui/MediaSlot";

export function VisionSplit() {
  // Feature-flagged gate: hides in production until client provides authentic founder story
  if (!features.vision) {
    return null;
  }

  return (
    <section className="w-full py-20 sm:py-28 bg-surface-dark/55 text-on-dark border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Founder Portrait Card (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-md overflow-hidden border border-white/10 bg-surface-dark-2">
              <MediaSlot aspect="4/5" label="Founder Portrait" />
            </div>
            <div className="space-y-1">
              <div className="font-display font-semibold text-base text-white">
                Leadership & Vision
              </div>
              <div className="type-label text-text-secondary-on-dark text-[11px]">
                Founder & Technical Direction
              </div>
            </div>
          </div>

          {/* Right: Manifesto Statement (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <Eyebrow className="text-accent-soft text-xs" withRule>
              OUR VISION
            </Eyebrow>

            <Heading level={2} className="text-white text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-snug">
              &ldquo;We believe that marketing and software should not be disconnected silos, 
              but an integrated growth engine for every ambitious business in Lucknow.&rdquo;
            </Heading>

            <Text variant="secondary-on-dark" className="text-base sm:text-lg max-w-2xl leading-relaxed">
              By pairing technical software engineering with transparent performance marketing, 
              we build systems that don&apos;t just promise visibility—they generate reliable calls, orders, and operational clarity.
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
}
