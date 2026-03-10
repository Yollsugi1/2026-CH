import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPost, getRelatedPosts } from "@/lib/notion/database";
import { renderBlocks } from "@/lib/notion/blocks";
import { ContentGrid } from "@/components/grid/content-grid";
import { InstagramEmbed } from "@/components/embeds/instagram-embed";
import { YouTubeEmbed } from "@/components/embeds/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { SERIES_CONFIG } from "@/lib/constants";
import type { BlockObjectResponse } from "@/lib/notion/types";

export const revalidate = 3600; // ISR: 1 hour

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  let post;
  try {
    post = await getPost(id);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const series = post.series ? SERIES_CONFIG[post.series] : null;

  let relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = [];
  try {
    relatedPosts = await getRelatedPosts(post, 4);
  } catch {
    relatedPosts = [];
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      {/* Back link */}
      <Link
        href={series ? `/series/${series.slug}` : "/"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {series ? series.name : "Home"}
      </Link>

      {/* Post header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {series && (
            <Badge
              className="series-badge"
              style={{ backgroundColor: series.color, color: "#fff" }}
            >
              {series.name}
            </Badge>
          )}
          <Badge variant="outline" className="series-badge">
            {post.contentType}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}

        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span>
          {post.publishedAt && (
            <>
              <span>&middot;</span>
              <time>
                {new Date(post.publishedAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Primary embed */}
      <div className="mb-8">
        {post.youtubeUrl && <YouTubeEmbed url={post.youtubeUrl} />}
        {post.instagramUrl && !post.youtubeUrl && (
          <InstagramEmbed url={post.instagramUrl} />
        )}
      </div>

      {/* Post body (Notion blocks) */}
      {post.blocks.length > 0 && (
        <div className="prose-container mb-12">
          {renderBlocks(post.blocks as BlockObjectResponse[])}
        </div>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t pt-10">
          <h2 className="mb-6 text-xl font-bold">Related</h2>
          <ContentGrid posts={relatedPosts} />
        </section>
      )}
    </article>
  );
}
