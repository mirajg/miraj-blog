
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { getPublishedPosts } from "@/services/post.service";

export const revalidate = 3600; // rebuilt hourly, and when you publish or edit (see lib/revalidate.ts)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/blog` },
    { url: `${SITE_URL}/about` },
  ];

  // Only list categories that actually have posts (empty ones are thin pages)
  const categorySlugs = [...new Set(posts.map((post) => post.category))];
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}