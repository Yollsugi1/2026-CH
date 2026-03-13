---
description: 이전 세션 백업을 찾아 작업을 재개한다. "이어서 해줘", "어디까지 했지", "/resume" 시 사용.
allowed-tools: Bash(git *), Read, Glob, Grep, AskUserQuestion
---

# /resume — 세션 복구

저장된 SESSION_BACKUP 파일을 찾아 읽고, 중단된 작업을 재개한다.

---

## Step 1: SESSION_BACKUP 파일 검색

프로젝트 전체에서 SESSION_BACKUP 파일을 찾는다:

```
Glob("**/SESSION_BACKUP_*.md")
```

## Step 2: 목록 제시

파일이 2개 이상이면 목록을 보여주고 사용자에게 선택을 요청한다.
각 파일의 첫 3줄 (제목 + date + status)을 읽어 요약으로 표시한다.

```
AskUserQuestion(
  question: "어떤 세션을 이어서 할까요?",
  header: "세션 선택",
  options: [
    // 수정일 최신순으로 정렬하여 표시
    { label: "[주제] (MM/DD)", description: "[CONTEXT 섹션 첫 줄]" },
    { label: "[주제] (MM/DD)", description: "[CONTEXT 섹션 첫 줄]" },
    ...
  ]
)
```

파일이 1개면 바로 읽고 확인만 한다:
"[주제] 세션을 이어서 진행합니다."

## Step 3: 백업 파일 읽기 + 브리핑

선택된 SESSION_BACKUP 파일을 전체 읽는다.

사용자에게 간결하게 브리핑한다:

```
[주제] 세션 복구

상태:
- 완료: [COMPLETED 요약]
- 미결: [PENDING 요약]

주요 결정:
- [DECISIONS 핵심만]

다음 할 일:
- [RESUME 섹션의 지시사항]
```

## Step 4: RESUME 섹션 실행

RESUME 섹션의 지시를 따라 작업을 재개한다.
FILES 섹션에 나열된 파일들을 먼저 읽어 현재 상태를 파악한 후 시작한다.

KEY_EXCHANGES 섹션이 있으면 (상세 저장이었던 경우):
- 사용자의 피드백/제약 조건을 숙지한 상태에서 재개
- 이미 거절된 방향을 다시 제안하지 않는다

---

## 주의사항

- DECISIONS의 rejected 항목을 다시 제안하지 않는다
- KEY_EXCHANGES의 사용자 발언 톤/뉘앙스를 존중한다
- 백업 파일에 없는 맥락을 추측하지 않는다. 불확실하면 사용자에게 물어본다
