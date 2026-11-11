
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { CATEGORIES } from "@/constants/site";

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
    published: boolean;
  };
};

export default function PostForm({ post }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();

    const payload = {
      title: text("title"),
      slug: text("slug") || undefined, // blank = auto-generate / keep current
      description: text("description"),
      content: text("content"),
      category: text("category"),
      tags: text("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverImage: text("coverImage") || undefined,
      coverImageAlt: text("coverImageAlt") || undefined,
      published: form.get("published") === "on",
    };

    try {
      const response = await fetch(post ? `/api/posts/${post.id}` : "/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not save the post.");
        if (Array.isArray(data.issues)) {
          const errors: Record<string, string> = {};
          for (const issue of data.issues) errors[issue.field] ??= issue.message;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Title" htmlFor="title" error={fieldErrors.title}>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          maxLength={120}
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
          className={inputClass}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category" error={fieldErrors.category}>
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
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Cover image URL"
          htmlFor="coverImage"
          error={fieldErrors.coverImage}
        >
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            defaultValue={post?.coverImage ?? ""}
            className={inputClass}
          />
        </Field>

        <Field
          label="Cover image alt text"
          htmlFor="coverImageAlt"
          error={fieldErrors.coverImageAlt}
          hint="Describe the image. Needed when a cover image is set."
        >
          <input
            id="coverImageAlt"
            name="coverImageAlt"
            defaultValue={post?.coverImageAlt ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

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
          rows={24}
          className={`${inputClass} font-mono text-sm`}
        />
      </Field>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
        />
        Published (visible to visitors)
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save post"}
        </Button>
        <Link href="/admin">Cancel</Link>
      </div>
    </form>
  );
}