# CEO Daily Briefing — Scheduled Task 프롬프트 백업

**Task ID**: `ceo-daily-briefing`
**Cron**: `0 8 * * *` (매일 오전 8시)
**설명**: 크리에이터후드 CEO 데일리 브리핑 — Craft+Notion+Calendar+마스터플랜 통합

---

## 프롬프트 내용

```
크리에이터후드 CEO 데일리 브리핑을 생성해줘.

## 실행 순서

### Step 1: 데이터 수집 (6개 소스)

1. **Google Calendar** — 오늘~내일 일정
   - gcal_list_events(timeMin=오늘 00:00, timeMax=내일 23:59, timeZone="Asia/Seoul")
   - 없으면 "캘린더 미연결" 표시

2. **Craft 태스크** — 개인 태스크 전체
   - tasks_get(scope="active") → 전체 active 태스크
   - scheduleDate 기준으로 밀림 분류: 최근(1주), 2~4주, 30일+

3. **Notion TEAM CH Tasks DB**
   - notion-fetch(id="collection://11902b0e-30a9-811e-bbce-000b4cd8ef5a")
   - 상태가 "진행중" 또는 "시작전"인 항목 필터

4. **Notion CH 미팅로그DB**
   - notion-fetch(id="11902b0e-30a9-8169-89c0-dee2476cb0eb")
   - 오늘 날짜 또는 가장 최근 미팅 문서

5. **Notion 2026 CH 콘텐츠 DB**
   - notion-fetch(id="2e002b0e-30a9-805d-b435-e24367fd92ef")
   - 이번 주 발행 예정 또는 제작 중 콘텐츠

6. **Notion 영상 시리즈 DB**
   - notion-fetch(id="2ee02b0e-30a9-80ff-90d1-efe47a37be43")
   - 현재 진행 중인 시리즈 상태

7. **마스터플랜 MD**
   - 워크스페이스에서 "크리에이터후드_2026_마스터플랜*.md" 파일 읽기

### Step 2: 분석

- 오늘 캘린더에서 외부 일정 / 촬영 / 미팅 식별
- Craft 태스크를 카테고리별(콘텐츠/영업/전략/자동화/팀/사업) 분류
- 밀림 일수 계산 (scheduleDate vs 오늘)
- 팀 태스크에서 블로커/밀림 감지
- 콘텐츠 파이프라인 상태 매핑

### Step 3: Must/Should/Could 우선순위

- **Must**: 오늘 마감, 촬영, 외부 미팅, 클라이언트 공유일
- **Should**: 이번 주 내 처리 필요, 2주 이상 밀린 항목
- **Could**: 시간 되면 진행, 30일+ 정리

### Step 4: MD 파일 생성

아래 템플릿으로 작성:

# 📋 CEO 데일리 브리핑 — {YYYY.MM.DD} ({요일})

**생성**: Claude CEO Staff | 자동 브리핑
**소스**: Calendar {✅/⬜} + Craft ({N}건) + Notion TEAM Tasks + 미팅로그 + 콘텐츠DB

---

## ━━━ 오늘 캘린더 ━━━
{일정 테이블 또는 "별도 일정 없음"}

## ━━━ 오늘의 핵심 (수현 관점) ━━━

**[Must — 오늘 반드시]**
1. {액션}
2. {액션}

**[Should — 이번 주 중]**
3. {액션}
4. {액션}

**[Could — 시간 되면]**
5. {액션}

## ━━━ Craft 개인 태스크 ━━━

### 🟡 최근 밀림 (1주 이내)
| # | 태스크 | 예정일 |
{테이블}

### 🟠 2~4주 밀림
{간략 리스트}

### ⚪ 30일+
{건수만}

## ━━━ 팀 태스크 현황 ━━━
{담당자별 진행중 태스크}

## ━━━ 콘텐츠 파이프라인 ━━━
{이번 주 제작/발행 예정 콘텐츠}

## ━━━ 블로커/리스크 ━━━
{감지된 이슈}

## ━━━ 내일 미리보기 ━━━
{내일 주요 일정/마감}

---
*CEO Staff 자동 브리핑 — {소스 연결 상태}*

### Step 5: 저장

파일명: CEO_데일리_브리핑_{YYYYMMDD}.md
저장 위치: 워크스페이스 폴더 (mnt/claude-cowork-contents/)
```

---
*2026.03.03 생성 — CEO Staff System v1.0*
