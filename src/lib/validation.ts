
import { z } from "zod";
import { CATEGORIES } from "@/constants/site";

export const postSchema = z
  .object({
    title: z.string().trim().min(3, "Title is too short").max(120),
    slug: z.string().trim().max(100).optional(), // blank = auto-generate / keep current
    description: z
      .string()
      .trim()
      .min(20, "Write at least a full sentence")
      .max(300),
    content: z.string().trim().min(1, "Content is required"),
    category: z
      .string()
      .refine(
        (slug) => CATEGORIES.some((category) => category.slug === slug),
        "Choose a category",
      ),
    tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
    coverImage: z
      .string()
      .url("Enter a full URL")
      .refine((url) => url.startsWith("https://"), "Use an https:// URL")
      .optional(),
    coverImageAlt: z.string().trim().max(200).optional(),
    published: z.boolean(),
  })
  .refine((data) => !data.coverImage || data.coverImageAlt, {
    message: "Alt text is required when a cover image is set",
    path: ["coverImageAlt"],
  });

export type PostInput = z.infer<typeof postSchema>;