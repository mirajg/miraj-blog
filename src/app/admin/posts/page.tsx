
import type { Metadata } from "next";
import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { getCategory } from "@/constants/site";
import { requireAdmin } from "@/lib/auth";
import { getAllPostsForAdmin } from "@/services/post.service";

export const metadata: Metadata = {
    title: "Manage Posts",
};

export default async function AdminPostsPage() {
    await requireAdmin();

    const posts = await getAllPostsForAdmin();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.15em] text-blue-400">
                        Admin
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Manage posts
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Create, edit, publish, or remove your blog posts.
                    </p>
                </div>

                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 "
                >
                    + New post
                </Link>
            </div>

            {/* Stats / count */}
            <div
                className="
          flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between "
            >
                <div>
                    <p className="text-sm text-zinc-500">All posts</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                        {posts.length}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <span className="text-emerald-400">
                        {posts.filter((post) => post.published).length} published
                    </span>

                    <span className="text-zinc-700">•</span>

                    <span className="text-amber-400">
                        {posts.filter((post) => !post.published).length} drafts
                    </span>
                </div>
            </div>

            {/* Empty state */}
            {posts.length === 0 ? (
                <section
                    className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center"
                >
                    <div className="mx-auto max-w-md">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-xl">
                            ✎
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-white">
                            No posts yet
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                            Start writing your first article and it will appear here.
                        </p>

                        <Link
                            href="/admin/posts/new"
                            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 "
                        >
                            Write your first post
                        </Link>
                    </div>
                </section>
            ) : (
                /* Posts */
                <section
                    className="
            overflow-hidden rounded-2xl
            border border-zinc-800 bg-zinc-900/70
          "
                >
                    {/* Desktop table */}
                    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
                        <div className="hidden md:block">
                            <table className="w-full table-fixed text-left">
                                <colgroup>
                                    <col className="w-[36%]" />
                                    <col className="w-[22%]" />
                                    <col className="w-[15%]" />
                                    <col className="w-[13%]" />
                                    <col className="w-[14%]" />
                                </colgroup>

                                <thead className="border-b border-zinc-800 bg-zinc-900">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Post
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Updated
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-800">
                                    {posts.map((post) => (
                                        <tr
                                            key={post.id.toString()}
                                            className="transition-colors hover:bg-zinc-900"
                                        >
                                            {/* Post */}
                                            <td className="px-6 py-5 align-top">
                                                <Link
                                                    href={`/admin/posts/${post.id.toString()}/edit`}
                                                    className="
                  block break-wrap-words font-medium
                  leading-6 text-zinc-100
                  transition-colors hover:text-blue-400
                "
                                                >
                                                    {post.title}
                                                </Link>

                                                <p className="mt-1 break-wrap-words text-xs leading-5 text-zinc-600">
                                                    /blog/{post.slug}
                                                </p>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-5 align-top">
                                                <span className="break-wrap-words text-sm leading-6 text-zinc-400">
                                                    {getCategory(post.category)?.name ?? post.category}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5 align-top">
                                                {post.published ? (
                                                    <span
                                                        className="
                    inline-flex max-w-full items-center gap-1.5
                    rounded-full border border-emerald-500/20
                    bg-emerald-500/10 px-2.5 py-1
                    text-xs font-medium text-emerald-400
                  "
                                                    >
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                                        <span className="break-wrap-words">Published</span>
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="
                    inline-flex max-w-full items-center gap-1.5
                    rounded-full border border-amber-500/20
                    bg-amber-500/10 px-2.5 py-1
                    text-xs font-medium text-amber-400
                  "
                                                    >
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                                        <span className="break-wrap-words">Draft</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Updated */}
                                            <td className="px-6 py-5 align-top">
                                                <time className="break-wrap-words text-sm leading-6 text-zinc-500">
                                                    {post.updatedAt.toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </time>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-wrap justify-end gap-x-3 gap-y-2">
                                                    <Link
                                                        href={`/admin/posts/${post.id.toString()}/edit`}
                                                        className="
                    text-sm font-medium text-zinc-400
                    transition-colors hover:text-blue-400
                  "
                                                    >
                                                        Edit
                                                    </Link>

                                                    <DeletePostButton id={post.id.toString()} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <div className="divide-y divide-zinc-800 md:hidden">
                        {posts.map((post) => (
                            <article
                                key={post.id.toString()}
                                className="p-5 transition-colors hover:bg-zinc-900"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/admin/posts/${post.id.toString()}/edit`}
                                            className="
                        block font-semibold text-zinc-100
                        transition-colors hover:text-blue-400
                      "
                                        >
                                            {post.title}
                                        </Link>

                                        <p className="mt-1 truncate text-xs text-zinc-600">
                                            /blog/{post.slug}
                                        </p>
                                    </div>

                                    {post.published ? (
                                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                                            Draft
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
                                    <span>
                                        {getCategory(post.category)?.name ?? post.category}
                                    </span>

                                    <span className="text-zinc-700">•</span>

                                    <time>
                                        {post.updatedAt.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </time>
                                </div>

                                <div className="mt-5 flex items-center gap-4">
                                    <Link
                                        href={`/admin/posts/${post.id.toString()}/edit`}
                                        className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                                    >
                                        Edit →
                                    </Link>

                                    <DeletePostButton id={post.id.toString()} />
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}