export type ContentStatus = "verified" | "draft" | "pending";

export interface BaseEntity {
  id: string;
  status: ContentStatus;
  source: string;
  note?: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  domain: string;
  tagline: string;
  positioning: string;
  contact: {
    email: string;
    phones: string[];
    whatsapp: string;
    address: string | null;
    hours: string | null;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  flag?: keyof FeaturesConfig;
  children?: {
    category: string;
    items: { label: string; href: string }[];
  }[];
}

export interface ServiceItem extends BaseEntity {
  slug: string;
  pillar: "grow" | "build" | "run";
  name: string;
  oneLiner: string;
  summary: string;
  audience: string[];
  includes: string[];
  deliverables: string[];
  tools: string[];
  process: { step: number; title: string; desc: string }[];
  timeline: string | null;
  pricing: {
    model: "monthly" | "one-time" | "quote";
    fromPrice: number | null;
    priceStatus: ContentStatus;
    note?: string;
  };
  faqs: string[];
  relatedTestimonialIds: string[];
  relatedServiceSlugs: string[];
}

export interface ProjectItem extends BaseEntity {
  slug: string;
  approved: boolean;
  client: {
    name: string;
    logo?: string;
    permissionToName: boolean;
    permissionToLogo: boolean;
  };
  industry: string;
  category: string[];
  services: string[];
  year?: string;
  summary: string;
  challenge: string;
  approach: string[];
  deliverables: string[];
  technologies: string[];
  metrics: {
    label: string;
    value: string;
    period?: string;
    source?: string;
    verified: boolean;
  }[];
  media: {
    src: string;
    alt: string;
    kind: "screenshot" | "creative" | "photo" | "video";
    permission: boolean;
    width?: number;
    height?: number;
  }[];
  testimonialId?: string;
  links: {
    liveUrl?: string;
  };
  relatedSlugs: string[];
}

export interface TestimonialItem extends BaseEntity {
  author: string;
  business: string;
  quote: string | null;
  confirmedGoogle: boolean;
  serviceCategory?: string;
}

export interface TeamMember extends BaseEntity {
  name: string;
  title: string;
  photo?: string;
  field?: 1 | 2 | 3;
  bio?: string;
}

export interface PricingPlan extends BaseEntity {
  group: "grow" | "build" | "run";
  name: string;
  model: "monthly" | "one-time" | "quote";
  candidatePrice: number | null;
  displayedPrice: number | null;
  approved: boolean;
  features: string[];
  excludes?: string[];
  recommended?: boolean;
}

export interface FaqItem extends BaseEntity {
  question: string;
  answer: string;
  category: "general" | "seo" | "marketing" | "websites" | "software";
}

export interface ArticleItem extends BaseEntity {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  summary: string;
  cover?: string;
  body: string;
}

export interface CredentialItem extends BaseEntity {
  name: string;
  issuer?: string;
  certificateNumber?: string;
  validUntil?: string;
  logo?: string;
}

export interface ClientItem extends BaseEntity {
  name: string;
  logo?: string;
  permission: boolean;
}

export interface ProofItem extends BaseEntity {
  metricType: "timing" | "count" | "rating";
  value: string;
  numericValue?: number;
  caption: string;
}

export interface FeaturesConfig {
  work: boolean;
  insights: boolean;
  industries: boolean;
  pricingNumbers: boolean;
  vision: boolean;
  credentials: boolean;
}
