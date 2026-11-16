import React from "react";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/data/site";

export function CompanyDetails() {
  return (
    <section className="py-12 bg-surface-dark/55 border-b border-hairline">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Column 1: Legal Entity */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary block mb-1">
              LEGAL ENTITY
            </span>
            <p className="font-display font-medium text-base text-ink">
              {siteConfig.legalName}
            </p>
          </div>

          {/* Column 2: Commercial Brand */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary block mb-1">
              COMMERCIAL BRAND
            </span>
            <p className="font-display font-medium text-base text-ink">
              {siteConfig.name}
            </p>
          </div>

          {/* Column 3: Regional Base */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary block mb-1">
              REGIONAL PRESENCE
            </span>
            <p className="font-display font-medium text-base text-ink">
              Lucknow, Uttar Pradesh, India
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
