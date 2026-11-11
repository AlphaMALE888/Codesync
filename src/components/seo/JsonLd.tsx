import React from "react";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

interface JsonLdProps {
  data?: JsonLdValue;
  schema?: JsonLdValue;
}

/**
 * Safely renders JSON-LD structured data script.
 * Escapes closing script tags to prevent XSS.
 */
export function JsonLd({ data, schema }: JsonLdProps) {
  const content = data ?? schema;
  if (!content) return null;
  const jsonString = JSON.stringify(content).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
