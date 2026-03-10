# CH MAG Web Magazine — Orchestrator Context

## 프로젝트 개요

Creatorhood(@creatorhood.mag) 웹매거진. 인스타그램 캐러셀, 릴스, 유튜브 롱폼 시리즈, 스낵 콘텐츠를 The Ringer 스타일의 인터랙티브 카드 그리드로 보여주는 매거진 사이트.

- **레퍼런스**: [The Ringer](https://www.theringer.com/)
- **스택**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Radix UI
- **CMS**: Notion API (@notionhq/client)
- **배포**: Vercel

## 콘텐츠 분류 체계

### Content Type (4종)
| Type | 설명 |
|------|------|
| `carousel` | 인스타그램 캐러셀 (멀티이미지) |
| `reels` | 릴스/숏폼 영상 |
| `longform` | 유튜브 롱폼 영상 |
| `editorial` | 에디토리얼 텍스트 기사 |

### Series (10종)
| Series | Content Type | 설명 |
|--------|-------------|------|
| Hoodies | longform | 크리에이터 브이로그 (5-15분) |
| Playbook | longform | 토크쇼 (20-30분 + 숏폼 하이라이트) |
| 폭력적인 식단 | reels | 숏폼 맛집투어 (60-90초) |
| Pit Stop | reels | 숏폼 카페 큐레이션 (60초) |
| Shirtless | reels | 숏폼 스타일링 (60-90초) |
| False 9 | longform | 시네마틱 필름 (5-10분) |
| 후드의 주민들 | longform | 팀 브이로그 (8-15분) |
| 캐러셀 콘텐츠 | carousel | 인스타 캐러셀 시리즈 |
| 스낵 콘텐츠 | carousel/reels | 바이트사이즈 소셜 콘텐츠 |
| 봤어 | reels | 릴스 시리즈 |

## Agent Team 구성

### 역할
| Agent | 파일 | 역할 |
|-------|------|------|
| **Lead** (You) | 이 파일 | 태스크 분배, 코드 리뷰, 통합 |
| **Planner** | `agents/planner.md` | Notion DB 스키마, 콘텐츠 구조, IA |
| **Designer** | `agents/designer.md` | UI/UX, 컴포넌트 스타일, 테마 |
| **Frontend** | `agents/frontend.md` | React 컴포넌트, 페이지, 인터랙션 |
| **Backend** | `agents/backend.md` | Notion API, 데이터 레이어, API routes |

### 파일 소유권 (충돌 방지)
```
Backend 소유:    src/lib/          src/app/api/      src/types/
Frontend 소유:   src/app/ (pages)  src/components/
Designer 소유:   src/app/globals.css  컴포넌트 스타일링 (className props)
Planner 소유:    docs/             agents/
Lead 소유:       CLAUDE.md         전체 통합
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈 (히어로 + 카드 그리드)
│   ├── series/[slug]/       # 시리즈 아카이브
│   ├── post/[id]/           # 포스트 상세
│   ├── about/               # About
│   ├── search/              # 검색
│   ├── api/notion/revalidate/  # ISR 재검증 웹훅
│   └── globals.css
├── components/
│   ├── ui/                  # Radix 프리미티브 (Zone X에서 포팅됨)
│   ├── layout/              # Header, Footer, SeriesNav
│   ├── cards/               # ContentCard + 유형별 변형
│   ├── embeds/              # Instagram, YouTube 임베드
│   ├── grid/                # HeroGrid, ContentGrid
│   ├── post/                # PostHeader, PostBody
│   └── search/              # SearchBar, SearchResults
├── lib/
│   ├── notion/              # Notion API 클라이언트 + 쿼리
│   ├── embeds/              # oEmbed 처리
│   ├── constants.ts         # SERIES_CONFIG
│   └── utils.ts             # cn() 유틸리티
└── types/
    └── index.ts             # Post, Series, ContentType
```

## 코딩 컨벤션

- **언어**: TypeScript strict mode
- **스타일**: Tailwind CSS utility-first
- **컴포넌트**: 함수형 컴포넌트, named exports
- **임포트**: `@/` alias 사용 (`@/lib/utils`, `@/components/ui/card` 등)
- **파일명**: kebab-case (컴포넌트 파일도)
- **데이터 페칭**: Next.js App Router의 서버 컴포넌트 + ISR
- **에러 처리**: 서버 컴포넌트에서 try-catch, 클라이언트는 Error Boundary

## Notion DB 스키마 (CH Magazine Posts)

| 속성 | 타입 | 설명 |
|------|------|------|
| Title | title | 포스트 제목 |
| Content Type | select | carousel, reels, longform, editorial |
| Series | select | 10종 시리즈명 |
| Status | select | draft, published, archived |
| Slug | rich_text | URL 슬러그 |
| Excerpt | rich_text | 요약 |
| Thumbnail | files | 카드 썸네일 |
| Instagram URL | url | 인스타 임베드용 |
| YouTube URL | url | 유튜브 임베드용 |
| Is Featured | checkbox | 히어로 노출 |
| Feature Priority | number | 히어로 정렬 |
| Tags | multi_select | 태그 |
| Author | select | 작성자 |
| Published At | date | 발행일 |
| Card Size | select | hero, large, medium, small |

## 데이터 페칭 전략

- **홈**: ISR 5분 (`revalidate: 300`)
- **시리즈**: ISR 10분 (`revalidate: 600`)
- **포스트**: ISR 1시간 (`revalidate: 3600`)
- **온디맨드**: `/api/notion/revalidate` 엔드포인트

## 환경변수

```env
NOTION_TOKEN=           # Notion Integration Token
NOTION_DATABASE_ID=     # CH Magazine Posts DB ID
NEXT_PUBLIC_SITE_URL=   # 사이트 URL (OG 이미지 등)
```
