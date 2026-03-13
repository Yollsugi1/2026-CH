# SESSION_BACKUP — chmag-redesign-brainstorming
date: 2026-03-13
status: paused
work_dir: claude-magazine/

## CONTEXT
CH MAG 웹매거진의 네비게이션과 홈페이지를 리디자인하는 작업. brainstorming skill 체인(→ writing-plans → executing-plans → agent team)으로 진행 중이며, 디자인 섹션별 승인 단계에 있다.

## COMPLETED
- 프로젝트 컨텍스트 탐색 (현재 header.tsx, constants.ts, types, page.tsx 등 파악)
- 수현 손스케치(IMG_3183.heic) 분석 및 네비 구조 이해
- The Ringer 레퍼런스 홈페이지 레이아웃 분석
- 질문 단계 완료 (네비 구조, 홈 레이아웃, 서브홈 방향, FEATURED 정의)
- 접근법 3개 제안 → A안(대분류를 실제 라우트로) 채택
- 디자인 섹션 1(네비게이션) 승인
- 디자인 섹션 2(홈페이지) 승인

## DECISIONS
- 라우팅 구조: A안 (/, /daily, /series, /featured, /series/[slug], /post/[id]) | rejected: B안(쿼리 파라미터), C안(클라이언트 탭) | reason: 대분류별 독립적 서브홈 경험 필요, SEO, URL 공유 가능성
- 활성 대분류 표시: key color 하이라이트 | rejected: underline, bold | reason: 수현 직접 지정
- FEATURED 코너명: 승부처, 잘산템, 프리뷰 | rejected: "월간 승부처" 등 풀네임 | reason: 수현 지시 — "월간" 빼기. 프리뷰는 월초 스포츠 콘텐츠("너는 3월에 스포츠를 많이 보게 되어있다" 등)
- 모바일 네비: 햄버거(☰) + 아코디언 방식 | rejected: 별도 모바일 구조 | reason: 수현 확인
- 홈 숏폼 섹션: 가로 스크롤 (Pit Stop + 폭력적인 식단 혼합) | 확정
- 홈 FEATURED 섹션: 승부처/잘산템/프리뷰 탭 전환, 1:1 카드 | 확정
- "캐러셀" 정의: 인스타 캐러셀 형식 데일리 콘텐츠 통칭. FEATURED는 그 중 월간 반복 코너의 태그 기반 큐레이션 뷰

## PENDING
- 디자인 섹션 3: 서브홈 페이지 (/daily, /series, /featured) 디자인 미제시
- 디자인 doc 작성 (docs/plans/2026-03-13-chmag-redesign-design.md)
- writing-plans 스킬 → 구현 계획
- agent team 구성 및 병렬 구현

## FILES
- `claude-magazine/src/components/layout/header.tsx`: 현재 헤더 — 10개 시리즈 평면 나열, 리디자인 대상
- `claude-magazine/src/lib/constants.ts`: 10개 시리즈 config — 대분류 그룹핑 추가 필요
- `claude-magazine/src/types/index.ts`: SeriesConfig, EmbedSource 등 타입 정의
- `claude-magazine/src/app/page.tsx`: 현재 홈 — Hero+Latest 구조, 섹션 추가 필요
- `claude-magazine/src/app/series/[slug]/page.tsx`: 개별 시리즈 페이지 (유지)
- `claude-magazine/IMG_3183.heic`: 수현 손스케치
- `session-resumes/RESUME_260313_1200.md`: 이전 session-resume 백업 (이 파일이 더 최신)

## RESUME
이 파일을 읽은 클로드는:
1. brainstorming skill을 로드하고 Step 4(디자인 섹션별 승인) 상태임을 인지하라. 섹션 1(네비)과 섹션 2(홈)는 승인됐다.
2. 디자인 섹션 3: 서브홈 페이지 (/daily, /series, /featured) 디자인을 제시하고 사용자 승인을 받아라. SERIES 서브홈은 "각 시리즈가 섹션 단위로 Interactive하게 표현"되어야 한다.
3. 승인 후 디자인 doc을 docs/plans/에 작성하고, writing-plans 스킬을 invoke하라.
