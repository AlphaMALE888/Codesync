import React from "react";

interface ArticleBodyProps {
  body: string;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  // Parse paragraphs and basic markdown structures
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-[680px] mx-auto font-body text-text-primary text-base md:text-lg leading-relaxed space-y-6">
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();

        // Check if heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="type-h2 font-display tracking-tight text-text-primary pt-6 mb-3"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        // Check if heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="type-h3 font-display tracking-tight text-text-primary pt-4 mb-2"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        // Check if blockquote
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="p-5 my-6 border-l-4 border-accent-default bg-surface-subtle rounded-r-card text-text-secondary italic text-base"
            >
              {trimmed.replace(/^>\s+/, "")}
            </blockquote>
          );
        }

        // Check if ordered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const listItems = trimmed.split("\n").filter(Boolean);
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-2 text-text-secondary text-base">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {item.replace(/^\d+\.\s+/, "")}
                </li>
              ))}
            </ol>
          );
        }

        // Check if unordered list
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const listItems = trimmed.split("\n").filter(Boolean);
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2 text-text-secondary text-base">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {item.replace(/^[-*]\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-text-secondary leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
