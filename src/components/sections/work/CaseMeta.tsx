import React from "react";
import { Container } from "@/components/layout/Container";
import { ProjectItem } from "@/data/types";

interface CaseMetaProps {
  project: ProjectItem;
}

export function CaseMeta({ project }: CaseMetaProps) {
  const fields = [
    { label: "Client", value: project.client.name },
    { label: "Industry", value: project.industry },
    {
      label: "Services",
      value: project.category?.join(", ") || project.services?.join(", "),
    },
    { label: "Timeline", value: project.year ? `Completed ${project.year}` : null },
    { label: "Delivery Team", value: "CODESYNC In-house (Lucknow)" },
  ].filter((f) => Boolean(f.value));

  return (
    <section className="py-8 sm:py-10 bg-white border-b border-hairline">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-hairline">
          {fields.map((f, idx) => (
            <div key={idx} className={idx > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}>
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary block mb-1">
                {f.label}
              </span>
              <span className="font-display font-medium text-sm sm:text-base text-ink block leading-snug">
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
