---
name: kuksundang-client-update
description: |
  국순당 클라이언트 보고용 주간 업데이트를 Notion 페이지로 생성하고 Slack으로 알림을 보냅니다.
  MUST BE USED when: "클라이언트 보고", "업데이트 페이지", "주간 업데이트 만들어줘", "연정님 보고" 등을 요청할 때
  USE PROACTIVELY when: 매주 금요일 또는 클라이언트에게 진행 현황을 보고해야 할 때
---

# 국순당 클라이언트 보고 자동 업데이트

## Objective
국순당 프로젝트의 클라이언트 보고용 주간 업데이트를 생성한다. 협업 Notion 페이지 아래에 보고 페이지를 만들고, Slack으로 요약 + 링크를 발송한다.

## 실행 순서

### Step 1: Notion DB 조회

**1. 국순당 작업 현황 (클라이언트 공유 보드)**
- `data_source_url: collection://25402b0e-30a9-80ce-ab4c-000be4f8067b`

**2. 내부 업무관리 (제작 캘린더)**
- `data_source_url: collection://2fd02b0e-30a9-80d6-91c4-000b9f5c2a4b`

**3. 2026 국순당 콘텐츠 (마스터 DB)**
- `data_source_url: collection://2e802b0e-30a9-80be-a68b-000b949a80a2`

### Step 2: 클라이언트용 요약 작성
클라이언트에게 적합한 정보만 필터링:
- 시리즈별 정리 (순당포착, 취하지아니한가, 1막1장)
- 각 항목: 콘텐츠명, 현재 단계, 예상 완료 시점
- 클라이언트 피드백/승인 필요 항목 강조
- 최근 완료된 산출물 목록

### Step 3: Notion 업데이트 페이지 생성
`notion-create-pages` 도구로 협업페이지 아래에 새 페이지 생성:
- Parent page ID: `25402b0e-30a9-80dc-9be8-c56eeb7e3b2a`
- 페이지 제목: `[주간 업데이트] {YYYY.MM.DD} 크리에이터후드 작업 현황`

### Step 4: Slack 알림 발송
Slack 채널 "outsource-1-국순당" (C0ABALBMYRW)에 발송:

```
[국순당] 주간 업데이트가 등록되었습니다

이번 주 주요 진행사항:
- {핵심 하이라이트 2-3개}

상세 내용: {생성된 Notion 페이지 URL}

확인 요청: {클라이언트 액션 필요 항목}
```

## 제약사항
- 클라이언트 대면 톤: 전문적이지만 따뜻하게
- 내부 전용 메모, 비용 정보 절대 포함하지 않음
- Notion 페이지 내용 최대 ~20줄
