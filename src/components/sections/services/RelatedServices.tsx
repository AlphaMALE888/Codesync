"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { ArrowUpRight } from "lucide-react";
import { getRelatedServices } from "@/lib/content";
import {
  setParticleFocusFromElement,
  clearParticleFocus,
} from "@/components/particles/particleState";

interface RelatedServicesProps {
  relatedSlugs: string[];
}

export function RelatedServices({ relatedSlugs }: RelatedServicesProps) {
  const related = getRelatedServices(relatedSlugs).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-transparent border-b border-white/10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Eyebrow className="text-accent-soft text-xs">RELATED CAPABILITIES</Eyebrow>
            <Heading level={2} className="mt-3 text-ink text-2xl sm:text-3xl tracking-tight">
              Complementary services.
            </Heading>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-text-secondary hover:text-accent-soft flex items-center gap-1 transition-colors"
          >
            <span>View all 14 services</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              onMouseEnter={(e) => setParticleFocusFromElement(e.currentTarget, "attract", 0.8)}
              onMouseLeave={() => clearParticleFocus()}
              className="group p-6 rounded-md bg-surface-dark-2/85 border border-white/12 hover:border-accent-soft/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-soft font-semibold block mb-2">
                  {service.pillar.toUpperCase()}
                </span>
                <h3 className="font-display font-medium text-lg sm:text-xl text-ink group-hover:text-accent-soft transition-colors leading-snug">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm text-text-secondary line-clamp-3 leading-relaxed">
                  {service.oneLiner}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/75 group-hover:text-accent-soft transition-colors">
                <span>EXPLORE CAPABILITY</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
