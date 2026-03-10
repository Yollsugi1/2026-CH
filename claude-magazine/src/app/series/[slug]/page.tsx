import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Layers, ExternalLink } from "lucide-react";
import { getPosts } from "@/lib/notion/database";
import { ContentGrid } from "@/components/grid/content-grid";
import { Badge } from "@/components/ui/badge";
import { SERIES_CONFIG, ALL_SERIES } from "@/lib/constants";
import type { SeriesSlug, Post } from "@/types";
import { cn } from "@/lib/utils";

export const revalidate = 600; // ISR: 10 minutes

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_SERIES.map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = SERIES_CONFIG[slug as SeriesSlug];
  if (!series) return {};

  return {
    title: series.name,
    description: series.description,
    openGraph: {
      title: `${series.name} | CH MAG`,
      description: series.description,
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = SERIES_CONFIG[slug as SeriesSlug];

  if (!series) {
    notFound();
  }

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    posts = await getPosts({ series: series.slug, limit: 24 });
  } catch {
    posts = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Series header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: series.color }}
          />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {series.embedSource === "youtube" ? "YouTube Series" : "Instagram Series"}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {series.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {series.description}
        </p>
      </header>

      {/* Render based on embed source */}
      {posts.length > 0 ? (
        series.embedSource === "youtube" ? (
          <YouTubeSeriesGrid posts={posts} seriesColor={series.color} />
        ) : series.defaultContentType === "reels" ? (
          <ReelsGrid posts={posts} seriesColor={series.color} />
        ) : (
          <CarouselGrid posts={posts} seriesColor={series.color} />
        )
      ) : (
        <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
          이 시리즈의 콘텐츠가 아직 없습니다.
        </div>
      )}
    </div>
  );
}

/* YouTube longform series — 16:9 video cards in 2-column grid */
function YouTubeSeriesGrid({ posts, seriesColor }: { posts: Post[]; seriesColor: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            {post.thumbnailUrl ? (
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Play className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/60 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
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
      ))}
    </div>
  );
}

/* Instagram Reels — vertical 9:16 grid, 2 on mobile, 3-4 on desktop */
function ReelsGrid({ posts, seriesColor }: { posts: Post[]; seriesColor: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="group relative overflow-hidden rounded-xl bg-card"
        >
          <div className="relative aspect-[9/16] w-full overflow-hidden">
            {post.thumbnailUrl ? (
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-b from-muted to-muted/50 flex items-center justify-center">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            {/* Instagram indicator */}
            {post.instagramUrl && (
              <div className="absolute top-2 right-2">
                <ExternalLink className="h-3.5 w-3.5 text-white/70" />
              </div>
            )}
            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">
                {post.title}
              </h3>
              {post.publishedAt && (
                <time className="mt-1 block text-xs text-white/60">
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* Instagram Carousel — card grid with carousel indicator */
function CarouselGrid({ posts, seriesColor }: { posts: Post[]; seriesColor: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-square w-full overflow-hidden">
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
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {/* Carousel indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
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
      ))}
    </div>
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
