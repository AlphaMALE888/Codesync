import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { FaqSection } from "@/components/sections/faq/FaqSection";
import { siteConfig } from "@/data/site";
import { Phone, MessageSquare, Mail, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/jsonld";
import { faqsData } from "@/data/faqs";
import { renderable } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Our Lucknow Team",
  description:
    "Get in touch with CODESYNC in Lucknow. Call, WhatsApp, or send a project enquiry directly to our technology and marketing leads.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our Lucknow Team | CODESYNC",
    description:
      "Connect directly with CODESYNC Digi Marketing (OPC) Pvt Ltd in Lucknow, Uttar Pradesh. Call, WhatsApp, or request a free consultation.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  const contactFaqs = renderable(faqsData)
    .slice(0, 5)
    .map((f) => ({ question: f.question, answer: f.answer }));
  const faqSchema = getFaqSchema(contactFaqs);

  return (
    <main className="min-h-screen bg-canvas pt-32 sm:pt-40">
      <JsonLd data={[breadcrumbs, faqSchema]} />

      <Container>
        <div id="book-a-call" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 sm:pb-28">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <Eyebrow withRule>DIRECT ACCESS</Eyebrow>
              <Heading level={1} className="mt-4 text-display-md sm:text-display-lg text-ink font-medium tracking-tight">
                Let&apos;s talk.
              </Heading>
              <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
                Connect directly with our Lucknow team. We discuss your project requirements, technical challenges, and growth objectives with transparent accountability.
              </p>
            </div>

            {/* Direct Verified Communication Rows */}
            <div className="space-y-4 pt-4 border-t border-hairline">
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block">
                Direct Channels (Lucknow, UP)
              </span>

              {/* WhatsApp Link */}
              <Link
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-md bg-white border border-hairline hover:border-accent/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wider block">
                      Instant WhatsApp
                    </span>
                    <span className="font-medium text-base text-ink group-hover:text-emerald-700 transition-colors">
                      +91 8948040913
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Phone 1 */}
              <a
                href={`tel:${siteConfig.contact.phones[0]}`}
                className="group flex items-center justify-between p-4 rounded-md bg-white border border-hairline hover:border-accent/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wider block">
                      Direct Line (Primary)
                    </span>
                    <span className="font-medium text-base text-ink group-hover:text-accent transition-colors">
                      +91 {siteConfig.contact.phones[0]}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Phone 2 */}
              <a
                href={`tel:${siteConfig.contact.phones[1]}`}
                className="group flex items-center justify-between p-4 rounded-md bg-white border border-hairline hover:border-accent/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wider block">
                      Direct Line (Secondary)
                    </span>
                    <span className="font-medium text-base text-ink group-hover:text-accent transition-colors">
                      +91 {siteConfig.contact.phones[1]}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group flex items-center justify-between p-4 rounded-md bg-white border border-hairline hover:border-accent/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-surface-muted text-ink flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-text-secondary uppercase tracking-wider block">
                      Official Support
                    </span>
                    <span className="font-medium text-base text-ink group-hover:text-accent transition-colors">
                      {siteConfig.contact.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Full Inquiry Form */}
          <div className="lg:col-span-7">
            <InquiryForm />
          </div>
        </div>
      </Container>

      {/* Embedded FAQ Section */}
      <FaqSection id="contact-faq" limit={5} showContactCta={false} />
    </main>
  );
}
