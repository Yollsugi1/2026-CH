# Git 저장소 관리 가이드

> 2026 CH 워크스페이스의 GitHub 저장소 구조와 사용법

---

## 저장소 구조

하나의 로컬 폴더(`2026 CH`)에서 작업하고, GitHub에는 2개 저장소로 분리 관리한다.

| 구분 | 저장소 | URL | 공개 | 용도 |
|---|---|---|---|---|
| **팀 공유** | `2026-CH` | https://github.com/Yollsugi1/2026-CH | Public | 팀원(지운, 우석, 임용)과 공유하는 콘텐츠/프로젝트 |
| **대표 전용** | `2026-CH-private` | https://github.com/Yollsugi1/2026-CH-private | Private | 경영, 재무, 법률, 영업 등 민감 문서 |

### 로컬 디렉토리 위치

```
/Users/Yollsugi/Downloads/2026 CH/          ← 원본 (모든 파일)
/Users/Yollsugi/Downloads/2026-CH-private/  ← Private repo 전용 복사본
```

---

## 파일 분류 기준

### Public (2026-CH) — 팀 공유

| 폴더/파일 | 내용 |
|---|---|
| `claude-cowork-contents/` | 콘텐츠 기획, 브리핑, 시리즈 플래닝 |
| `claude-team-zonex/` | Zone X 프로젝트 전체 |
| `국순당-자동화-팀공유/` | 국순당 워크플로우 (팀 공유용) |
| `CLAUDE.md` | 워크스페이스 가이드 |
| `creatorhood_2026_content_strategy.md` | 2026 콘텐츠 전략 |
| `2026_CH_MAG_콘텐츠_시리즈_확정안.md` | 시리즈 확정안 |
| `CH 소개서.pdf`, 포트폴리오, 소개서 PDF | 대외 소개 자료 |

### Private (2026-CH-private) — 대표 전용

| 폴더/파일 | 내용 |
|---|---|
| `claude-cowork-business/` | 경영/재무 — 사업플랜, 3레이어, 재무 가이드, 견적서 |
| `claude-cowork-doc/` | 법률 — 계약서, 정관, 대표 커뮤니케이션 |
| `claude-cowork-sales/` | 영업 — 클라이언트 견적서, 제안서 |
| `claude-code-ch/` | 국순당 견적/예산 (금액 포함) |
| `claude-client/` | 클라이언트 관리 — 비용 청구, 자동화 |
| `대표 전용/` | 동업 관련 문서 |
| `사업자등록증_크리에이터후드.pdf` | 개인사업자 정보 |
| `Kocca Business 2026 v1.1.pdf` | 정부지원사업 |
| `포트폴리오_크리에이터후드(2026).pdf` | 내부용 포트폴리오 |
| `SESSION_BACKUP_CEO_*` | CEO 작업 세션 백업 |

### 분류 기준 요약

- **금액/견적/예산** → Private
- **계약서/법률** → Private
- **대표 전용 자료** → Private
- **사업자등록증/개인정보** → Private
- **콘텐츠 기획/제작** → Public
- **프로젝트 협업** → Public

---

## Push 방법

### Claude Code에서 (권장)

**"push 해줘"** 한 마디면 된다. Claude가 자동으로:

1. 변경된 파일을 감지
2. Public / Private 자동 분류
3. 분류 리스트를 보여줌
4. 승인하면 각 저장소에 push

매번 "이건 public", "이건 private" 구분해서 말할 필요 없음.

### 수동으로 할 경우

#### Public (팀 공유) push

```bash
cd "/Users/Yollsugi/Downloads/2026 CH"

# 1. 브랜치 생성 (main 직접 커밋 차단됨)
git checkout -b feat/작업설명

# 2. 변경 파일 확인
git status

# 3. 파일 추가 & 커밋
git add 파일명
git commit -m "feat: 작업 설명"

# 4. push
git push -u origin feat/작업설명
```

> `.gitignore`가 민감 파일을 자동 차단하므로, `git add -A` 해도 Private 파일은 올라가지 않는다.

#### Private (대표 전용) push

```bash
# 1. 원본 → Private repo로 동기화
bash "/Users/Yollsugi/Downloads/2026 CH/.claude/scripts/sync-private.sh"

# 2. Private repo에서 커밋 & push
cd "/Users/Yollsugi/Downloads/2026-CH-private"
git add -A
git commit -m "docs: 업데이트 설명"
git push origin main
```

---

## Git Hooks (팀 보호)

Public repo(`2026-CH`)에 3개의 hook이 설치되어 있다:

| Hook | 역할 |
|---|---|
| `pre-commit` | main 브랜치에서 직접 commit 차단 → 새 브랜치 생성 안내 |
| `commit-msg` | Conventional Commits 형식 검증 (`feat:`, `fix:`, `docs:` 등) |
| `pre-push` | main 브랜치로 직접 push 차단 → 새 브랜치 안내 |

### Conventional Commits 예시

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
chore: 설정/관리 작업
refactor: 코드 리팩토링
```

---

## .gitignore 구조

`2026 CH/.gitignore`은 **화이트리스트 방식**이다:

- 기본적으로 모든 파일 무시 (`*`)
- 문서 파일만 허용: `.pdf`, `.md`, `.txt`, `.docx`, `.xlsx`, `.csv`, `.skill`, `.plugin`
- 이미지(`.jpg`, `.png`), 영상(`.mov`), 코드(`node_modules`) 등은 자동 제외
- 민감 폴더/파일은 명시적으로 차단

---

## 새 민감 파일이 추가될 때

`2026 CH` 폴더에 새로운 민감 파일/폴더가 생기면:

1. `.gitignore`에 해당 경로 추가
2. `sync-private.sh` 스크립트에 경로 추가
3. Private repo로 동기화 후 push

Claude Code에서 "이 파일은 private으로 관리해줘"라고 말하면 위 과정을 자동 처리한다.

---

## 팀원 접근 설정

| 팀원 | Public (2026-CH) | Private (2026-CH-private) |
|---|---|---|
| 수현 (대표) | Owner | Owner |
| 김지운 (PD) | Collaborator 초대 가능 | 접근 불가 |
| 우석 (디자이너) | Collaborator 초대 가능 | 접근 불가 |
| 임용 (에디터) | Collaborator 초대 가능 | 접근 불가 |

팀원을 초대하려면:
```bash
gh repo add-collaborator Yollsugi1/2026-CH 팀원GitHub아이디
```

---

## 요약

```
2026 CH (로컬 폴더) ──push──→ 2026-CH (Public, 팀 공유)
       │
       └── sync → 2026-CH-private (Private, 대표 전용)
```

- 로컬에서는 하나의 폴더에서 모든 작업
- Push할 때만 자동으로 Public / Private 분리
- Claude Code에서 "push 해줘"로 한 번에 처리
