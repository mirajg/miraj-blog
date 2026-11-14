
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
    <>
      <h1>Blog</h1>

      <nav aria-label="Categories">
        <ul className="category-list">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <PostList
        posts={result.posts}
        emptyMessage={
          page === 1
            ? "No posts yet. Check back soon."
            : "No posts on this page."
        }
      />
      <Pagination path="/blog" page={page} totalPages={result.totalPages} />
    </>
  );
}