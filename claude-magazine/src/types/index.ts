export type ContentType = "carousel" | "reels" | "longform" | "editorial";

export type SeriesSlug =
  | "hoodies"
  | "playbook"
  | "violent-diet"
  | "pit-stop"
  | "shirtless"
  | "false-9"
  | "hood-residents"
  | "carousel-contents"
  | "snack-contents"
  | "bwasseo";

export type CardSize = "hero" | "large" | "medium" | "small";

export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  series: SeriesSlug | null;
  status: PostStatus;
  excerpt: string;
  thumbnailUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  isFeatured: boolean;
  featurePriority: number;
  tags: string[];
  author: string;
  publishedAt: string | null;
  cardSize: CardSize;
}

export interface PostDetail extends Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
}

export type EmbedSource = "youtube" | "instagram" | "editorial";

export interface SeriesConfig {
  slug: SeriesSlug;
  name: string;
  nameKo: string;
  defaultContentType: ContentType;
  embedSource: EmbedSource;
  description: string;
  color: string;
}
