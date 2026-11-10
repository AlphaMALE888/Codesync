import React from "react";
import Link from "next/link";
import { getServiceBySlug } from "@/lib/content";
import { ArrowRight, Sparkles } from "lucide-react";

interface RelatedServiceCtaProps {
  serviceSlug?: string;
}

export function RelatedServiceCta({ serviceSlug }: RelatedServiceCtaProps) {
  if (!serviceSlug) return null;

  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;

  return (
    <div className="max-w-[680px] mx-auto mt-16 p-8 rounded-card border border-border-light bg-surface-subtle">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft/30 text-accent-default text-xs font-mono font-medium mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Recommended Implementation Service
      </div>

      <h3 className="type-h3 font-display tracking-tight text-text-primary mb-2">
        Need assistance with {service.name}?
      </h3>

      <p className="text-text-secondary text-sm font-body leading-relaxed mb-6">
        {service.summary || service.oneLiner}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-brand-darkest text-white text-xs font-medium hover:bg-brand-darkest/90 transition-colors"
        >
          Explore {service.name} Scope
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-white border border-border-medium text-text-primary text-xs font-medium hover:bg-surface-muted transition-colors"
        >
          Book a Free Discovery Call
        </Link>
      </div>
    </div>
  );
}
