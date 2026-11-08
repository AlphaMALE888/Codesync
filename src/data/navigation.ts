import { NavItem } from "./types";

export const navigationItems: NavItem[] = [
  {
    label: "Works",
    href: "/work",
    flag: "work",
  },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        category: "GROW",
        items: [
          { label: "Local SEO & Google Business Profile", href: "/services/local-seo-google-business-profile" },
          { label: "SEO (Search Engine Optimization)", href: "/services/seo" },
          { label: "Google Ads & PPC", href: "/services/google-ads-ppc" },
          { label: "Meta Ads & Lead Generation", href: "/services/meta-ads-lead-generation" },
          { label: "Social, Content, Email & SMS", href: "/services/social-content-email-sms" },
        ],
      },
      {
        category: "BUILD",
        items: [
          { label: "Business Websites", href: "/services/business-websites" },
          { label: "E-commerce Websites", href: "/services/ecommerce-websites" },
          { label: "Mobile Apps", href: "/services/mobile-apps" },
          { label: "UI/UX & Graphic Design", href: "/services/ui-ux-graphic-design" },
          { label: "Domain, Hosting & Maintenance", href: "/services/domain-hosting-maintenance" },
        ],
      },
      {
        category: "RUN",
        items: [
          { label: "CRM Solutions", href: "/services/crm" },
          { label: "ERP, Billing & GST Software", href: "/services/erp-billing-gst" },
          { label: "HRMS & Payroll", href: "/services/hrms-payroll" },
          { label: "Custom Software", href: "/services/custom-software" },
        ],
      },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    flag: "insights",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Company",
    href: "/about",
  },
];
