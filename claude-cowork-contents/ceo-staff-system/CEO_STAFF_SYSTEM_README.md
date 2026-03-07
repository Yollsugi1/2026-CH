# CEO Staff 자동화 시스템 v1.0

## 시스템 구조

```
[매일 오전 8시 — Scheduled Task 자동 실행]
    │
    ├─ Craft 태스크 읽기 (tasks_get → active 전체)
    ├─ Notion TEAM CH Tasks 읽기 (진행중/시작전)
    ├─ Notion 미팅로그DB 읽기 (최근 미팅)
    ├─ Notion 콘텐츠DB + 영상시리즈DB 읽기
    ├─ 마스터플랜 MD 읽기
    ├─ Google Calendar 읽기 (연결 시)
    │
    ▼
[CEO_데일리_브리핑_{날짜}.md] → 워크스페이스 저장
    ├─ 오늘 캘린더
    ├─ Must/Should/Could 핵심 액션
    ├─ Craft 개인 태스크 (밀림 분류)
    ├─ 팀 태스크 현황 (담당자별)
    ├─ 콘텐츠 파이프라인
    └─ 블로커/리스크 + 내일 미리보기
```

```
[주간 리뷰 — 수현님 요청 시 실행]
"주간 리뷰", "이번 주 전체 점검", "프로젝트 현황" 등
    │
    ├─ 위 데일리 소스 전체 +
    ├─ 마스터플랜 대비 gap 분석
    ├─ 프로젝트 4축 전체 스캔
    │
    ▼
[CEO_위클리_리뷰_W{주차}.md] → 워크스페이스 저장
    ├─ 프로젝트별 전체 현황 (CH MAG / Zone X / 서브채널 / 법인)
    ├─ 시리즈별 파이프라인 상태
    ├─ 마스터플랜 vs 실제 gap
    ├─ 미결 의사결정 목록
    ├─ 리소스 병목 분석
    └─ 다음 주 플래닝
```

## 데이터 소스 연결 현황

| 소스 | 연결 | ID/경로 |
|------|------|---------|
| Craft 태스크 | ✅ | tasks_get(scope="active") |
| Notion TEAM CH Tasks | ✅ | DB: 11902b0e-30a9-8158-b6ca-e109809e1085 / DS: collection://11902b0e-30a9-811e-bbce-000b4cd8ef5a |
| Notion CH 미팅로그DB | ✅ | DB: 11902b0e-30a9-8169-89c0-dee2476cb0eb |
| Notion 2026 CH 콘텐츠 DB | ✅ | DB: 2e002b0e-30a9-805d-b435-e24367fd92ef |
| Notion 영상 시리즈 DB | ✅ | DB: 2ee02b0e-30a9-80ff-90d1-efe47a37be43 |
| 마스터플랜 MD | ✅ | 크리에이터후드_2026_마스터플랜*.md |
| Google Calendar | ⬜ 미연결 | 커넥터 연결 필요 |

## 트리거

- **데일리**: 매일 오전 8시 자동 / "CEO 브리핑", "오늘 뭐해" 요청 시
- **위클리**: "주간 리뷰", "프로젝트 전체 점검" 요청 시

## 산출물

- `CEO_데일리_브리핑_{YYYYMMDD}.md`
- `CEO_위클리_리뷰_W{주차}_{YYYYMMDD}.md`
- 모두 워크스페이스 폴더에 저장

---
*2026.03.03 생성 — CEO Staff System v1.0*
