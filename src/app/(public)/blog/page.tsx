
import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/PostList";
import { CATEGORIES } from "@/constants/site";
import { getPublishedPosts } from "@/services/post.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All posts: practical notes on web development, JavaScript/TypeScript, AI/ML and projects.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts(); // add pagination later

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

      <PostList posts={posts} />
    </>
  );
}