import React from "react";
import { Container } from "@/components/layout/Container";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { siteConfig } from "@/data/site";
import { Phone, MessageSquare } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section
      id="final-cta-section"
      className="w-full py-20 sm:py-28 px-[clamp(8px,1.2vw,16px)] bg-transparent"
    >
      <div className="w-full rounded-lg bg-gradient-to-br from-[#1B1B1F]/80 via-[#121214]/75 to-[#641B30]/30 text-on-dark p-8 sm:p-14 lg:p-20 border border-white/12 shadow-2xl relative overflow-hidden">
        {/* Subtle Atmospheric Crimson Radial Vignette (lets converging WebGL particles shine) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 75% 50%, rgba(224, 46, 79, 0.14) 0%, rgba(18, 18, 20, 0.05) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <Container className="relative z-10 !px-0">
          <Reveal>
            <div className="max-w-3xl space-y-6">
              <span className="type-label text-accent-soft font-mono text-xs tracking-widest block uppercase">
                LET&apos;S TALK GROWTH
              </span>

              <h2 className="type-display-xl text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Tell us what you want to grow.
              </h2>

              <p className="type-body text-text-secondary-on-dark text-base sm:text-lg max-w-xl leading-relaxed">
                Whether you need qualified leads for your local business or custom software to streamline your operations,
                our Lucknow team is ready to plan your roadmap.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
                <SplitArrowButton href="/contact#book-a-call" variant="solid-light" size="lg">
                  Book a free call
                </SplitArrowButton>

                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-pill bg-white/10 hover:bg-accent/25 text-white text-sm font-medium border border-white/15 hover:border-accent-soft/50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-accent-soft" />
                  <span>WhatsApp us</span>
                </a>

                <a
                  href={`tel:${siteConfig.contact.phones[0]}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent-soft" />
                  <span>+91 {siteConfig.contact.phones[0]}</span>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
