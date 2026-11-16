/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/career",
        destination: "/about#careers",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/legal/privacy",
        permanent: true,
      },
      {
        source: "/seo-services-lucknow",
        destination: "/services/seo",
        permanent: true,
      },
      {
        source: "/services/website-development",
        destination: "/services/business-websites",
        permanent: true,
      },
      {
        source: "/services/web-development",
        destination: "/services/business-websites",
        permanent: true,
      },
      {
        source: "/services/e-commerce",
        destination: "/services/ecommerce-websites",
        permanent: true,
      },
      {
        source: "/services/ecommerce",
        destination: "/services/ecommerce-websites",
        permanent: true,
      },
      {
        source: "/services/app-development",
        destination: "/services/mobile-apps",
        permanent: true,
      },
      {
        source: "/services/android-app-development",
        destination: "/services/mobile-apps",
        permanent: true,
      },
      {
        source: "/services/ios-app-development",
        destination: "/services/mobile-apps",
        permanent: true,
      },
      {
        source: "/services/graphic-design",
        destination: "/services/ui-ux-graphic-design",
        permanent: true,
      },
      {
        source: "/services/ui-ux",
        destination: "/services/ui-ux-graphic-design",
        permanent: true,
      },
      {
        source: "/services/domain-hosting",
        destination: "/services/domain-hosting-maintenance",
        permanent: true,
      },
      {
        source: "/services/crm-software",
        destination: "/services/crm",
        permanent: true,
      },
      {
        source: "/services/erp-software",
        destination: "/services/erp-billing-gst",
        permanent: true,
      },
      {
        source: "/services/billing-software",
        destination: "/services/erp-billing-gst",
        permanent: true,
      },
      {
        source: "/services/hrms",
        destination: "/services/hrms-payroll",
        permanent: true,
      },
      {
        source: "/services/google-ads",
        destination: "/services/google-ads-ppc",
        permanent: true,
      },
      {
        source: "/services/ppc",
        destination: "/services/google-ads-ppc",
        permanent: true,
      },
      {
        source: "/services/meta-ads",
        destination: "/services/meta-ads-lead-generation",
        permanent: true,
      },
      {
        source: "/services/facebook-ads",
        destination: "/services/meta-ads-lead-generation",
        permanent: true,
      },
      {
        source: "/services/social-media-marketing",
        destination: "/services/social-content-email-sms",
        permanent: true,
      },
      {
        source: "/services/local-seo",
        destination: "/services/local-seo-google-business-profile",
        permanent: true,
      },
      {
        source: "/services/gmb-management",
        destination: "/services/local-seo-google-business-profile",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
