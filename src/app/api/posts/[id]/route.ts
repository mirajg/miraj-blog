
import { NextResponse } from "next/server";
import {
  invalidData,
  notFound,
  readJson,
  slugTaken,
  unauthorized,
} from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { revalidatePostPages } from "@/lib/revalidate";
import { postSchema } from "@/lib/validation";
import {
  SlugTakenError,
  deletePost,
  getPostByIdForAdmin,
  updatePost,
} from "@/services/post.service";

type Context = { params: Promise<{ id: string }> };
 
export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const existing = await getPostByIdForAdmin(id);
  if (!existing) return notFound();

  const parsed = postSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidData(parsed.error);

  try {
    const post = await updatePost(id, parsed.data);
    // Refresh the old URL/category too, in case either one changed
    revalidatePostPages(existing);
    revalidatePostPages(post);
    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof SlugTakenError) return slugTaken();
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) return notFound();

  await deletePost(id);
  revalidatePostPages(post);
  return NextResponse.json({ ok: true });
}