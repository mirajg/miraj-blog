
import type { Metadata } from "next";
import Link from "next/link";
import { getCategory } from "@/constants/site";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminPostStats,
  getRecentPostsForAdmin,
} from "@/services/post.service";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [stats, recentPosts] = await Promise.all([
    getAdminPostStats(),
    getRecentPostsForAdmin(5),
  ]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-blue-400">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your blog and recent posts.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          + New post
        </Link>
      </div>

      {/* Stats */}
      <section
        aria-label="Blog statistics"
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-sm text-zinc-500">Total posts</p>

          <p className="mt-2 text-3xl font-bold text-white">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-sm text-zinc-500">Published</p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {stats.published}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-sm text-zinc-500">Drafts</p>

          <p className="mt-2 text-3xl font-bold text-amber-400">
            {stats.drafts}
          </p>
        </div>
      </section>

      {/* Recent posts */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Recent posts
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your latest updated posts.
            </p>
          </div>

          <Link
            href="/admin/posts"
            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            View all →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
            <p className="text-zinc-500">No posts yet.</p>

            <Link
              href="/admin/posts/new"
              className="mt-3 inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <div className="divide-y divide-zinc-800">
              {recentPosts.map((post) => (
                <div
                  key={post._id.toString()}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/posts/${post._id.toString()}/edit`}
                      className="block truncate font-medium text-zinc-100 transition-colors hover:text-blue-400"
                    >
                      {post.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span>
                        {getCategory(post.category)?.name ??
                          post.category}
                      </span>

                      <span>·</span>

                      <span
                        className={
                          post.published
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>

                      <span>·</span>

                      <span>
                        {post.updatedAt.toLocaleDateString("en-US")}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/posts/${post._id}/edit`}
                    className="shrink-0 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    Edit →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Quick actions
        </h2> 

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/posts/new"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <p className="font-semibold text-white">
              Write a new post
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Create and publish a new article.
            </p>
          </Link>

          <Link
            href="/admin/posts"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <p className="font-semibold text-white">
              Manage posts
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Edit, view, or delete your posts.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}