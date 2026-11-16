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
    <div className="max-w-[680px] mx-auto mt-16 p-8 rounded-md border border-hairline bg-surface-dark-2/85">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-deep/30 border border-accent-soft/40 text-accent-soft text-xs font-mono font-medium mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Recommended Implementation Service
      </div>

      <h3 className="type-h3 font-display tracking-tight text-ink mb-2">
        Need assistance with {service.name}?
      </h3>

      <p className="text-text-secondary text-sm font-body leading-relaxed mb-6">
        {service.summary || service.oneLiner}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-ink text-xs font-medium hover:bg-accent-soft transition-colors"
        >
          Explore {service.name} Scope
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-surface-dark border border-hairline text-ink text-xs font-medium hover:bg-white/10 transition-colors"
        >
          Book a Free Discovery Call
        </Link>
      </div>
    </div>
  );
}
