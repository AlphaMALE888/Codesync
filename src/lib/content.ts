import { BaseEntity, ServiceItem, FaqItem, ProjectItem } from "@/data/types";
import { servicesData } from "@/data/services";
import { faqsData } from "@/data/faqs";
import { projectsData } from "@/data/projects";
import { devSampleProjects } from "@/data/__dev__/projects.fixtures";
import { features } from "@/data/features";

/**
 * Filter items according to the Content Status Rule:
 * - 'verified': Allowed in production and development.
 * - 'draft': Allowed with draft acknowledgment.
 * - 'pending': Stripped completely from production renders.
 */
export function renderable<T extends BaseEntity>(items: T[]): T[] {
  return items.filter((item) => {
    if (item.status === "pending") {
      return false;
    }
    // In production, also drop any items that are incomplete
    if (process.env.NODE_ENV === "production") {
      if (!item.id || !item.source) {
        return false;
      }
    }
    return true;
  });
}

export function getAllServices(): ServiceItem[] {
  return renderable(servicesData);
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  const services = renderable(servicesData);
  return services.find((s) => s.slug === slug);
}

export function getServicesByPillar(pillar: "grow" | "build" | "run"): ServiceItem[] {
  return renderable(servicesData).filter((s) => s.pillar === pillar);
}

export function getRelatedServices(slugs: string[]): ServiceItem[] {
  const services = renderable(servicesData);
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is ServiceItem => Boolean(s));
}

export function getFaqsByIds(ids: string[]): FaqItem[] {
  const faqs = renderable(faqsData);
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is FaqItem => Boolean(f));
}

/**
 * Retrieve renderable projects.
 * In production: strictly uses approved items with client permissions.
 * In development: dev sample fixtures can be loaded when NEXT_PUBLIC_SHOW_DEV_FIXTURES === 'true'.
 * When features.work is false and not in dev fixture mode, returns an empty array.
 */
export function getRenderableProjects(): ProjectItem[] {
  // If features.work is enabled
  if (features.work) {
    const list = [...projectsData];
    // In development only, allow fixtures if requested
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true") {
      list.push(...devSampleProjects);
    }
    return list.filter(
      (p) =>
        p.approved &&
        p.client.permissionToName &&
        p.status !== "pending" &&
        p.media.every((m) => m.permission)
    );
  }

  // If features.work is false, check if dev fixtures are explicitly enabled for dev testing
  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_DEV_FIXTURES === "true") {
    return devSampleProjects.filter(
      (p) =>
        p.approved &&
        p.client.permissionToName &&
        p.status !== "pending" &&
        p.media.every((m) => m.permission)
    );
  }

  return [];
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  const projects = getRenderableProjects();
  return projects.find((p) => p.slug === slug);
}
