import { ContentCard } from "@/components/cards/content-card";
import type { Post } from "@/types";

interface ContentGridProps {
  posts: Post[];
  className?: string;
}

export function ContentGrid({ posts, className }: ContentGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        No content yet.
      </div>
    );
  }

  return (
    <div className={`content-grid ${className || ""}`}>
      {posts.map((post) => (
        <ContentCard key={post.id} post={post} />
      ))}
    </div>
  );
}
