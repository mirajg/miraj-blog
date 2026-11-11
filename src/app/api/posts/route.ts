
import { NextResponse } from "next/server";
import { invalidData, readJson, slugTaken, unauthorized } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { revalidatePostPages } from "@/lib/revalidate";
import { postSchema } from "@/lib/validation";
import {
  SlugTakenError,
  createPost,
  getAllPostsForAdmin,
} from "@/services/post.service";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  const posts = await getAllPostsForAdmin();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = postSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidData(parsed.error);

  try {
    const post = await createPost(parsed.data);
    revalidatePostPages(post);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof SlugTakenError) return slugTaken();
    throw error;
  }
}