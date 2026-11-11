
import mongoose, { Schema, type Model } from "mongoose";
import { AUTHOR_NAME } from "@/constants/site";

export interface PostDocument {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  author: string;
  published: boolean;
  publishedAt: Date | null;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    // unique: true creates the unique index on slug
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    coverImage: { type: String },
    coverImageAlt: { type: String },
    author: { type: String, required: true, default: AUTHOR_NAME },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    readingTime: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

// Speeds up the public lists (newest published first, optionally per category)
postSchema.index({ published: 1, publishedAt: -1 });
postSchema.index({ published: 1, category: 1, publishedAt: -1 });

// The models.Post check stops "model already exists" errors during hot reload
const Post =
  (mongoose.models.Post as Model<PostDocument>) ||
  mongoose.model<PostDocument>("Post", postSchema);

export default Post;