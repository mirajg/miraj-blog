import Link from "next/link";
import { getCategory } from "@/constants/site";

export default function CategoryBadge({ slug }: { slug: string }) {
  const category = getCategory(slug);

  if (!category) return null;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="
        inline-flex rounded-full
        border border-blue-500/20
        bg-blue-500/10
        px-3 py-1
        text-xs font-medium
        text-blue-400
        transition-all duration-200
        hover:border-blue-500/40
        hover:bg-blue-500/15
        hover:text-blue-300
      "
    >
      {category.name}
    </Link>
  );
}