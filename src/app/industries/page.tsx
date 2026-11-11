import { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/data/features";

export const metadata: Metadata = {
  title: "Industries Served",
  description:
    "Specialized marketing and software solutions across key business verticals from CODESYNC in Lucknow.",
  alternates: {
    canonical: "/industries",
  },
  robots: {
    index: features.industries,
    follow: features.industries,
  },
};

export default function IndustriesPage() {
  // If industries feature flag is disabled, return 404 per Phase 5 specifications
  if (!features.industries) {
    notFound();
  }

  return (
    <div className="py-24">
      <h1 className="text-display-md font-bold">Industries</h1>
    </div>
  );
}
