import { Metadata } from "next";
import { getAllServices } from "@/lib/content";
import { ServicesIndex } from "@/components/sections/services/ServicesIndex";

export const metadata: Metadata = {
  title: "Services | CODESYNC Lucknow",
  description:
    "Explore our 14 core capabilities across Digital Marketing (GROW), Websites & Mobile Apps (BUILD), and Custom Business Software (RUN). Engineered in Lucknow for measurable growth.",
};

export default function ServicesPage() {
  const services = getAllServices();

  return <ServicesIndex services={services} />;
}
