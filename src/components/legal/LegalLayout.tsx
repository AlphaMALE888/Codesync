import React from "react";
import Link from "next/link";
import { TableOfContents } from "./TableOfContents";
import { LegalPageItem } from "@/data/types";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface LegalLayoutProps {
  page: LegalPageItem;
}

export function LegalLayout({ page }: LegalLayoutProps) {
  const sections = page.sections || [];

  return (
    <div className="min-h-screen bg-bg-light text-text-primary pt-32 pb-24">
      <div className="container-spartan">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-text-secondary hover:text-text-primary transition-colors uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="max-w-[720px] mb-12 pb-8 border-b border-border-light">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft/30 border border-accent-soft text-accent-default text-xs font-mono font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Compliance Policy
          </div>
          <h1 className="type-h1 font-display tracking-tight text-text-primary mb-4">
            {page.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary">
            <span>Effective Date: {page.effectiveDate}</span>
            <span>&bull;</span>
            <span>Codesync Digi Marketing (OPC) Pvt Ltd</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Sticky Table of Contents (span 4) */}
          <aside className="lg:col-span-4 order-1 lg:order-1">
            <TableOfContents sections={sections} />
          </aside>

          {/* Right Column: 720px Reading Column (span 8) */}
          <main className="lg:col-span-8 order-2 lg:order-2 max-w-[720px]">
            <article className="prose prose-slate max-w-none space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 pb-8 border-b border-border-light/60 last:border-b-0"
                >
                  <h2 className="type-h3 font-display tracking-tight text-text-primary mb-4">
                    {section.title}
                  </h2>
                  <div className="text-text-secondary leading-relaxed space-y-3.5 text-sm md:text-base font-body whitespace-pre-line">
                    {section.content}
                  </div>
                </section>
              ))}
            </article>

            {/* Bottom Inquiries Notice */}
            <div className="mt-16 p-6 rounded-card border border-border-light bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-display font-semibold text-text-primary">
                  Questions regarding our policies?
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Our compliance team is available at support@cdmlko.com.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-button bg-text-primary text-white hover:bg-brand-darkest transition-colors shrink-0"
              >
                Contact Compliance
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
