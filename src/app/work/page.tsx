import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { WorkFilters } from "@/components/sections/work/WorkFilters";
import { WorkGrid } from "@/components/sections/work/WorkGrid";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getRenderableProjects } from "@/lib/content";
import { features } from "@/data/features";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description:
    "Explore verified client deliverables, organic search compounding, and custom business software architectures delivered by CODESYNC in Lucknow.",
  alternates: {
    canonical: "/work",
  },
  robots: {
    index: features.work,
    follow: features.work,
  },
};

interface WorkPageProps {
  searchParams?: {
    category?: string;
  };
}

const CATEGORIES = ["All", "SEO", "Paid Media", "Websites", "Software", "Local Services"];

export default function WorkPage({ searchParams }: WorkPageProps) {
  // Check if work is enabled (or dev fixtures active in non-production)
  const isDevFixtures =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true";

  if (!features.work && !isDevFixtures) {
    notFound();
  }

  const allProjects = getRenderableProjects();
  const activeCategory = searchParams?.category || "All";

  const filteredProjects =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((p) =>
          p.category.some(
            (c) => c.toLowerCase() === activeCategory.toLowerCase()
          )
        );

  return (
    <main className="min-h-screen bg-canvas pt-32 sm:pt-40">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Work", url: "/work" },
        ])}
      />
      <Container>
        {/* Header */}
        <div className="max-w-3xl pb-12 sm:pb-16 border-b border-hairline">
          <Eyebrow>OUR WORK</Eyebrow>
          <Heading level={1} className="mt-4 text-display-md sm:text-display-lg text-ink font-medium tracking-tight">
            Selected case studies.
          </Heading>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
            Real outcomes and production systems engineered for Lucknow enterprises and regional brands. Measured in qualified inquiries, operational speed, and revenue growth.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="py-8 sm:py-10">
          <WorkFilters
            categories={CATEGORIES}
            activeCategory={activeCategory}
            totalCount={filteredProjects.length}
          />
        </div>

        {/* Case Studies Grid */}
        <div className="pb-24">
          <WorkGrid projects={filteredProjects} />
        </div>
      </Container>

      {/* Conversion CTA */}
      <FinalCta />
    </main>
  );
}
