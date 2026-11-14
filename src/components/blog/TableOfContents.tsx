
import GithubSlugger from "github-slugger";

type Heading = {
  level: 2 | 3;
  text: string;
  id: string;
};

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

export default function TableOfContents({
  content,
}: {
  content: string;
}) {
  const headings = getHeadings(content);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="my-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg shadow-black/10 sm:p-6"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">
        On this page
      </p>

      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${heading.id}`}
              className="block rounded-md px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-blue-400"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}