import React from "react";
import Link from "next/link";
import { ArticleItem } from "@/data/types";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

interface ArticleHeaderProps {
  article: ArticleItem;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="max-w-[720px] mx-auto mb-12">
      {/* Back to Insights */}
      <div className="mb-8">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-text-secondary hover:text-ink transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Insights
        </Link>
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="px-3 py-1 rounded-full bg-accent-deep/30 border border-accent-soft/40 text-accent-soft text-xs font-mono font-medium">
          {article.category}
        </span>
      </div>

      {/* Article Title */}
      <h1 className="type-h1 font-display tracking-tight text-ink mb-6">
        {article.title}
      </h1>

      {/* Article Metadata Byline */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-text-secondary pt-4 border-t border-hairline">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-accent-soft" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-accent-soft" />
          <span>{article.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-accent-soft" />
          <span>{article.readingTime || "5 min read"}</span>
        </div>
      </div>
    </header>
  );
}
