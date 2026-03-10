"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYouTubeVideoId, getYouTubeThumbnailUrl, getYouTubeEmbedUrl } from "@/lib/embeds/youtube";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
}

export function YouTubeEmbed({ url, className }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View on YouTube
      </a>
    );
  }

  // Lite YouTube embed — show thumbnail first, load iframe on click
  if (!isPlaying) {
    return (
      <div className={`embed-container ${className || ""}`}>
        <button
          onClick={() => setIsPlaying(true)}
          className="relative w-full aspect-video group cursor-pointer"
          aria-label="Play video"
        >
          <Image
            src={getYouTubeThumbnailUrl(videoId, "maxres")}
            alt="Video thumbnail"
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, 720px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-red-600 p-4 shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`embed-container ${className || ""}`}>
      <div className="relative w-full aspect-video">
        <iframe
          src={`${getYouTubeEmbedUrl(videoId)}?autoplay=1`}
          className="absolute inset-0 h-full w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
