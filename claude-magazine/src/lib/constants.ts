import type { SeriesConfig, SeriesSlug } from "@/types";

export const SERIES_CONFIG: Record<SeriesSlug, SeriesConfig> = {
  hoodies: {
    slug: "hoodies",
    name: "Hoodies",
    nameKo: "후디스",
    defaultContentType: "longform",
    embedSource: "youtube",
    description: "크리에이터 브이로그 — 운동하는 사람들의 입체적인 삶",
    color: "#1a1a1a",
  },
  playbook: {
    slug: "playbook",
    name: "Playbook",
    nameKo: "플레이북",
    defaultContentType: "longform",
    embedSource: "youtube",
    description: "토크쇼 — 스포츠와 라이프스타일의 교차점",
    color: "#2563eb",
  },
  "violent-diet": {
    slug: "violent-diet",
    name: "폭력적인 식단",
    nameKo: "폭력적인 식단",
    defaultContentType: "reels",
    embedSource: "instagram",
    description: "숏폼 맛집투어 — 운동인의 식단 그 너머",
    color: "#dc2626",
  },
  "pit-stop": {
    slug: "pit-stop",
    name: "Pit Stop",
    nameKo: "핏 스탑",
    defaultContentType: "reels",
    embedSource: "instagram",
    description: "숏폼 카페 큐레이션 — 쉬어가는 공간들",
    color: "#854d0e",
  },
  shirtless: {
    slug: "shirtless",
    name: "Shirtless",
    nameKo: "셔틀리스",
    defaultContentType: "reels",
    embedSource: "instagram",
    description: "숏폼 스타일링 — 운동하는 사람의 패션",
    color: "#7c3aed",
  },
  "false-9": {
    slug: "false-9",
    name: "False 9",
    nameKo: "폴스 나인",
    defaultContentType: "longform",
    embedSource: "youtube",
    description: "시네마틱 필름 — 스포츠의 아름다움",
    color: "#0d9488",
  },
  "hood-residents": {
    slug: "hood-residents",
    name: "후드의 주민들",
    nameKo: "후드의 주민들",
    defaultContentType: "longform",
    embedSource: "youtube",
    description: "팀 브이로그 — 크리에이터후드의 일상",
    color: "#ea580c",
  },
  "carousel-contents": {
    slug: "carousel-contents",
    name: "캐러셀 콘텐츠",
    nameKo: "캐러셀 콘텐츠",
    defaultContentType: "carousel",
    embedSource: "instagram",
    description: "인스타그램 캐러셀 시리즈",
    color: "#e11d48",
  },
  "snack-contents": {
    slug: "snack-contents",
    name: "스낵 콘텐츠",
    nameKo: "스낵 콘텐츠",
    defaultContentType: "carousel",
    embedSource: "instagram",
    description: "바이트사이즈 소셜 콘텐츠",
    color: "#f59e0b",
  },
  bwasseo: {
    slug: "bwasseo",
    name: "봤어",
    nameKo: "봤어",
    defaultContentType: "reels",
    embedSource: "instagram",
    description: "릴스 시리즈 — 짧고 강렬한 순간들",
    color: "#6366f1",
  },
};

export const ALL_SERIES = Object.values(SERIES_CONFIG);

export const SERIES_BY_CONTENT_TYPE = {
  longform: ALL_SERIES.filter((s) => s.defaultContentType === "longform"),
  reels: ALL_SERIES.filter((s) => s.defaultContentType === "reels"),
  carousel: ALL_SERIES.filter((s) => s.defaultContentType === "carousel"),
  editorial: ALL_SERIES.filter((s) => s.defaultContentType === "editorial"),
};

export const SITE_CONFIG = {
  name: "CH MAG",
  fullName: "Creatorhood Magazine",
  description: "스포츠 라이프스타일 콘텐츠 스튜디오",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://creatorhood.mag",
  instagram: "@creatorhood.mag",
};
