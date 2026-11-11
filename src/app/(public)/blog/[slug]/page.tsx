import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBadge from "@/components/blog/CategoryBadge";
import MarkdownContent from "@/components/blog/MarkdownContent";
import TableOfContents from "@/components/blog/TableOfContents";
import JsonLd from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/format";
import { buildWebSiteJsonLd } from "@/lib/seo";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPostMetadata,
} from "@/lib/seo";
import { getPostBySlug } from "@/services/post.service";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post ? buildPostMetadata(post) : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const wasUpdated = formatDate(post.updatedAt) !== formatDate(post.publishedAt);

  return (
    <>
      <article>
        <JsonLd data={buildBlogPostingJsonLd(post)} />
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ])}
        />

        <p>
          <Link href="/blog">← All posts</Link>
        </p>

        <header className="mt-4 space-y-3">
          <CategoryBadge slug={post.category} />
          <h1>{post.title}</h1>
          <p className="post-meta">
            By {post.author} ·{" "}
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>{" "}
            · {post.readingTime} min read
            {wasUpdated && (
              <>
                {" "}
                · Updated{" "}
                <time dateTime={post.updatedAt.toISOString()}>
                  {formatDate(post.updatedAt)}
                </time>
              </>
            )}
          </p>
        </header>

        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            width={1200}
            height={630}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="cover-image"
          />
        )}

        {/* Short summary near the top: good for readers and answer engines */}
        <p className="post-summary">{post.description}</p>

        <TableOfContents content={post.content} />
        <MarkdownContent content={post.content} />

        {post.tags.length > 0 && (
          <ul className="tag-list" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
      </article>
    </>
  );
}