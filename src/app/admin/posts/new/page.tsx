
import type { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">New post</h1>
      <PostForm />
    </>
  );
}