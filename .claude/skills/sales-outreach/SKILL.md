---
name: sales-outreach
description: |
  크리에이터후드 통합 세일즈 시스템. 6개 전문 에이전트로 라우팅하거나, 빠른 실행 모드로 즉시 메일 초안을 작성한다.
  MUST BE USED when: "대행영업", "세일즈", "콜드메일", "아웃바운드", "인바운드", "문의 왔어", "섭외", "스폰서십", "브랜디드", "PPL", "협찬", "Upwork", "업워크", "Meta 광고", "인스타 광고", "빠르게 메일만"
  USE PROACTIVELY when: 사용자가 아이보스 의뢰, 클라이언트 문의, 브랜드 공략, 출연자 섭외, 스폰서십 제안 등을 언급할 때
---

# 크리에이터후드 통합 세일즈 시스템

사용자의 요청을 분석하여 **6개 전문 에이전트** 중 최적의 에이전트로 라우팅하거나, **빠른 실행 모드**로 즉시 초안을 작성한다.

## 라우팅 매트릭스

사용자의 입력에서 키워드/맥락을 감지하여 분기:

```
├── 대행 세일즈
│   ├── inbound-sales-agent   ← "문의 왔어", "인바운드", "의뢰 응대", "답장 작성", "클라이언트가 연락했어"
│   ├── outbound-sales-agent  ← "콜드메일", "아웃바운드", "브랜드 공략", "새 클라이언트 발굴", "아이보스 리드"
│   ├── upwork-agent          ← "Upwork", "업워크", "해외 영업", "해외 클라이언트"
│   └── meta-ads-agent        ← "Meta 광고", "인스타 광고", "페이스북 광고", "광고 카피", "리드 생성"
│
├── 파트너십/섭외
│   ├── sponsorship-agent     ← "스폰서십", "브랜디드", "PPL", "협찬", "광고주 붙이기", "스폰서 찾기"
│   └── talent-outreach-agent ← "섭외", "게스트", "출연자", "출연 요청", "콜라보 제안"
│
└── 빠른 실행 모드
    └── 직접 처리               ← "빠르게 메일만", "간단하게", "템플릿으로"
```

## 라우팅 프로세스

### Step 1. 입력 분류

사용자 입력을 받으면:

1. **키워드 매칭**: 위 라우팅 매트릭스의 키워드와 대조
2. **맥락 분석**: 키워드가 명확하지 않으면 아래 기준으로 판단:
   - 클라이언트 문의 원문이 붙여넣기됨 → `inbound-sales-agent`
   - 특정 브랜드명 + "공략/접근/메일" → `outbound-sales-agent`
   - 영문 공고 URL 또는 Upwork 언급 → `upwork-agent`
   - 광고 소재/카피/타게팅 관련 → `meta-ads-agent`
   - CH MAG 시리즈 + 브랜드 연결 → `sponsorship-agent`
   - 인물명 + 시리즈 출연 관련 → `talent-outreach-agent`
3. **모호한 경우**: 사용자에게 확인 질문

### Step 2. 에이전트 호출 또는 빠른 실행

**에이전트 호출 시:**
- 해당 에이전트의 `.claude/agents/[agent-name].md` 참조
- 사용자 입력 + 필요한 컨텍스트를 에이전트에 전달
- 에이전트가 Phase별로 사용자 컨펌 받으며 진행

**빠른 실행 모드 시:**
- `assets/outbound-template.md` 기반으로 즉시 메일 초안 작성
- 프레임워크 적용 없이 빠른 아웃풋 우선
- 사용자가 "이걸 더 다듬어줘" 하면 해당 에이전트로 전환

## 6개 에이전트 요약

### 1. inbound-sales-agent (국내 인바운드)

- **프레임워크**: 팔레트혜인 3-Step ("질문의 수준이 단가를 결정한다")
- **입력**: 클라이언트 문의 원문 (아이보스 / Meta 광고 DM / 인스타 DM)
- **출력**: 문의 해부 → 커버리지 매핑 → 3-Step 응답 초안
- **연동**: `quotation-builder` (견적), `proposal-docx` (제안서)
- **참조**: `.claude/knowledge/sales/inquiry-frameworks.md`

### 2. outbound-sales-agent (국내 아웃바운드)

- **프레임워크**: 옥성아 6-Step B2B 변형 ("세계관 연결 → 브랜드 포지셔닝 연결")
- **입력**: 타겟 브랜드명, 아이보스 의뢰 URL, 또는 타겟 산업
- **출력**: 타겟 리서치 → 전략 분석 → 콜드메일 (이메일 + DM 동시)
- **연동**: `brand-knowledge` (케이스 스터디), `quotation-builder`
- **참조**: `.claude/knowledge/sales/outreach-frameworks.md` (B2B 변형)

### 3. upwork-agent (해외 Upwork)

- **프레임워크**: Baehaus A-to-Z (프로필 세팅 ~ 성장 로드맵)
- **4가지 모드**:
  - Mode A: 공고 분석 (7기준 체크리스트 자동 채점)
  - Mode B: Cover Letter 작성 (5-Paragraph + 3단계 앵커링)
  - Mode C: 프로필 & 전략 가이드 (성장 로드맵 현재 단계 진단)
  - Mode D: 견적 설계 (시간당 요율 기반 테이블)
- **참조**: `.claude/knowledge/sales/upwork-playbook.md`

### 4. meta-ads-agent (Meta 광고)

- **입력**: 타겟 서비스/오디언스, 예산, 목표
- **출력**: 키워드 분석 → 카피 3방향 (문제인식/결과증명/차별화) → 소재 기획 → A/B 테스트 구조
- **연동**: 광고 통한 인바운드 문의 발생 시 → `inbound-sales-agent` 가이드

### 5. sponsorship-agent (스폰서십/브랜디드)

- **핵심**: 시리즈×브랜드 매칭 → 스폰서십 패키지 설계 → 제안
- **입력**: 타겟 브랜드 또는 타겟 시리즈
- **출력**: 매칭 결과 → 티어별 패키지 → 제안 메일/데크
- **Zone X 모드**: Zone X 문서 참조하여 이벤트/리그 스폰서십 별도 구성
- **참조**: `.claude/knowledge/sales/sponsorship-playbook.md`

### 6. talent-outreach-agent (출연자/게스트 섭외)

- **프레임워크**: 옥성아 6-Step 원본 ("콜드 메일을 제안이 아닌 공명으로")
- **입력**: 섭외 대상 이름, 인스타 핸들, 또는 "이런 사람 찾아줘"
- **출력**: 세계관 리서치 → 6-Step 메일 → DM 축약본
- **시리즈별 맥락**: Playbook(토크쇼) / Hoodies(브이로그) / False 9(시네마틱)
- **참조**: `.claude/knowledge/sales/outreach-frameworks.md` (원본)

## 빠른 실행 모드

에이전트 없이 즉시 초안을 작성하는 모드. 사용자가 시간이 급하거나 간단한 메일만 필요할 때.

### 프로세스:
1. `assets/outbound-template.md` 템플릿 로드
2. 사용자 입력에서 핵심 정보 추출 (대상, 목적, 채널)
3. 템플릿에 맞춰 즉시 초안 작성 (300자 이내)
4. "더 다듬어줘" → 적절한 에이전트로 자동 전환

## 이메일 톤 가이드라인 (전체 공통)

**크리에이터후드 보이스:**
- 전문적이되 따뜻한 톤 (딱딱한 기업체 느낌 X)
- 자신감 있되 오만하지 않게
- 전략적 파트너로 포지셔닝 (벤더/하청 X)
- 주장이 아닌 사례로 전문성을 보여줄 것

**한국어 비즈니스 커뮤니케이션:**
- 존댓말 일관 유지
- 공식적이되 접근 가능한 균형
- 명확한 구조와 적절한 여백
- 과도한 이모지/감탄부호 자제

**영문 커뮤니케이션 (Upwork):**
- Professional but personable
- Lead with results, not claims
- K-brand identity = 차별화 자산

**공통 금지:**
- 과도한 약속이나 추상적 주장
- 모든 역량 나열 (선택적으로)
- 가격에 대한 방어적 톤
- 사과 투의 어조

## 통합 연동 맵

```
[에이전트 출력] → 사용자 컨펌
    │
    ├── 견적 필요 → quotation-builder 스킬 호출
    ├── 제안서 필요 → proposal-docx 스킬 호출
    ├── 케이스 참조 → brand-knowledge 스킬 참조
    └── 콘텐츠 기획 → content-frameworks 참조
```

## Knowledge Base

모든 에이전트가 참조하는 프레임워크 파일:

| 파일 | 내용 | 주 사용 에이전트 |
|---|---|---|
| `knowledge/sales/outreach-frameworks.md` | 옥성아 6-Step (원본 + B2B 변형) | talent-outreach, outbound-sales |
| `knowledge/sales/inquiry-frameworks.md` | 팔레트혜인 3-Step | inbound-sales |
| `knowledge/sales/upwork-playbook.md` | Baehaus A-to-Z | upwork |
| `knowledge/sales/sponsorship-playbook.md` | 시리즈별 매칭 + 티어 체계 | sponsorship |

## 세일즈 파이프라인 전체 플로우

```
[기회 발견]
  │
  ├─ 국내 인바운드 ──→ inbound-sales-agent (3-Step) ──→ 응답 + 견적
  ├─ 국내 아웃바운드 ─→ outbound-sales-agent (6-Step B2B) → 콜드메일 + 팔로업
  ├─ 해외 Upwork ────→ upwork-agent (5-Paragraph) ──→ Cover Letter + 견적
  ├─ Meta 광고 ──────→ meta-ads-agent ──→ 광고 → 인바운드 문의 생성
  ├─ 스폰서십 ───────→ sponsorship-agent (매칭+패키지) → 제안
  └─ 출연자 섭외 ────→ talent-outreach-agent (6-Step 원본) → 공명 메일
        │
        └── 공통 하류: [관심 확인] → [미팅] → quotation-builder → proposal-docx → [계약]
```

## 템플릿 & 에셋

- `assets/outbound-template.md` — 빠른 실행 모드 기본 템플릿
- `brand-knowledge` 스킬 — 케이스 스터디 + 가치 제안
- `quotation-builder` 스킬 — 견적 생성
- `proposal-docx` 스킬 — Word 제안서 생성
