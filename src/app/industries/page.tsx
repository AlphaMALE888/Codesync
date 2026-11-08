import { notFound } from "next/navigation";
import { features } from "@/data/features";

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
