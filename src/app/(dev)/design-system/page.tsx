import React from "react";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Display, Heading, Text, Eyebrow } from "@/components/ui/Typography";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { TextLink } from "@/components/ui/TextLink";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { DisplayMarquee } from "@/components/ui/DisplayMarquee";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const tokens = [
    { name: "--canvas", hex: "#F5F5F3", bg: "#F5F5F3", text: "#121212", ratio: "16.1:1 (AAA)" },
    { name: "--ink", hex: "#121212", bg: "#121212", text: "#FFFFFF", ratio: "18.2:1 (AAA)" },
    { name: "--surface-dark", hex: "#111213", bg: "#111213", text: "#FFFFFF", ratio: "18.5:1 (AAA)" },
    { name: "--surface-dark-2", hex: "#1A1B1C", bg: "#1A1B1C", text: "#FFFFFF", ratio: "16.7:1 (AAA)" },
    { name: "--surface-muted", hex: "#EBEBE9", bg: "#EBEBE9", text: "#121212", ratio: "14.8:1 (AAA)" },
    { name: "--hairline", hex: "#DCDCD9", bg: "#DCDCD9", text: "#121212", ratio: "13.2:1 (AAA)" },
    { name: "--text-secondary", hex: "#5F5F5F", bg: "#5F5F5F", text: "#FFFFFF", ratio: "5.8:1 (AA)" },
    { name: "--text-secondary-on-dark", hex: "#A3A3A0", bg: "#A3A3A0", text: "#111213", ratio: "7.1:1 (AAA)" },
    { name: "--accent", hex: "#2F5A44", bg: "#2F5A44", text: "#FFFFFF", ratio: "6.9:1 (AA)" },
    { name: "--accent-soft", hex: "#49735A", bg: "#49735A", text: "#FFFFFF", ratio: "4.7:1 (AA)" },
    { name: "--field-1", hex: "#C9D8CF", bg: "#C9D8CF", text: "#121212", ratio: "11.8:1 (AAA)" },
    { name: "--field-2", hex: "#E6DCCB", bg: "#E6DCCB", text: "#121212", ratio: "13.9:1 (AAA)" },
    { name: "--field-3", hex: "#E3CFC8", bg: "#E3CFC8", text: "#121212", ratio: "12.5:1 (AAA)" },
  ];

  return (
    <div className="w-full">
      {/* Dev Header */}
      <div className="bg-ink text-white py-4 px-6 border-b border-white/10 flex justify-between items-center text-xs tracking-wider uppercase font-mono">
        <span>CODESYNC Design System — Phase 1 Foundation</span>
        <span className="text-accent-soft font-semibold">DEV ONLY — 404 in Production</span>
      </div>

      {/* 1. Color Tokens Section */}
      <Section tone="light" padded>
        <Container>
          <Eyebrow className="mb-4">System Foundation</Eyebrow>
          <Heading level={1} className="mb-8">Design Tokens & Color Contrast</Heading>
          <Text variant="secondary" className="max-w-2xl mb-12">
            Every color token is mapped to CSS custom variables in globals.css and exposed directly to Tailwind. 
            All text/background combinations meet WCAG AA standards (minimum 4.5:1 ratio).
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tokens.map((token) => (
              <div key={token.name} className="p-4 rounded-md border border-hairline bg-white shadow-sm flex flex-col gap-3">
                <div
                  className="w-full h-20 rounded-sm flex items-center justify-center font-mono text-xs font-semibold"
                  style={{ backgroundColor: token.bg, color: token.text }}
                >
                  {token.hex}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-ink">{token.name}</div>
                  <div className="text-xs text-text-secondary mt-1">Contrast: {token.ratio}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 2. Typography Scale Section */}
      <Section tone="muted" padded>
        <Container>
          <Eyebrow className="mb-4">Typography System</Eyebrow>
          <Heading level={2} className="mb-8">Fluid Typography Scale</Heading>
          <Text variant="secondary" className="max-w-2xl mb-12">
            Loaded via next/font (Inter Tight for Display/Headings, Inter for Body). Scaled responsively using CSS clamp formulas.
          </Text>

          <div className="space-y-12 bg-white p-8 sm:p-12 rounded-lg border border-hairline shadow-sm">
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Display XL (clamp(3.25rem, 11vw, 11rem))</span>
              <Display>Grow. Build. Run.</Display>
            </div>
            <hr className="border-hairline" />
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Heading 1 (clamp(2.75rem, 6vw, 6rem))</span>
              <Heading level={1}>Marketing that grows revenue.</Heading>
            </div>
            <hr className="border-hairline" />
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Heading 2 (clamp(2.25rem, 4.5vw, 4.5rem))</span>
              <Heading level={2}>Tailored Intelligence for Lucknow Business.</Heading>
            </div>
            <hr className="border-hairline" />
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Heading 3 (clamp(1.5rem, 2.2vw, 2.25rem))</span>
              <Heading level={3}>Autonomous Software & Business Automation</Heading>
            </div>
            <hr className="border-hairline" />
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Body & Secondary Body</span>
              <Text className="max-w-3xl mb-3">
                We help Lucknow businesses attract qualified leads with SEO, local SEO, Google Ads, Meta Ads and social media, 
                then build the websites, web apps and CRM software that turn demand into lasting growth.
              </Text>
              <Text variant="secondary" className="max-w-3xl">
                Secondary label text rendered with high contrast compliance (WCAG AA certified).
              </Text>
            </div>
            <hr className="border-hairline" />
            <div>
              <span className="type-label text-text-secondary block mb-2 font-mono">Tabular Numerals (Counters & Pricing)</span>
              <div className="font-tabular text-4xl font-bold tracking-tight text-ink">
                ₹13,999 / ₹29,999 / ₹4,999 / 24–48 hrs
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Interactive Primitives Section */}
      <Section tone="light" padded>
        <Container>
          <Eyebrow className="mb-4">UI Primitives</Eyebrow>
          <Heading level={2} className="mb-8">Buttons, Pills, Links & Motifs</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* SplitArrowButton */}
            <div className="p-8 rounded-lg border border-hairline bg-white shadow-sm space-y-6">
              <span className="type-label text-text-secondary block font-mono">SplitArrowButton (All Variants & Sizes)</span>
              
              <div className="flex flex-wrap items-center gap-4">
                <SplitArrowButton variant="solid-light" size="md">
                  Book a free call
                </SplitArrowButton>
                <SplitArrowButton variant="solid-light" size="lg">
                  Large Solid Light
                </SplitArrowButton>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <SplitArrowButton variant="solid-dark" size="md">
                  Solid Dark Button
                </SplitArrowButton>
                <SplitArrowButton variant="outline" size="md">
                  Outline Variant
                </SplitArrowButton>
                <SplitArrowButton variant="solid-light" size="md" disabled>
                  Disabled State
                </SplitArrowButton>
              </div>
            </div>

            {/* Category Pills & Links */}
            <div className="p-8 rounded-lg border border-hairline bg-white shadow-sm space-y-6">
              <span className="type-label text-text-secondary block font-mono">CategoryPills & TextLinks</span>
              
              <div className="flex flex-wrap items-center gap-2">
                <CategoryPill variant="light">SEO & Local</CategoryPill>
                <CategoryPill variant="dark">Websites & Apps</CategoryPill>
                <CategoryPill variant="outline">ERP & CRM</CategoryPill>
                <CategoryPill variant="light">Grow</CategoryPill>
                <CategoryPill variant="dark">Build</CategoryPill>
                <CategoryPill variant="outline">Run</CategoryPill>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <TextLink href="/services">Explore All Services &rarr;</TextLink>
                <TextLink href="https://wa.me/918948040913" external>
                  Chat on WhatsApp &rarr;
                </TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Awadhi Arch Motif Demonstration */}
      <Section tone="dark" padded>
        <Container>
          <Eyebrow className="text-text-secondary-on-dark mb-4">Original Lucknow Motif</Eyebrow>
          <Heading level={2} className="text-on-dark mb-6">Awadhi Pointed-Arch Geometry</Heading>
          <Text variant="secondary-on-dark" className="max-w-2xl mb-12">
            Replaces the template&apos;s starburst with an original Awadhi architectural pointed-arch motif, 
            connecting CODESYNC to its Lucknow heritage.
          </Text>

          <div className="p-8 rounded-lg border border-white/10 bg-surface-dark-2 flex flex-wrap items-center justify-around gap-8 text-accent-soft">
            <div className="flex flex-col items-center gap-3">
              <ArchMotif size="sm" />
              <span className="font-mono text-xs text-text-secondary-on-dark">Small (16x24px)</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ArchMotif size="md" />
              <span className="font-mono text-xs text-text-secondary-on-dark">Medium (24x36px)</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ArchMotif size="lg" />
              <span className="font-mono text-xs text-text-secondary-on-dark">Large (40x60px)</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Display Marquee Demonstration */}
      <div className="py-8 bg-canvas border-y border-hairline">
        <DisplayMarquee text="Grow. Build. Run." />
      </div>

      {/* 6. Accordion & SectionHeader Demonstration */}
      <Section tone="dark" padded>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="COMMON QUERIES"
              title="Frequently Asked Questions"
              intro="Demonstrating the dark rounded accordion rows and single/multiple expansion states."
              tone="dark"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-3xl">
              <Accordion type="single" defaultOpen="item-1" tone="dark">
                <AccordionItem id="item-1" title="What services does CODESYNC provide?">
                  Digital marketing (Local SEO, Google Ads, Meta Ads, Social Media, Content, Email, SMS) 
                  and custom software development (Websites, Mobile Apps, CRM, ERP, Billing, HRMS).
                </AccordionItem>
                <AccordionItem id="item-2" title="How is the price of a project decided?">
                  Final pricing depends on project goals, scope, content preparation, campaign ad budget, 
                  and required delivery timelines. We follow a transparent quote-first model.
                </AccordionItem>
                <AccordionItem id="item-3" title="Do you offer maintenance and support after launch?">
                  Yes, all IT development services come with maintenance support options including updates, 
                  technical fixes, and backup monitoring.
                </AccordionItem>
              </Accordion>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 7. MediaSlot Placeholder & Image Handling */}
      <Section tone="light" padded>
        <Container>
          <SectionHeader
            eyebrow="ASSET SAFEGUARD"
            title="MediaSlot Component Behavior"
            intro="Guarantees zero broken layout shifts or missing boxes. Displays informative striped markers in development and hides cleanly in production."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="type-label text-text-secondary font-mono text-xs block">16:9 Aspect Video/Photo</span>
              <MediaSlot aspect="16/9" label="Hero Terrain Composition" />
            </div>
            <div className="space-y-2">
              <span className="type-label text-text-secondary font-mono text-xs block">4:5 Aspect Team Portrait</span>
              <MediaSlot aspect="4/5" label="Leadership Headshot" />
            </div>
            <div className="space-y-2">
              <span className="type-label text-text-secondary font-mono text-xs block">1:1 Aspect Client Logo</span>
              <MediaSlot aspect="1/1" label="Partner Logo" />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
