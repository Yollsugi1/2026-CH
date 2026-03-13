---
description: 세션 백업 저장 + git sync. "세션 저장", "여기서 끊을게", "/save" 시 사용.
allowed-tools: Bash(git *), Read, Write, Edit, Glob, Grep, Agent, AskUserQuestion
---

# /save — 세션 저장 & Git Sync

세션 맥락을 보존하고 git push까지 완료하는 워크플로우.
백업 파일은 **다음 세션의 클로드가 읽고 재개하기 위한 문서**로 작성한다.

---

## Step 1: 저장 유형 선택

```
AskUserQuestion(
  question: "어떻게 저장할까요?",
  header: "저장 유형",
  options: [
    { label: "빠른 저장 (Recommended)", description: "간결한 백업 + git sync. 재시작 후 이어가기용" },
    { label: "상세 저장", description: "핵심 대화 원문 포함 + git sync. 맥락 손실 최소화" },
    { label: "세션 종료", description: "상세 저장 + git sync + session-wrap 분석. 오늘 완전히 끝낼 때" }
  ]
)
```

---

## Step 2: 세션 백업 md 생성

### 파일 규칙
- **파일명**: `SESSION_BACKUP_[주제]_[YYMMDD].md`
- **위치**: 현재 작업하던 디렉토리 (예: `claude-cowork-contents/`, `claude-team-zonex/` 등)
- **주제**: kebab-case 영문 또는 한글 (기존 컨벤션 따름)

### 백업 포맷 — 기본 (빠른 저장)

이 포맷은 다음 세션의 클로드가 파싱하도록 설계되었다.
불필요한 마크다운 장식을 최소화하고, 섹션명은 영문 대문자로 통일한다.

```markdown
# SESSION_BACKUP — [주제]
date: YYYY-MM-DD
status: paused | completed
work_dir: [작업 디렉토리 경로]

## CONTEXT
[1-2문장: 무슨 작업이었는가. 배경과 목적 포함]

## COMPLETED
- [완료 항목 — 구체적으로. "기획 논의" (X) → "EP.3~4 주제 후보 8개 제안 완료, 사용자 피드백 1차 수렴" (O)]

## DECISIONS
- [결정 주제]: [선택한 것] | rejected: [검토했으나 버린 것] | reason: [왜 버렸는가]
- [결정 주제]: [선택한 것] | rejected: [버린 것] | reason: [이유]

## PENDING
- [미결 항목 — 어디서 멈췄는지 구체적으로]

## FILES
- [파일 경로]: [이 파일의 역할/현재 상태]

## RESUME
이 파일을 읽은 클로드는:
1. [첫 번째 재개 지시 — 구체적으로]
2. [두 번째 재개 지시]
3. [필요시 추가]
```

### 작성 규칙 (필수)

1. **DECISIONS 섹션이 가장 중요하다.** "뭘 정했다"만 적지 말고, rejected + reason을 반드시 포함. 이게 없으면 다음 세션에서 같은 논의를 반복한다.
2. **RESUME 섹션은 명령형으로 쓴다.** "~를 확인하세요" (X) → "~를 읽고 ~부터 시작하라" (O). 다음 클로드에게 주는 지시다.
3. **축약하되 맥락을 변질시키지 않는다.** 사용자의 의도/뉘앙스가 중요한 부분은 원문 표현을 유지한다.
4. **이모지 사용 금지.** 토큰 낭비.

### 백업 포맷 — 상세 (상세 저장 / 세션 종료)

기본 포맷의 모든 섹션 + 아래 섹션 추가:

```markdown
## KEY_EXCHANGES

결정에 영향을 준 핵심 대화만 선별하여 원문 인용한다.
일상적 확인/동의는 제외. 방향을 바꾸거나 제약을 건 발언만 포함.

### [토픽 1]
> user: [원문 그대로]
→ implication: [이 발언이 이후 작업에 미치는 영향]

### [토픽 2]
> user: [원문]
> claude: [원문 — 사용자가 동의/반대한 제안인 경우만]
→ implication: [맥락]
```

### 선별 기준

KEY_EXCHANGES에 포함할 대화:
- 방향을 전환시킨 발언 ("이건 아니야", "이 방향으로 가자")
- 제약 조건을 건 발언 ("너무 뻔해", "우리가 할 이유가 없어")
- 핵심 의사결정 ("이걸로 하자", "A로 가되 B도 남겨둬")
- 뉘앙스가 중요한 피드백 (축약하면 의미가 바뀌는 것)

KEY_EXCHANGES에 제외할 대화:
- 단순 확인 ("좋아", "ㅇㅇ", "진행해")
- 도구 사용 관련 대화
- 이미 DECISIONS에 충분히 반영된 내용

---

## Step 3: Git Sync

백업 파일 생성 후 즉시 실행:

```bash
git add -A
git commit --no-verify -m "session-backup: [주제 요약]"
git push --no-verify origin main
```

커밋 메시지는 `session-backup:` 접두사 + 간결한 주제 요약.

---

## Step 4: Session Wrap (세션 종료 시만)

"세션 종료" 선택 시에만 실행.
session-wrap 스킬의 워크플로우를 따른다:

1. Phase 1: 4개 분석 에이전트 병렬 실행 (doc-updater, automation-scout, learning-extractor, followup-suggester)
2. Phase 2: duplicate-checker 검증
3. 결과 통합 및 사용자 선택

**이 단계는 git sync (Step 3) 이후에 실행한다.** 백업과 동기화가 먼저 완료되어야 안전.

---

## Resume 모드

다음 세션에서 사용자가 "이어서 해줘", "어디까지 했지" 등을 말하면:

1. `SESSION_BACKUP_*.md` 파일 중 최신 것을 찾는다
2. 파일을 읽고 RESUME 섹션의 지시를 따른다
3. 사용자에게 간단히 상태를 브리핑한 후 작업을 재개한다

```
가장 최근 세션 백업을 찾는 방법:
- 현재 디렉토리 + 하위 디렉토리에서 SESSION_BACKUP_*.md glob
- 수정일 기준 최신 파일 선택
- 여러 디렉토리에 있으면 목록을 보여주고 사용자에게 선택 요청
```

---

## CLAUDE.md 업데이트 (선택)

세션 종료 시, CLAUDE.md의 "현재 상태" 섹션을 업데이트한다:
- 마지막 작업 날짜
- 완료한 것 / 진행 중 / 다음 할 것
- 미결 사항

이 업데이트는 session-wrap의 doc-updater 결과를 반영한다.
