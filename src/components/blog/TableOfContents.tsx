
import GithubSlugger from "github-slugger";

type Heading = { level: 2 | 3; text: string; id: string };

// Reads "##" and "###" lines from the Markdown, skipping code blocks.
// IDs are generated the same way rehype-slug does, so the links match.
function getHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCodeBlock = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+?)(?:\s+#+)?\s*$/.exec(line);
    if (!match) continue;

    // Remove Markdown symbols so the text matches what's rendered
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[`*_]/g, "");

    headings.push({
      level: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    });
  }

  return headings;
}

export default function TableOfContents({ content }: { content: string }) {
  const headings = getHeadings(content);
  if (headings.length < 3) return null; // not worth showing for short posts

  return (
    <nav aria-label="Table of contents" className="my-8 rounded border p-4 text-sm">
      <p className="mb-2 font-semibold">On this page</p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}