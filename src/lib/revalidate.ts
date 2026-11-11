
import { revalidatePath } from "next/cache";

// Refresh every public page that can show this post.
export function revalidatePostPages(post: { slug: string; category: string }) {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/category/${post.category}`);
    revalidatePath("/sitemap.xml");
}