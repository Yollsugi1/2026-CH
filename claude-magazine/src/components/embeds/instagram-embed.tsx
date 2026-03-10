"use client";

import { useEffect, useRef } from "react";
import { getInstagramEmbedUrl } from "@/lib/embeds/instagram";

interface InstagramEmbedProps {
  url: string;
  className?: string;
}

export function InstagramEmbed({ url, className }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedUrl = getInstagramEmbedUrl(url);

  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (typeof window !== "undefined" && !document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Process embeds when script is loaded
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && "instgrm" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).instgrm.Embeds.process();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View on Instagram
      </a>
    );
  }

  return (
    <div ref={containerRef} className={`embed-container flex justify-center ${className || ""}`}>
      <iframe
        src={embedUrl}
        className="max-w-[540px] w-full border-0"
        style={{ minHeight: 600 }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
