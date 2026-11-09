import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectItem } from "@/data/types";

interface NextProjectProps {
  nextProject?: ProjectItem;
}

export function NextProject({ nextProject }: NextProjectProps) {
  if (!nextProject) return null;

  return (
    <section className="py-20 sm:py-28 bg-canvas border-b border-hairline">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block mb-4">
            NEXT CASE STUDY
          </span>

          <Link
            href={`/work/${nextProject.slug}`}
            className="group inline-flex flex-col items-center gap-4 transition-transform"
          >
            <h2 className="font-display font-medium text-3xl sm:text-5xl text-ink tracking-tight transition-transform duration-300 group-hover:translate-x-3 group-hover:text-accent">
              {nextProject.summary}
            </h2>

            <div className="flex items-center gap-2 text-sm font-mono text-accent font-semibold tracking-wider uppercase mt-2">
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
