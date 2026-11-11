import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdmlko.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/design-system", "/(dev)/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
