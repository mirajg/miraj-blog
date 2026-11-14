import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function isSafeUrl(value?: string) {
  if (!value) return false;

  const trimmed = value.trim();
  if (!trimmed || /^\s*$/u.test(trimmed)) return false;

  if (/^(?:javascript|data|vbscript):/i.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;

  try {
    const parsed = new URL(trimmed, "https://example.com");
    return ["http:", "https:", "mailto:", "tel:"].includes(
      parsed.protocol
    );
  } catch {
    return false;
  }
}

export default function MarkdownContent({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="
        prose prose-invert mt-10 max-w-none
        prose-headings:scroll-mt-24
        prose-headings:font-bold
        prose-headings:tracking-tight
        prose-h1:text-3xl
        prose-h2:mt-12
        prose-h2:text-2xl
        prose-h3:mt-8
        prose-h3:text-xl
        prose-p:text-zinc-300
        prose-p:leading-8
        prose-a:text-blue-400
        prose-a:no-underline
        hover:prose-a:text-blue-300
        prose-strong:text-zinc-100
        prose-code:text-blue-300
        prose-pre:border
        prose-pre:border-zinc-800
        prose-pre:bg-zinc-900
        prose-blockquote:border-blue-500/50
        prose-blockquote:text-zinc-400
        prose-li:text-zinc-300
        prose-hr:border-zinc-800
        prose-img:rounded-xl
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ node, ...props }) => <h2 {...props} />,

          a: ({ node, href, children, ...props }) => {
            if (typeof href !== "string" || !isSafeUrl(href)) {
              return <span>{children}</span>;
            }

            const external = /^https?:\/\//i.test(href);

            return (
              <a
                href={href}
                {...props}
                {...(external
                  ? {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
              >
                {children}
              </a>
            );
          },

          img: ({ node, src, ...props }) => {
            const safeSrc =
              typeof src === "string" && isSafeUrl(src)
                ? src
                : undefined;

            return (
              <img
                {...props}
                src={safeSrc}
                loading="lazy"
                alt={props.alt ?? ""}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}