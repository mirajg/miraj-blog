
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
        rounded-2xl
        border border-zinc-800
        bg-zinc-900/70
        p-6
        transition-all duration-300
        hover:border-zinc-700
        hover:bg-zinc-900
        hover:shadow-lg
        hover:shadow-black/20
        sm:p-7
      "
    >
      {post.coverImage && (
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="block overflow-hidden rounded-xl"
        >
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? ""}
            width={640}
            height={336}
            sizes="(max-width: 768px) 100vw, 768px"
            draggable={false}
            className="h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className={post.coverImage ? "mt-6" : ""}>
        <CategoryBadge slug={post.category} />

        <Heading className="mt-4 text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
          <Link
            href={href}
            className="transition-colors hover:text-blue-400"
          >
            {post.title}
          </Link>
        </Heading>

        <p className="mt-3 text-base leading-7 text-zinc-400">
          {post.description}
        </p>

        <p className="mt-5 text-sm text-zinc-500">
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>{" "}
          <span className="text-zinc-700">·</span>{" "}
          {post.readingTime} min read
        </p>
      </div>
    </article>
  );
}
