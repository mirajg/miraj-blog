
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import { getPostByIdForAdmin } from "@/services/post.service";

export const metadata: Metadata = { title: "Edit post" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Edit post</h1>
      <PostForm post={post} />
    </>
  );
}