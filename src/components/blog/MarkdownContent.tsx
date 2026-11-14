
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function isSafeUrl(value?: string) {
  if (!value) return false;

  const trimmed = value.trim();
  if (!trimmed || /^\s*$/u.test(trimmed)) return false;

  // Block obvious script/data vectors. Keep normal links, relative paths, and
  // common safe protocols.
  if (/^(?:javascript|data|vbscript):/i.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;

  try {
    const parsed = new URL(trimmed, "https://example.com");
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          // The page title is the only H1, so demote any "#" inside the content
          h1: ({ node, ...props }) => <h2 {...props} />,

          // Only render safe URLs. This prevents javascript: and data: payloads
          // from being executed when users add links or images in Markdown.
          a: ({ node, href, children, ...props }) => {
            // Unsafe or missing URL: show the text, but not as a link
            if (typeof href !== "string" || !isSafeUrl(href)) {
              return <span>{children}</span>;
            }

            const external = /^https?:\/\//i.test(href);

            return (
              <a
                href={href}
                {...props}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },

          // Lazy-load images inside posts (alt text comes from your Markdown)
          img: ({ node, src, ...props }) => {
            const safeSrc = typeof src === "string" && isSafeUrl(src) ? src : undefined;
            // eslint-disable-next-line @next/next/no-img-element
            return <img {...props} src={safeSrc} loading="lazy" alt={props.alt ?? ""} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}