# CH MAG Content Management System

## 개요
크리에이터후드(CH MAG) 콘텐츠 제작 일정, 시리즈 현황, 리소스 배분, 업로드 스케줄을 통합 관리하는 대시보드 시스템.

## 현재 상태: MVP (v1.0)
- `index.html`: 단일 파일 React 대시보드 (CDN 기반, 브라우저에서 바로 실행)
- `data/march-2026.json`: 2026년 3월 전체 스케줄 데이터

## 즉시 사용
```bash
# 브라우저에서 바로 열기
open index.html
```

## Claude Code 확장 로드맵

### Phase 1: 프로젝트 세팅
```bash
# Next.js 또는 Vite React 프로젝트로 전환
npx create-next-app@latest ch-cms --typescript --tailwind --app
# 또는
npm create vite@latest ch-cms -- --template react-ts
```

### Phase 2: 데이터 영속성
현재 MVP는 React state로만 데이터 관리 (새로고침 시 리셋).
확장 시 선택지:
1. **JSON 파일 기반** (가장 간단): fs로 `data/` 폴더 읽기/쓰기
2. **SQLite** (로컬): better-sqlite3로 로컬 DB
3. **Supabase/Firebase** (클라우드): 팀 공유 가능
4. **Notion API 연동**: 기존 Notion DB와 양방향 싱크

### Phase 3: 기능 확장
- [ ] 월 전환 (3월 → 4월 → ...)
- [ ] 드래그앤드롭으로 일정 이동
- [ ] 콘텐츠 추가/삭제 UI
- [ ] 팀원별 개인 뷰
- [ ] 제작 파이프라인 상태 추적 (단계별 진행)
- [ ] 자동 리소스 충돌 감지 (지운 오버로드 알림)
- [ ] 노션 API 양방향 싱크
- [ ] Slack 알림 연동 (업로드 완료/지연 시)
- [ ] Vercel 배포로 팀 공유

### Phase 4: 반복 템플릿
- 월간 스케줄 자동 생성 (규칙 기반)
- 이전 달 데이터 복사 + 조정
- 시리즈별 기본 패턴 저장

## 데이터 구조

### uploads (핵심 데이터)
```typescript
interface Upload {
  id: string;          // 고유 ID
  date: string;        // YYYY-MM-DD
  type: string;        // carousel | bwasseo | snack | pitstop | mukbang | playbook | vlog | hoodies
  title: string;       // 콘텐츠 제목
  status: 'scheduled' | 'in_progress' | 'done' | 'delayed';
}
```

### 콘텐츠 타입
| Key | 이름 | 포맷 | 주평균 | 패턴 |
|-----|------|------|--------|------|
| carousel | 캐러셀 | 숏폼 | 3.5편 | 주중 매일(봤어와 교대) |
| bwasseo | 봤어 | 숏폼 | 2.5편 | 주중(캐러셀과 교대) |
| snack | 스낵 | 숏폼 | 5편 | 주중 매일 |
| pitstop | Pit Stop | 숏폼 | 1편(격주2) | W1,W3 격주, 주 2편 |
| mukbang | 폭력적인식단 | 숏폼 | 1.25편(격주2) | W1(1),W2(2),W4(2) 교차 |
| playbook | Playbook | 롱폼 | 0.75편 | W2,W3,W4 목요일 |
| vlog | 팀 브이로그 | 롱폼 | 0.5편 | W2,W4 격주 |
| hoodies | 후디스 | 롱폼 | 0.25편 | 3월은 W3 1편만 |

### 리소스 (편당 시간)
| 콘텐츠 | 수현 | 우석 | 지운 | 임용 |
|--------|------|------|------|------|
| 캐러셀 | 2h | 3h | - | 2h |
| 봤어 | 0.5h | 1h | 4h | 2h |
| 스낵 | 1h | 1h | 1h | - |
| Pit Stop | 2h | - | 12h | - |
| 폭력적인식단 | 2h | - | 12h | - |
| Playbook | 4h | - | 16h* | 4h |
| 팀 브이로그 | 4h | - | 24h | - |
| 후디스 | 6h | - | 24h | - |

*Playbook 촬영은 정규시간 외 (지운 8h에 미포함)

### 핵심 제약조건
1. **지운 병목**: 평균 60h/week (150%), W2에 87h까지 상승 가능
2. **하루 기본 업로드**: (캐러셀 OR 봤어) 1개 + 스낵 1개 = 2개
3. **후디스 본격화 시**: 팀 브이로그 우선순위 먼저 조정
4. **Shirtless**: 3월 이후 보류

## 팀 구성
- **수현**: CEO/기획총괄 - 콘텐츠 소재발굴, 시리즈 기획, 스크립트 감수
- **우석**: 디자인 - 캐러셀 디자인, 봤어 썸네일, 인스타 운영
- **지운**: 촬영/편집 - 모든 영상 촬영+편집 (숏폼 4h/편, 롱폼 16h/편)
- **임용**: 글쓰기/기획보조 - 캐러셀 카피, 봤어 스크립트, Playbook 리서치
- **나강/예나**: Pit Stop 출연자 (편집은 지운)
- **예나**: 봤어 나레이션 녹음

## 기존 엑셀 파일
- `CH_콘텐츠_마스터스케쥴_2026년3월.xlsx` - 5 시트 마스터 스케줄
- `CH_업로드캘린더_2026년3월.xlsx` - 업로드 캘린더 뷰
