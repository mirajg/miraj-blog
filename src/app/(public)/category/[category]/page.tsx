
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/blog/PostCard";
import { getCategory } from "@/constants/site";
import { getPublishedPosts } from "@/services/post.service";
import { CATEGORIES } from "@/constants/site";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = await getPublishedPosts({ category: category.slug });

  return (
    <>
      <p>
        <Link href="/blog">← All posts</Link>
      </p>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      {posts.length === 0 ? (
        <p>No posts in this category yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}