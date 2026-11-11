
export const SITE_NAME = "Miraj's Dev Blog"; // change to whatever you like
export const SITE_DESCRIPTION =
  "A developer blog about web development, JavaScript/TypeScript, AI/ML and the projects I build.";
export const AUTHOR_NAME = "Miraj Gautam";

// NEXT_PUBLIC_* values must be written out literally like this so Next.js can inline them
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, ""); // no trailing slash
export const PORTFOLIO_URL = (
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://mirajgautam.com.np"
).replace(/\/+$/, "");

export type Category = { slug: string; name: string; description: string };

// Posts store the slug; pages show the name.
export const CATEGORIES: Category[] = [
  {
    slug: "web-development",
    name: "Web Development",
    description:
      "Notes on building for the web: frameworks, performance, debugging and mistakes I learned from.",
  },
  {
    slug: "javascript-typescript",
    name: "JavaScript/TypeScript",
    description: "Practical JavaScript and TypeScript lessons from real projects.",
  },
  {
    slug: "ai-ml",
    name: "AI/ML",
    description: "What I'm learning and building with AI and machine learning.",
  },
  {
    slug: "projects",
    name: "Projects",
    description:
      "Write-ups of things I've built: why I built them, how, and what I'd change.",
  },
  {
    slug: "learning-notes",
    name: "Learning Notes",
    description: "Short notes on concepts I'm learning, in my own words.",
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}