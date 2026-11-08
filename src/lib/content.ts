import { BaseEntity, ServiceItem, FaqItem } from "@/data/types";
import { servicesData } from "@/data/services";
import { faqsData } from "@/data/faqs";

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
