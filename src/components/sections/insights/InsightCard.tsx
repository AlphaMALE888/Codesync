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
        className={`group block h-full rounded-card overflow-hidden border border-border-light bg-surface-subtle transition-all duration-300 hover:shadow-card hover:border-border-medium flex flex-col justify-between ${className}`}
      >
        <div>
          {/* Cover Graphic Frame (4:3 aspect ratio) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-darkest/90 border-b border-border-light flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-darkest via-brand-darkest/90 to-accent-soft/20 opacity-80" />
            <div className="relative z-10 text-center transition-transform duration-450 ease-out group-hover:scale-[1.03]">
              <span className="inline-flex p-3 rounded-full bg-white/10 text-accent-soft border border-white/10 mb-2">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="block text-[11px] font-mono tracking-wider uppercase text-white/60">
                CODESYNC INSIGHTS
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-soft/20 border border-accent-soft/40 text-accent-default text-xs font-mono font-medium">
                {article.category}
              </span>
              <span className="text-xs font-mono text-text-muted">
                {article.readingTime || "5 min read"}
              </span>
            </div>

            <h3 className="type-h3 font-display font-semibold text-text-primary tracking-tight mb-2.5 line-clamp-2 group-hover:text-accent-default transition-colors">
              {article.title}
            </h3>

            <p className="text-text-secondary text-sm font-body line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Byline / Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-border-light/60 flex items-center justify-between text-xs font-mono text-text-muted">
          <span>{article.author.split(",")[0]}</span>
          <span className="inline-flex items-center gap-1 text-accent-default font-medium group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  // Text-led variant (Dark or Pale)
  return (
    <Link
      href={`/insights/${article.slug}`}
      className={`group block h-full rounded-card p-6 md:p-8 flex flex-col justify-between transition-colors duration-220 ${
        isTextDark
          ? "bg-brand-darkest text-white border border-white/10 hover:bg-brand-darkest/95 hover:border-white/20"
          : "bg-surface-subtle text-text-primary border border-border-light hover:bg-surface-muted hover:border-border-medium"
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
              isTextDark
                ? "bg-white/10 border border-white/15 text-accent-soft"
                : "bg-accent-soft/20 border border-accent-soft/40 text-accent-default"
            }`}
          >
            {article.category}
          </span>
          <span
            className={`text-xs font-mono ${
              isTextDark ? "text-white/50" : "text-text-muted"
            }`}
          >
            {article.readingTime || "5 min read"}
          </span>
        </div>

        <h3
          className={`font-display font-bold tracking-tight mb-3 line-clamp-3 text-lg md:text-xl leading-snug ${
            isTextDark
              ? "text-white group-hover:text-accent-soft"
              : "text-text-primary group-hover:text-accent-default"
          } transition-colors`}
        >
          {article.title}
        </h3>

        <p
          className={`text-sm font-body line-clamp-3 leading-relaxed ${
            isTextDark ? "text-white/70" : "text-text-secondary"
          }`}
        >
          {article.summary}
        </p>
      </div>

      <div
        className={`pt-6 mt-6 border-t flex items-center justify-between text-xs font-mono ${
          isTextDark
            ? "border-white/10 text-white/50"
            : "border-border-light text-text-muted"
        }`}
      >
        <span>{article.author.split(",")[0]}</span>
        <span
          className={`inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ${
            isTextDark ? "text-accent-soft" : "text-accent-default"
          }`}
        >
          Read <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
