"use client";

import React, { useRef, useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { TestimonialCard } from "./TestimonialCard";
import { testimonialsData } from "@/data/testimonials";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 400 + 24; // Card width + gap
      const offset = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-canvas overflow-hidden">
      {/* Repeated Giant Marquee Heading */}
      <DisplayMarquee text="Experiences" speed={30} />

      <Container className="pt-8 sm:pt-12">
        {/* Intro Sentence & Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
            Direct feedback from verified business owners, educators, and enterprise teams in Lucknow.
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-12 h-12 rounded-pill bg-ink text-white flex items-center justify-center transition-all",
                "hover:bg-accent disabled:opacity-30 disabled:pointer-events-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              )}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-12 h-12 rounded-pill bg-ink text-white flex items-center justify-center transition-all",
                "hover:bg-accent disabled:opacity-30 disabled:pointer-events-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              )}
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll-Snap Rail */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-[clamp(20px,4vw,64px)] px-[clamp(20px,4vw,64px)]"
          role="region"
          aria-label="Client Testimonials Carousel"
        >
          {testimonialsData.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Container>
    </section>
  );
}
