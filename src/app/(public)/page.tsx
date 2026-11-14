
import type { Metadata } from "next";
import Link from "next/link";
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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-28 sm:px-8 sm:py-36">
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-1.5 text-sm font-medium text-zinc-400 backdrop-blur">
              Developer notes &amp; experiments
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
              Notes from building
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                things on the web.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              I&apos;m Miraj, a developer. I write about what I build, learn
              and struggle with: web development, JavaScript/TypeScript and
              AI/ML.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={PORTFOLIO_URL}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                See my portfolio
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <Link
                href="/blog"
                className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/60 px-5 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Explore the blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="latest-heading"
        className="mx-auto max-w-5xl px-6 py-20 sm:px-8"
      >
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-400">
              Recently written
            </p>

            <h2
              id="latest-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Latest posts
            </h2>
          </div>

          <Link
            href="/blog"
            className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-2xl shadow-black/20 sm:p-6">
          <PostList posts={posts} headingLevel="h3" />
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            View all posts →
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="topics-heading"
        className="border-t border-zinc-800 bg-zinc-900/30"
      >
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
          <div className="mb-10">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-purple-400">
              Explore
            </p>

            <h2
              id="topics-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Topics
            </h2>

            <p className="mt-3 max-w-xl text-zinc-400">
              Things I&apos;m learning, building, debugging and experimenting
              with.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-200 transition group-hover:text-white">
                    {category.name}
                  </span>

                  <span className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-zinc-300">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}