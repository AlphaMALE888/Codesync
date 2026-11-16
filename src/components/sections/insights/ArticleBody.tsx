import React from "react";

interface ArticleBodyProps {
  body: string;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-[680px] mx-auto font-body text-ink text-base md:text-lg leading-relaxed space-y-6">
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="type-h2 font-display tracking-tight text-ink pt-6 mb-3"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="type-h3 font-display tracking-tight text-ink pt-4 mb-2"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="p-5 my-6 border-l-4 border-accent-soft bg-surface-dark-2/85 rounded-r-md text-text-secondary italic text-base"
            >
              {trimmed.replace(/^>\s+/, "")}
            </blockquote>
          );
        }

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

        return (
          <p key={idx} className="text-text-secondary leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
