
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Pagination from "@/components/blog/Pagination";
import PostList from "@/components/blog/PostList";
import { CATEGORIES } from "@/constants/site";
import { parsePageNumber, paginationHref } from "@/lib/pagination";
import { getPublishedPostsPage } from "@/services/post.service";

export const revalidate = 60;

type SearchParams = Promise<{ page?: string | string[] }>;
type Props = { searchParams: SearchParams };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: rawPage } = await searchParams;
  const page = parsePageNumber(rawPage) ?? 1;

  return {
    title: page > 1 ? `Blog - Page ${page}` : "Blog",
    description:
      "All posts: practical notes on web development, JavaScript/TypeScript, AI/ML and projects.",
    alternates: { canonical: paginationHref("/blog", page) },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: rawPage } = await searchParams;
  const page = parsePageNumber(rawPage);

  if (page === null || (rawPage !== undefined && page === 1)) {
    redirect("/blog");
  }

  const result = await getPublishedPostsPage({ page });

  if (page > result.totalPages) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-[650px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            Writing &amp; experiments
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            The Blog
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Practical notes on building things, solving problems and learning
            along the way — from web development and TypeScript to AI/ML.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        {/* Categories */}
        <nav aria-label="Categories" className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Browse topics
          </h2>

          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Posts */}
        <section aria-labelledby="posts-heading">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-purple-400">
                {page > 1 ? `Page ${page}` : "Recently published"}
              </p>

              <h2
                id="posts-heading"
                className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                All posts
              </h2>
            </div>

            {result.posts.length > 0 && (
              <span className="hidden text-sm text-zinc-500 sm:block">
                {result.posts.length}{" "}
                {result.posts.length === 1 ? "post" : "posts"}
              </span>
            )}
          </div>

          <PostList
            posts={result.posts}
            emptyMessage={
              page === 1
                ? "No posts yet. Check back soon."
                : "No posts on this page."
            }
          />
        </section>

        {/* Pagination */}
        <div className="mt-10">
          <Pagination
            path="/blog"
            page={page}
            totalPages={result.totalPages}
          />
        </div>
      </div>
    </main>
  );
}