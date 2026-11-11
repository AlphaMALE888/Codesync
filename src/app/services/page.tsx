import { Metadata } from "next";
import { getAllServices } from "@/lib/content";
import { ServicesIndex } from "@/components/sections/services/ServicesIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Digital Marketing & Software Services in Lucknow",
  description:
    "Explore our 14 core capabilities across Digital Marketing (GROW), Websites & Mobile Apps (BUILD), and Custom Business Software (RUN). Engineered in Lucknow for measurable growth.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Digital Marketing & Software Services in Lucknow | CODESYNC",
    description:
      "Explore our 14 core capabilities across GROW (marketing), BUILD (websites/apps), and RUN (business software).",
    url: "/services",
  },
};

export default function ServicesPage() {
  const services = getAllServices();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ServicesIndex services={services} />
    </>
  );
}
