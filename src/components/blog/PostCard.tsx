import Image from "next/image";
import Link from "next/link";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { formatDate } from "@/lib/format";

export type PostCardData = {
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  publishedAt: Date;
  readingTime: number;
};

type Props = {
  post: PostCardData;
  headingLevel?: "h2" | "h3";
};

export default function PostCard({
  post,
  headingLevel: Heading = "h2",
}: Props) {
  const href = `/blog/${post.slug}`;

  return (
    <article
      className="
        group relative
        rounded-2xl
        border border-zinc-800
        bg-zinc-900/70
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-500/40
        hover:bg-zinc-900
        hover:shadow-xl
        hover:shadow-gray-500/10
        focus-within:border-gray-500/60
        sm:p-7
      "
    >
      {post.coverImage && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? ""}
            width={640}
            height={336}
            sizes="(max-width: 768px) 100vw, 768px"
            draggable={false}
            className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className={post.coverImage ? "mt-6" : ""}>
        <CategoryBadge slug={post.category} />

        <Heading className="mt-4 text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-blue-400 sm:text-2xl">
          {/* The ::after on this link stretches over the whole card,
              making the entire card clickable. */}
          <Link
            href={href}
            className="
              after:absolute after:inset-0 after:content-['']
              focus:outline-none
            "
          >
            {post.title}
          </Link>
        </Heading>

        <p className="mt-3 text-base leading-7 text-zinc-400">
          {post.description}
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="whitespace-nowrap text-sm text-zinc-500">
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>{" "}
            <span className="text-zinc-700">·</span> {post.readingTime} min read
          </p>

          <span
            aria-hidden
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30 sm:w-auto sm:shrink-0 "
          >
            Read article
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}