import { ProjectItem } from "../types";

/**
 * DEVELOPMENT ONLY SAMPLE FIXTURES
 * Used solely to verify the /work layout, filters, and case-study template.
 * These are completely excluded from production builds unless NEXT_PUBLIC_SHOW_DEV_FIXTURES === 'true'
 * and process.env.NODE_ENV !== 'production'.
 */
export const devSampleProjects: ProjectItem[] = [
  {
    id: "sample-proj-1",
    slug: "sample-lucknow-healthcare-clinic",
    status: "draft",
    source: "dev-fixtures",
    approved: true,
    client: {
      name: "SAMPLE, DEV ONLY: Metro Health Clinic",
      permissionToName: true,
      permissionToLogo: true,
    },
    industry: "Healthcare & Clinics",
    category: ["SEO", "Local Services"],
    services: ["local-seo-google-business-profile", "seo"],
    year: "2026",
    summary:
      "SAMPLE, DEV ONLY: Complete local search optimization and patient acquisition funnel for a multi-specialty Lucknow medical practice.",
    challenge:
      "SAMPLE, DEV ONLY: The clinic struggled with invisible Google Maps rankings and declining patient appointments across Aliganj and Gomti Nagar localities.",
    approach: [
      "SAMPLE, DEV ONLY: Cleaned up 40+ inconsistent directory citations across Lucknow regional directories.",
      "SAMPLE, DEV ONLY: Restructured Google Business Profile categories, medical service attributes, and patient review workflows.",
      "SAMPLE, DEV ONLY: Launched geo-targeted landing pages focused on emergency healthcare keywords.",
    ],
    deliverables: [
      "Verified Google Business Profile Setup",
      "Local Citation Audit & Fixes",
      "Geo-targeted Service Pages",
      "Monthly Ranking & Call Tracking Dashboard",
    ],
    technologies: ["Google Search Console", "Google Business Profile", "WordPress"],
    metrics: [
      { label: "Local Map Calls", value: "+140%", period: "90 days", source: "GMB Insights (SAMPLE, DEV ONLY)", verified: true },
      { label: "Local Pack Keywords", value: "#1 to #3", period: "120 days", source: "Search Console (SAMPLE, DEV ONLY)", verified: true },
      { label: "Patient Inquiries", value: "320+", period: "Per Month", source: "Call Tracker (SAMPLE, DEV ONLY)", verified: true },
      { label: "Organic Search Lift", value: "2.4x", period: "6 months", source: "Analytics (SAMPLE, DEV ONLY)", verified: true },
    ],
    media: [
      {
        src: "/assets/sample/sample-clinic-hero.png",
        alt: "SAMPLE, DEV ONLY: Clinic Dashboard Screen Mockup",
        kind: "screenshot",
        permission: true,
        width: 1200,
        height: 750,
      },
      {
        src: "/assets/sample/sample-clinic-sub1.png",
        alt: "SAMPLE, DEV ONLY: Mobile View Mockup",
        kind: "screenshot",
        permission: true,
        width: 800,
        height: 500,
      },
      {
        src: "/assets/sample/sample-clinic-sub2.png",
        alt: "SAMPLE, DEV ONLY: Keyword Growth Chart",
        kind: "screenshot",
        permission: true,
        width: 800,
        height: 500,
      },
    ],
    links: {
      liveUrl: "https://example.com/sample-clinic",
    },
    relatedSlugs: ["sample-retail-brand-ecommerce", "sample-b2b-lead-engine"],
  },
  {
    id: "sample-proj-2",
    slug: "sample-retail-brand-ecommerce",
    status: "draft",
    source: "dev-fixtures",
    approved: true,
    client: {
      name: "SAMPLE, DEV ONLY: Awadh Handicrafts & Apparel",
      permissionToName: true,
      permissionToLogo: true,
    },
    industry: "Retail & E-commerce",
    category: ["Websites", "Paid Media"],
    services: ["ecommerce-websites", "meta-ads-lead-generation"],
    year: "2026",
    summary:
      "SAMPLE, DEV ONLY: Mobile-first online storefront with UPI checkout and high-ROAS Meta catalog advertising.",
    challenge:
      "SAMPLE, DEV ONLY: Transitioning a high-touch traditional retail showroom in Hazratganj into a nationwide direct-to-consumer e-commerce brand.",
    approach: [
      "SAMPLE, DEV ONLY: Engineered a sub-second load time e-commerce store with frictionless UPI single-step checkout.",
      "SAMPLE, DEV ONLY: Configured catalog feed ads and dynamic retargeting campaigns across Instagram and Facebook.",
      "SAMPLE, DEV ONLY: Integrated automated WhatsApp order notifications and dispatch tracking alerts.",
    ],
    deliverables: [
      "Custom E-commerce Storefront",
      "UPI & NetBanking Payment Gateways",
      "Meta Ads Funnel & Catalog Feed",
      "Automated Shipping Webhooks",
    ],
    technologies: ["WooCommerce", "WordPress", "Razorpay", "Meta Ads Manager"],
    // Tests project with 0 metrics (fallback to scope tags)
    metrics: [],
    media: [
      {
        src: "/assets/sample/sample-store-hero.png",
        alt: "SAMPLE, DEV ONLY: E-commerce Store Mockup",
        kind: "screenshot",
        permission: true,
        width: 1200,
        height: 750,
      },
      {
        src: "/assets/sample/sample-store-sub1.png",
        alt: "SAMPLE, DEV ONLY: Checkout UX",
        kind: "screenshot",
        permission: true,
        width: 800,
        height: 500,
      },
      {
        src: "/assets/sample/sample-store-sub2.png",
        alt: "SAMPLE, DEV ONLY: Mobile Cart Flow",
        kind: "screenshot",
        permission: true,
        width: 800,
        height: 500,
      },
    ],
    links: {
      liveUrl: "https://example.com/sample-store",
    },
    relatedSlugs: ["sample-lucknow-healthcare-clinic", "sample-enterprise-erp-billing"],
  },
  {
    id: "sample-proj-3",
    slug: "sample-b2b-lead-engine",
    status: "draft",
    source: "dev-fixtures",
    approved: true,
    client: {
      name: "SAMPLE, DEV ONLY: Industrial Equipment Corp",
      permissionToName: true,
      permissionToLogo: true,
    },
    industry: "Manufacturing & Industrial",
    category: ["Paid Media", "SEO"],
    services: ["google-ads-ppc", "seo"],
    year: "2025",
    summary:
      "SAMPLE, DEV ONLY: High-intent Google Search PPC and B2B organic lead pipeline generating commercial machinery inquiries.",
    challenge:
      "SAMPLE, DEV ONLY: High cost per lead and irrelevant consumer clicks draining marketing ad spend on broad search queries.",
    approach: [
      "SAMPLE, DEV ONLY: Sculpted 300+ negative keyword exclusions to filter out retail DIY hobbyists.",
      "SAMPLE, DEV ONLY: Built dedicated landing pages highlighting technical machine specs and direct RFQ inquiry forms.",
      "SAMPLE, DEV ONLY: Implemented offline conversion tracking to feed qualified deal values back into Google smart bidding.",
    ],
    deliverables: [
      "Google Search PPC Campaign Architecture",
      "High-Conversion B2B Landing Pages",
      "Call & Form Lead Routing Webhook",
      "Technical On-Page SEO Blueprint",
    ],
    technologies: ["Google Ads", "Google Tag Manager", "PHP", "MySQL"],
    metrics: [
      { label: "Cost Per Lead", value: "-46%", period: "60 days", source: "Google Ads (SAMPLE, DEV ONLY)", verified: true },
      { label: "Qualified RFQ Calls", value: "3.2x", period: "Quarterly", source: "CRM Logs (SAMPLE, DEV ONLY)", verified: true },
    ],
    media: [
      {
        src: "/assets/sample/sample-b2b-hero.png",
        alt: "SAMPLE, DEV ONLY: B2B Machine Portal Mockup",
        kind: "screenshot",
        permission: true,
        width: 1200,
        height: 750,
      },
    ],
    links: {
      liveUrl: "https://example.com/sample-b2b",
    },
    relatedSlugs: ["sample-enterprise-erp-billing", "sample-lucknow-healthcare-clinic"],
  },
  {
    id: "sample-proj-4",
    slug: "sample-enterprise-erp-billing",
    status: "draft",
    source: "dev-fixtures",
    approved: true,
    client: {
      name: "SAMPLE, DEV ONLY: Regional Logistics Hub",
      permissionToName: true,
      permissionToLogo: true,
    },
    industry: "Logistics & Supply Chain",
    category: ["Software"],
    services: ["erp-billing-gst", "custom-software"],
    year: "2026",
    summary:
      "SAMPLE, DEV ONLY: Multi-branch GST billing, consignment inventory, and dispatch tracking software.",
    challenge:
      "SAMPLE, DEV ONLY: Disconnected billing desks and manual paper ledgers creating invoice discrepancies and stock leakage across warehouses.",
    approach: [
      "SAMPLE, DEV ONLY: Designed a unified relational database schema covering goods receipt, warehousing, and GST invoicing.",
      "SAMPLE, DEV ONLY: Built responsive billing counter UI supporting barcode scanner input and thermal receipt printing.",
      "SAMPLE, DEV ONLY: Automated end-of-day reconciliation summaries with real-time management dashboards.",
    ],
    deliverables: [
      "Custom ERP & GST Invoicing Application",
      "Thermal & A4 Invoice Print Templates",
      "Multi-Branch Warehouse Inventory Module",
      "Role-Based Access Management & Audit Logs",
    ],
    technologies: ["Node.js", "React", "PostgreSQL", "REST APIs"],
    metrics: [
      { label: "Billing Speed", value: "4x Faster", period: "At Counter", source: "Time Study (SAMPLE, DEV ONLY)", verified: true },
      { label: "Inventory Errors", value: "-92%", period: "Annual", source: "Audit Records (SAMPLE, DEV ONLY)", verified: true },
      { label: "GST Reconciliation", value: "100%", period: "Monthly", source: "Compliance Logs (SAMPLE, DEV ONLY)", verified: true },
    ],
    media: [
      {
        src: "/assets/sample/sample-erp-hero.png",
        alt: "SAMPLE, DEV ONLY: ERP Software Dashboard Mockup",
        kind: "screenshot",
        permission: true,
        width: 1200,
        height: 750,
      },
    ],
    links: {
      liveUrl: "https://example.com/sample-erp",
    },
    relatedSlugs: ["sample-b2b-lead-engine", "sample-retail-brand-ecommerce"],
  },
];
