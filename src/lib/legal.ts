import fs from "fs";
import path from "path";
import { LegalPageItem } from "@/data/types";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export function parseMarkdownFile(filePath: string): { frontmatter: Record<string, string>; content: string } {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, content: raw };
  }

  const yamlBlock = match[1];
  const content = match[2];

  const frontmatter: Record<string, string> = {};
  yamlBlock.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}

export function getLegalPage(slug: string): LegalPageItem | null {
  const filePath = path.join(LEGAL_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { frontmatter, content } = parseMarkdownFile(filePath);

  // Extract H2 sections for table of contents
  const sections: { id: string; title: string; content: string }[] = [];
  const rawSections = content.split(/\n(?=##\s+)/);

  rawSections.forEach((sec, idx) => {
    const titleMatch = sec.match(/^##\s+(.*)/);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      // Generate stable anchor id, e.g. "section-1", "section-2", etc.
      const numMatch = title.match(/^(\d+)\.\s*(.*)/);
      const id = numMatch ? `section-${numMatch[1]}` : `section-${idx + 1}`;
      sections.push({
        id,
        title,
        content: sec.replace(/^##\s+.*\n?/, "").trim(),
      });
    }
  });

  return {
    slug,
    title: frontmatter.title || slug,
    effectiveDate: frontmatter.effectiveDate || "pending",
    status: (frontmatter.status as "published" | "awaiting-client-text") || "awaiting-client-text",
    content,
    sections,
  };
}

export function getRenderableLegalPages(): LegalPageItem[] {
  const slugs = ["privacy", "terms", "refund-cancellation"];
  const pages: LegalPageItem[] = [];

  for (const slug of slugs) {
    const page = getLegalPage(slug);
    if (page && page.status === "published") {
      pages.push(page);
    }
  }

  return pages;
}
