import Link from "next/link";
import Image from "next/image";
import { Play, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SERIES_CONFIG } from "@/lib/constants";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  post: Post;
  className?: string;
}

export function ContentCard({ post, className }: ContentCardProps) {
  switch (post.cardSize) {
    case "hero":
      return <HeroCard post={post} className={className} />;
    default:
      return <DefaultCard post={post} className={className} />;
  }
}

function HeroCard({ post, className }: ContentCardProps) {
  const series = post.series ? SERIES_CONFIG[post.series] : null;

  return (
    <Link
      href={`/post/${post.id}`}
      className={cn("card-hero group relative block overflow-hidden rounded-2xl", className)}
    >
      <div className="relative aspect-[21/9] w-full">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="card-gradient absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            {series && (
              <SeriesBadge series={series} />
            )}
            <ContentTypeBadge type={post.contentType} />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-white/60">
            <span>{post.author}</span>
            {post.publishedAt && (
              <>
                <span>&middot;</span>
                <time>{formatDate(post.publishedAt)}</time>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function DefaultCard({ post, className }: ContentCardProps) {
  const series = post.series ? SERIES_CONFIG[post.series] : null;
  const isVertical = post.contentType === "reels";
  const aspectClass = isVertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <Link
      href={`/post/${post.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg",
        post.cardSize === "large" && "card-large",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className={cn("relative w-full overflow-hidden", aspectClass)}>
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No thumbnail</span>
          </div>
        )}

        {/* Play button overlay for video content */}
        {(post.contentType === "reels" || post.contentType === "longform") && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Carousel indicator */}
        {post.contentType === "carousel" && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
            <Layers className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          {series && <SeriesBadge series={series} />}
          <ContentTypeBadge type={post.contentType} />
        </div>

        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span>{post.author}</span>
          {post.publishedAt && (
            <>
              <span>&middot;</span>
              <time>{formatDate(post.publishedAt)}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function SeriesBadge({ series }: { series: { name: string; color: string } }) {
  return (
    <Badge
      className="series-badge"
      style={{ backgroundColor: series.color, color: "#fff" }}
    >
      {series.name}
    </Badge>
  );
}

function ContentTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    carousel: "Carousel",
    reels: "Reels",
    longform: "Long",
    editorial: "Article",
  };
  return (
    <Badge variant="outline" className="series-badge">
      {labels[type] || type}
    </Badge>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
