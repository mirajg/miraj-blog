
import type { Metadata } from "next";
import { PORTFOLIO_URL, SITE_NAME, SITE_URL } from "@/constants/site";

type SeoPost = {
  title: string;
  slug: string;
  description: string;
  author: string;
  tags?: string[];
  coverImage?: string | null;
  coverImageAlt?: string | null;
  publishedAt: Date;
  updatedAt: Date;
};

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export function buildPostMetadata(post: SeoPost): Metadata {
  const path = `/blog/${post.slug}`;
  const images = post.coverImage
    ? [{ url: post.coverImage, alt: post.coverImageAlt ?? post.title }]
    : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: path,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: images?.map((image) => image.url),
    },
  };
}

export function buildBlogPostingJsonLd(post: SeoPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "en",
    keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    author: { "@type": "Person", name: post.author, url: PORTFOLIO_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// For the home page
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    author: { "@type": "Person", name: "Miraj Gautam", url: PORTFOLIO_URL },
  };
}