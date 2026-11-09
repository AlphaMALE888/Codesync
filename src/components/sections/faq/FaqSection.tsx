import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { faqsData } from "@/data/faqs";
import { renderable } from "@/lib/content";

interface FaqSectionProps {
  id?: string;
  category?: "general" | "seo" | "marketing" | "websites" | "software";
  limit?: number;
  showContactCta?: boolean;
}

export function FaqSection({
  id = "faq",
  category,
  limit,
  showContactCta = true,
}: FaqSectionProps) {
  let faqs = renderable(faqsData);
  if (category) {
    faqs = faqs.filter((f) => f.category === category);
  }
  if (limit) {
    faqs = faqs.slice(0, limit);
  }

  return (
    <section id={id} className="py-20 sm:py-28 bg-surface-dark text-on-dark border-b border-white/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Split Layout Callout */}
          <div className="lg:col-span-5 space-y-4">
            <Eyebrow className="text-accent-soft text-xs" withRule>
              COMMON QUERIES
            </Eyebrow>
            <Heading level={2} className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Frequently asked questions.
            </Heading>
            <p className="text-base sm:text-lg text-text-secondary-on-dark leading-relaxed pt-2">
              Transparent answers regarding delivery timelines, cost models, campaign setups, and custom software maintenance.
            </p>

            {showContactCta && (
              <div className="pt-6">
                <SplitArrowButton href="/contact">
                  Have a specific question?
                </SplitArrowButton>
              </div>
            )}
          </div>

          {/* Right Column: Dark Rounded Accordion Rows */}
          <div className="lg:col-span-7 w-full">
            <Accordion type="single" defaultOpen={faqs[0]?.id} tone="dark">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
                  <p className="text-sm sm:text-base leading-relaxed text-text-secondary-on-dark">
                    {faq.answer}
                  </p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  );
}
