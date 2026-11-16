"use client";

import React from "react";
import Link from "next/link";
import { ArticleItem } from "@/data/types";
import { ArrowUpRight, BookOpen } from "lucide-react";

interface InsightCardProps {
  article: ArticleItem;
  variant?: "image-led" | "text-led-pale" | "text-led-dark";
  className?: string;
}

export function InsightCard({ article, variant = "text-led-pale", className = "" }: InsightCardProps) {
  const isImageLed = variant === "image-led";
  const isTextDark = variant === "text-led-dark";

  if (isImageLed) {
    return (
      <Link
        href={`/insights/${article.slug}`}
        className={`group block h-full rounded-md overflow-hidden border border-hairline bg-surface-dark-2/85 transition-all duration-300 hover:border-accent-soft/45 flex flex-col justify-between ${className}`}
      >
        <div>
          {/* Cover Graphic Frame (4:3 aspect ratio) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-dark border-b border-hairline flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#09090B] via-surface-dark to-accent-deep/35 opacity-90" />
            <div className="relative z-10 text-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
              <span className="inline-flex p-3 rounded-full bg-white/10 text-accent-soft border border-white/10 mb-2">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="block text-[11px] font-mono tracking-wider uppercase text-text-secondary">
                CODESYNC INSIGHTS
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-deep/30 border border-accent-soft/40 text-accent-soft text-xs font-mono font-medium">
                {article.category}
              </span>
              <span className="text-xs font-mono text-text-secondary">
                {article.readingTime || "5 min read"}
              </span>
            </div>

            <h3 className="type-h3 font-display font-semibold text-ink tracking-tight mb-2.5 line-clamp-2 group-hover:text-accent-soft transition-colors">
              {article.title}
            </h3>

            <p className="text-text-secondary text-sm font-body line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Byline / Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-text-secondary">
          <span>{article.author.split(",")[0]}</span>
          <span className="inline-flex items-center gap-1 text-accent-soft font-medium group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/insights/${article.slug}`}
      className={`group block h-full rounded-md p-6 md:p-8 flex flex-col justify-between transition-colors duration-220 ${
        isTextDark
          ? "bg-surface-dark/90 text-ink border border-hairline hover:border-accent-soft/45"
          : "bg-surface-dark-2/85 text-ink border border-hairline hover:border-white/25"
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-accent-deep/30 border border-accent-soft/40 text-accent-soft">
            {article.category}
          </span>
          <span className="text-xs font-mono text-text-secondary">
            {article.readingTime || "5 min read"}
          </span>
        </div>

        <h3 className="font-display font-bold tracking-tight mb-3 line-clamp-3 text-lg md:text-xl leading-snug text-ink group-hover:text-accent-soft transition-colors">
          {article.title}
        </h3>

        <p className="text-sm font-body line-clamp-3 leading-relaxed text-text-secondary">
          {article.summary}
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-hairline flex items-center justify-between text-xs font-mono text-text-secondary">
        <span>{article.author.split(",")[0]}</span>
        <span className="inline-flex items-center gap-1 font-medium text-accent-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
          Read <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
