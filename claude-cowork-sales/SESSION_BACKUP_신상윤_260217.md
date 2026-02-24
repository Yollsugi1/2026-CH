# 세션 백업 — 신상윤 SNS 대행 제안서

**백업 일자**: 2026-02-17
**프로젝트 상태**: 모든 문서 완성 — Word 2종, Excel 1종, MD 1종. 사용자 직접 수정 반영 완료. 폰트 Freesentation 적용 완료.

---

## 🔑 핵심 사항

- **클라이언트**: 신상윤 / (주)아이스클래식
- **대상 브랜드**: 로켓츠 아이스하키 클럽 + 박스페이스
- **총 예산**: ₩600만/월 (VAT 10% 별도), 2026년 연간 계약
- **예산 배분 옵션**: 1안 (로켓츠 ₩400만 / 박스페이스 ₩200만) vs 2안 (로켓츠 ₩350만 / 박스페이스 ₩250만)
- **서비스**: 릴스 24건/월(브랜드당 12건) + 캐러셀(로켓츠 2건, 박스페이스 4건) + 채널기획 + 채널관리 + 리포팅
- **폰트**: 전 문서 Freesentation (각 weight가 별도 폰트 패밀리: "Freesentation 4 Regular", "Freesentation 7 Bold" 등)
- **문서 생성 방식**: Word → docx 패키지(Node.js), Excel → openpyxl(Python)

---

## 📝 전체 대화 흐름 (시간순)

### [이전 세션들 — 요약]

이전 2개 세션에 걸쳐 다음 작업이 진행됨:
- 1차 미팅 결과 기반 MD 파일 작성 (신상윤_미팅결과_서비스범위.md)
- create_docs_v2.js 스크립트 작성 (docx 패키지 사용, 내부공유용 + 상세 제안서 2종 생성)
- create_excel_v2.py 스크립트 작성 (openpyxl 사용, 3시트 견적서 생성)
- 초기 Word v1 생성 완료 상태에서 세션 종료

---

### [1] 이전 세션 이어서 — Word 생성 + Excel 생성 + 검증

**사용자 요청**: 이전 세션 컨텍스트 요약을 바탕으로 이어서 진행

**진행 내용**:
- Word 문서 2종 검증 (이전 세션 v1 기준) — validate.py 통과
- create_excel_v2.py 작성 및 실행
  - 3시트 구성: 견적 총괄, 1안 세부단가, 2안 세부단가
  - 1안: 로켓츠 ₩400만(릴스₩280만+캐러셀₩40만+기획₩40만+관리₩20만+리포팅₩20만) + 박스페이스 ₩200만(릴스₩100만+캐러셀₩40만+기획₩25만+관리₩20만+리포팅₩15만)
  - 2안: 로켓츠 ₩350만(릴스₩240만+캐러셀₩35만+기획₀35만+관리₩20만+리포팅₩20만) + 박스페이스 ₩250만(릴스₩140만+캐러셀₩45만+기획₩30만+관리₩20만+리포팅₩15만)
- recalc.py로 수식 재계산 — 39개 수식, 0 오류
- Excel 값 검증 완료

**산출물**:
- `신상윤_견적서_v3_옵션별.xlsx` — 3시트 견적서

---

### [2] 폰트 변경 — Freesentation 적용

**사용자 요청**: "문서는 굵기 반영해서 다 freesentation 폰트로 하자"
이후 추가: "폰트 내가 폴더 안에 넣어놨어 폰트 설치해서 doc 문서에 다 반영하자"

**진행 내용**:
- 워크스페이스 `/Freesentation 2.000/` 폴더에서 9개 TTF 파일 확인
  - Thin(1), ExtraLight(2), Light(3), Regular(4), Medium(5), SemiBold(6), Bold(7), ExtraBold(8), Black(9)
- fontTools로 메타데이터 확인 → **각 weight가 별도 font family** (nameID=1이 "Freesentation 4 Regular" 등)
- `~/.fonts/`에 설치 (디렉토리명에 공백 있어서 for loop으로 처리)
- create_docs_v2.js 수정:
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
- 폰트 매핑: h1→XBOLD, h2→BOLD, subheading→SEMI, body→ff(bold), cover title→BLACK, bullet→REGULAR
- 모든 Arial 참조 제거 확인 (node script로 검증)
- create_excel_v2.py도 동일 적용: header/bold→"Freesentation 7 Bold", body→"Freesentation 4 Regular"
- Excel 재생성 + recalc → 39 수식, 0 오류

**산출물**:
- Word 2종 + Excel 1종 모두 Freesentation 폰트 적용

**기술 이슈**:
- 폰트 설치 시 `cp "/path/Freesentation 2.000/"*.ttf ~/.fonts/` 실패 → for loop으로 해결
- fontTools로 ~/.fonts/ 읽기 시 PermissionError → 원본 경로에서 직접 읽어서 해결
- Excel에서 replace_all로 Arial→Bold 일괄 치환 시 body_font까지 Bold로 바뀜 → 수동으로 Regular 복원

---

### [3] 사용자 직접 수정 반영 — 예산 옵션 구조 변경

**사용자 요청**: "신상윤_서비스안내_내부공유용.docx의 문서를 내가 좀 직접 수정했어. 특히 예산 옵션 비교 부분을 수정했는데, 간단하게 예산 옵션만 비교를 먼저하고, 그 다음에 각 안에 대해 서비스가 다른 뉘앙스를 주기보다, 우리가 각 브랜드에 대해서 어떻게 접근하는지를 설명하면서 예산이 책정된 합리성을 드러내고자 했어. 이 내용을 보면 아마 내가 어떤 걸 변경하려고 했는지를 알거야. 이를 바탕으로 상세 제안서와 미팅결과 마크다운 문서에도 반영해줘."

**진행 내용**:
- python-docx로 사용자가 수정한 내부공유용.docx 전체 내용 추출
- 변경사항 파악:

  **커버 페이지:**
  - "로켓츠 (아이스하키 교육) + 박스페이스 (복싱 & 피트니스)" → "로켓츠 아이스하키 클럽 + 박스페이스"
  - 제출처에 "신상윤님" 추가

  **제안 개요:**
  - "서비스 범위를 안내" → "견적과 서비스 범위를 안내"

  **핵심 요약 테이블:**
  - 캐러셀 +α → "로켓츠 2건 (릴스 콘텐츠 중심으로 진행) + 박스페이스 4건 (매거진형 더하여 콘텐츠 믹스 보완)"
  - 월 예산 → "₩600만/월 (VAT 별도) | 각 브랜드별 단가 하단 기재"

  **서비스 제공 범위:**
  - "월간 콘텐츠 캘린더" → "콘텐츠 캘린더"
  - "월간 단위 전략 업데이트" → "분기 단위 전략 업데이트"
  - "각 브랜드 12건/월" → "각 브랜드별 12건/월"
  - 채널 관리: "해시태그 전략 및 게시 시간 최적화, 노션 공동워크스페이스..." → "카피라이팅 및 게시 시간 최적화"
  - 캐러셀: 자사 에디터 풀 활용 서술 + 홍보성 포스트 별도 단락으로 분리

  **예산 옵션 (가장 큰 변경):**
  - **기존**: 1안/2안 각각 설명 + 개별 서비스 테이블
  - **변경**: 예산 비교 테이블(1안/2안 x 로켓츠/박스페이스) → 공통 서비스 테이블 → 브랜드별 접근 방향 서술
  - 의도: "서비스가 달라지는 게 아니라, 예산 배분만 다르다"는 메시지. 각 브랜드에 대한 접근 방식을 설명하면서 예산 책정의 합리성을 표현

  **클로징:**
  - "상윤님이 비즈니스에 집중하실 수 있도록, SNS 전략부터 실행까지 크리에이터후드가 토탈 관리합니다." → "비즈니스에 집중하실 수 있도록, SNS 콘텐츠 전략부터 실행까지 크리에이터후드가 지속적으로 방향성을 함께 고민하며 전 퍼널에서 관리합니다."
  - bold+italic → bold only
  - "대표 수현" → "대표 정수현"

- create_docs_v2.js에 모든 변경사항 반영 (createInternalDoc + createDetailedDoc 모두)
- `node create_docs_v2.js` 실행 → 두 문서 모두 성공
- validate.py 검증 → 두 문서 모두 통과

**산출물**:
- `신상윤_서비스안내_내부공유용.docx` — 사용자 수정 반영 완료
- `신상윤_제안서_v3.docx` — 동일 변경사항 반영 완료

---

### [4] 마크다운 문서 업데이트

**진행 내용**:
- 신상윤_미팅결과_서비스범위.md에 동일한 변경사항 반영:
  - 대상: "로켓츠 아이스하키 클럽 + 박스페이스"
  - 서비스범위 워딩 변경 (콘텐츠 캘린더, 분기 단위, 카피라이팅 등)
  - 캐러셀 섹션 재작성 (자사 에디터 풀, 홍보성 포스트 분리)
  - 예산 옵션 구조 변경 (비교표 + 공통 서비스 + 브랜드별 접근)
  - 서명: "대표 정수현"

**산출물**:
- `신상윤_미팅결과_서비스범위.md` — 업데이트 완료

---

## 📁 최종 파일 목록

| 파일명 | 위치 | 설명 | 버전 |
|---|---|---|---|
| 신상윤_서비스안내_내부공유용.docx | workspace root | 내부공유용 서비스안내 (커버+본문) | 최신 — 사용자 수정 반영 |
| 신상윤_제안서_v3.docx | workspace root | 상세 제안서 (커버+본문, 더 상세한 내용) | 최신 — 사용자 수정 반영 |
| 신상윤_견적서_v3_옵션별.xlsx | workspace root | 3시트 견적서 (총괄+1안+2안 세부단가) | 최신 — Freesentation 폰트 |
| 신상윤_미팅결과_서비스범위.md | workspace root | 미팅결과 마크다운 요약 | 최신 — 사용자 수정 반영 |
| create_docs_v2.js | /sessions/gifted-dazzling-galileo/ | Word 생성 스크립트 (docx 패키지) | 최신 |
| create_excel_v2.py | /sessions/gifted-dazzling-galileo/ | Excel 생성 스크립트 (openpyxl) | 최신 |
| Freesentation 2.000/ | workspace root | 폰트 파일 9종 (TTF) | — |

---

## ⏭️ 다음 할 일

- [ ] 클라이언트 미팅 전 최종 검토 (수현님 직접)
- [ ] 예산 옵션 선택 후 계약 진행
- [ ] 견적서 Excel 내 세부단가 클라이언트 공유 여부 결정
- [ ] 필요 시 Word/Excel 추가 수정

---

## 💡 맥락 메모

- **Freesentation 폰트 주의**: 각 weight가 별도 font family명임. "Freesentation 4 Regular", "Freesentation 7 Bold" 등으로 지정해야 함. 단일 family + bold flag 방식 안 됨.
- **ff(bold) 헬퍼**: `function ff(bold) { return bold ? F.BOLD : F.REGULAR; }` — body 텍스트에서 bold 여부에 따라 폰트 자동 선택
- **docx 패키지**: `npm install docx` (Node.js). Packer.toBuffer()로 생성.
- **openpyxl**: Python. 수식은 LibreOffice recalc.py로 재계산 필요.
- **validate.py 위치**: `mnt/.skills/skills/docx/scripts/office/validate.py`
- **recalc.py 위치**: `mnt/.skills/skills/xlsx/scripts/recalc.py`
- **문서 컬러 팔레트**: DARK_NAVY(1A1A2E), NAVY(0F3460), ACCENT(E94560), BLUE(4A90D9), BODY(333333), GRAY(666666)
- **A4 레이아웃**: 11906×16838 DXA, 마진 1138 DXA (0.79"), 콘텐츠 너비 ~9630 DXA
- **사용자의 예산 옵션 철학**: 1안/2안 서비스 차이를 부각하지 않고, 동일 서비스에서 예산 배분만 다름을 강조. 브랜드별 접근 방식을 서술하며 예산 책정 합리성을 전달.

---

## 🔄 이 백업 사용법

새 세션에서:
```
신상윤 제안서 프로젝트 이어서 진행하려고 해.
SESSION_BACKUP_신상윤_260217.md 파일 읽고 맥락 파악한 다음 진행해줘.
```
