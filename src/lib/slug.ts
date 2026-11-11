
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

// "How I Fixed a Next.js Hydration Error" -> "how-i-fixed-a-nextjs-hydration-error"
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/['’`.]/g, "") // "Next.js" -> "nextjs", "don't" -> "dont"
    .replace(/[^a-z0-9]+/g, "-") // everything else becomes a hyphen
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, ""); // the cut may leave a trailing hyphen
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  await connectDB();
  const filter = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  return (await Post.exists(filter)) !== null;
}

// Used when creating a post: adds -2, -3, ... until the slug is free.
export async function generateUniqueSlug(text: string) {
  const base = slugify(text) || "post";
  let slug = base;
  let counter = 2;

  while (await isSlugTaken(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}