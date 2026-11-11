import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { features } from "@/data/features";
import { getArticleBySlug, getRenderableArticles } from "@/lib/content";
import { ReadingProgress } from "@/components/sections/insights/ReadingProgress";
import { ArticleHeader } from "@/components/sections/insights/ArticleHeader";
import { ArticleBody } from "@/components/sections/insights/ArticleBody";
import { RelatedServiceCta } from "@/components/sections/insights/RelatedServiceCta";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const isDevFixtureMode =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true";

  if (!features.insights && !isDevFixtureMode) {
    return [];
  }

  const articles = getRenderableArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Insight Article Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdmlko.com";

  return {
    title: `${article.title} | CODESYNC Insights`,
    description: article.summary,
    alternates: {
      canonical: `/insights/${article.slug}`,
    },
    robots: {
      index: features.insights,
      follow: features.insights,
    },
    openGraph: {
      title: `${article.title} | CODESYNC Insights`,
      description: article.summary,
      url: `${baseUrl}/insights/${article.slug}`,
      type: "article",
      siteName: "CODESYNC Digi Marketing",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | CODESYNC Insights`,
      description: article.summary,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const isDevFixtureMode =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true";

  if (!features.insights && !isDevFixtureMode) {
    notFound();
  }

  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const allArticles = getRenderableArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-bg-light text-text-primary pt-32">
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: article.title, url: `/insights/${article.slug}` },
        ])}
      />
      {/* Scroll Reading Progress Bar */}
      <ReadingProgress />

      <main className="container-spartan pb-20">
        {/* Article Header */}
        <ArticleHeader article={article} />

        {/* Article Body */}
        <ArticleBody body={article.body} />

        {/* Contextual Related Service CTA */}
        <RelatedServiceCta serviceSlug={article.relatedServiceSlug} />

        {/* Previous / Next Article Navigation */}
        <div className="max-w-[680px] mx-auto mt-16 pt-8 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevArticle ? (
            <Link
              href={`/insights/${prevArticle.slug}`}
              className="group flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors text-left"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="block text-[10px] text-text-muted uppercase">Previous Article</span>
                <span className="font-sans font-medium line-clamp-1">{prevArticle.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link
              href={`/insights/${nextArticle.slug}`}
              className="group flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors text-right"
            >
              <div>
                <span className="block text-[10px] text-text-muted uppercase">Next Article</span>
                <span className="font-sans font-medium line-clamp-1">{nextArticle.title}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      {/* Final Call to Action */}
      <FinalCta />
    </div>
  );
}
