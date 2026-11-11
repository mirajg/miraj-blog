
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
  headingLevel?: "h2" | "h3"; // keeps the heading order logical on each page
};

export default function PostCard({ post, headingLevel: Heading = "h2" }: Props) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="space-y-3">
      {post.coverImage && (
        <Link href={href} aria-hidden tabIndex={-1}>
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? ""}
            width={640}
            height={336}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded"
          />
        </Link>
      )}

      <CategoryBadge slug={post.category} />

      <Heading className="text-xl font-semibold">
        <Link href={href}>{post.title}</Link>
      </Heading>

      <p className="text-muted">{post.description}</p>

      <p className="text-sm text-muted">
        <time dateTime={post.publishedAt.toISOString()}>
          {formatDate(post.publishedAt)}
        </time>{" "}
        · {post.readingTime} min read
      </p>
    </article>
  );
}