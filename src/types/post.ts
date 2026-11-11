
// What visitors see: only published posts, so publishedAt always exists
export type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string; // the category slug, e.g. "web-development"
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  readingTime: number; // minutes
  published: boolean;
};

// List pages don't need the full article text
export type PostSummary = Omit<Post, "content">;

// Admin also sees drafts, which have no publish date yet
export type AdminPost = Omit<Post, "publishedAt"> & { publishedAt: Date | null };
export type AdminPostSummary = Omit<AdminPost, "content">;