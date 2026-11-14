
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Pagination from "@/components/blog/Pagination";
import PostCard from "@/components/blog/PostCard";
import { CATEGORIES, getCategory } from "@/constants/site";
import { parsePageNumber, paginationHref } from "@/lib/pagination";
import { getPublishedPostsPage } from "@/services/post.service";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const { page: rawPage } = await searchParams;
  const page = parsePageNumber(rawPage) ?? 1;

  return {
    title: page > 1 ? `${category.name} - Page ${page}` : category.name,
    description: category.description,
    alternates: {
      canonical: paginationHref(`/category/${category.slug}`, page),
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const { page: rawPage } = await searchParams;
  const page = parsePageNumber(rawPage);
  const path = `/category/${category.slug}`;
  if (page === null || (rawPage !== undefined && page === 1)) redirect(path);

  const result = await getPublishedPostsPage({
    category: category.slug,
    page,
  });

  if (page > result.totalPages) notFound();

  return (
    <>
      <p>
        <Link href="/blog">← All posts</Link>
      </p>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      {result.posts.length === 0 ? (
        <p>
          {page === 1
            ? "No posts in this category yet."
            : "No posts on this page."}
        </p>
      ) : (
        <ul className="post-list">
          {result.posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
      <Pagination path={path} page={page} totalPages={result.totalPages} />
    </>
  );
} 