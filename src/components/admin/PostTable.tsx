
import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { getCategory } from "@/constants/site";

type Row = {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  updatedAt: Date;
};

export default function PostTable({ posts }: { posts: Row[] }) {
  if (posts.length === 0) return <p>No posts yet. Write your first one.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Updated</th>
            <th className="py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b">
              <td className="py-2 pr-4">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-medium hover:underline"
                >
                  {post.title}
                </Link>
              </td>
              <td className="py-2 pr-4">
                {getCategory(post.category)?.name ?? post.category}
              </td>
              <td className="py-2 pr-4">
                {post.published ? "Published" : "Draft"}
              </td>
              <td className="py-2 pr-4">
                {post.updatedAt.toLocaleDateString("en-US")}
              </td>
              <td className="flex gap-3 py-2">
                <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                {post.published && (
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    View
                  </Link>
                )}
                <DeletePostButton id={post.id} title={post.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}