# Antigravity IDE + Claude Code 완전 설정 가이드
## 크리에이터후드 워크플로우 마이그레이션

> 작성일: 2026-03-03
> 목적: Claude Cowork에서 사용하던 모든 기능(Skills, Plugins, MCP, 맥락)을 Antigravity IDE + Claude Code 환경에서 동일하게 구현

---

## 📋 목차

1. [Antigravity IDE 기본 이해](#1-antigravity-ide-기본-이해)
2. [Claude Code 설치 및 기본 설정](#2-claude-code-설치-및-기본-설정)
3. [MCP 서버 연결 (Notion, Slack, Google Calendar 등)](#3-mcp-서버-연결)
4. [CLAUDE.md로 크리에이터후드 맥락 주입](#4-claudemd로-맥락-주입)
5. [Skills → Claude Code 변환](#5-skills-변환)
6. [Plugins 마이그레이션](#6-plugins-마이그레이션)
7. [Antigravity에서 Claude Code 사용하기](#7-antigravity에서-claude-code-사용하기)

---

## 1. Antigravity IDE 기본 이해

Antigravity는 Google이 만든 AI 기반 IDE입니다. 쉽게 말하면 "AI가 코드를 대신 짜주는 작업 환경"인데, 수현님은 코딩보다는 **Claude Code를 터미널에서 돌리는 환경**으로 사용하게 됩니다.

### Antigravity가 제공하는 것
- 내장 터미널 (여기서 Claude Code 실행)
- 파일 탐색기 (프로젝트 파일 관리)
- 내장 브라우저 (결과물 미리보기)
- MCP 서버 연결 기능

### 핵심 포인트
수현님 입장에서 Antigravity는 **Claude Code를 실행하는 "집"** 같은 역할입니다. Cowork에서 대화창에 타이핑하던 것을 터미널에서 하게 되는 것뿐입니다.

---

## 2. Claude Code 설치 및 기본 설정

### Step 1: Claude Code 설치

터미널을 열고 아래 명령어를 실행합니다:

```bash
npm install -g @anthropic-ai/claude-code
```

설치 후 확인:
```bash
claude --version
```

### Step 2: 로그인

```bash
claude
```

처음 실행하면 브라우저가 열리면서 Anthropic 계정 로그인을 요청합니다.
현재 사용하시는 Claude 계정(sh.jung@teamcreatorhood.com)으로 로그인하면 됩니다.

### Step 3: 프로젝트 폴더 만들기

크리에이터후드 전용 작업 폴더를 만듭니다:

```bash
mkdir ~/creatorhood-workspace
cd ~/creatorhood-workspace
```

이 폴더가 앞으로 Claude Code를 실행하는 기본 위치가 됩니다.

---

## 3. MCP 서버 연결

MCP는 Claude가 외부 도구(Notion, Slack, Google Calendar 등)에 접속하는 통로입니다.
Cowork에서 자동으로 연결되던 것을 Claude Code에서는 **직접 명령어로 등록**해야 합니다.

### 🔵 Notion MCP 연결

**방법 A: 공식 Notion MCP (권장)**
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp --scope user
```

실행 후 `/mcp` 명령으로 Notion OAuth 인증을 완료합니다:
```
> /mcp
# Notion 옆의 "Authenticate" 클릭 → 브라우저에서 Notion 로그인
```

**방법 B: 로컬 Notion MCP (API 키 사용)**
```bash
claude mcp add --transport stdio notion \
  --env NOTION_API_KEY=your-notion-api-key \
  --scope user \
  -- npx -y @notionhq/notion-mcp-server
```

> ⚠️ Notion API 키는 https://www.notion.so/my-integrations 에서 발급받을 수 있습니다.

### 🔵 Slack MCP 연결

```bash
claude mcp add --transport http slack https://slack-mcp-server-url --scope user
```

또는 Slack 공식 MCP가 있다면:
```bash
claude mcp add --transport http slack https://mcp.slack.com/mcp --scope user
```

인증:
```
> /mcp
# Slack "Authenticate" 선택 → OAuth 로그인
```

### 🔵 Google Calendar MCP 연결

```bash
claude mcp add --transport http gcal https://mcp.google-calendar.com/mcp --scope user
```

### 🔵 Google Drive MCP 연결

```bash
claude mcp add --transport http gdrive https://mcp.google-drive.com/mcp --scope user
```

### 연결 상태 확인

```bash
claude mcp list
```

Claude Code 내에서:
```
> /mcp
```

### 🔵 Antigravity IDE에서 MCP 연결하기

Antigravity 자체에도 MCP를 연결할 수 있습니다:

1. Antigravity IDE 열기
2. 상단 메뉴에서 **점 3개(⋮)** 클릭 → **MCP Servers** 선택
3. **Manage MCP Servers** 클릭
4. **View raw config** 클릭

설정 파일 위치:
- **Mac**: `~/.gemini/antigravity/mcp_config.json`
- **Windows**: `C:\Users\<사용자명>\.gemini\antigravity\mcp_config.json`

JSON 형식 예시:
```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp"
    },
    "slack": {
      "url": "https://your-slack-mcp-url"
    }
  }
}
```

> 💡 **핵심 차이**: Antigravity 자체 MCP는 Gemini 에이전트가 사용하는 것이고, Claude Code의 MCP는 Claude가 사용하는 것입니다. 둘 다 따로 설정해야 합니다.

---

## 4. CLAUDE.md로 맥락 주입

CLAUDE.md는 Claude Code의 "기억" 파일입니다. 프로젝트 폴더에 넣으면 매 세션 시작할 때 자동으로 읽습니다.

### Step 1: 프로젝트 CLAUDE.md 생성

`~/creatorhood-workspace/CLAUDE.md` 파일을 만듭니다:

```markdown
# Creatorhood Project Context

## Company Overview
크리에이터후드(Creatorhood)는 한국의 스포츠 라이프스타일 미디어 회사이자 콘텐츠 마케팅 에이전시입니다.
CEO/Founder: 수현 (sh.jung@teamcreatorhood.com)

## Core Business
- CH MAG: 스포츠 라이프스타일 매거진 (Instagram 1.6K 팔로워)
- 브랜드 채널 운영 대행 서비스
- Zone X: 하이브리드 카디오 스포츠 엔터테인먼트 리그 (2026 런칭)

## Current Clients
- 국순당 (전통주 - 막걸리 마케팅)
- 펠리카나 (치킨)
- 호텔/웰니스 브랜드 다수

## Team
디자이너, 에디터, 대학생 에디터 기여자 팀 운영

## Content Philosophy
"Content → Audience → Brand/Commerce" (미디어 퍼스트 사고)
광고가 아닌 오리지널 콘텐츠 기반 오디언스 구축

## Key Frameworks
- 윤성원 A-B-C 프레임워크 (콘텐츠 기획용)
- 3단계 공유 시스템 (클라이언트 보고용)

## Working Style
- 한국어와 영어 모두 사용 (한국어 위주)
- 노션 페이지 fetch할 때는 반드시 Notion MCP 먼저 사용
- 대화 내용은 매번 markdown으로 백업
- 제안서는 docx 형식으로 생성
- 따뜻하면서도 프로페셔널한 커뮤니케이션

## Tools & Platforms
- Notion: 프로젝트 관리 & 문서
- Slack: 팀 커뮤니케이션
- Google Calendar: 일정 관리
- Instagram: 주요 콘텐츠 채널
- Figma: 디자인 협업

## Preferred Output Formats
- 제안서 → .docx (크리에이터후드 템플릿)
- 콘텐츠 기획안 → Notion 페이지 또는 Markdown
- 리포트 → Slack 메시지 또는 Notion
- 프레젠테이션 → .pptx
```

### Step 2: 글로벌 사용자 설정

`~/.claude/CLAUDE.md` (홈 디렉토리)에 넣으면 **모든 프로젝트**에서 적용됩니다:

```markdown
# User Preferences (Global)

- 노션 페이지를 불러달라고 할 때는 Notion MCP 커넥터를 먼저 사용할 것
- 대화할 때마다 markdown 파일로 백업 저장
- 한국어 중심 커뮤니케이션
- 크리에이터후드 CEO/Founder 수현
```

---

## 5. Skills 변환

Cowork의 Skills는 Claude Code에서 **Custom Slash Commands** 또는 **CLAUDE.md에 포함된 지시사항**으로 변환됩니다.

### 방법 A: Custom Slash Commands (권장)

프로젝트 폴더에 `.claude/commands/` 디렉토리를 만들고, 각 스킬을 `.md` 파일로 저장합니다:

```bash
mkdir -p ~/creatorhood-workspace/.claude/commands
```

#### 예시: 국순당 데일리 리포트 커맨드

파일: `.claude/commands/kuksundang-daily.md`
```markdown
국순당 프로젝트 데일리 리포트를 생성하여 Slack 채널에 발송합니다.

1. Notion에서 국순당 프로젝트 현황 페이지를 fetch
2. 오늘 날짜 기준으로 진행 상황 파악
3. 2개의 메시지로 분리:
   - (1) 내부 데일리 현황
   - (2) 클라이언트 공유 액션 가이드
4. Slack 채널에 발송
```

사용 방법 (Claude Code 내에서):
```
> /project:kuksundang-daily
```

#### 현재 보유 Skills → Commands 변환 목록

| Cowork Skill | Claude Code Command 파일명 | 용도 |
|---|---|---|
| kuksundang-daily-report | `kuksundang-daily.md` | 국순당 데일리 리포트 |
| kuksundang-weekly-report | `kuksundang-weekly.md` | 국순당 주간 리포트 |
| kuksundang-client-update | `kuksundang-client.md` | 클라이언트 보고 |
| kuksundang-schedule-manager | `kuksundang-schedule.md` | 제작 일정 관리 |
| weekly-meeting-prep | `meeting-prep.md` | 주간미팅 브리핑 |
| daily-action-items | `daily-actions.md` | 데일리 액션아이템 |
| content-planner | `content-plan.md` | 콘텐츠 기획 |
| sales-outreach | `sales-outreach.md` | 영업 제안서 |
| quotation-builder | `quotation.md` | 견적서 생성 |
| session-backup | `backup.md` | 세션 백업 |
| brand-knowledge | `brand-info.md` | 브랜드 지식 참조 |
| content-frameworks | `frameworks.md` | 콘텐츠 프레임워크 |
| proposal-docx | `proposal.md` | 제안서 docx 생성 |
| ch-mag-writer | `ch-mag.md` | CH MAG 글 작성 |

### 방법 B: Skills 폴더 직접 복사

Cowork의 Skills 폴더 내용(SKILL.md 등)을 Claude Code 프로젝트로 복사하여 참조하게 할 수도 있습니다:

```bash
# 프로젝트 내에 skills 디렉토리를 만들고 참조 자료로 보관
mkdir -p ~/creatorhood-workspace/skills-reference
# Cowork에서 내보낸 SKILL.md 파일들을 여기에 복사
```

CLAUDE.md에 추가:
```markdown
## Skills Reference
- skills-reference/ 폴더에 각 워크플로우별 상세 지시사항이 있음
- 관련 작업 요청 시 해당 SKILL.md 파일을 먼저 읽고 진행할 것
```

---

## 6. Plugins 마이그레이션

현재 설치된 Plugins:
- **ch-mag-writer**: CH MAG 매거진 콘텐츠 라이팅
- **proposal-docx**: 크리에이터후드 제안서 Word 문서 생성

### Claude Code의 Plugin 시스템

Claude Code도 자체 Plugin 시스템을 지원합니다:

```bash
# Plugin 설치 (예시)
claude plugin install ch-mag-writer
```

또는 `.claude/commands/` 폴더에 커맨드로 변환하여 사용합니다 (위 5번 참조).

**참조 자료(레퍼런스 문서) 포함 방법:**

ch-mag-writer처럼 참조 문서가 있는 경우:
```bash
mkdir -p ~/creatorhood-workspace/references/ch-mag-writer
# style-guide.md, source-articles/ 등을 복사
```

CLAUDE.md에:
```markdown
## CH MAG Writer References
- references/ch-mag-writer/style-guide.md: CH MAG 스타일 가이드
- references/ch-mag-writer/source-articles/: 참조 기사 모음
```

---

## 7. Antigravity에서 Claude Code 사용하기

### 기본 워크플로우

1. **Antigravity IDE 실행**
2. **프로젝트 폴더 열기**: `~/creatorhood-workspace`
3. **터미널 열기**: 하단 터미널 패널 또는 `Ctrl+`` (백틱)
4. **Claude Code 실행**:
   ```bash
   claude
   ```
5. **작업 시작**: Cowork에서 하던 것처럼 자연어로 지시

### 자주 쓰는 Claude Code 명령어

| 명령어 | 설명 |
|---|---|
| `claude` | Claude Code 대화 시작 |
| `/mcp` | MCP 서버 상태 확인 및 인증 |
| `/memory` | CLAUDE.md 파일 확인/편집 |
| `/project:커맨드명` | 커스텀 커맨드 실행 |
| `/clear` | 대화 초기화 |
| `claude mcp list` | MCP 서버 목록 (Claude Code 밖에서) |
| `claude mcp add ...` | MCP 서버 추가 (Claude Code 밖에서) |

### 사용 예시

```
# Claude Code 실행 후...

> 국순당 이번 주 콘텐츠 제작 현황 정리해줘
> /project:kuksundang-daily
> 이 노션 페이지 불러와줘: https://notion.so/...
> CH MAG 글 기획해줘 - 주제: NBA 올스타 패션
> 펠리카나 SNS 대행 제안서 만들어줘
```

---

## 📌 빠른 시작 체크리스트

- [ ] Claude Code 설치: `npm install -g @anthropic-ai/claude-code`
- [ ] 프로젝트 폴더 생성: `mkdir ~/creatorhood-workspace`
- [ ] Claude Code 로그인: `claude` 실행 후 계정 인증
- [ ] Notion MCP 연결: `claude mcp add --transport http notion https://mcp.notion.com/mcp --scope user`
- [ ] Slack MCP 연결
- [ ] Google Calendar MCP 연결
- [ ] `~/creatorhood-workspace/CLAUDE.md` 생성 (크리에이터후드 맥락)
- [ ] `~/.claude/CLAUDE.md` 생성 (글로벌 사용자 선호)
- [ ] `.claude/commands/` 폴더에 주요 커맨드 생성
- [ ] 참조 자료(references) 복사
- [ ] Antigravity IDE에서 프로젝트 폴더 열기
- [ ] 터미널에서 `claude` 실행하여 테스트

---

## ⚠️ Cowork vs Claude Code 차이점

| 항목 | Cowork | Claude Code |
|---|---|---|
| 인터페이스 | GUI 대화창 | 터미널 (CLI) |
| 스킬 실행 | 자동 트리거 | `/project:커맨드명` 으로 실행 |
| MCP 연결 | 자동 설정 | 수동으로 `claude mcp add` |
| 파일 생성 | 워크스페이스 폴더 | 현재 프로젝트 디렉토리 |
| 맥락 유지 | user_preferences로 자동 | CLAUDE.md로 수동 관리 |
| 플러그인 | GUI에서 설치 | CLI로 설치 또는 커맨드로 변환 |

---

## 💡 팁

1. **Antigravity IDE를 꼭 써야 하나요?** Claude Code는 일반 터미널(Terminal, iTerm, Windows Terminal)에서도 잘 돌아갑니다. Antigravity는 파일 탐색기와 미리보기가 편한 정도의 장점이 있습니다.

2. **VS Code도 가능**: Antigravity 대신 VS Code에서 터미널을 열고 Claude Code를 실행해도 동일합니다.

3. **세션 백업**: Claude Code에서 대화 내용은 자동으로 `~/.claude/` 폴더에 저장됩니다. 추가로 markdown 백업을 원하면 커맨드를 만들어두면 됩니다.

4. **비용**: Claude Code는 Anthropic API 사용량 기반 과금입니다. Cowork과는 과금 체계가 다릅니다.

---

## 8. Antigravity Agent Mode + Claude Code 시너지

Antigravity에는 일반 Editor 모드 외에 **Agent Mode (Agent Manager)**가 있습니다. 이걸 Claude Code와 함께 쓰면 강력한 시너지가 납니다.

### Agent Mode란?

Agent Mode는 Antigravity의 "미션 컨트롤" 대시보드입니다. AI 에이전트가 자율적으로 작업을 수행하고, 수현님은 결과물만 확인하고 피드백을 주는 방식이에요.

핵심 기능:
- **병렬 에이전트**: 여러 에이전트가 동시에 다른 작업을 수행
- **Ghost Runtime**: 보이지 않는 Linux 컨테이너에서 코드가 자동 실행/테스트됨
- **Artifact 시스템**: 에이전트가 만든 결과물(계획서, 코드, 스크린샷 등)을 시각적으로 확인
- **피드백 루프**: Artifact에 직접 코멘트를 달면 에이전트가 반영

### Claude Code + Agent Mode 조합의 이점

**"샌드위치 워크플로우"**라고 불리는 방식입니다:

```
[Antigravity Agent Mode]     [Claude Code (터미널)]
  Gemini 에이전트가              Claude가
  큰 그림/구조 설계     +      세부 실행/파일 작업
  병렬 작업 오케스트레이션         깊은 맥락의 작업 수행
```

구체적인 시너지:

1. **Antigravity Agent = 매크로(큰 그림)**: 프로젝트 구조 설계, 여러 파일 동시 생성, 전체 워크플로우 오케스트레이션
2. **Claude Code = 마이크로(세부 작업)**: 특정 파일 정밀 편집, MCP를 통한 외부 도구 연동, 맥락 기반의 복잡한 작업
3. **모델 선택 가능**: Antigravity 안에서 Claude Sonnet 4.5를 모델로 선택할 수 있어서, Gemini 대신 Claude가 Agent Mode를 구동하게 할 수도 있음

### 수현님에게 실용적인 활용 시나리오

| 시나리오 | Antigravity Agent Mode | Claude Code (터미널) |
|---|---|---|
| 제안서 작업 | "펠리카나 SNS 대행 제안서 구조 잡아줘" → 에이전트가 전체 구조/섹션 설계 | "/project:proposal" → Claude가 docx 파일 생성, Notion에서 참조 자료 fetch |
| 콘텐츠 기획 | 여러 시리즈를 병렬로 기획 (에이전트 3개 동시 실행) | 각 기획안을 Notion 페이지로 생성, Slack에 공유 |
| 리포트 | 에이전트가 프로젝트 전체 현황 스캔 | Claude가 국순당 데일리/주간 리포트를 MCP로 발송 |

### 실전 사용법

```
1. Antigravity IDE 열기
2. 상단에서 "Agent" 탭 클릭 (Editor ↔ Agent 전환)
3. 프롬프트 입력: "이번 주 국순당 콘텐츠 진행 상황을 정리하고, 클라이언트 보고 자료를 만들어줘"
4. 에이전트가 작업하는 동안, 터미널에서 Claude Code를 별도로 실행하여 세부 작업 병행
```

> 💡 **수현님 팁**: 처음에는 Claude Code만 터미널에서 사용하다가, 익숙해지면 Agent Mode를 추가로 활용하는 것을 추천합니다. Agent Mode는 코딩 작업에 더 특화되어 있어서, 수현님의 콘텐츠/마케팅 작업에는 Claude Code가 더 직접적으로 유용합니다.

---

## 9. Craft MCP 연결

Craft(craft.do) 문서를 Claude Code에서 직접 읽고 쓸 수 있게 연결하는 방법입니다.

### Step 1: Craft에서 MCP 활성화

1. Craft 앱 열기
2. 사이드바에서 **Imagine** 탭 클릭
3. **"Create Your First MCP Connection"** 클릭
4. MCP 연결 이름을 설정 (예: "Claude Code 연결")
5. **"Add Document"** 클릭하여 공유할 문서를 선택
6. MCP URL이 생성됨 → 이 URL을 복사

생성되는 URL 형식: `https://mcp.craft.do/my/mcp` (또는 커스텀 URL)

### Step 2: Claude Code에 Craft MCP 추가

```bash
claude mcp add --transport http craft https://mcp.craft.do/my/mcp --scope user
```

### Step 3: OAuth 인증

Claude Code 안에서:
```
> /mcp
```

Craft 서버를 선택하면 브라우저가 열립니다:
1. Craft 로그인
2. 연결할 **Space(워크스페이스)** 선택
3. **"Approve"** 클릭하여 접근 권한 부여

### Step 4: 사용 시작

```
> 내 Craft 문서 내용 읽어줘
> Craft에 있는 프로젝트 문서 요약해줘
```

### Antigravity IDE에서 Craft MCP 연결

Antigravity의 MCP 설정 파일(`~/.gemini/antigravity/mcp_config.json`)에도 추가 가능:

```json
{
  "mcpServers": {
    "craft": {
      "url": "https://mcp.craft.do/my/mcp"
    }
  }
}
```

### Craft MCP에서 할 수 있는 것

- Craft 문서 내용 읽기/검색
- 문서에 내용 추가/수정
- 여러 문서의 내용을 크로스 참조
- Craft의 폴더/컬렉션 구조 탐색

> ⚠️ **접근 범위 관리**: Craft MCP 연결 설정 시 "Add Document"로 특정 문서만 선택하면, Claude가 접근할 수 있는 문서를 제한할 수 있습니다. 전체 워크스페이스를 열어두기보다 필요한 문서만 연결하는 것을 권장합니다.

---

## 📌 업데이트된 빠른 시작 체크리스트

- [ ] Claude Code 설치: `npm install -g @anthropic-ai/claude-code`
- [ ] 프로젝트 폴더 생성: `mkdir ~/creatorhood-workspace`
- [ ] Claude Code 로그인: `claude` 실행 후 계정 인증
- [ ] **MCP 서버 연결:**
  - [ ] Notion: `claude mcp add --transport http notion https://mcp.notion.com/mcp --scope user`
  - [ ] Slack MCP 연결
  - [ ] Google Calendar MCP 연결
  - [ ] Craft: `claude mcp add --transport http craft https://mcp.craft.do/my/mcp --scope user`
- [ ] `/mcp`로 각 서버 OAuth 인증 완료
- [ ] `~/creatorhood-workspace/CLAUDE.md` 생성 (크리에이터후드 맥락)
- [ ] `~/.claude/CLAUDE.md` 생성 (글로벌 사용자 선호)
- [ ] `.claude/commands/` 폴더에 주요 커맨드 생성
- [ ] 참조 자료(references) 복사
- [ ] Antigravity IDE에서 프로젝트 폴더 열기
- [ ] 터미널에서 `claude` 실행하여 테스트
- [ ] (선택) Antigravity Agent Mode 시도
