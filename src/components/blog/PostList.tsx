
import PostCard, { type PostCardData } from "@/components/blog/PostCard";

type Props = {
  posts: PostCardData[];
  headingLevel?: "h2" | "h3";
  emptyMessage?: string;
};

export default function PostList({
  posts,
  headingLevel,
  emptyMessage = "No posts yet. Check back soon.",
}: Props) {
  if (posts.length === 0) return <p>{emptyMessage}</p>;

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul> 
  );
}
