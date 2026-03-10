import React from "react";
import Image from "next/image";
import type { BlockObjectResponse } from "./types";

function getRichTextContent(richText: Array<{ plain_text: string; annotations: { bold: boolean; italic: boolean; strikethrough: boolean; underline: boolean; code: boolean }; href: string | null }>): React.ReactNode {
  return richText.map((text, i) => {
    let content: React.ReactNode = text.plain_text;

    if (text.annotations.bold) content = <strong key={i}>{content}</strong>;
    if (text.annotations.italic) content = <em key={i}>{content}</em>;
    if (text.annotations.strikethrough) content = <s key={i}>{content}</s>;
    if (text.annotations.underline) content = <u key={i}>{content}</u>;
    if (text.annotations.code) content = <code key={i} className="bg-muted rounded px-1.5 py-0.5 text-sm">{content}</code>;
    if (text.href) content = <a key={i} href={text.href} className="text-primary underline underline-offset-4 hover:text-primary/80" target="_blank" rel="noopener noreferrer">{content}</a>;

    return <React.Fragment key={i}>{content}</React.Fragment>;
  });
}

function renderBlock(block: BlockObjectResponse): React.ReactNode {
  const { type, id } = block;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (block as any)[type];

  switch (type) {
    case "paragraph":
      if (!value.rich_text.length) return <div key={id} className="h-4" />;
      return (
        <p key={id} className="leading-7 text-foreground">
          {getRichTextContent(value.rich_text)}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={id} className="text-3xl font-bold tracking-tight">
          {getRichTextContent(value.rich_text)}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={id} className="text-2xl font-semibold tracking-tight">
          {getRichTextContent(value.rich_text)}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={id} className="text-xl font-semibold tracking-tight">
          {getRichTextContent(value.rich_text)}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li key={id} className="leading-7">
          {getRichTextContent(value.rich_text)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li key={id} className="leading-7">
          {getRichTextContent(value.rich_text)}
        </li>
      );

    case "quote":
      return (
        <blockquote key={id} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          {getRichTextContent(value.rich_text)}
        </blockquote>
      );

    case "divider":
      return <hr key={id} className="border-border my-6" />;

    case "image": {
      const src = value.type === "file" ? value.file.url : value.external.url;
      const caption = value.caption?.length
        ? value.caption.map((c: { plain_text: string }) => c.plain_text).join("")
        : "";
      return (
        <figure key={id} className="my-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={caption || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "video": {
      const videoUrl = value.type === "file" ? value.file.url : value.external.url;
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
          return (
            <div key={id} className="my-6 aspect-video overflow-hidden rounded-lg">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }
      }
      return (
        <div key={id} className="my-6 aspect-video overflow-hidden rounded-lg">
          <video src={videoUrl} controls className="h-full w-full" />
        </div>
      );
    }

    case "embed": {
      const embedUrl = value.url;
      if (embedUrl?.includes("instagram.com")) {
        return (
          <div key={id} className="my-6 flex justify-center">
            <iframe
              src={`${embedUrl}embed`}
              className="max-w-[540px] w-full min-h-[600px] border-0"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <div key={id} className="my-6">
          <iframe src={embedUrl} className="w-full min-h-[400px] rounded-lg border-0" />
        </div>
      );
    }

    case "callout":
      return (
        <div key={id} className="my-4 flex gap-3 rounded-lg border bg-muted/50 p-4">
          {value.icon && (
            <span className="text-xl">
              {value.icon.type === "emoji" ? value.icon.emoji : ""}
            </span>
          )}
          <div className="leading-7">
            {getRichTextContent(value.rich_text)}
          </div>
        </div>
      );

    case "toggle":
      return (
        <details key={id} className="my-2">
          <summary className="cursor-pointer font-medium leading-7">
            {getRichTextContent(value.rich_text)}
          </summary>
        </details>
      );

    default:
      return null;
  }
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

export function renderBlocks(blocks: BlockObjectResponse[]): React.ReactNode {
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType;
      elements.push(
        <ListTag key={`list-${elements.length}`} className={listType === "ul" ? "list-disc pl-6 space-y-1" : "list-decimal pl-6 space-y-1"}>
          {listItems}
        </ListTag>,
      );
      listItems = [];
      listType = null;
    }
  };

  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(renderBlock(block));
    } else if (block.type === "numbered_list_item") {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(renderBlock(block));
    } else {
      flushList();
      const rendered = renderBlock(block);
      if (rendered) elements.push(rendered);
    }
  }
  flushList();

  return <div className="space-y-4">{elements}</div>;
}
