import { notion, databaseId } from "./client";
import type { PageObjectResponse, BlockObjectResponse } from "./types";
import type { Post, PostDetail, ContentType, SeriesSlug } from "@/types";
import { SERIES_CONFIG } from "@/lib/constants";

// --- Property extractors ---
// Adapted to match actual Notion DB property names and types

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties["Title"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") || "Untitled";
  }
  return "Untitled";
}

function getSelect(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "select" && prop.select) {
    return prop.select.name;
  }
  return null;
}

function getStatus(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "status" && prop.status) {
    return prop.status.name;
  }
  return null;
}

function getRichText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function getUrl(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "url") {
    return prop.url;
  }
  return null;
}

function getCheckbox(page: PageObjectResponse, key: string): boolean {
  const prop = page.properties[key];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

function getNumber(page: PageObjectResponse, key: string): number {
  const prop = page.properties[key];
  if (prop?.type === "number" && prop.number !== null) {
    return prop.number;
  }
  return 0;
}

function getMultiSelect(page: PageObjectResponse, key: string): string[] {
  const prop = page.properties[key];
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getDate(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "date" && prop.date) {
    return prop.date.start;
  }
  return null;
}

function getFiles(page: PageObjectResponse, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "files" && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === "file") return file.file.url;
    if (file.type === "external") return file.external.url;
  }
  return null;
}

function getPeople(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "people" && prop.people.length > 0) {
    const person = prop.people[0];
    if ("name" in person && person.name) return person.name;
  }
  return "Creatorhood";
}

// --- Series slug mapping ---

const SERIES_NAME_TO_SLUG: Record<string, SeriesSlug> = {};
for (const config of Object.values(SERIES_CONFIG)) {
  SERIES_NAME_TO_SLUG[config.name] = config.slug;
  SERIES_NAME_TO_SLUG[config.nameKo] = config.slug;
}

function mapSeriesToSlug(seriesName: string | null): SeriesSlug | null {
  if (!seriesName) return null;
  return SERIES_NAME_TO_SLUG[seriesName] || null;
}

// --- Publish status mapping ---
// DB uses Notion "status" type: 작성 전, 작성 중, 보류, 편집 중, 업로드 완료, 드랍
const PUBLISH_STATUS_MAP: Record<string, Post["status"]> = {
  "작성 전": "draft",
  "작성 중": "draft",
  "보류": "archived",
  "편집 중": "draft",
  "업로드 완료": "published",
  "드랍": "archived",
};

// --- Page to Post mapper ---
// Maps actual Notion DB property names to Post interface

function pageToPost(page: PageObjectResponse): Post {
  const publishStatus = getStatus(page, "Publish");

  return {
    id: page.id,
    slug: String(getNumber(page, "Slug") || page.id), // Slug is number type in this DB
    title: getTitle(page),
    contentType: (getSelect(page, "Content Type") as ContentType) || "editorial",
    series: mapSeriesToSlug(getSelect(page, "Series")),
    status: PUBLISH_STATUS_MAP[publishStatus || ""] || "draft",
    excerpt: getRichText(page, "Intro"),          // "Intro" → excerpt
    thumbnailUrl: getFiles(page, "Cover"),         // "Cover" → thumbnail
    instagramUrl: getUrl(page, "Instagram URL"),
    youtubeUrl: getUrl(page, "YouTube URL"),
    isFeatured: getCheckbox(page, "Must Read"),    // "Must Read" → isFeatured
    featurePriority: getNumber(page, "Feature Priority"),
    tags: getMultiSelect(page, "Tags"),
    author: getPeople(page, "Author"),             // "Author" is people type
    publishedAt: getDate(page, "날짜"),             // "날짜" → publishedAt
    cardSize: (getSelect(page, "Card Size") as Post["cardSize"]) || "medium",
  };
}

// --- Public query functions ---

interface GetPostsOptions {
  series?: SeriesSlug;
  contentType?: ContentType;
  featured?: boolean;
  limit?: number;
  startCursor?: string;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<Post[]> {
  const { series, contentType, featured, limit = 20, startCursor } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any[] = [
    // Filter by "업로드 완료" status (= published)
    { property: "Publish", status: { equals: "업로드 완료" } },
  ];

  if (series) {
    const config = SERIES_CONFIG[series];
    filters.push({
      property: "Series",
      select: { equals: config.name },
    });
  }

  if (contentType) {
    filters.push({
      property: "Content Type",
      select: { equals: contentType },
    });
  }

  if (featured !== undefined) {
    filters.push({
      property: "Must Read",     // "Must Read" = isFeatured
      checkbox: { equals: featured },
    });
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: filters,
    },
    sorts: [
      { property: "날짜", direction: "descending" },  // Sort by 날짜
    ],
    page_size: limit,
    start_cursor: startCursor,
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToPost);
}

export async function getPost(pageId: string): Promise<PostDetail | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!("properties" in page)) return null;

    const rawBlocks = await getAllBlocks(pageId);
    const post = pageToPost(page as PageObjectResponse);
    const blocks = rawBlocks.filter((b): b is BlockObjectResponse => "type" in b);

    return { ...post, blocks };
  } catch {
    return null;
  }
}

export async function getRelatedPosts(
  post: Post,
  limit = 4,
): Promise<Post[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any[] = [
    { property: "Publish", status: { equals: "업로드 완료" } },
  ];

  if (post.series) {
    const config = SERIES_CONFIG[post.series];
    filters.push({
      property: "Series",
      select: { equals: config.name },
    });
  } else if (post.contentType) {
    filters.push({
      property: "Content Type",
      select: { equals: post.contentType },
    });
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { and: filters },
    sorts: [{ property: "날짜", direction: "descending" }],
    page_size: limit + 1,
  });

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map(pageToPost)
    .filter((p) => p.id !== post.id)
    .slice(0, limit);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const response = await notion.search({
    query,
    filter: { property: "object", value: "page" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
    page_size: 20,
  });

  return response.results
    .filter(
      (page): page is PageObjectResponse =>
        "properties" in page && "parent" in page,
    )
    .filter((page) => {
      if (page.parent.type === "database_id") {
        return page.parent.database_id.replace(/-/g, "") === databaseId.replace(/-/g, "");
      }
      return false;
    })
    .map(pageToPost)
    .filter((post) => post.status === "published");
}

// --- Block fetcher ---

async function getAllBlocks(pageId: string) {
  const blocks = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}
