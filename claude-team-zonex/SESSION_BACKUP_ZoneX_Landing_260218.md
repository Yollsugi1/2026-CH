# 세션 백업 — Zone X 랜딩 페이지 (세션 3/3)

**백업 일자**: 2026-02-18
**프로젝트 상태**: 개발 완료, 배포 대기 (React Router 적용, 빌드 성공, Vercel 설정 완료)
**이전 세션**: 세션 1-2에서 thermal imaging 디자인 시스템 적용 및 전체 컴포넌트 변환 완료

---

## 🔑 핵심 사항

- Zone X 랜딩 페이지: Vite + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui
- Thermal imaging 디자인 시스템 전체 적용 완료 (3개 세션에 걸쳐)
- React Router v6 적용 완료 — 5개 라우트 (`/`, `/sponsorship`, `/partnership-value`, `/team-proposal`, `/presentation`)
- 빌드 성공: 2021 모듈, CSS 90.97KB, JS 533.71KB
- `vercel.json` SPA rewrite 설정 완료
- **배포는 아직 안 됨** — Vercel CLI 인증 문제로 수동 배포 필요
- 프로젝트 폴더: `/sessions/cool-sharp-cerf/zonex-landing/` (VM 내부) + 워크스페이스에 복사됨

---

## 📝 전체 대화 흐름 (시간순)

### [1] 세션 시작 — 이전 세션 컨텍스트 복원
**사용자 요청**: 이전 2개 세션의 상세 요약을 제공하며 이어서 진행 요청

**진행 내용**:
- 세션 1-2 요약 확인: Figma → React 코드 변환, thermal design system 적용, 12개+ 컴포넌트 변환 완료
- 남은 작업: 빌드 테스트, React Router 적용, Vercel 배포, 시각적 검증

**결정된 사항**:
- 빌드 테스트 → React Router → 배포 순서로 진행

---

### [2] 빌드 테스트
**진행 내용**:
- `npm run build` 실행 → 성공
- 2018 modules transformed, CSS 90.97KB, JS 514.54KB

**결정된 사항**:
- PresentationSlides.tsx 포함 모든 컴포넌트 정상 빌드 확인

---

### [3] React Router 적용
**진행 내용**:
- 기존 구조 분석: `useState`로 `currentPage` 관리, callback props로 페이지 전환
- `react-router-dom@6.30.3` 이미 설치되어 있음 확인
- `main.tsx` 수정: `<BrowserRouter>`로 App 래핑
- `App.tsx` 전면 리팩토링 (가장 큰 변경):
  - `useState<currentPage>` 제거 → `useLocation()` + `useNavigate()` 사용
  - `currentPage`를 `location.pathname`에서 파생 (switch문)
  - 라우트 변경 시 스크롤 최상단 이동 `useEffect` 추가
  - `handlePageNavigate()` 함수: 페이지명 → URL 경로 매핑
  - `handleNavClick()` 함수: 다른 라우트에서 섹션 스크롤 시 먼저 `/`로 이동 후 100ms 딜레이 후 스크롤
  - `HomePage` 컴포넌트 분리 (Routes 내부 사용)
  - 5개 Route 정의

**산출물**:
- `src/main.tsx` — BrowserRouter 래핑
- `src/App.tsx` — 583줄, 전면 리팩토링

**라우트 구조**:
```
/                  → HomePage (메인)
/sponsorship       → Sponsorship (스폰서십 제안)
/partnership-value → PartnershipValue (파트너십 가치)
/team-proposal     → TeamProposal (팀 제안)
/presentation      → PresentationSlides (프레젠테이션)
```

**컴포넌트 props 변경**:
- Sponsorship: `onNavigateToValue={() => navigate('/partnership-value')}`
- PartnershipValue: `onBack={() => navigate('/sponsorship')}`
- TeamProposal: `onBack={() => navigate('/')}`
- PresentationSlides: `onBack={() => navigate('/')}`
- Header: `onNavigate`, `onScrollToSection` callback 유지 (Router hooks 직접 사용 안 함)

---

### [4] Vercel 배포 설정
**진행 내용**:
- `vercel.json` 생성: SPA 리라이트 룰 (`/(.*) → /index.html`)
- 빌드 재실행 성공: 2021 modules, CSS 90.97KB, JS 533.71KB

**산출물**:
- `vercel.json` — SPA 클라이언트 사이드 라우팅 지원

---

### [5] Vercel 배포 시도 (실패)
**진행 내용**:
- Vercel MCP 도구로 팀 확인: "Creatorhood's projects" (team_TTtsJy8N33PkTJv3UnGWHRHW)
- 기존 프로젝트 없음 확인
- MCP deploy 도구는 CLI 사용 제안만 함
- Vercel CLI 설치 (npm --prefix로 사용자 디렉토리에)
- `vercel deploy` 실행 → **실패**: "No existing credentials found. Please run `vercel login` or pass `--token`"
- 환경변수에 VERCEL_TOKEN 없음
- Git 초기화 및 커밋 완료
- GitHub CLI(`gh`) 설치 시도 → 권한 거부

**기술적 이슈**:
- VM 환경에서 Vercel CLI 브라우저 인증 불가
- VERCEL_TOKEN 환경변수 미설정
- GitHub CLI 설치 불가 (apt 권한 없음)

**결정된 사항**:
- 수동 배포 필요 — GitHub에 push 후 Vercel 대시보드에서 import

---

### [6] 시각적 검증 시도 (실패 → 코드 레벨 검증)
**진행 내용**:
- `serve` 및 `vite preview`로 로컬 서버 실행 시도
- Chrome 브라우저가 VM의 localhost에 접근 불가 (격리 환경)
- 코드 레벨 검증으로 전환:
  - 빌드 출력 확인: `build/index.html`, JS 522KB, CSS 89KB
  - 5개 라우트 정상 정의 확인
  - vercel.json SPA 설정 확인
  - ImageWithFallback 등 깨진 import 없음 확인
  - globals.css에 7개 thermal CSS 변수 참조 확인
  - BrowserRouter 정상 래핑 확인

---

### [7] 프로젝트 워크스페이스 복사
**진행 내용**:
- `zonex-landing` 폴더 전체를 워크스페이스(`/sessions/cool-sharp-cerf/mnt/claude-team-zonex/`)에 복사
- 사용자가 접근 가능하도록 준비

---

### [8] Claude Cowork vs Code 비교 & 배포 가이드
**사용자 요청**: "claude cowork로도 claude code에서 하는 앱 개발 및 배포 작업을 다 할 수 있는지 알려줘. 그리고 vercel 활용해서 배포할 때 내가 어떤걸 준비하고 너한테 어떤걸 맡기면 되는지 알려줘. 나는 배포에 대해서는 이해도가 부족하니 지금보다 조금 더 자세히 알려주면 좋겠어"

**진행 내용**:
- Claude Cowork vs Claude Code 비교 설명:
  - 공통: 코드 작성, 파일 관리, bash 실행
  - Code 강점: 사용자 컴퓨터 환경에서 실행, CLI 인증, git push, localhost 접근
  - Cowork 한계: VM 격리로 외부 인증/배포 제한
- Vercel 배포 4단계 가이드 제공:
  1. GitHub 계정 & 레포지토리 생성
  2. Vercel 계정 GitHub 연동
  3. GitHub에 코드 올리기 (GitHub Desktop 추천)
  4. Vercel에서 Import & Deploy

**결정된 사항**:
- 배포는 사용자가 GitHub Desktop + Vercel 대시보드로 직접 수행
- Output Directory를 `build`로 설정해야 함 (vite.config.ts의 outDir)

---

## 📁 최종 파일 목록

| 파일명 | 위치 | 설명 | 상태 |
|---|---|---|---|
| `src/App.tsx` | zonex-landing/ | 메인 앱 — React Router 5개 라우트 | 최신 (583줄) |
| `src/main.tsx` | zonex-landing/ | 엔트리포인트 — BrowserRouter 래핑 | 최신 |
| `vercel.json` | zonex-landing/ | Vercel SPA 리라이트 설정 | 최신 |
| `vite.config.ts` | zonex-landing/ | Vite 빌드 설정 (outDir: build) | 이전 세션 |
| `src/styles/globals.css` | zonex-landing/ | Thermal CSS 변수 정의 | 이전 세션 |
| `src/components/Header.tsx` | zonex-landing/ | 헤더 네비게이션 | 이전 세션 |
| `src/components/Sponsorship.tsx` | zonex-landing/ | 스폰서십 페이지 | 이전 세션 |
| `src/components/PartnershipValue.tsx` | zonex-landing/ | 파트너십 가치 페이지 | 이전 세션 |
| `src/components/TeamProposal.tsx` | zonex-landing/ | 팀 제안 페이지 | 이전 세션 |
| `src/components/PresentationSlides.tsx` | zonex-landing/ | 프레젠테이션 슬라이드 | 이전 세션 |
| `src/components/ZoneXLogo.tsx` | zonex-landing/ | 로고 컴포넌트 | 이전 세션 |
| `build/` | zonex-landing/ | 빌드 출력 (index.html, JS 522KB, CSS 89KB) | 최신 |
| `package.json` | zonex-landing/ | 의존성 (react-router-dom@6.30.3 포함) | 이전 세션 |

## 🎨 디자인 시스템 (이전 세션에서 확정)

```css
--zx-thermal-red: #c41e3a
--zx-thermal-orange: #e85d26
--zx-thermal-amber: #f59e0b
--zx-bg-primary: #0a0a0a
--zx-surface-dark: #111111
```

폰트: Akira Expanded (display), OCR A Std (data), Rix독립고딕 (Korean)

---

## ⏭️ 다음 할 일

- [ ] **GitHub에 코드 push** — GitHub Desktop 또는 CLI 사용
- [ ] **Vercel에서 Import** — Output Directory를 `build`로 설정
- [ ] **배포 후 시각적 검증** — 모든 라우트 정상 동작 확인
- [ ] **커스텀 도메인 연결** (선택) — zonex.kr 등
- [ ] **모바일 반응형 최종 확인** — 실제 디바이스 테스트
- [ ] **SEO 메타태그 추가** — Open Graph, 트위터 카드 등

---

## 💡 맥락 메모

- **Vercel 팀 ID**: team_TTtsJy8N33PkTJv3UnGWHRHW ("Creatorhood's projects")
- **빌드 명령어**: `npm run build` (Vite), 출력 디렉토리: `build`
- **VM 한계**: Chrome이 VM localhost에 접근 불가, Vercel CLI 인증 불가
- **Git**: 프로젝트 내 git 초기화 및 초기 커밋 완료 (remote 미설정)
- **이전 세션 요약**: 세션 1에서 Figma 코드 변환 + thermal design system 구축, 세션 2에서 나머지 컴포넌트 변환 + 빌드 수정
- **Figma asset aliases**: vite.config.ts에 남아있지만 실제 사용 안 됨 (정리 가능)
- **Header.tsx**: React Router hooks 직접 사용하지 않고 callback props 방식 유지 — 필요시 `useNavigate()` 직접 사용으로 리팩토링 가능

---

## 🔄 이 백업 사용법

새 세션에서:
```
Zone X 랜딩 페이지 프로젝트 이어서 진행하려고 해.
SESSION_BACKUP_ZoneX_Landing_260218.md 파일 읽고 맥락 파악한 다음 진행해줘.
```
