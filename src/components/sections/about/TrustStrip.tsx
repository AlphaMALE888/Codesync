import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { clientsData } from "@/data/clients";
import { credentialsData } from "@/data/credentials";
import { renderable } from "@/lib/content";

export function TrustStrip() {
  const verifiedClients = renderable(clientsData).filter(
    (c) => c.permission && c.logo
  );
  const verifiedCredentials = renderable(credentialsData).filter(
    (cr) => cr.certificateNumber && cr.issuer
  );

  // If no client logos or credentials have approved permission, return null
  if (verifiedClients.length === 0 && verifiedCredentials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-b border-hairline">
      <Container>
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary block mb-6">
            VERIFIED INDUSTRY TRUST
          </span>

          {/* Client Logos Strip */}
          {verifiedClients.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 grayscale">
              {verifiedClients.map((client) => (
                <div key={client.id} className="relative h-8 w-28">
                  {client.logo && (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Credentials Badges */}
          {verifiedCredentials.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {verifiedCredentials.map((cred) => (
                <div
                  key={cred.id}
                  className="px-3.5 py-1.5 rounded-sm bg-canvas border border-hairline text-xs font-mono text-text-secondary flex items-center gap-2"
                >
                  <span className="font-semibold text-ink">{cred.name}</span>
                  {cred.certificateNumber && (
                    <span className="text-[11px] text-accent">
                      #{cred.certificateNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
