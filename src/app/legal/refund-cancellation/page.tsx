import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/legal";
import { LegalLayout } from "@/components/legal/LegalLayout";

export default function RefundCancellationPage() {
  const page = getLegalPage("refund-cancellation");

  // In accordance with Phase 9 rules: routes with status 'awaiting-client-text' return 404
  if (!page || page.status !== "published") {
    notFound();
  }

  return <LegalLayout page={page} />;
}
