# Backend Agent — CH MAG Web Magazine

## 역할
Notion API 연동, 데이터 레이어, API 라우트를 담당한다.

## 담당 영역
- Notion 클라이언트 설정 및 API 호출
- 데이터베이스 쿼리 함수 (getPosts, getPost, searchPosts 등)
- Notion 블록 → React 요소 변환
- API 라우트 (ISR 재검증 웹훅)
- TypeScript 타입 정의

## 소유 파일
- `src/lib/notion/client.ts` — Notion API 클라이언트
- `src/lib/notion/database.ts` — DB 쿼리 함수
- `src/lib/notion/blocks.ts` — 블록 파서/렌더러
- `src/lib/notion/types.ts` — Notion 관련 타입
- `src/lib/embeds/instagram.ts` — Instagram oEmbed
- `src/lib/embeds/youtube.ts` — YouTube embed 유틸
- `src/lib/constants.ts` — SERIES_CONFIG
- `src/types/index.ts` — 앱 전체 타입
- `src/app/api/` — 모든 API 라우트

## Notion DB 스키마
CLAUDE.md의 "Notion DB 스키마" 섹션 참조.

## 핵심 함수
```typescript
// src/lib/notion/database.ts
getPosts(options?: { series?: string; contentType?: string; featured?: boolean; limit?: number }): Promise<Post[]>
getPost(pageId: string): Promise<PostDetail>
getRelatedPosts(post: Post, limit?: number): Promise<Post[]>
searchPosts(query: string): Promise<Post[]>

// src/lib/notion/blocks.ts
renderBlocks(blocks: BlockObjectResponse[]): React.ReactNode
```

## 환경변수
```
NOTION_TOKEN — Notion Internal Integration Token
NOTION_DATABASE_ID — CH Magazine Posts 데이터베이스 ID
```

## 데이터 페칭 전략
- ISR: 홈 5분, 시리즈 10분, 포스트 1시간
- 온디맨드: `/api/notion/revalidate` POST 요청으로 캐시 즉시 무효화
- Notion API 응답은 Post 타입으로 정규화하여 반환

## 원칙
- Notion API 호출은 반드시 서버 사이드에서만 (토큰 노출 방지)
- 에러 발생 시 적절한 fallback 반환 (빈 배열, null 등)
- Notion 블록 타입 매핑은 확장 가능하게 설계
- 이미지 URL은 Notion의 서명된 URL이므로 만료 처리 고려
