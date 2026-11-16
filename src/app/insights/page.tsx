import { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/data/features";
import { getRenderableArticles } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { InsightsGrid } from "@/components/sections/insights/InsightsGrid";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Insights & Strategy",
  description:
    "Practical growth frameworks, performance web architecture, and regional digital marketing insights from CODESYNC Digi Marketing in Lucknow.",
  alternates: {
    canonical: "/insights",
  },
  robots: {
    index: features.insights,
    follow: features.insights,
  },
};

export default function InsightsPage() {
  // If insights feature is disabled and not in dev fixture preview mode, return 404
  const isDevFixtureMode =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true";

  if (!features.insights && !isDevFixtureMode) {
    notFound();
  }

  const articles = getRenderableArticles();

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent text-ink pt-32 pb-24">
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
        ])}
      />
      {/* Editorial Marquee Banner */}
      <div className="border-y border-hairline mb-12">
        <DisplayMarquee text="INSIGHTS & STRATEGY" speed={36} tone="dark" />
      </div>

      <Container>
        {/* Header Section */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="type-label text-accent-soft font-mono block mb-3">
            AGENCY INTELLIGENCE &bull; LUCKNOW
          </span>
          <h1 className="type-h1 font-display tracking-tight text-ink mb-4">
            Practical Thinking on Growth & Software
          </h1>
          <p className="text-text-secondary text-base font-body leading-relaxed">
            No empty buzzwords. Real case perspectives, local search realities, and architectural decisions from our active client engagements.
          </p>
        </div>

        {/* Dynamic Asymmetric Grid */}
        <InsightsGrid articles={articles} />
      </Container>
    </div>
  );
}
