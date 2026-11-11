
import Link from "next/link";
import { getCategory } from "@/constants/site";

export default function CategoryBadge({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="inline-block rounded-full border px-2.5 py-0.5 text-xs text-muted hover:text-foreground"
    >
      {category.name}
    </Link>
  );
}