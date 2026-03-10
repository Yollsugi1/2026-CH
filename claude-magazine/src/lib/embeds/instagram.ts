export function getInstagramEmbedUrl(url: string): string | null {
  // Normalize Instagram URL to embed format
  const match = url.match(
    /instagram\.com\/(p|reel|reels)\/([a-zA-Z0-9_-]+)/,
  );
  if (!match) return null;
  const [, type, shortcode] = match;
  return `https://www.instagram.com/${type}/${shortcode}/embed`;
}

export function isInstagramUrl(url: string): boolean {
  return /instagram\.com\/(p|reel|reels)\//.test(url);
}

export function isInstagramReel(url: string): boolean {
  return /instagram\.com\/(reel|reels)\//.test(url);
}
