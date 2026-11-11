
import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import { CATEGORIES, PORTFOLIO_URL, SITE_NAME } from "@/constants/site";
import { getPublishedPosts } from "@/services/post.service";
import PostList from "@/components/blog/PostList";

export const revalidate = 60; // re-generate at most once per minute

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Web development, TypeScript and AI notes` },
  description:
    "A developer blog about things I build, learn and get stuck on: web development, JavaScript/TypeScript and AI/ML.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const posts = await getPublishedPosts({ limit: 5 });

  return (
    <>
      <section className="hero">
        {/* Edit this intro in your own words */}
        <h1>Notes from building things on the web</h1>
        <p>
          I&apos;m Miraj, a developer. I write about what I build, learn and
          struggle with: web development, JavaScript/TypeScript and AI/ML.
        </p>
        <p>
          <a href={PORTFOLIO_URL}>See my portfolio →</a>
        </p>
      </section>

      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading">Latest posts</h2>
        <PostList posts={posts} headingLevel="h3" />
        <p>
          <Link href="/blog">View all posts →</Link>
        </p>
      </section>

      <section aria-labelledby="topics-heading">
        <h2 id="topics-heading">Topics</h2>
        <ul className="category-list">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}