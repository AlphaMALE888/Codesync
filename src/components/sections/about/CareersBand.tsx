import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { careersData } from "@/data/careers";
import { siteConfig } from "@/data/site";
import { Mail } from "lucide-react";

export function CareersBand() {
  const activeRoles = careersData.filter((r) => r.active);

  return (
    <section id="careers" className="py-20 sm:py-28 bg-white border-b border-hairline">
      <Container>
        <div className="max-w-4xl mx-auto rounded-lg bg-canvas border border-hairline p-8 sm:p-14">
          <Eyebrow className="text-accent text-xs" withRule>
            CAREERS & CULTURE
          </Eyebrow>

          <Heading level={2} className="mt-4 text-3xl sm:text-4xl lg:text-5xl text-ink font-medium tracking-tight">
            We are always glad to meet good people.
          </Heading>

          <p className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
            Whether your discipline is performance marketing, search systems, full-stack software development, or interface design, we welcome conversation with craftsmen who value accountability.
          </p>

          {/* Active Job Roles (if any are active) */}
          {activeRoles.length > 0 && (
            <div className="mt-8 space-y-3 pt-6 border-t border-hairline">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
                Open Positions
              </span>
              <div className="divide-y divide-hairline">
                {activeRoles.map((role) => (
                  <div key={role.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-medium text-base text-ink">
                        {role.title}
                      </h4>
                      <span className="text-xs text-text-secondary">
                        {role.department} · {role.location} · {role.type}
                      </span>
                    </div>
                    <SplitArrowButton href={`mailto:${siteConfig.contact.email}?subject=Application for ${role.title}`}>
                      Apply
                    </SplitArrowButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Application Callout */}
          <div className="mt-10 pt-6 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span>
                Send your CV and portfolio to{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-ink font-medium underline underline-offset-4 hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </span>
            </div>

            <div className="w-full sm:w-auto">
              <SplitArrowButton
                href={`mailto:${siteConfig.contact.email}?subject=Career Inquiry - CODESYNC`}
                className="w-full sm:w-auto"
              >
                Send your CV
              </SplitArrowButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
