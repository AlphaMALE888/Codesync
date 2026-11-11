import { siteConfig } from "@/data/site";
import { ServiceItem } from "@/data/types";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdmlko.com";

/**
 * Organization Schema (JSON-LD)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: siteConfig.tagline,
    email: siteConfig.contact.email,
    telephone: `+91${siteConfig.contact.phones[0]}`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+91${siteConfig.contact.phones[0]}`,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

/**
 * LocalBusiness / ProfessionalService Schema (JSON-LD)
 * Note: Address is kept as city-level since exact street address differs across legacy pages.
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: baseUrl,
    image: `${baseUrl}/logo.png`,
    telephone: `+91${siteConfig.contact.phones[0]}`,
    email: siteConfig.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lucknow",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Lucknow",
      },
      {
        "@type": "AdministrativeArea",
        name: "Uttar Pradesh",
      },
    ],
  };
}

/**
 * Service Schema (JSON-LD)
 */
export function getServiceSchema(service: ServiceItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Lucknow",
    },
    termsOfService: `${baseUrl}/legal/privacy`,
  };
}

/**
 * BreadcrumbList Schema (JSON-LD)
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * FAQPage Schema (JSON-LD)
 * Only for visible FAQs on the given page.
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
