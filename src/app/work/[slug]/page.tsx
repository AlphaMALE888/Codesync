import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { CaseHero } from "@/components/sections/work/CaseHero";
import { CaseMeta } from "@/components/sections/work/CaseMeta";
import { ProjectMockup } from "@/components/sections/work/ProjectMockup";
import { CaseResults } from "@/components/sections/work/CaseResults";
import { NextProject } from "@/components/sections/work/NextProject";
import { ServiceTestimonial } from "@/components/sections/services/ServiceTestimonial";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getRenderableProjects, getProjectBySlug } from "@/lib/content";
import { features } from "@/data/features";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const projects = getRenderableProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Case Study Not Found | CODESYNC",
    };
  }

  return {
    title: `${project.summary} | CODESYNC Case Study`,
    description: project.challenge,
  };
}

export default function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const isDevFixtures =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true";

  if (!features.work && !isDevFixtures) {
    notFound();
  }

  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const allProjects = getRenderableProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  const supportingVisuals = project.media.slice(1, 3);

  return (
    <main className="min-h-screen bg-canvas">
      {/* 1. Hero */}
      <CaseHero project={project} />

      {/* 2. Metadata Strip */}
      <CaseMeta project={project} />

      {/* 3. The Challenge & What We Did */}
      <section className="py-20 sm:py-28 bg-white border-b border-hairline">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            {/* The Challenge */}
            <div className="space-y-4">
              <Eyebrow className="text-accent text-xs">THE CHALLENGE</Eyebrow>
              <Heading level={2} className="text-ink text-2xl sm:text-3xl tracking-tight">
                Addressing operational and growth bottlenecks.
              </Heading>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
                {project.challenge}
              </p>
            </div>

            {/* What We Did */}
            <div className="space-y-6 pt-6 border-t border-hairline">
              <Eyebrow className="text-accent text-xs">WHAT WE DID</Eyebrow>
              <div className="space-y-4">
                {project.approach.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-5 rounded-md bg-canvas border border-hairline/80"
                  >
                    <span className="font-mono text-xs font-semibold text-accent pt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Project Mockup */}
      <ProjectMockup
        imageSrc={project.media?.[0]?.src}
        imageAlt={project.media?.[0]?.alt}
        urlLabel={project.links?.liveUrl || "cdmlko.com/verified-work"}
      />

      {/* 5. Supporting Visuals (side by side if present) */}
      {supportingVisuals.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-b border-hairline">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {supportingVisuals.map((visual, vIdx) => (
                <div
                  key={vIdx}
                  className="relative aspect-[16/10] rounded-md overflow-hidden border border-hairline bg-surface-muted shadow-sm"
                >
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 6. Measurable Results */}
      <CaseResults metrics={project.metrics} />

      {/* 7. Testimonial for this project (if linked) */}
      {project.testimonialId && (
        <ServiceTestimonial testimonialIds={[project.testimonialId]} />
      )}

      {/* 8. Next Project Link */}
      {nextProject && nextProject.slug !== project.slug && (
        <NextProject nextProject={nextProject} />
      )}

      {/* 9. Final CTA */}
      <FinalCta />
    </main>
  );
}
