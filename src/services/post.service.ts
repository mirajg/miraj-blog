
import "server-only";
import { isValidObjectId, type Types } from "mongoose";
import { cache } from "react";
import { AUTHOR_NAME } from "@/constants/site";
import { connectDB } from "@/lib/db";
import { getReadingTime } from "@/lib/reading-time";
import { generateUniqueSlug, isSlugTaken, slugify } from "@/lib/slug";
import type { PostInput } from "@/lib/validation";
import Post, { type PostDocument } from "@/models/Post";
import type {
  AdminPost,
  AdminPostSummary,
  Post as PublicPost,
  PostSummary,
} from "@/types/post";

export class SlugTakenError extends Error {
  constructor() {
    super("Slug already in use");
    this.name = "SlugTakenError";
  }
}

export const PUBLIC_POSTS_PAGE_SIZE = 10;

/* ---------- Mapping: database document -> plain objects for the UI ---------- */

type LeanPost = PostDocument & { _id: Types.ObjectId };
type LeanSummary = Omit<LeanPost, "content">;

function toAdminSummary(doc: LeanSummary): AdminPostSummary {
  return {
    id: String(doc._id), // a string, because ObjectId can't go to client components
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    category: doc.category,
    tags: doc.tags ?? [],
    coverImage: doc.coverImage ?? undefined,
    coverImageAlt: doc.coverImageAlt ?? undefined,
    author: doc.author,
    published: doc.published,
    publishedAt: doc.publishedAt ?? null,
    updatedAt: doc.updatedAt,
    readingTime: doc.readingTime,
  };
}

function toAdminPost(doc: LeanPost): AdminPost {
  return { ...toAdminSummary(doc), content: doc.content };
}

function toSummary(doc: LeanSummary): PostSummary {
  return { ...toAdminSummary(doc), publishedAt: doc.publishedAt ?? doc.createdAt };
}

function toPost(doc: LeanPost): PublicPost {
  return { ...toSummary(doc), content: doc.content };
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

function buildFields(input: PostInput) {
  return {
    title: input.title,
    description: input.description,
    content: input.content,
    category: input.category,
    tags: input.tags,
    coverImage: input.coverImage,
    coverImageAlt: input.coverImageAlt,
    published: input.published,
    readingTime: getReadingTime(input.content),
  };
}


export async function getPublishedPosts(
  options: { category?: string; limit?: number } = {},
): Promise<PostSummary[]> {
  await connectDB();

  const docs = await Post.find({
    published: true,
    ...(options.category ? { category: options.category } : {}),
  })
    .select("-content")
    .sort({ publishedAt: -1, _id: -1 })
    .limit(options.limit ?? 0) // 0 means no limit
    .lean<LeanSummary[]>();

  return docs.map(toSummary);
}

export async function getPublishedPostsPage(options: {
  category?: string;
  page: number;
}): Promise<{
  posts: PostSummary[];
  totalPages: number;
}> {
  const { category, page } = options;
  const filter = {
    published: true,
    ...(category ? { category } : {}),
  };

  await connectDB();
  const totalPosts = await Post.countDocuments(filter);
  const totalPages = Math.max(
    1,
    Math.ceil(totalPosts / PUBLIC_POSTS_PAGE_SIZE),
  );

  if (page > totalPages) {
    return { posts: [], totalPages };
  }

  const docs = await Post.find(filter)
    .select("-content")
    .sort({ publishedAt: -1, _id: -1 })
    .skip((page - 1) * PUBLIC_POSTS_PAGE_SIZE)
    .limit(PUBLIC_POSTS_PAGE_SIZE)
    .lean<LeanSummary[]>();

  return { posts: docs.map(toSummary), totalPages };
}

// cache() lets generateMetadata and the page share one database query
export const getPostBySlug = cache(
  async (slug: string): Promise<PublicPost | null> => {
    await connectDB();
    const doc = await Post.findOne({ slug, published: true }).lean<LeanPost | null>();
    return doc ? toPost(doc) : null;
  },
);

/* ---------- Admin: includes drafts ---------- */

export async function getAllPostsForAdmin(): Promise<AdminPostSummary[]> {
  await connectDB();
  const docs = await Post.find()
    .select("-content")
    .sort({ updatedAt: -1 })
    .lean<LeanSummary[]>();
  return docs.map(toAdminSummary);
}

export async function getPostByIdForAdmin(id: string): Promise<AdminPost | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await Post.findById(id).lean<LeanPost | null>();
  return doc ? toAdminPost(doc) : null;
}

export async function createPost(input: PostInput): Promise<AdminPost> {
  await connectDB();
  await Post.init(); // make sure the unique slug index exists before saving

  const customSlug = input.slug ? slugify(input.slug) : "";
  if (customSlug && (await isSlugTaken(customSlug))) throw new SlugTakenError();
  const slug = customSlug || (await generateUniqueSlug(input.title));

  try {
    const doc = await Post.create({
      ...buildFields(input),
      slug,
      author: AUTHOR_NAME,
      publishedAt: input.published ? new Date() : null,
    });
    return toAdminPost(doc.toObject());
  } catch (error) {
    // Two saves with the same slug at the same moment: the unique index wins
    if (isDuplicateKeyError(error)) throw new SlugTakenError();
    throw error;
  }
}

export async function updatePost(id: string, input: PostInput): Promise<AdminPost> {
  await connectDB();
  await Post.init();

  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  // The slug never changes on its own: blank keeps the current one
  const slug = input.slug ? slugify(input.slug) || post.slug : post.slug;
  if (slug !== post.slug && (await isSlugTaken(slug, id))) throw new SlugTakenError();

  post.set({ ...buildFields(input), slug });

  // Set the publish date only the first time the post goes live.
  // Unpublishing keeps it, so republishing doesn't change the original date.
  if (input.published && !post.publishedAt) post.publishedAt = new Date();

  try {
    await post.save();
  } catch (error) {
    if (isDuplicateKeyError(error)) throw new SlugTakenError();
    throw error;
  }

  return toAdminPost(post.toObject());
}

export async function deletePost(id: string) {
  await connectDB();
  await Post.findByIdAndDelete(id);
}