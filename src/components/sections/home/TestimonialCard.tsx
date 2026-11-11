import React from "react";
import { TestimonialItem } from "@/data/types";
import { Quote } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TestimonialCardProps {
  testimonial: TestimonialItem;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "w-[min(320px,calc(100vw-48px))] sm:w-[400px] shrink-0 rounded-md border border-hairline bg-white p-6 sm:p-8",
        "flex flex-col justify-between shadow-sm select-none scroll-snap-align-start",
        className
      )}
    >
      <div>
        {/* Source Badge & Icon */}
        <div className="flex items-center justify-between mb-6">
          <span className="type-label text-[10px] text-accent tracking-wider font-bold px-2.5 py-1 rounded-pill bg-accent/10">
            From Google reviews
          </span>
          <Quote className="w-5 h-5 text-accent opacity-50" />
        </div>

        {/* Verbatim Quote */}
        <p className="text-sm sm:text-base text-ink leading-relaxed italic mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Attribution */}
      <div className="pt-4 border-t border-hairline space-y-0.5">
        <h4 className="font-display font-bold text-sm text-ink">
          {testimonial.author}
        </h4>
        <p className="text-xs text-text-secondary">
          {testimonial.business} &bull; {testimonial.serviceCategory}
        </p>
      </div>
    </div>
  );
}
