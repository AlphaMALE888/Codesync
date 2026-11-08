import React from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { getFaqsByIds } from "@/lib/content";

interface ServiceFaqProps {
  faqIds: string[];
}

export function ServiceFaq({ faqIds }: ServiceFaqProps) {
  const faqs = getFaqsByIds(faqIds);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-surface-dark text-on-dark border-b border-white/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Eyebrow className="text-accent-soft text-xs" withRule>
              FREQUENTLY ASKED
            </Eyebrow>
            <Heading level={2} className="mt-4 text-white text-3xl sm:text-4xl tracking-tight">
              Questions & answers.
            </Heading>
            <p className="mt-4 text-text-secondary-on-dark text-sm sm:text-base leading-relaxed">
              Clear, honest details on delivery expectations, pricing models, and technical requirements.
            </p>
          </div>

          <div className="lg:col-span-8 w-full">
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
