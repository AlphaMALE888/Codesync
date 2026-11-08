import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServices, getServiceBySlug } from "@/lib/content";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { AudienceBlock } from "@/components/sections/services/AudienceBlock";
import { WhatYouGet } from "@/components/sections/services/WhatYouGet";
import { HowItWorks } from "@/components/sections/services/HowItWorks";
import { PricingBlock } from "@/components/sections/services/PricingBlock";
import { ServiceTestimonial } from "@/components/sections/services/ServiceTestimonial";
import { ServiceFaq } from "@/components/sections/services/ServiceFaq";
import { RelatedServices } from "@/components/sections/services/RelatedServices";
import { FinalCta } from "@/components/sections/home/FinalCta";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({
    slug: s.slug,
  }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found | CODESYNC",
    };
  }

  return {
    title: `${service.name} in Lucknow | CODESYNC`,
    description: service.summary,
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-canvas">
      {/* 1. Hero */}
      <ServiceHero service={service} />

      {/* 2. Who it is for */}
      <AudienceBlock audience={service.audience} />

      {/* 3. What you get */}
      <WhatYouGet
        includes={service.includes}
        deliverables={service.deliverables}
      />

      {/* 4. How it works */}
      <HowItWorks process={service.process} />

      {/* 5. Pricing (quote-first block) */}
      <PricingBlock pricing={service.pricing} serviceName={service.name} />

      {/* 6. Proof / Testimonial */}
      <ServiceTestimonial testimonialIds={service.relatedTestimonialIds} />

      {/* 7. FAQ */}
      <ServiceFaq faqIds={service.faqs} />

      {/* 8. Related Services */}
      <RelatedServices relatedSlugs={service.relatedServiceSlugs} />

      {/* 9. Final CTA */}
      <FinalCta />
    </main>
  );
}
