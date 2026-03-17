---
name: proposal-docx
description: |
  크리에이터후드 제안서/서비스안내 Word 문서를 docx 패키지(Node.js)로 생성합니다. 커버페이지 + 본문 구조, 테이블 스타일, 컬러 팔레트, 폰트 체계가 모두 포함된 템플릿입니다.
  MUST BE USED when: "제안서 만들어줘", "서비스안내 docx", "DOCX 제안서", "Word 문서 생성"
  USE PROACTIVELY when: 클라이언트에게 공식 제안서를 전달해야 할 때
---

# 크리에이터후드 제안서 DOCX 생성 스킬

이 스킬은 크리에이터후드의 SNS 대행/콘텐츠 파트너십 제안서를 Node.js `docx` 패키지로 생성하는 양식 및 가이드입니다.

## 사전 준비

```bash
npm list docx 2>/dev/null || npm install docx
```

## 디자인 시스템

### 컬러 팔레트

```javascript
const C = {
  DARK_NAVY: "1A1A2E",  // 제목, 강조 텍스트
  NAVY: "0F3460",        // 서브헤딩
  ACCENT: "E94560",      // 포인트 (브랜드명 등)
  BLUE: "4A90D9",        // 링크, 보조 포인트
  BODY: "333333",        // 본문 텍스트
  GRAY: "666666",        // 부가 텍스트, 캡션
  WHITE: "FFFFFF",       // 테이블 헤더 텍스트
  LIGHT_BG: "F8F9FA",   // 테이블 라벨 셀 배경
};
```

### 폰트 체계 (Freesentation)

```javascript
const F = {
  REGULAR: "Freesentation 4 Regular",
  MEDIUM: "Freesentation 5 Medium",
  SEMI: "Freesentation 6 SemiBold",
  BOLD: "Freesentation 7 Bold",
  XBOLD: "Freesentation 8 ExtraBold",
  BLACK: "Freesentation 9 Black",
};
function ff(bold) { return bold ? F.BOLD : F.REGULAR; }
```

### 폰트 용도 매핑

| 요소 | 폰트 | 사이즈 | 비고 |
|---|---|---|---|
| 커버 타이틀 | F.BLACK | 56 (28pt) | 2줄 구성 가능 |
| heading1 | F.XBOLD | 36 (18pt) | DARK_NAVY |
| heading2 | F.BOLD | 30 (15pt) | DARK_NAVY |
| subheading | F.SEMI | 24 (12pt) | NAVY |
| body | ff(bold) | 22 (11pt) | BODY, line:320 |
| 테이블 헤더 | F.BOLD | 20 (10pt) | 배경 DARK_NAVY, 글자 WHITE |
| 테이블 본문 | ff(bold) | 20 (10pt) | BODY |

### 페이지 레이아웃 (A4)

```javascript
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1138;         // ~2cm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
```

## 문서 구조

### 섹션 1: 커버 페이지

```
[여백 2000]
"CREATORHOOD" (10pt, Bold, Gray)
"{서비스 타이틀}" (28pt, Black, Dark Navy)
"{대상 브랜드/클라이언트}" (12pt, SemiBold, Accent Red)
[여백 800]
제출처: {회사명 담당자명}
제출일: {YYYY년 M월}
작성: 크리에이터후드 (Creatorhood)
```

### 섹션 2: 본문

#### 기본 블록 순서 (내부공유용 / 간략 서비스안내)
1. 제안 개요 + 핵심 요약 테이블
2. 서비스 제공 범위
3. 예산 옵션
4. 클로징

#### 확장 블록 순서 (상세 제안서)
1. 제안 개요 + 핵심 요약 테이블
2. 크리에이터후드 이해도/강점
3. 브랜드별 운영 방향
4. 서비스 제공 범위
5. 월 견적 옵션
6. 진행 프로세스
7. 포함/별도 사항
8. 다음 단계
9. 클로징

## 핵심 헬퍼 함수

```javascript
function makeCell(text, opts = {}) {
  const {
    bold = false, size = 20, color = C.BODY, font = null,
    fill = null, width = null, align = AlignmentType.LEFT,
    vAlign = VerticalAlign.CENTER, colSpan = 1, rowSpan = 1,
  } = opts;
  // ... (상세 구현은 레퍼런스 참조)
}

function heading1(text) { /* F.XBOLD, 36, DARK_NAVY */ }
function heading2(text) { /* F.BOLD, 30, DARK_NAVY */ }
function subheading(text) { /* F.SEMI, 24, NAVY */ }
function body(text, opts) { /* ff(bold), 22, BODY, line:320 */ }
function bullet(text) { /* F.REGULAR, 22, numbered */ }
```

## 예산 옵션 섹션 — 권장 구조

1. **예산 비교 테이블**: 1안/2안의 브랜드별 금액만 간결하게 비교
2. **공통 서비스 테이블**: 어떤 안이든 동일하게 제공되는 서비스 명시
3. **브랜드별 접근 서술**: 예산 책정의 합리성 전달

핵심 메시지: "서비스가 달라지는 게 아니라, 예산 배분만 다르다"

## 새 제안서 작성 시 체크리스트

1. 클라이언트/브랜드 정보 확인
2. 서비스 범위 정의
3. 예산 구조 정의
4. 커버 타이틀 결정
5. 문서 유형 결정 (간략본 vs 상세)
6. 본문 블록 구성 결정
7. 진행 프로세스 일정 확인
8. 클로징 메시지 맞춤 작성
9. Freesentation 폰트 설치 확인
10. 생성 후 검증
