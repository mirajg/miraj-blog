
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { CATEGORIES } from "@/constants/site";
import Image from "next/image";

type Props = {
  // Pass a post to edit it; leave out to create a new one
  post?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    coverImage?: string | null;
    coverImageAlt?: string | null;
    coverImagePublicId?: string | null;
    published: boolean;
  };
};

export default function PostForm({ post }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [coverImage, setCoverImage] = useState(
    post?.coverImage ?? ""
  );

  const [coverImagePublicId, setCoverImagePublicId] = useState(
    post?.coverImagePublicId ?? ""
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();

    const payload = {
      title: text("title"),
      slug: text("slug") || undefined,
      description: text("description"),
      content: text("content"),
      category: text("category"),
      tags: text("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverImage: text("coverImage") || undefined,
      coverImagePublicId: text("coverImagePublicId") || undefined,
      coverImageAlt: text("coverImageAlt") || undefined,
      published: form.get("published") === "on",
    };

    try {
      const response = await fetch(
        post ? `/api/posts/${post.id}` : "/api/posts",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not save the post.");

        if (Array.isArray(data.issues)) {
          const errors: Record<string, string> = {};

          for (const issue of data.issues) {
            errors[issue.field] ??= issue.message;
          }

          setFieldErrors(errors);
        }

        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setImageError(data.error ?? "Could not upload image.");
        return;
      }

      setCoverImage(data.url);
      setCoverImagePublicId(data.publicId);
    } catch {
      setImageError("Network error while uploading image.");
    } finally {
      setUploadingImage(false);

      // Allows selecting the same file again later.
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page intro */}
      <div className="border-b border-zinc-800 pb-7">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-blue-400">
          Admin
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {post ? "Edit post" : "New post"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {post
                ? "Update your article, metadata, and publishing settings."
                : "Write and publish a new article to your blog."}
            </p>
          </div>

          {post && (
            <span
              className={`
                inline-flex w-fit items-center gap-2 rounded-full
                border px-3 py-1.5 text-xs font-medium
                ${post.published
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                }
              `}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${post.published ? "bg-emerald-400" : "bg-amber-400"
                  }`}
              />

              {post.published ? "Published" : "Draft"}
            </span>
          )}
        </div>
      </div>

      {/* Basic information */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg shadow-black/10 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Basic information
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            The main information visitors will see about your post.
          </p>
        </div>

        <div className="space-y-6">
          <Field
            label="Title"
            htmlFor="title"
            error={fieldErrors.title}
          >
            <input
              id="title"
              name="title"
              defaultValue={post?.title}
              required
              maxLength={120}
              placeholder="What I learned building..."
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            error={fieldErrors.slug}
            hint={
              post
                ? "Changing the slug changes the post's URL and breaks old links."
                : "Leave blank to generate it from the title."
            }
          >
            <input
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              placeholder="how-i-fixed-a-nextjs-hydration-error"
              className={inputClass}
            />
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            error={fieldErrors.description}
            hint="One or two sentences. Shown in search results and at the top of the post."
          >
            <textarea
              id="description"
              name="description"
              defaultValue={post?.description}
              required
              rows={3}
              maxLength={300}
              placeholder="A short explanation of what this article covers..."
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>
      </section>

      {/* Organization */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg shadow-black/10 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Organization
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Categorize your article and add useful tags.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Category"
            htmlFor="category"
            error={fieldErrors.category}
          >
            <select
              id="category"
              name="category"
              defaultValue={post?.category ?? ""}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>

              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Tags"
            htmlFor="tags"
            error={fieldErrors.tags}
            hint="Comma separated, e.g. nextjs, hydration, debugging"
          >
            <input
              id="tags"
              name="tags"
              defaultValue={post?.tags.join(", ")}
              placeholder="nextjs, typescript, debugging"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Cover image */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg shadow-black/10 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Cover image
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Upload an image from your device. It will be stored on
            Cloudinary and attached to this post.
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload */}
          <div>
            <label
              htmlFor="coverImageFile"
              className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 px-6 py-8 text-center transition-all hover:border-blue-500/50 hover:bg-zinc-950 ">
              {uploadingImage ? (
                <>
                  <div
                    className="
                h-8 w-8 animate-spin rounded-full
                border-2 border-zinc-700
                border-t-blue-500
              "
                  />

                  <p className="mt-4 text-sm font-medium text-zinc-200">
                    Uploading image...
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Please wait
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="
                flex h-12 w-12 items-center justify-center
                rounded-xl border border-zinc-800
                bg-zinc-900 text-zinc-400
              "
                  >
                    ↑
                  </div>

                  <p className="mt-4 text-sm font-medium text-zinc-200">
                    Choose an image
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    JPG, PNG, WebP or AVIF · Max 5 MB
                  </p>
                </>
              )}

              <input
                id="coverImageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="sr-only"
              />
            </label>

            {imageError && (
              <p
                className="mt-2 text-sm text-red-400"
                role="alert"
              >
                {imageError}
              </p>
            )}
          </div>

          {/* Preview */}
          {coverImage && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
              <div className="relative aspect-[1200/630] w-full">
                <Image
                  src={coverImage}
                  alt={post?.coverImageAlt ?? "Cover image preview"}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-zinc-800 px-4 py-3">
                <p className="min-w-0 truncate text-xs text-zinc-500">
                  {coverImagePublicId || "Cloudinary image"}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setCoverImage("");
                    setCoverImagePublicId("");
                  }}
                  className="
              shrink-0 text-xs font-medium
              text-red-400 transition-colors
              hover:text-red-300
            "
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Hidden values */}
          <input
            type="hidden"
            name="coverImage"
            value={coverImage}
          />

          <input
            type="hidden"
            name="coverImagePublicId"
            value={coverImagePublicId}
          />

          {/* Alt text */}
          <Field
            label="Cover image alt text"
            htmlFor="coverImageAlt"
            error={fieldErrors.coverImageAlt}
            hint="Describe the image for accessibility. Required when a cover image is set."
          >
            <input
              id="coverImageAlt"
              name="coverImageAlt"
              defaultValue={post?.coverImageAlt ?? ""}
              placeholder="A developer working on a laptop"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Content */}
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg shadow-black/10">
        <div className="border-b border-zinc-800 px-6 py-5 sm:px-7">
          <h2 className="text-lg font-semibold text-white">
            Article content
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Write your article using Markdown.
          </p>
        </div>

        <div className="p-6 sm:p-7">
          <Field
            label="Content (Markdown)"
            htmlFor="content"
            error={fieldErrors.content}
            hint="Use ## and ### for headings. The title is already the H1."
          >
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content}
              required
              rows={10}
              spellCheck={false}
              placeholder={`## Introduction

Write your article here...

## What I learned

Explain the problem and solution...`}
              className={`
                ${inputClass}
                min-h-[320px]
                resize-y
                font-mono text-sm leading-7
              `}
            />
          </Field>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg shadow-black/10 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Control whether this post is visible to visitors.
            </p>
          </div>

          <label
            className="
              flex cursor-pointer items-center gap-3
              rounded-xl border border-zinc-800
              bg-zinc-950/70 px-4 py-3
              transition-colors hover:border-zinc-700
            "
          >
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published}
              className="
                h-4 w-4 rounded border-zinc-700
                bg-zinc-900 text-blue-600
                focus:ring-2 focus:ring-blue-500/30
              "
            />

            <span>
              <span className="block text-sm font-medium text-zinc-200">
                Published
              </span>

              <span className="block text-xs text-zinc-500">
                Visible to visitors
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-xl border border-red-500/20
            bg-red-500/10 px-4 py-3
            text-sm text-red-400
          "
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div
        className="
          sticky bottom-0 z-10 -mx-4
          border-t border-zinc-800
          bg-zinc-950/90 px-4 py-4
          backdrop-blur-xl
          sm:-mx-8 sm:px-8
        "
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href="/admin"
            className="
              text-sm font-medium text-zinc-500
              transition-colors hover:text-zinc-200
            "
          >
            Cancel
          </Link>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : post ? "Save changes" : "Publish post"}
          </Button>
        </div>
      </div>
    </form>
  );
}