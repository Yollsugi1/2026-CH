# SESSION BACKUP — CEO Staff Hub Notion DB 통합
**날짜**: 2026.02.23 (월)
**세션 목적**: TEAM CH Tasks DB + 미팅로그DB를 PM Agent/Hub Router 시스템에 통합

---

## 1. 세션 요약

이전 세션(CEO Staff Hub 구축)에서 이어서, Notion의 **TEAM CH Tasks DB**와 **CH 미팅로그DB**를 CEO Staff 시스템의 4대 데이터 소스로 통합했다. PM Agent, Hub Router, CLAUDE.md 3개 파일을 모두 업데이트하여, `오늘 뭐해?`, `이번 주`, `미팅 준비` 등의 커맨드가 Google Calendar + Craft + Notion 팀태스크 + 미팅로그를 종합적으로 참조하도록 개선했다.

---

## 2. 4대 데이터 소스 체계 (확정)

| # | 소스 | 역할 | Collection ID / API |
|---|---|---|---|
| 1 | **Google Calendar** | 일정 (미팅, 촬영, 외부 약속) | list_gcal_events |
| 2 | **Craft** | 수현 개인 태스크 (메모성 포함) | tasks_get(scope="active") |
| 3 | **Notion TEAM CH Tasks** | 팀 태스크 (담당자별, 프로젝트별) | `collection://11902b0e-30a9-811e-bbce-000b4cd8ef5a` |
| 4 | **Notion CH 미팅로그DB** | 미팅 기록 & 액션아이템 | `collection://11902b0e-30a9-8128-b64a-000bb8d53ffb` |

**콘텐츠 파이프라인:**
- 영상 콘텐츠 DB: `collection://2e002b0e-30a9-80c0-a95a-000b7c178b4c`
- 매거진 콘텐츠 DB: `collection://29b02b0e-30a9-8048-8b6f-000b69f03149`

---

## 3. Notion DB 스키마

### TEAM CH Tasks DB
- Name (title)
- 완료 (status: 시작 전 / 진행중 / 보류 / 완료 / 드랍)
- Due Date (date)
- 담당자 (person: 수현, 지운, 우석, 임용)
- Project (relation)
- Meeting (relation → 미팅로그DB)
- Area, Description, Sub-task, 선행 작업, 후속 작업, 산출물

### CH 미팅로그DB
- Name (title)
- Type (select: 팀 정기 미팅 / 외부 미팅 / 1:1 미팅 / 비정기미팅 / Others)
- 일자 (date)
- 참여자 (person)
- 태스크 (relation → TEAM CH Tasks)
- 프로젝트 (relation)
- 페이지 구조: 사전작성내용 → 지난주 액션아이템 점검 → 금주 액션아이템 설정 → 주요 일정 공유 → 금주 콘텐츠 플랜 → 기타 공유내용 → Meeting Notes → Action Items

---

## 4. 수정된 파일

| 파일 | 변경 내용 |
|---|---|
| `/.claude/skills/pm-agent/SKILL.md` | Step 1 데이터 수집에 4대 소스 체계 반영, 브리핑 포맷에 팀태스크/미팅 액션아이템 섹션 추가, 이번 주/미팅 준비 커맨드 업데이트, 태스크 관리 기능 4대 소스로 재구성 |
| `/.claude/skills/ceo-staff-hub/SKILL.md` | External Context에 4대 데이터 소스 추가, PM/일정 라우팅에 pm-agent 연결, Sub-Agent Registry에 PM Domain 추가 (Planned→Active) |
| `/.claude/CLAUDE.md` | Notion 핵심 링크 섹션 재구성 (태스크/PM, 콘텐츠, 기타로 분류), Quick Commands 설명 업데이트 |

---

## 5. 통합 테스트 결과 (이어서 진행 세션)

### 완료된 항목
1. ✅ **`오늘 뭐해?` 통합 테스트** — 4대 소스 모두 정상 연동 확인
   - Calendar: 오늘 사무실 근무 (외부 일정 없음)
   - Craft: 27건 active 태스크 정상 fetch
   - TEAM CH Tasks: 주간미팅 페이지에서 팀원별 액션아이템 추출 성공
   - 미팅로그DB: 오늘자 주간미팅(2/23) 페이지 자동 fetch → 상세 내용 추출 성공
   - 산출물: `오늘_브리핑_260223_통합테스트.md`

2. ✅ **daily-ceo-briefing 스케줄 태스크 업데이트** — settings.json description에 4대 소스 체계 반영 완료
   - Step 4~7을 [소스1]~[소스4]로 명시적 구분
   - Craft tasks_get(scope='active') 추가
   - TEAM CH Tasks + 미팅로그DB collection ID 반영
   - 브리핑 포맷에 주간미팅 액션아이템 섹션 추가

3. ✅ **위클리 브리핑 재생성** — 4대 소스 통합 v2 생성
   - 기존 v1(Calendar+Craft만) → v2(+TEAM CH Tasks+미팅로그DB)
   - 담당자별 금주 액션아이템 테이블 추가 (우석/지운/임용)
   - 주간미팅 회고 이슈 반영
   - 산출물: `위클리_브리핑_2026_W9_0223_v2.md`

### 테스트 인사이트
- Notion search는 semantic search 기반이라 status 필터링(진행중/시작 전)이 정확하지 않음 → 미팅로그 페이지를 통해 팀 태스크 현황을 간접 추출하는 방식이 더 효과적
- 미팅로그DB의 주간미팅 페이지가 가장 풍부한 팀 태스크 정보를 담고 있음 (담당자별 지난주 회고 + 금주 액션)
- Craft + 미팅로그 조합이 수현 개인 태스크 + 팀 태스크를 가장 잘 커버

### 미완료 / 다음 세션
1. **`미팅 준비` 테스트** — 미팅로그DB에서 최근 주간미팅 자동 fetch → agenda 생성 (다음 주간미팅 전 테스트)
2. **CEO 대시보드 업데이트** — 팀태스크 현황 반영 (대시보드 포맷 개선 필요)
3. **Notion TEAM CH Tasks 직접 쿼리 개선** — query_data_sources 활용하여 status 필터링 정확도 개선

---

*이 백업은 새 세션에서 `/mnt/2026 CH/SESSION_BACKUP_CEO_Staff_Hub_DB통합_260223.md`를 읽으면 전체 맥락을 복원할 수 있습니다.*
