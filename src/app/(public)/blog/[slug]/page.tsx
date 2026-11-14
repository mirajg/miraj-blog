
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBadge from "@/components/blog/CategoryBadge";
import MarkdownContent from "@/components/blog/MarkdownContent";
import TableOfContents from "@/components/blog/TableOfContents";
import JsonLd from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getPublishedPosts } from "@/services/post.service";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPostMetadata,
} from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post ? buildPostMetadata(post) : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const wasUpdated =
    formatDate(post.updatedAt) !== formatDate(post.publishedAt);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <JsonLd data={buildBlogPostingJsonLd(post)} />

        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ])}
        />

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-zinc-500 transition-colors hover:text-blue-400"
        >
          ← All posts
        </Link>

        {/* Post header */}
        <header className="mt-8">
          <CategoryBadge slug={post.category} />

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <p className="mt-5 text-sm text-zinc-500">
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

        {/* Cover image */}
        {post.coverImage && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
              draggable={false}
            />
          </div>
        )}

        {/* Summary */}
        <p className="mt-10 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 text-base leading-7 text-zinc-300">
          {post.description}
        </p>

        {/* Table of contents */}
        <TableOfContents content={post.content} />

        {/* Markdown */}
        <MarkdownContent content={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <ul
            className="mt-12 flex flex-wrap gap-2 border-t border-zinc-800 pt-8"
            aria-label="Tags"
          >
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </main>
  );
}