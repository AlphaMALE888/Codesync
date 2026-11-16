import React from "react";
import { Container } from "@/components/layout/Container";
import { testimonialsData } from "@/data/testimonials";
import { renderable } from "@/lib/content";

interface ServiceTestimonialProps {
  testimonialIds: string[];
}

export function ServiceTestimonial({ testimonialIds }: ServiceTestimonialProps) {
  if (!testimonialIds || testimonialIds.length === 0) return null;

  const validTestimonials = renderable(testimonialsData);
  const testimonial = validTestimonials.find((t) => testimonialIds.includes(t.id));

  if (!testimonial || !testimonial.quote) return null;

  return (
    <section className="py-16 sm:py-20 bg-surface-dark/55 border-b border-white/10">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block mb-4">
            CLIENT FEEDBACK
          </span>
          <blockquote className="font-display text-xl sm:text-2xl text-ink leading-relaxed font-normal italic">
            “{testimonial.quote}”
          </blockquote>
          <div className="mt-6">
            <cite className="not-italic font-medium text-sm text-ink block">
              {testimonial.author}
            </cite>
            <span className="text-xs text-text-secondary block mt-0.5">
              {testimonial.business}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
