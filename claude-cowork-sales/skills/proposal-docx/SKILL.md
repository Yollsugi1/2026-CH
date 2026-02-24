---
name: proposal-docx
description: "크리에이터후드 제안서/서비스안내 Word 문서를 docx 패키지(Node.js)로 생성합니다. 커버페이지 + 본문 구조, 테이블 스타일, 컬러 팔레트, 폰트 체계가 모두 포함된 템플릿입니다."
---

# 크리에이터후드 제안서 DOCX 생성 스킬

이 스킬은 크리에이터후드의 SNS 대행/콘텐츠 파트너십 제안서를 Node.js `docx` 패키지로 생성하는 양식 및 가이드입니다.

## 사전 준비

```bash
cd /sessions/gifted-dazzling-galileo && npm list docx 2>/dev/null || npm install docx
```

Freesentation 폰트가 설치되어 있어야 합니다 (워크스페이스의 `Freesentation 2.000/` 폴더 참조).

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
  BLUE_BG: "EBF3FB",    // 강조 배경 (선택)
  ACCENT_BG: "FFF0F3",  // 경고/강조 배경 (선택)
  NAVY_BG: "EDF0F7",    // 네이비 배경 (선택)
};
```

### 폰트 체계 (Freesentation)

**중요**: Freesentation 폰트는 각 weight가 **별도 font family**입니다.

```javascript
const F = {
  REGULAR: "Freesentation 4 Regular",   // 본문 기본
  MEDIUM: "Freesentation 5 Medium",     // (필요시)
  SEMI: "Freesentation 6 SemiBold",     // 서브헤딩
  BOLD: "Freesentation 7 Bold",         // 강조, 헤딩2
  XBOLD: "Freesentation 8 ExtraBold",   // 헤딩1
  BLACK: "Freesentation 9 Black",       // 커버 타이틀
};

// bold 여부에 따라 폰트 자동 선택 (본문용)
function ff(bold) { return bold ? F.BOLD : F.REGULAR; }
```

### 폰트 용도 매핑

| 요소 | 폰트 | 사이즈 | 비고 |
|---|---|---|---|
| 커버 타이틀 | F.BLACK | 56 (28pt) | 2줄 구성 가능 |
| 커버 "CREATORHOOD" | F.BOLD | 20 (10pt) | GRAY 색상 |
| 커버 브랜드명 | F.SEMI | 24 (12pt) | ACCENT 색상 |
| heading1 | F.XBOLD | 36 (18pt) | DARK_NAVY |
| heading2 | F.BOLD | 30 (15pt) | DARK_NAVY |
| subheading | F.SEMI | 24 (12pt) | NAVY |
| body | ff(bold) | 22 (11pt) | BODY, line:320 |
| bullet | F.REGULAR | 22 (11pt) | BODY |
| 테이블 헤더 | F.BOLD | 20 (10pt) | 배경 DARK_NAVY, 글자 WHITE |
| 테이블 본문 | ff(bold) | 20 (10pt) | BODY |
| 헤더/푸터 | F.REGULAR | 16 (8pt) | GRAY |

### 페이지 레이아웃 (A4)

```javascript
const PAGE_WIDTH = 11906;    // A4 너비 (DXA)
const PAGE_HEIGHT = 16838;   // A4 높이 (DXA)
const MARGIN = 1138;         // 0.79인치 = ~2cm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2; // ~9630 DXA
```

## 문서 구조

### 섹션 1: 커버 페이지

```
[여백 2000]
"CREATORHOOD" (10pt, Bold, Gray)
"{서비스 타이틀 1줄}" (28pt, Black, Dark Navy)
"{서비스 타이틀 2줄}" (28pt, Black, Dark Navy)  ← 선택
"{대상 브랜드/클라이언트}" (12pt, SemiBold, Accent Red)
[여백 800]
제출처: {회사명 담당자명}
제출일: {YYYY년 M월}
작성: 크리에이터후드 (Creatorhood)
```

### 섹션 2: 본문

본문은 다음 블록들로 구성됩니다. 프로젝트에 따라 블록을 선택/조합합니다.

#### 기본 블록 순서 (내부공유용 / 간략 서비스안내)

1. **제안 개요** (heading1) + 본문 1~2문단
2. **핵심 요약 테이블** (subheading + 2열 테이블)
3. **서비스 제공 범위** (heading1 + heading2 × N개 서비스)
4. **예산 옵션** (heading1 + 비교표 + 공통 서비스표 + 브랜드 접근 서술)
5. **클로징** (강조 문구 + 연락처 + 서명)

#### 확장 블록 순서 (상세 제안서)

1. **제안 개요** + 핵심 요약 테이블
2. **크리에이터후드 이해도/강점** (heading1 + body)
3. **브랜드별 운영 방향** (heading1 + heading2×N + bullets)
4. **서비스 제공 범위** (heading1 + heading2×N)
5. **월 견적 옵션** (비교표 + 공통 서비스표 + 접근 서술)
6. **진행 프로세스** (heading1 + 3열 테이블)
7. **포함/별도 사항** (subheading + 2열 테이블)
8. **다음 단계** (heading1 + 번호 리스트)
9. **클로징**

## 핵심 헬퍼 함수

### makeCell — 테이블 셀 생성

```javascript
function makeCell(text, opts = {}) {
  const {
    bold = false, size = 20, color = C.BODY, font = null,
    fill = null, width = null, align = AlignmentType.LEFT,
    vAlign = VerticalAlign.CENTER, colSpan = 1, rowSpan = 1,
    cellBorders = borders, paragraphs = null
  } = opts;
  const resolvedFont = font || ff(bold);
  const children = paragraphs || [
    new Paragraph({
      alignment: align, spacing: { before: 40, after: 40 },
      children: [new TextRun({ text, bold, size, color, font: resolvedFont })]
    })
  ];
  const cellOpts = {
    borders: cellBorders, verticalAlign: vAlign,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, children,
  };
  if (fill) cellOpts.shading = { fill, type: ShadingType.CLEAR };
  if (width) cellOpts.width = { size: width, type: WidthType.DXA };
  if (colSpan > 1) cellOpts.columnSpan = colSpan;
  if (rowSpan > 1) cellOpts.rowSpan = rowSpan;
  return new TableCell(cellOpts);
}
```

### 텍스트 헬퍼 함수

```javascript
function heading1(text) {
  return new Paragraph({ spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 36, color: C.DARK_NAVY, font: F.XBOLD })] });
}
function heading2(text) {
  return new Paragraph({ spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 30, color: C.DARK_NAVY, font: F.BOLD })] });
}
function subheading(text) {
  return new Paragraph({ spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: C.NAVY, font: F.SEMI })] });
}
function body(text, opts = {}) {
  const { bold = false, italic = false, color = C.BODY, spacing = {} } = opts;
  return new Paragraph({ spacing: { after: 120, lineRule: "auto", line: 320, ...spacing },
    children: [new TextRun({ text, size: 22, color, font: ff(bold), bold, italic })] });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: F.REGULAR, color: C.BODY })]
  });
}
function emptyPara() { return new Paragraph({ children: [] }); }
```

## 예산 옵션 섹션 — 권장 구조

수현님이 확립한 예산 옵션 표현 방식:

1. **예산 비교 테이블**: 1안/2안의 브랜드별 금액만 간결하게 비교
2. **공통 서비스 테이블**: 어떤 안이든 동일하게 제공되는 서비스 명시
3. **브랜드별 접근 서술**: 각 브랜드에 대한 접근 방식을 서술하며 예산 책정의 합리성 전달

→ 핵심 메시지: "서비스가 달라지는 게 아니라, 예산 배분만 다르다"

## 클로징 섹션

```javascript
// 강조 문구
new Paragraph({
  spacing: { before: 600, after: 200 },
  children: [new TextRun({
    text: "{맞춤형 클로징 메시지}",
    bold: true, size: 24, color: C.DARK_NAVY, font: F.BOLD
  })]
});
// 연락 안내
new Paragraph({
  spacing: { before: 200 },
  children: [new TextRun({
    text: "궁금하신 점이 있으시면 언제든 연락 부탁드립니다.",
    size: 20, color: C.GRAY, font: F.REGULAR
  })]
});
// 서명
new Paragraph({
  children: [new TextRun({
    text: "크리에이터후드 대표 정수현",
    bold: true, size: 20, color: C.BODY, font: F.BOLD
  })]
});
```

## 문서 생성 및 검증

```javascript
const doc = new Document({
  numbering,
  styles: { default: { document: { run: { font: F.REGULAR, size: 22 } } } },
  sections: [coverSection("서비스 안내"), contentSection]
});

const buf = await Packer.toBuffer(doc);
fs.writeFileSync("출력파일명.docx", buf);
```

생성 후 반드시 validate.py로 검증:
```bash
python mnt/.skills/skills/docx/scripts/office/validate.py 출력파일.docx
```

## 새 제안서 작성 시 체크리스트

1. [ ] 클라이언트/브랜드 정보 확인 (회사명, 담당자명, 브랜드명)
2. [ ] 서비스 범위 정의 (어떤 서비스를 몇 건?)
3. [ ] 예산 구조 정의 (옵션이 있는지, 총액, 브랜드별 배분)
4. [ ] 커버 타이틀 결정 ("서비스 안내" / "제안서" / "파트너십 제안" 등)
5. [ ] 문서 유형 결정 (내부공유용 간략본 vs 상세 제안서)
6. [ ] 본문 블록 구성 결정 (기본 블록 vs 확장 블록)
7. [ ] 진행 프로세스 일정 확인
8. [ ] 클로징 메시지 맞춤 작성
9. [ ] Freesentation 폰트 설치 확인
10. [ ] 생성 후 validate.py 검증

## 레퍼런스

전체 레퍼런스 구현: `create_docs_v2.js` (신상윤 프로젝트)
세션 백업: `SESSION_BACKUP_신상윤_260217.md`
