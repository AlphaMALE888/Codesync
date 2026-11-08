import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <Container className="text-center">
        <Heading level={1} className="mb-4">
          CODESYNC Digi Marketing
        </Heading>
        <Text variant="secondary" className="max-w-xl mx-auto mb-8">
          Website rebuild in progress under Phase 1 (Design System & Global Foundation).
        </Text>
        {process.env.NODE_ENV !== "production" && (
          <div className="inline-block">
            <Link href="/design-system">
              <SplitArrowButton variant="solid-light">
                View Design System (Dev Only)
              </SplitArrowButton>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
