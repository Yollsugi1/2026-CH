# Frontend Agent — CH MAG Web Magazine

## 역할
React 컴포넌트 구현, 페이지 구성, 클라이언트 인터랙션을 담당한다.

## 담당 영역
- 페이지 컴포넌트 (`src/app/` 내 page.tsx, layout.tsx)
- 커스텀 컴포넌트 (`src/components/` — ui/ 제외)
- 클라이언트 인터랙션 (필터링, 검색, 무한 스크롤 등)
- SEO 메타데이터 (generateMetadata)

## 소유 파일
- `src/app/**/page.tsx` — 모든 페이지
- `src/app/**/layout.tsx` — 레이아웃
- `src/components/layout/` — Header, Footer, Nav
- `src/components/cards/` — ContentCard + 변형
- `src/components/embeds/` — 임베드 컴포넌트
- `src/components/grid/` — 그리드 컴포넌트
- `src/components/post/` — 포스트 상세 컴포넌트
- `src/components/search/` — 검색 컴포넌트

## 페이지 구조
| 경로 | 설명 | 데이터 |
|------|------|--------|
| `/` | 홈 — 히어로 + 카드 그리드 | getPosts(featured + latest) |
| `/series/[slug]` | 시리즈 아카이브 | getPosts(series=slug) |
| `/post/[id]` | 포스트 상세 | getPost(id) + getRelatedPosts() |
| `/about` | About 페이지 | 정적 |
| `/search` | 검색 | searchPosts(query) |

## 핵심 컴포넌트
1. **ContentCard** — Content Type에 따라 CarouselCard, ReelsCard, LongformCard, EditorialCard로 분기
2. **HeroSection** — 피쳐드 포스트 대형 카드
3. **ContentGrid** — 반응형 카드 그리드 (1/2/3 컬럼)
4. **Header** — 로고 + 시리즈 네비게이션 + 검색
5. **EmbedRenderer** — Instagram/YouTube URL → 임베드 컴포넌트

## 의존성
- Backend Agent가 만든 데이터 함수 (`src/lib/notion/`) 사용
- Designer Agent가 정의한 스타일 (globals.css, className) 적용
- UI 프리미티브는 `src/components/ui/`에서 import

## 원칙
- 서버 컴포넌트 기본, 인터랙션이 필요한 경우에만 "use client"
- 임포트 경로는 `@/` alias 사용
- 이미지는 next/image 사용 (자동 최적화)
- 임베드는 lazy load (Intersection Observer)
