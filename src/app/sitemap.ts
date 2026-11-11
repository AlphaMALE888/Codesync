import { MetadataRoute } from "next";
import { servicesData } from "@/data/services";
import { features } from "@/data/features";
import { getRenderableLegalPages } from "@/lib/legal";
import { getRenderableArticles } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdmlko.com";
  const now = new Date();

  // Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 14 Core Services Pages
  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Renderable Legal Pages (only those with status: "published")
  const renderableLegal = getRenderableLegalPages();
  const legalRoutes: MetadataRoute.Sitemap = renderableLegal.map((p) => ({
    url: `${baseUrl}/legal/${p.slug}`,
    lastModified: p.effectiveDate ? new Date(p.effectiveDate) : now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  // Feature Flag: Work & Portfolio
  const workRoutes: MetadataRoute.Sitemap = [];
  if (features.work) {
    workRoutes.push({
      url: `${baseUrl}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Feature Flag: Insights & Thought Leadership
  const insightRoutes: MetadataRoute.Sitemap = [];
  if (features.insights) {
    const articles = getRenderableArticles();
    if (articles.length > 0) {
      insightRoutes.push({
        url: `${baseUrl}/insights`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      articles.forEach((a) => {
        insightRoutes.push({
          url: `${baseUrl}/insights/${a.slug}`,
          lastModified: a.updated || a.date ? new Date(a.updated || a.date) : now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }
  }

  // Feature Flag: Industries
  const industryRoutes: MetadataRoute.Sitemap = [];
  if (features.industries) {
    industryRoutes.push({
      url: `${baseUrl}/industries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...legalRoutes,
    ...workRoutes,
    ...insightRoutes,
    ...industryRoutes,
  ];
}
