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
import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceSchema, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/jsonld";
import { faqsData } from "@/data/faqs";

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
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${service.name} in Lucknow`,
    description: service.summary,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} in Lucknow | CODESYNC`,
      description: service.summary,
      url: `/services/${service.slug}`,
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = getServiceSchema(service);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.name, url: `/services/${service.slug}` },
  ]);

  // Extract visible FAQs if present
  const serviceFaqs = (service.faqs || [])
    .map((id) => faqsData.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .map((f) => ({ question: f.question, answer: f.answer }));

  const faqSchema = serviceFaqs.length > 0 ? getFaqSchema(serviceFaqs) : null;

  return (
    <main className="min-h-screen bg-canvas">
      <JsonLd
        data={[
          serviceSchema,
          breadcrumbSchema,
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

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
