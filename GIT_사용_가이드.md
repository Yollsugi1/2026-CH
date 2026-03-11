# Git 사용 가이드 — 크리에이터후드

> MacBook ↔ Mac mini 멀티 디바이스 작업을 위한 실용 가이드

---

## 핵심 개념 한 줄 요약

Git = 구글 드라이브인데, **내가 "저장해"라고 말할 때만** 동기화되는 것.

```
MacBook [내 폴더]  →push→  GitHub [우체국]  ←pull←  Mac mini [내 폴더]
                  ←pull←                   →push→
```

---

## 명령어 3개

| 명령어 | 뜻 | 언제 |
|---|---|---|
| `git pull` | GitHub → 내 컴퓨터로 최신 내용 받기 | 작업 시작 전 |
| `git add -A` + `git commit -m "..."` | 변경 내용 묶어서 이름표 붙이기 | 작업 끝낼 때 |
| `git push` | 내 컴퓨터 → GitHub로 올리기 | 커밋 직후 |

---

## 실제 루틴

### 작업 시작할 때 (어느 기기든)
```bash
git pull
```

### 작업 끝낼 때 (어느 기기든)
```bash
git add -A
git commit -m "wip: 오늘 한 작업 한 줄 요약"
git push
```

그리고 해당 폴더 `CLAUDE.md`의 **현재 상태** 섹션도 업데이트.

---

## 디바이스 전환 시나리오

```
[MacBook - 오전]
작업 → git add -A → git commit -m "wip: ..." → git push

[Mac mini - 저녁]
git pull → Claude Code 시작 → 맥락 이어서 작업
작업 → git add -A → git commit -m "wip: ..." → git push

[MacBook - 다음날]
git pull → 어제 Mac mini 작업 내용이 그대로 있음
```

---

## 파일이 섞이거나 사라지지 않나요?

**아닙니다.** Git은 매우 명시적입니다.

- `git add`하지 않은 파일 → 절대 GitHub에 올라가지 않음
- `git pull`해도 → 내 로컬 파일 삭제 안 함, GitHub에 있는 것만 추가/업데이트
- 충돌 발생 조건 → 두 기기가 **동시에** 같은 파일 수정할 때만. 한 번에 한 기기씩 작업하면 발생 안 함

---

## 처음 MacBook에서 한 번만 할 것

```bash
# 저장소 받아오기
git clone https://github.com/Yollsugi1/2026-CH.git ~/Downloads/2026-CH

# Git 사용자 설정
git config --global user.name "정수현"
git config --global user.email "jjason68@gmail.com"
```

---

## 폴더 구조 참고

```
~/Downloads/
├── 2026 CH/        ← Claude Code 작업 폴더 (Git 아님, 로컬 전용)
└── 2026-CH/        ← Git 저장소 (GitHub와 동기화되는 폴더)
    ├── CLAUDE.md
    ├── GIT_사용_가이드.md   ← 이 파일
    ├── claude-cowork-contents/
    │   └── CLAUDE.md
    └── claude-team-zonex/
        └── CLAUDE.md
```

---

## 자주 쓰는 확인 명령어

```bash
# 현재 상태 확인 (어떤 파일이 변경됐는지)
git status

# 커밋 히스토리 확인
git log --oneline -10

# GitHub랑 동기화 상태 확인
git fetch && git status
```
